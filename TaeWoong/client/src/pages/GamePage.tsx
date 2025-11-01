import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { STAGES, ITEMS } from '../constants/gameData';
import { GameCard } from '../types';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentStage, unlockedStages, completedStages, setCompletedStages, setUnlockedStages, coins } = useGame();
  const { playerAvatar, playerName } = useAuth();

  // 로컬 게임 상태
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [canClick, setCanClick] = useState(true);
  const [gameInitialized, setGameInitialized] = useState(false);

  const stage = STAGES.find((s) => s.id === currentStage);

  // 게임 초기화 - 한 번만 실행
  useEffect(() => {
    if (!gameInitialized) {
      initializeGame();
      setGameInitialized(true);
    }
  }, [gameInitialized]);

  const shuffleArray = (array: GameCard[]): GameCard[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const initializeGame = () => {
    // 8개 아이템 × 2 = 16장 카드 생성
    const pairs: GameCard[] = [];
    ITEMS.forEach((item) => {
      pairs.push({
        ...item,
        id: pairs.length,
        pairId: item.idx
      });
      pairs.push({
        ...item,
        id: pairs.length,
        pairId: item.idx
      });
    });

    const shuffled = shuffleArray(pairs);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
    setCanClick(true);
  };

  const handleCardClick = (cardId: number) => {
    // 클릭 조건 체크
    if (!canClick || flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId) || isWon) {
      return;
    }

    // 카드 뒤집기
    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    // 2장이 뒤집혔을 때
    if (newFlipped.length === 2) {
      setCanClick(false);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const card1 = cards[firstId];
      const card2 = cards[secondId];

      // 짝 확인
      if (card1 && card2 && card1.pairId === card2.pairId) {
        // 정답! 카드 제거
        setMatched((prev) => {
          const newMatched = [...prev, firstId, secondId];

          // 모든 카드를 맞췄는지 확인
          if (newMatched.length === cards.length) {
            setIsWon(true);

            // 스테이지 완료 처리
            if (!completedStages.includes(currentStage)) {
              setCompletedStages([...completedStages, currentStage]);
            }

            // 다음 스테이지 잠금 해제
            if (currentStage < STAGES.length && !unlockedStages.includes(currentStage + 1)) {
              setUnlockedStages([...unlockedStages, currentStage + 1]);
            }

            // 랭킹에 저장
            const rankingData = localStorage.getItem('ranking_data') || '[]';
            const rankings = JSON.parse(rankingData);
            rankings.push({
              name: playerName,
              stage: stage?.name || 'Stage',
              moves: moves + 1,
              timestamp: new Date().toISOString()
            });
            // 시도 횟수로 정렬
            rankings.sort((a: any, b: any) => a.moves - b.moves);
            localStorage.setItem('ranking_data', JSON.stringify(rankings.slice(0, 50)));
          }

          return newMatched;
        });

        setFlipped([]);
        setCanClick(true);
      } else {
        // 오답! 1초 후 카드 뒤집기
        setTimeout(() => {
          setFlipped([]);
          setCanClick(true);
        }, 1000);
      }
    }
  };

  const handleRestartGame = () => {
    setGameInitialized(false);
  };

  const totalPairs = cards.length / 2;
  const matchedPairs = matched.length / 2;

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">게임 준비 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate('/stages')}
              className="py-2 px-4 rounded-lg font-bold text-gray-200 bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              ← 돌아가기
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                Stage {currentStage}: {stage?.name}
              </h2>
            </div>

            <button
              onClick={handleRestartGame}
              className="py-2 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300"
            >
              🔄 다시 하기
            </button>
          </div>

          {/* 통계 */}
          <div className="flex justify-center gap-8 text-center">
            <div className="px-4 py-2 rounded-lg bg-white/5">
              <p className="text-sm text-gray-300">시도 횟수</p>
              <p className="text-3xl font-bold text-purple-300">{moves}</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/5">
              <p className="text-sm text-gray-300">진행도</p>
              <p className="text-3xl font-bold text-pink-300">
                {matchedPairs} / {totalPairs}
              </p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/5">
              <p className="text-sm text-gray-300">코인</p>
              <p className="text-3xl font-bold text-yellow-300">🪙 {coins}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 게임 영역 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`
                  relative w-full aspect-square cursor-pointer transition-all duration-500
                  ${matched.includes(idx) ? 'opacity-50' : ''}
                `}
                style={{
                  perspective: '1000px'
                }}
              >
                {/* 카드 컨테이너 */}
                <div
                  className={`
                    relative w-full h-full transition-transform duration-500
                    ${isFlipped ? 'rotate-y-180' : ''}
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* 카드 뒷면 */}
                  <div
                    className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center text-5xl font-bold text-white border-4 border-purple-300 hover:border-purple-100 transition-colors"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    ?
                  </div>

                  {/* 카드 앞면 */}
                  <div
                    className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border-4 border-purple-200 flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <img
                      src={`../assets/img/${card.img}`}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="60" text-anchor="middle" dy=".35em"%3E' +
                          card.icon +
                          '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 승리 모달 */}
      {isWon && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-green-600 mb-4">완료!</h2>
            <p className="text-xl text-gray-700 mb-2">시도 횟수: {moves}회</p>
            <p className="text-lg text-gray-600 mb-6">{stage?.name} 단계를 클리어했습니다!</p>

            {currentStage < STAGES.length ? (
              <>
                <button
                  onClick={() => {
                    navigate('/stages');
                    setGameInitialized(false);
                  }}
                  className="w-full mb-3 py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  다음 단계로
                </button>
              </>
            ) : (
              <p className="text-lg font-bold text-purple-600 mb-4">🏆 모든 단계를 완료했습니다!</p>
            )}

            <button
              onClick={() => navigate('/stages')}
              className="w-full py-3 px-6 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
            >
              스테이지 선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;