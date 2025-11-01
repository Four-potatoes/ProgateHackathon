import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { STAGES } from '../constants/gameData';

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
  const { isGuest } = useAuth();
  const { completedStages, addCoins, coins } = useGame();

  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'loading' | 'question' | 'checking' | 'result'>('loading');
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // 퀴즈 로드
  useEffect(() => {
    if (isGuest || completedStages.length === 0) {
      setQuizState('loading');
    } else {
      loadQuiz();
    }
  }, []);

  const loadQuiz = () => {
    // 완료된 스테이지의 아이템들 수집
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

    // 랜덤 아이템 선택
    const randomItem = unlockedItems[Math.floor(Math.random() * unlockedItems.length)];

    // 정답 + 오답 3개 옵션 생성
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

    // 정답 확인
    const correct = answer === currentQuiz?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      addCoins(10);
      setCoinsEarned(10);
    }

    // 1초 후 결과 표시
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white">🤖 AI 코인 채굴 퀴즈</h1>
                <p className="text-gray-300 mt-2">한국 문화 퀴즈를 풀고 코인을 획득하세요!</p>
              </div>
              <button
                onClick={() => navigate('/stages')}
                className="py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 text-center">
            <p className="text-xl text-gray-300 mb-4">⚠️ 로그인 필요</p>
            <p className="text-gray-400 mb-6">
              코인 채굴 퀴즈는 로그인한 사용자만 이용할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white">🤖 AI 코인 채굴 퀴즈</h1>
                <p className="text-gray-300 mt-2">한국 문화 퀴즈를 풀고 코인을 획득하세요!</p>
              </div>
              <button
                onClick={() => navigate('/stages')}
                className="py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 text-center">
            <p className="text-xl text-gray-300 mb-4">🎮 스테이지 클리어 필요</p>
            <p className="text-gray-400 mb-6">
              퀴즈를 풀려면 먼저 스테이지를 하나 이상 클리어해야 합니다.
            </p>
            <button
              onClick={() => navigate('/stages')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              게임 시작하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900">
      {/* 헤더 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">🤖 AI: K-Culture 퀴즈</h1>
              <p className="text-gray-300 mt-1">한국 문화를 배워봅시다!</p>
            </div>
            <button
              onClick={() => navigate('/stages')}
              className="py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-b from-indigo-600/30 to-purple-600/20 border-2 border-indigo-400/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          {/* 진행 상황 */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <div>
                <p className="text-sm text-gray-300">AI 객관식 퀴즈</p>
                <p className="text-white font-bold">{quizCount + 1}번째 문제</p>
              </div>
            </div>
            <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold">
              {quizCount}/8 완료
            </div>
          </div>

          {/* 진행 바 */}
          <div className="w-full h-2 bg-gray-600 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
              style={{ width: `${(quizCount / 8) * 100}%` }}
            />
          </div>

          {/* 퀴즈 상태별 렌더링 */}
          {quizState === 'loading' ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mb-4"></div>
              <p className="text-gray-300">퀴즈 준비 중...</p>
            </div>
          ) : quizState === 'question' && currentQuiz ? (
            <div className="space-y-6">
              {/* 질문 */}
              <div className="bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-l-4 border-purple-400 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-sm text-gray-300 font-semibold mb-2">AI 객관식 퀴즈</p>
                    <p className="text-white text-lg font-bold">{currentQuiz.question}</p>
                  </div>
                </div>
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
                        flex items-center gap-4
                        ${
                          selectedAnswer === option
                            ? 'bg-indigo-500/60 border-2 border-indigo-300 text-white'
                            : 'bg-white/10 border-2 border-white/20 text-gray-200 hover:bg-white/20 hover:border-white/30'
                        }
                      `}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
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
                className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed"
              >
                정답 확인
              </button>
            </div>
          ) : quizState === 'checking' || quizState === 'result' ? (
            <div className="space-y-6 text-center py-6">
              {/* 결과 표시 */}
              <div className="space-y-4">
                <div className={`text-6xl ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
                  {isCorrect ? '✅' : '❌'}
                </div>

                <div>
                  <p
                    className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {isCorrect ? '정답입니다!' : '틀렸습니다!'}
                  </p>
                  {isCorrect && (
                    <p className="text-lg text-yellow-300 font-semibold">
                      🪙 +10 코인 획득! (총: {coins}코인)
                    </p>
                  )}
                </div>

                {/* 정답 표시 */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-300 mb-2">정답:</p>
                  <p className="text-white font-semibold">{currentQuiz?.correctAnswer}</p>
                </div>
              </div>

              {/* 다음 문제 버튼 */}
              {quizCount < 8 ? (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
                >
                  다음 문제 →
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg text-purple-300 font-bold">🎉 오늘의 8문제를 완료했습니다!</p>
                  <button
                    onClick={() => navigate('/stages')}
                    className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
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
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-xs text-gray-300">정답: +10 코인</p>
          </div>
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 text-center">
            <p className="text-2xl mb-2">❌</p>
            <p className="text-xs text-gray-300">오답: 재시도</p>
          </div>
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4 text-center">
            <p className="text-2xl mb-2">🪙</p>
            <p className="text-xs text-gray-300">보유: {coins} 코인</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;