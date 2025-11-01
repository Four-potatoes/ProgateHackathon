const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { promisePool } = require('../config/db'); // Import promisePool for DB operations

// Google AI API 클라이언트 설정
const { GoogleGenerativeAI } = require("@google/generative-ai");
// TODO: 보안을 위해 API 키를 .env 파일로 이동하세요. (예: process.env.GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/ai/quiz
 * AI에게 퀴즈 질문을 요청합니다.
 * 요청 본문에는 해금된 카드 정보가 포함됩니다.
 */
router.post('/quiz', authenticateToken, async (req, res) => {
    const { unlockedCards } = req.body;

    if (!unlockedCards || unlockedCards.length === 0) {
        return res.status(400).json({ message: '퀴즈를 생성할 카드가 없습니다.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"}); // Gemini 2.5 Flash (최신 안정 버전)

        // 퀴즈 질문 생성 프롬프트
        const prompt = `
            당신은 한국 문화유산, 음식, 영화에 대한 퀴즈를 내는 AI입니다.
            다음 카드들 중 하나를 선택하여 퀴즈를 내주세요.
            질문은 객관식 또는 주관식으로 자유롭게 내되, 정답을 명확히 알 수 있도록 해주세요.
            응답은 JSON 형식으로 해주세요.
            {
                "question": "여기에 질문을 작성하세요.",
                "options": ["선택지1", "선택지2", "선택지3", "선택지4"], // 객관식일 경우, 주관식일 경우 이 필드는 생략
                "answer": "여기에 정답을 작성하세요.",
                "cardTitle": "질문에 사용된 카드의 제목"
            }

            다음은 사용 가능한 카드 목록입니다:
            ${JSON.stringify(unlockedCards.map(card => ({ title: card.title, stageName: card.stageName, desc: card.desc })))} 

            예시:
            {
                "question": "조선 시대 왕실의 제례와 종묘대제를 지내는 공간으로, 유네스코 세계유산에 등재된 곳은 어디일까요?",
                "options": ["경복궁", "창덕궁", "종묘", "덕수궁"],
                "answer": "종묘",
                "cardTitle": "종묘"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Gemini API 응답에서 JSON 파싱
        // 때때로 응답이 ```json ... ``` 형태로 올 수 있으므로 처리
        if (text.startsWith('```json')) {
            text = text.substring(7, text.lastIndexOf('```'));
        }
        const quizData = JSON.parse(text);

        // 질문의 출처가 된 카드 정보를 찾아서 questionContext에 포함
        const questionContext = unlockedCards.find(card => card.title === quizData.cardTitle);

        if (!questionContext) {
            throw new Error('AI가 생성한 퀴즈의 카드 제목이 유효하지 않습니다.');
        }

        res.json({
            question: quizData.question,
            options: quizData.options, // options가 없을 수도 있음
            answer: quizData.answer,
            questionContext: {
                title: questionContext.title,
                stageName: questionContext.stageName,
                desc: questionContext.desc
            }
        });

    } catch (error) {
        console.error('AI 퀴즈 생성 오류:', error);
        res.status(500).json({ message: `AI 퀴즈 생성에 실패했습니다: ${error.message}` });
    }
});

/**
 * POST /api/ai/answer
 * 사용자의 답변을 AI에게 보내 채점합니다.
 */
router.post('/answer', authenticateToken, async (req, res) => {
    const { answer, question, options, correctAnswer, questionContext } = req.body; // question, options, correctAnswer 추가

    if (!answer || !question || !correctAnswer || !questionContext) {
        return res.status(400).json({ message: '답변, 질문, 정답, 질문 정보가 필요합니다.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"}); // Gemini 2.5 Flash (최신 안정 버전)

        // 답변 채점 프롬프트
        const prompt = `
            다음 퀴즈 질문과 정답, 그리고 사용자의 답변이 주어졌습니다.
            사용자의 답변이 정답과 일치하는지 판단해주세요.
            응답은 JSON 형식으로 해주세요.
            {
                "isCorrect": true, // 사용자의 답변이 정답이면 true, 아니면 false
                "explanation": "여기에 채점 결과를 설명하는 문장을 작성하세요."
            }

            퀴즈 질문: "${question}"
            정답: "${correctAnswer}"
            사용자 답변: "${answer}"
            질문 카드 정보: ${JSON.stringify(questionContext)}

            예시 (정답):
            {
                "isCorrect": true,
                "explanation": "정답입니다! 종묘는 조선 왕실의 제례 공간입니다."
            }
            예시 (오답):
            {
                "isCorrect": false,
                "explanation": "아쉽지만 오답입니다. 종묘는 조선 왕실의 제례 공간입니다."
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        if (text.startsWith('```json')) {
            text = text.substring(7, text.lastIndexOf('```'));
        }
        const evaluation = JSON.parse(text);

        const isCorrect = evaluation.isCorrect;
        const reward = isCorrect ? 10 : 0; // 정답 시 10 코인 보상

        if (isCorrect) {
            // 유저 코인 업데이트
            await promisePool.query(
                'UPDATE users SET coins = coins + ? WHERE id = ?',
                [reward, req.user.id]
            );
        }

        res.json({
            isCorrect,
            reward,
            explanation: evaluation.explanation
        });

    } catch (error) {
        console.error('AI 답변 채점 오류:', error);
        res.status(500).json({ message: `AI 답변 채점에 실패했습니다: ${error.message}` });
    }
});

module.exports = router;
