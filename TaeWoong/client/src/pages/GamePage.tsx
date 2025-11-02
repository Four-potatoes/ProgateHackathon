import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { STAGES, AVATAR_SHOP } from '../constants/gameData';
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
    if (!stage) return;

    // 현재 스테이지의 아이템 × 2 = 16장 카드 생성
    const pairs: GameCard[] = [];
    stage.items.forEach((item) => {
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
      <div className="min-h-screen bg-[#e5f7ff] flex items-center justify-center">
        <div className="text-[#269dd9] text-2xl font-bold">게임 준비 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5f7ff]">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#bfd0d9] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/stages')}
                className="py-2 px-4 rounded-lg font-bold text-[#269dd9] bg-[#e0e7eb] hover:bg-[#d4dde4] transition-all duration-300"
              >
                ← 돌아가기
              </button>
              {/* 좌측 프로필 */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#f5fcff] border-2 border-[#269dd9] rounded-lg">
                {AVATAR_SHOP.find(a => a.id === playerAvatar)?.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#bfd0d9]">
                    <img
                      src={AVATAR_SHOP.find(a => a.id === playerAvatar)?.image}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-xl">{playerAvatar}</span>
                )}
                <span className="text-sm font-semibold text-[#269dd9]">{playerName}</span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#269dd9]">
                Stage {currentStage}: {stage?.name}
              </h2>
            </div>

            <button
              onClick={handleRestartGame}
              className="py-2 px-4 rounded-lg font-bold text-white bg-[#e61919] hover:bg-[#b31414] transition-all duration-300"
            >
              다시 하기
            </button>
          </div>

          {/* 통계 */}
          <div className="flex justify-center gap-8 text-center">
            <div className="px-4 py-2 rounded-lg bg-[#f5fcff] border border-[#bfd0d9]">
              <p className="text-sm text-[#2e3538]">시도 횟수</p>
              <p className="text-3xl font-bold text-[#269dd9]">{moves}</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#f5fcff] border border-[#bfd0d9]">
              <p className="text-sm text-[#2e3538]">진행도</p>
              <p className="text-3xl font-bold text-[#269dd9]">
                {matchedPairs} / {totalPairs}
              </p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#f5fcff] border border-[#bfd0d9]">
              <p className="text-sm text-[#2e3538]">코인</p>
              <p className="text-3xl font-bold text-[#269dd9]">{coins}</p>
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
                    className="absolute w-full h-full bg-[#269dd9] rounded-lg shadow-lg flex items-center justify-center text-5xl font-bold text-white border-2 border-[#bfd0d9] hover:border-[#269dd9] transition-colors"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    ?
                  </div>

                  {/* 카드 앞면 */}
                  <div
                    className="absolute w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#bfd0d9]"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <img
                      src={`/img/${stage?.folder}/${encodeURIComponent(card.img)}`}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`이미지 로드 실패: /img/${stage?.folder}/${card.img}`);
                        e.currentTarget.style.display = 'none';
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
          <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full border-2 border-[#33ccb3]">
            <h2 className="text-4xl font-bold text-[#33ccb3] mb-4">완료!</h2>
            <p className="text-xl text-[#2e3538] mb-2">시도 횟수: {moves}회</p>
            <p className="text-lg text-[#61686b] mb-6">{stage?.name} 단계를 클리어했습니다!</p>

            {currentStage < STAGES.length ? (
              <>
                <button
                  onClick={() => {
                    navigate('/stages');
                    setGameInitialized(false);
                  }}
                  className="w-full mb-3 py-3 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all duration-300"
                >
                  다음 단계로
                </button>
              </>
            ) : (
              <p className="text-lg font-bold text-[#33ccb3] mb-4">모든 단계를 완료했습니다!</p>
            )}

            <button
              onClick={() => navigate('/stages')}
              className="w-full py-3 px-6 rounded-lg font-bold text-[#2e3538] bg-[#e0e7eb] hover:bg-[#d4dde4] transition-all duration-300"
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