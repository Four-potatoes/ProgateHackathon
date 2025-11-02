import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { STAGES, AVATAR_SHOP } from '../constants/gameData';
import { GameItem } from '../types';

const StagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { playerName, playerAvatar, isGuest, logout } = useAuth();
  const { unlockedStages, completedStages, coins, initializeGame } = useGame();
  const [logoutHovered, setLogoutHovered] = useState(false);
  const [signupHovered, setSignupHovered] = useState(false);

  const handleGameStart = (stageId: number) => {
    initializeGame(stageId);
    navigate('/game');
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      await logout();
      navigate('/');
    }
  };

  const currentAvatar = AVATAR_SHOP.find(a => a.id === playerAvatar);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5f7ff' }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #bfd0d9',
        padding: '24px 32px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '60px',
          width: '100%',
        }}>
          {/* 왼쪽: 프로필 + 코인 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}>
            {/* 프로필 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              {currentAvatar?.image ? (
                <img
                  src={currentAvatar.image}
                  alt="프로필"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid #269dd9',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#269dd9',
                  border: '3px solid #269dd9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {playerAvatar || '😊'}
                </div>
              )}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                <h1 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#171a1c',
                  margin: '0',
                  padding: '0',
                }}>
                  {playerName}
                </h1>
                {isGuest && (
                  <p style={{
                    fontSize: '12px',
                    color: '#61686b',
                    margin: '0',
                    padding: '0',
                  }}>
                    게스트 모드
                  </p>
                )}
              </div>
            </div>

            {/* 코인 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f5fcff',
              border: '2px solid #269dd9',
              borderRadius: '8px',
            }}>
              <span style={{
                fontWeight: '600',
                color: '#269dd9',
                fontSize: '14px',
              }}>
                코인:
              </span>
              <span style={{
                fontWeight: '700',
                color: '#269dd9',
                fontSize: '16px',
              }}>
                {coins}
              </span>
            </div>
          </div>

          {/* 오른쪽: 버튼 */}
          <div style={{
            display: 'flex',
            gap: '12px',
          }}>
            {isGuest ? (
              <button
                onClick={() => navigate('/')}
                onMouseEnter={() => setSignupHovered(true)}
                onMouseLeave={() => setSignupHovered(false)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: signupHovered ? '#29a895' : '#33ccb3',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                회원가입
              </button>
            ) : (
              <button
                onClick={handleLogout}
                onMouseEnter={() => setLogoutHovered(true)}
                onMouseLeave={() => setLogoutHovered(false)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: logoutHovered ? '#b31414' : '#e61919',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={{
        paddingTop: '48px',
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          {/* 제목 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#269dd9',
              margin: '0 0 16px 0',
            }}>
              K-Cluture Memory Game
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#2e3538',
              margin: '0',
            }}>
              한국 문화를 배우며 카드를 맞추세요
            </p>
          </div>

          {/* 게스트 모드 알림 */}
          {isGuest && (
            <div style={{
              maxWidth: '768px',
              margin: '0 auto 32px auto',
            }}>
              <div style={{
                backgroundColor: '#f5fcff',
                border: '2px solid #33ccb3',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}>
                  <div style={{
                    flex: 1,
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#269dd9',
                      margin: '0 0 8px 0',
                    }}>
                      게스트 모드로 플레이 중
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#2e3538',
                      margin: '0',
                    }}>
                      현재 브라우저에 게임 기록이 임시 저장됩니다. 회원가입 또는 로그인하면 데이터를 영구적으로 저장할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 스테이지 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}>
            {STAGES.map((stage) => {
              const isUnlocked = unlockedStages.includes(stage.id);
              const isCompleted = completedStages.includes(stage.id);

              return (
                <div
                  key={stage.id}
                  style={{
                    position: 'relative',
                    backgroundColor: '#f5fcff',
                    border: `2px solid ${
                      isCompleted ? '#33ccb3' : isUnlocked ? '#269dd9' : '#bfd0d9'
                    }`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '32px',
                    opacity: !isUnlocked ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                >
                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '12px',
                      padding: '4px 12px',
                      backgroundColor: '#e7ecef',
                      borderRadius: '4px',
                      color: '#61686b',
                      fontWeight: '700',
                    }}>
                      LOCK
                    </div>
                  )}
                  {isCompleted && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '12px',
                      padding: '4px 12px',
                      backgroundColor: '#33ccb3',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontWeight: '700',
                    }}>
                      CLEAR
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#269dd9',
                      margin: '0 0 8px 0',
                    }}>
                      Stage {stage.id}
                    </h3>
                    <p style={{
                      fontSize: '18px',
                      color: '#2e3538',
                      margin: '0',
                    }}>
                      {stage.name}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    marginBottom: '24px',
                  }}>
                    {stage.items.slice(0, 8).map((item) => (
                      <div
                        key={item.idx}
                        style={{
                          aspectRatio: '1/1',
                          backgroundColor: '#e0e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: '1px solid #bfd0d9',
                        }}
                      >
                        <img
                          src={`/img/${stage.folder}/${encodeURIComponent(item.img)}`}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            console.error(`이미지 로드 실패: /img/${stage.folder}/${item.img}`);
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e0e7eb"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23666"%3E%3F%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleGameStart(stage.id)}
                    disabled={!isUnlocked}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '16px',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: isUnlocked ? '#269dd9' : '#e7ecef',
                      color: isUnlocked ? '#ffffff' : '#61686b',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    }}
                    onMouseEnter={(e) => {
                      if (isUnlocked) {
                        e.currentTarget.style.backgroundColor = '#1e7db0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isUnlocked) {
                        e.currentTarget.style.backgroundColor = '#269dd9';
                      }
                    }}
                  >
                    {isUnlocked ? '게임 시작' : '잠금'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 네비게이션 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            {[
              { label: '한국 문화 백과', path: '/wiki', color: '#33ccb3', hoverColor: '#29a895' },
              { label: '배지 & 업적', path: '/achievements', color: '#eb9947', hoverColor: '#c27d35' },
              { label: '내 컬렉션', path: '/collection', color: '#6666cc', hoverColor: '#5252a8' },
              { label: 'AI 퀴즈', path: '/quiz', color: '#269dd9', hoverColor: '#1e7db0' },
              { label: '프로필 상점', path: '/shop', color: '#cc66cc', hoverColor: '#a852a8' },
              { label: '랭킹', path: '/ranking', color: '#269dd9', hoverColor: '#1e7db0' },
            ].map((btn) => (
              <button
                key={btn.path}
                onClick={() => navigate(btn.path)}
                style={{
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  color: '#ffffff',
                  backgroundColor: btn.color,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = btn.hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = btn.color}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StagesPage;