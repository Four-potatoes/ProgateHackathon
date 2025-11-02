import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { AVATAR_SHOP } from '../constants/gameData';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

const AchievementPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedStages, coins } = useGame();
  const { playerAvatar, playerName } = useAuth();
  const [buttonHovered, setButtonHovered] = useState(false);

  // 배지 정의
  const badges: Badge[] = [
    {
      id: 'first_game',
      name: '첫 게임 시작',
      description: '첫 번째 게임을 플레이했습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '게임 1회 플레이',
      unlocked: completedStages.length > 0,
      unlockedDate: completedStages.length > 0 ? new Date().toLocaleDateString() : undefined,
      progress: completedStages.length,
      maxProgress: 1
    },
    {
      id: 'stage_master',
      name: '스테이지 마스터',
      description: '모든 스테이지를 클리어했습니다',
      icon: '',
      color: 'bg-[#33ccb3]',
      condition: '모든 스테이지 클리어',
      unlocked: completedStages.length === 3,
      unlockedDate: completedStages.length === 3 ? new Date().toLocaleDateString() : undefined,
      progress: completedStages.length,
      maxProgress: 3
    },
    {
      id: 'coin_collector',
      name: '코인 수집가',
      description: '50개 이상의 코인을 모았습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '50 코인 모으기',
      unlocked: coins >= 50,
      unlockedDate: coins >= 50 ? new Date().toLocaleDateString() : undefined,
      progress: coins,
      maxProgress: 50
    },
    {
      id: 'super_rich',
      name: '슈퍼 부자',
      description: '200개 이상의 코인을 모았습니다',
      icon: '',
      color: 'bg-[#33ccb3]',
      condition: '200 코인 모으기',
      unlocked: coins >= 200,
      unlockedDate: coins >= 200 ? new Date().toLocaleDateString() : undefined,
      progress: coins,
      maxProgress: 200
    },
    {
      id: 'culture_lover',
      name: '한국 문화 사랑꾼',
      description: '한국 문화재 스테이지를 완료했습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '문화재 스테이지 클리어',
      unlocked: completedStages.includes(1),
      unlockedDate: completedStages.includes(1) ? new Date().toLocaleDateString() : undefined
    },
    {
      id: 'food_expert',
      name: '한식 전문가',
      description: '한국 음식 스테이지를 완료했습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '음식 스테이지 클리어',
      unlocked: completedStages.includes(2),
      unlockedDate: completedStages.includes(2) ? new Date().toLocaleDateString() : undefined
    },
    {
      id: 'movie_buff',
      name: '영화 애호가',
      description: '한국 영화 스테이지를 완료했습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '영화 스테이지 클리어',
      unlocked: completedStages.includes(3),
      unlockedDate: completedStages.includes(3) ? new Date().toLocaleDateString() : undefined
    },
    {
      id: 'streak_warrior',
      name: '연속 플레이어',
      description: '5일 연속으로 게임을 플레이했습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '5일 연속 플레이',
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'speed_runner',
      name: '스피드 러너',
      description: '게임을 10회 이상 클리어했습니다',
      icon: '',
      color: 'bg-[#33ccb3]',
      condition: '게임 10회 클리어',
      unlocked: completedStages.length >= 10,
      progress: completedStages.length,
      maxProgress: 10
    },
    {
      id: 'perfect_memory',
      name: '완벽한 기억력',
      description: '각 스테이지를 최소 시도로 클리어했습니다',
      icon: '',
      color: 'bg-[#269dd9]',
      condition: '최적 플레이',
      unlocked: false
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;
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
              스테이지로
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
              배지 & 업적
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#61686b',
              margin: '0',
              padding: '0',
            }}>
              게임을 플레이하고 배지를 수집하세요!
            </p>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
            }}>
              {unlockedCount}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '8px 0 0 0',
            }}>
              배지 수집
            </p>
          </div>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
            }}>
              {totalBadges}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '8px 0 0 0',
            }}>
              전체 배지
            </p>
          </div>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#33ccb3',
              margin: '0',
            }}>
              {Math.round((unlockedCount / totalBadges) * 100)}%
            </p>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '8px 0 0 0',
            }}>
              진행률
            </p>
          </div>
          <div style={{
            backgroundColor: '#f5fcff',
            border: '2px solid #bfd0d9',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0',
            }}>
              {completedStages.length}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#61686b',
              margin: '8px 0 0 0',
            }}>
              클리어한 스테이지
            </p>
          </div>
        </div>

        {/* 진행 바 */}
        <div style={{
          backgroundColor: '#f5fcff',
          border: '2px solid #bfd0d9',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <p style={{
              color: '#2e3538',
              fontWeight: '700',
              margin: '0',
            }}>
              배지 수집 진행도
            </p>
            <p style={{
              color: '#61686b',
              fontSize: '14px',
              margin: '0',
            }}>
              {unlockedCount} / {totalBadges}
            </p>
          </div>
          <div style={{
            width: '100%',
            height: '16px',
            backgroundColor: '#ffffff',
            border: '2px solid #bfd0d9',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#33ccb3',
                width: `${(unlockedCount / totalBadges) * 100}%`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </section>

      {/* 배지 그리드 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 48px 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                position: 'relative',
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s ease',
                border: '2px solid',
                backgroundColor: badge.unlocked ? badge.color : '#ffffff',
                borderColor: badge.unlocked ? '#269dd9' : '#bfd0d9',
                opacity: badge.unlocked ? 1 : 0.5,
                color: badge.unlocked ? '#ffffff' : '#61686b',
                cursor: 'pointer',
              }}
            >
              {/* 배지 상태 표시 */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: badge.unlocked ? '#ffffff' : '#bfd0d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div
                  style={{
                    width: badge.unlocked ? '16px' : '12px',
                    height: badge.unlocked ? '16px' : '12px',
                    borderRadius: '50%',
                    backgroundColor: badge.unlocked ? '#33ccb3' : '#ffffff',
                  }}
                />
              </div>

              {/* 배지 내용 */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  color: badge.unlocked ? '#ffffff' : '#61686b',
                }}>
                  {badge.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  margin: '8px 0 0 0',
                  color: badge.unlocked ? 'rgba(255,255,255,0.9)' : '#61686b',
                }}>
                  {badge.description}
                </p>
              </div>

              {/* 조건 */}
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: badge.unlocked ? 'rgba(255,255,255,0.8)' : '#61686b',
              }}>
                {badge.condition}
              </div>

              {/* 진행도 바 */}
              {badge.progress !== undefined && badge.maxProgress !== undefined && !badge.unlocked && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#bfd0d9',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#33ccb3',
                        width: `${(badge.progress / badge.maxProgress) * 100}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <p style={{
                    fontSize: '12px',
                    marginTop: '4px',
                    color: '#61686b',
                    margin: '4px 0 0 0',
                  }}>
                    {badge.progress} / {badge.maxProgress}
                  </p>
                </div>
              )}

              {/* 언락 날짜 */}
              {badge.unlocked && badge.unlockedDate && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  {badge.unlockedDate}에 해제됨
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* 팁 */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 32px 24px',
      }}>
        <div style={{
          backgroundColor: '#f5fcff',
          border: '2px solid #bfd0d9',
          borderRadius: '8px',
          padding: '24px',
        }}>
          <h3 style={{
            color: '#269dd9',
            fontWeight: '700',
            marginBottom: '12px',
            margin: '0 0 12px 0',
          }}>
            배지를 더 많이 수집하는 팁
          </h3>
          <ul style={{
            fontSize: '14px',
            color: '#2e3538',
            margin: '0',
            paddingLeft: '20px',
          }}>
            <li>모든 스테이지를 클리어해서 "스테이지 마스터" 배지를 얻으세요</li>
            <li>AI 퀴즈를 풀어서 코인을 모아 배지를 해제하세요</li>
            <li>매일 게임을 플레이해서 "연속 플레이어" 배지를 목표로 하세요</li>
            <li>빠르게 게임을 완료해서 "스피드 러너" 배지를 노려보세요</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AchievementPage;