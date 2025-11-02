import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { AVATAR_SHOP } from '../constants/gameData';

const RankingPage: React.FC = () => {
  const navigate = useNavigate();
  const { playerAvatar, playerName } = useAuth();
  const [rankingData, setRankingData] = useState<RankingEntry[]>([]);
  const [buttonHovered, setButtonHovered] = useState(false);

  useEffect(() => {
    // 로컬스토리지에서 랭킹 데이터 로드
    const saved = localStorage.getItem('ranking_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // 시도 횟수 순으로 정렬
        const sorted = data.sort((a: RankingEntry, b: RankingEntry) => a.moves - b.moves);
        setRankingData(sorted.slice(0, 50)); // 상위 50개만 표시
      } catch (error) {
        console.error('랭킹 데이터 로드 실패:', error);
      }
    }
  }, []);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0:
        return 'bg-yellow-100 border-yellow-400';
      case 1:
        return 'bg-gray-100 border-gray-400';
      case 2:
        return 'bg-orange-100 border-orange-400';
      default:
        return 'bg-[#f5fcff] border-[#bfd0d9]';
    }
  };

  const getRankText = (rank: number) => {
    switch (rank) {
      case 0:
        return '1st';
      case 1:
        return '2nd';
      case 2:
        return '3rd';
      default:
        return `${rank + 1}th`;
    }
  };

  const currentAvatar = AVATAR_SHOP.find(a => a.id === playerAvatar);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
      {/* 헤더 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #bfd0d9',
        padding: '32px 24px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>
          {/* 프로필 + 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              {currentAvatar?.image ? (
                <img
                  src={currentAvatar.image}
                  alt={currentAvatar.name}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '3px solid #269dd9',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#269dd9',
                  border: '3px solid #269dd9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                }}>
                  {playerAvatar || '😊'}
                </div>
              )}
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2e3538',
              }}>
                {playerName || 'Player'}
              </span>
            </div>

            <button
              onClick={() => navigate('/stages')}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: buttonHovered ? '#1e7db0' : '#269dd9',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              스테이지 선택
            </button>
          </div>

          {/* 제목 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <h1 style={{
              fontSize: '40px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
              padding: '0',
            }}>
              랭킹
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#61686b',
              margin: '0',
              padding: '0',
            }}>
              시도 횟수가 적을수록 높은 순위!
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        <div style={{
          backgroundColor: '#f5fcff',
          border: '2px solid #bfd0d9',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          {/* 상위 3명 특별 표시 */}
          {rankingData.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '32px',
              backgroundColor: '#ffffff',
            }}>
              {rankingData.slice(0, 3).map((entry, idx) => {
                const rankColors = [
                  { bg: '#FEF3C7', border: '#FBBF24', text: '#D97706' },
                  { bg: '#F3F4F6', border: '#D1D5DB', text: '#6B7280' },
                  { bg: '#FED7AA', border: '#FDBA74', text: '#D97706' }
                ];
                const colors = rankColors[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      border: `2px solid ${colors.border}`,
                      backgroundColor: colors.bg,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <p style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#269dd9',
                      margin: '0 0 8px 0',
                    }}>
                      {getRankText(idx)}
                    </p>
                    <p style={{
                      fontSize: '18px',
                      color: '#2e3538',
                      fontWeight: '600',
                      margin: '8px 0',
                    }}>
                      {entry.name}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#61686b',
                      margin: '8px 0',
                    }}>
                      {entry.stage}
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#33ccb3',
                      margin: '0',
                    }}>
                      {entry.moves}회
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* 랭킹 리스트 */}
          <div style={{
            borderTop: rankingData.length > 0 ? '1px solid #bfd0d9' : 'none',
          }}>
            {rankingData.length > 0 ? (
              rankingData.map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px',
                    borderBottom: idx < rankingData.length - 1 ? '1px solid #bfd0d9' : 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: idx < 3 ? '#ffffff' : 'transparent',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx < 3 ? '#ffffff' : 'transparent'}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flex: 1,
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#269dd9',
                      width: '48px',
                      textAlign: 'center',
                    }}>
                      {getRankText(idx)}
                    </div>
                    <div style={{
                      flex: 1,
                    }}>
                      <p style={{
                        fontWeight: '700',
                        color: '#2e3538',
                        fontSize: '16px',
                        margin: '0',
                      }}>
                        {entry.name}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#61686b',
                        margin: '4px 0 0 0',
                      }}>
                        {entry.stage}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    textAlign: 'right',
                  }}>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#33ccb3',
                      margin: '0',
                    }}>
                      {entry.moves}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#61686b',
                      margin: '4px 0 0 0',
                    }}>
                      시도 횟수
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
              }}>
                <p style={{
                  color: '#61686b',
                  fontSize: '18px',
                  margin: '0',
                }}>
                  아직 랭킹 데이터가 없습니다.
                </p>
                <p style={{
                  color: '#61686b',
                  fontSize: '14px',
                  margin: '8px 0 0 0',
                }}>
                  게임을 완료하면 랭킹에 등록됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0 0 12px 0',
            }}>
              순위 계산
            </h3>
            <ul style={{
              fontSize: '14px',
              color: '#2e3538',
              margin: '0',
              paddingLeft: '20px',
            }}>
              <li>시도 횟수 (moves)가 적을수록 높은 순위</li>
              <li>최고 기록부터 정렬됩니다</li>
              <li>상위 50개 기록이 표시됩니다</li>
            </ul>
          </div>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '24px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0 0 12px 0',
            }}>
              팁
            </h3>
            <ul style={{
              fontSize: '14px',
              color: '#2e3538',
              margin: '0',
              paddingLeft: '20px',
            }}>
              <li>카드의 위치를 기억하며 플레이하세요</li>
              <li>집중력을 유지하면 시도 횟수를 줄일 수 있습니다</li>
              <li>랭킹에 등록되어 글로벌 순위를 경쟁하세요</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;