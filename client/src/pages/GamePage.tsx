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
  const [backButtonHovered, setBackButtonHovered] = useState(false);
  const [restartButtonHovered, setRestartButtonHovered] = useState(false);

  const stage = STAGES.find((s) => s.id === currentStage);
  const currentAvatar = AVATAR_SHOP.find(a => a.id === playerAvatar);

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
    if (!canClick || flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId) || isWon) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanClick(false);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const card1 = cards[firstId];
      const card2 = cards[secondId];

      if (card1 && card2 && card1.pairId === card2.pairId) {
        setMatched((prev) => {
          const newMatched = [...prev, firstId, secondId];

          if (newMatched.length === cards.length) {
            setIsWon(true);

            if (!completedStages.includes(currentStage)) {
              setCompletedStages([...completedStages, currentStage]);
            }

            if (currentStage < STAGES.length && !unlockedStages.includes(currentStage + 1)) {
              setUnlockedStages([...unlockedStages, currentStage + 1]);
            }

            const rankingData = localStorage.getItem('ranking_data') || '[]';
            const rankings = JSON.parse(rankingData);
            rankings.push({
              name: playerName,
              stage: stage?.name || 'Stage',
              moves: moves + 1,
              timestamp: new Date().toISOString()
            });
            rankings.sort((a: any, b: any) => a.moves - b.moves);
            localStorage.setItem('ranking_data', JSON.stringify(rankings.slice(0, 50)));
          }

          return newMatched;
        });

        setFlipped([]);
        setCanClick(true);
      } else {
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
      <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#269dd9', fontSize: '24px', fontWeight: '700' }}>게임 준비 중...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
      {/* 헤더 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #bfd0d9',
        padding: '24px 32px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* 상단: 돌아가기 | 제목 | 다시하기 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <button
              onClick={() => navigate('/stages')}
              onMouseEnter={() => setBackButtonHovered(true)}
              onMouseLeave={() => setBackButtonHovered(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                color: '#269dd9',
                backgroundColor: backButtonHovered ? '#d4dde4' : '#e0e7eb',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              ← 돌아가기
            </button>

            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
              padding: '0',
              flex: 1,
              textAlign: 'center',
            }}>
              Stage {currentStage}: {stage?.name}
            </h1>

            <button
              onClick={handleRestartGame}
              onMouseEnter={() => setRestartButtonHovered(true)}
              onMouseLeave={() => setRestartButtonHovered(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                color: '#ffffff',
                backgroundColor: restartButtonHovered ? '#b31414' : '#e61919',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              다시 하기
            </button>
          </div>

          {/* 하단: 프로필 + 통계 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
          }}>
            {/* 프로필 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: '#f5fcff',
              border: '2px solid #269dd9',
              borderRadius: '8px',
            }}>
              {currentAvatar?.image ? (
                <img
                  src={currentAvatar.image}
                  alt="프로필"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid #bfd0d9',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span style={{ fontSize: '24px' }}>{playerAvatar}</span>
              )}
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#269dd9',
              }}>
                {playerName}
              </span>
            </div>

            {/* 통계 */}
            <div style={{
              display: 'flex',
              gap: '16px',
            }}>
              <div style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#f5fcff',
                border: '1px solid #bfd0d9',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#2e3538',
                  margin: '0',
                }}>시도</p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#269dd9',
                  margin: '2px 0 0 0',
                }}>
                  {moves}
                </p>
              </div>
              <div style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#f5fcff',
                border: '1px solid #bfd0d9',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#2e3538',
                  margin: '0',
                }}>진행도</p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#269dd9',
                  margin: '2px 0 0 0',
                }}>
                  {matchedPairs}/{totalPairs}
                </p>
              </div>
              <div style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#f5fcff',
                border: '1px solid #bfd0d9',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#2e3538',
                  margin: '0',
                }}>코인</p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#269dd9',
                  margin: '2px 0 0 0',
                }}>
                  {coins}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 게임 영역 */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px 16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}>
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  perspective: '1000px',
                  opacity: matched.includes(idx) ? 0.5 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.5s ease',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* 카드 뒷면 */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#269dd9',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#ffffff',
                      border: '2px solid #bfd0d9',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    ?
                  </div>

                  {/* 카드 앞면 */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      border: '2px solid #bfd0d9',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={`/img/${stage?.folder}/${encodeURIComponent(card.img)}`}
                      alt={card.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
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
        <div style={{
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
            border: '2px solid #33ccb3',
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#33ccb3',
              margin: '0 0 16px 0',
            }}>
              완료!
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#2e3538',
              margin: '0 0 8px 0',
            }}>
              시도 횟수: {moves}회
            </p>
            <p style={{
              fontSize: '16px',
              color: '#61686b',
              margin: '0 0 24px 0',
            }}>
              {stage?.name} 단계를 클리어했습니다!
            </p>

            {currentStage < STAGES.length ? (
              <>
                <button
                  onClick={() => {
                    navigate('/stages');
                    setGameInitialized(false);
                  }}
                  style={{
                    width: '100%',
                    marginBottom: '12px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#ffffff',
                    backgroundColor: '#269dd9',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7db0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#269dd9'}
                >
                  다음 단계로
                </button>
              </>
            ) : (
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#33ccb3',
                margin: '0 0 24px 0',
              }}>
                모든 단계를 완료했습니다!
              </p>
            )}

            <button
              onClick={() => navigate('/stages')}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                color: '#2e3538',
                backgroundColor: '#e0e7eb',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4dde4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e0e7eb'}
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