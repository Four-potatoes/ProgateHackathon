import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { STAGES, AVATAR_SHOP } from '../constants/gameData';

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
  item: {
    title: string;
    desc: string;
    icon: string;
  };
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { isGuest, playerAvatar, playerName } = useAuth();
  const { completedStages, addCoins, coins } = useGame();

  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'loading' | 'question' | 'checking' | 'result'>('loading');
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    if (isGuest || completedStages.length === 0) {
      setQuizState('loading');
    } else {
      loadQuiz();
    }
  }, []);

  const loadQuiz = () => {
    const unlockedItems = STAGES.flatMap((stage) =>
      completedStages.includes(stage.id)
        ? stage.items.map((item) => ({
            ...item,
            stageName: stage.name
          }))
        : []
    );

    if (unlockedItems.length === 0) {
      setQuizState('loading');
      return;
    }

    const randomItem = unlockedItems[Math.floor(Math.random() * unlockedItems.length)];
    const allItems = STAGES.flatMap((stage) => stage.items);
    const wrongOptions = allItems
      .filter((item) => item.idx !== randomItem.idx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.desc);

    const options = [randomItem.desc, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuiz({
      question: `"${randomItem.title}"은(는) 무엇을 설명하는 것일까요?`,
      options: options,
      correctAnswer: randomItem.desc,
      item: {
        title: randomItem.title,
        desc: randomItem.desc,
        icon: randomItem.icon
      }
    });

    setSelectedAnswer(null);
    setQuizState('question');
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setQuizState('checking');

    const correct = answer === currentQuiz?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      addCoins(10);
    }

    setTimeout(() => {
      setQuizState('result');
    }, 500);
  };

  const handleNextQuiz = () => {
    setQuizCount((prev) => prev + 1);
    loadQuiz();
  };

  if (isGuest) {
    return (
      <div className="min-h-screen bg-[#e5f7ff]">
        <header className="bg-white border-b border-[#bfd0d9] sticky top-0 z-30 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#269dd9]">AI 퀴즈</h1>
                <p className="text-[#2e3538] mt-2">한국 문화 퀴즈를 풀고 코인을 획득하세요!</p>
              </div>
              <button
                onClick={() => navigate('/stages')}
                className="py-2 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-8 text-center shadow-md">
            <p className="text-xl text-[#269dd9] font-bold mb-4">로그인 필요</p>
            <p className="text-[#2e3538] mb-6">
              AI 퀴즈는 로그인한 사용자만 이용할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
            >
              로그인하러 가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (completedStages.length === 0) {
    return (
      <div className="min-h-screen bg-[#e5f7ff]">
        <header className="bg-white border-b border-[#bfd0d9] sticky top-0 z-30 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#269dd9]">AI 퀴즈</h1>
                <p className="text-[#2e3538] mt-2">한국 문화 퀴즈를 풀고 코인을 획득하세요!</p>
              </div>
              <button
                onClick={() => navigate('/stages')}
                className="py-2 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-8 text-center shadow-md">
            <p className="text-xl text-[#269dd9] font-bold mb-4">스테이지 클리어 필요</p>
            <p className="text-[#2e3538] mb-6">
              퀴즈를 풀려면 먼저 스테이지를 하나 이상 클리어해야 합니다.
            </p>
            <button
              onClick={() => navigate('/stages')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
            >
              게임 시작하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5f7ff]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#bfd0d9] sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* 좌측 프로필 */}
              <div className="flex items-center gap-3 px-4 py-2 bg-[#f5fcff] border-2 border-[#269dd9] rounded-lg">
                {AVATAR_SHOP.find(a => a.id === playerAvatar)?.image ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#bfd0d9]">
                    <img
                      src={AVATAR_SHOP.find(a => a.id === playerAvatar)?.image}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-2xl">{playerAvatar}</span>
                )}
                <span className="text-sm font-semibold text-[#269dd9]">{playerName}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#269dd9]">AI 퀴즈</h1>
                <p className="text-[#61686b] text-sm">한국 문화를 배워봅시다!</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/stages')}
              className="py-2 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#f5fcff] border-2 border-[#269dd9] rounded-lg p-8 shadow-lg">
          {/* 진행 상황 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-[#61686b]">객관식 퀴즈</p>
              <p className="text-[#269dd9] font-bold">{quizCount + 1}번째 문제</p>
            </div>
            <div className="bg-[#269dd9] text-white px-4 py-2 rounded-lg font-bold">
              {quizCount}/8 완료
            </div>
          </div>

          {/* 진행 바 */}
          <div className="w-full h-2 bg-[#e0e7eb] rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-[#269dd9] transition-all duration-500"
              style={{ width: `${(quizCount / 8) * 100}%` }}
            />
          </div>

          {/* 퀴즈 상태별 렌더링 */}
          {quizState === 'loading' ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#269dd9] mb-4"></div>
              <p className="text-[#61686b]">퀴즈 준비 중...</p>
            </div>
          ) : quizState === 'question' && currentQuiz ? (
            <div className="space-y-6">
              {/* 질문 */}
              <div className="bg-white border-l-4 border-[#269dd9] rounded-lg p-6 shadow-sm">
                <p className="text-sm text-[#61686b] font-semibold mb-2">문제</p>
                <p className="text-[#269dd9] text-lg font-bold">{currentQuiz.question}</p>
              </div>

              {/* 선택지 */}
              <div className="space-y-3">
                {currentQuiz.options.map((option, idx) => {
                  const labels = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`
                        w-full p-4 rounded-lg font-semibold text-left transition-all duration-200
                        flex items-center gap-4 border-2
                        ${
                          selectedAnswer === option
                            ? 'bg-[#269dd9] border-[#269dd9] text-white'
                            : 'bg-white border-[#bfd0d9] text-[#2e3538] hover:bg-[#e0e7eb] hover:border-[#269dd9]'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedAnswer === option ? 'bg-white/20' : 'bg-[#e0e7eb]'
                      }`}>
                        <span className="text-sm font-bold">{labels[idx]}</span>
                      </div>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* 정답 확인 버튼 */}
              <button
                onClick={() => selectedAnswer && handleSelectAnswer(selectedAnswer)}
                disabled={!selectedAnswer}
                className="w-full py-3 px-6 rounded-lg font-bold text-white bg-[#33ccb3] hover:bg-[#29a895] disabled:bg-[#e7ecef] disabled:text-[#61686b] transition-all duration-300 disabled:cursor-not-allowed"
              >
                정답 확인
              </button>
            </div>
          ) : quizState === 'checking' || quizState === 'result' ? (
            <div className="space-y-6 text-center py-6">
              {/* 결과 표시 */}
              <div className="space-y-4">
                <div>
                  <p
                    className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-[#33ccb3]' : 'text-[#e61919]'}`}
                  >
                    {isCorrect ? '정답입니다!' : '틀렸습니다!'}
                  </p>
                  {isCorrect && (
                    <p className="text-lg text-[#269dd9] font-semibold">
                      +10 코인 획득! (총: {coins}코인)
                    </p>
                  )}
                </div>

                {/* 정답 표시 */}
                <div className="bg-white border-2 border-[#bfd0d9] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#61686b] mb-2">정답:</p>
                  <p className="text-[#269dd9] font-semibold">{currentQuiz?.correctAnswer}</p>
                </div>
              </div>

              {/* 다음 문제 버튼 */}
              {quizCount < 8 ? (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all duration-300"
                >
                  다음 문제
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg text-[#33ccb3] font-bold">오늘의 8문제를 완료했습니다!</p>
                  <button
                    onClick={() => navigate('/stages')}
                    className="w-full py-3 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all duration-300"
                  >
                    게임으로 돌아가기
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* 정보 섹션 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-4 text-center">
            <p className="text-sm text-[#61686b]">정답: +10 코인</p>
          </div>
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-4 text-center">
            <p className="text-sm text-[#61686b]">오답: 재시도</p>
          </div>
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-4 text-center">
            <p className="text-sm text-[#61686b]">보유: {coins} 코인</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
