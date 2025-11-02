import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { AVATAR_SHOP } from '../constants/gameData';

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { playerAvatar, setPlayerAvatar, coins: authCoins } = useAuth();
  const { coins, setCoins, purchasedAvatars, addPurchasedAvatar } = useGame();
  const [message, setMessage] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);

  const displayCoins = coins || authCoins;
  const currentAvatar = AVATAR_SHOP.find(a => a.id === playerAvatar);

  const handlePurchase = (avatarId: string) => {
    const avatar = AVATAR_SHOP.find((a) => a.id === avatarId);
    if (!avatar) return;

    if (displayCoins >= avatar.price && !purchasedAvatars.has(avatar.id)) {
      // 코인 차감
      setCoins(displayCoins - avatar.price);
      // 아바타 추가 (GameContext에서 자동으로 백엔드 저장)
      addPurchasedAvatar(avatar.id);
      setMessage(`${avatar.name} 아바타를 구매했습니다!`);
      setTimeout(() => setMessage(''), 3000);
    } else if (purchasedAvatars.has(avatar.id)) {
      setMessage('이미 보유한 아바타입니다.');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('코인이 부족합니다. AI 퀴즈를 풀어 코인을 획득하세요!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSelectAvatar = (avatarId: string) => {
    if (purchasedAvatars.has(avatarId)) {
      setPlayerAvatar(avatarId);
      setMessage(`${avatarId}로 프로필 아바타가 변경되었습니다!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

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
                {displayCoins}
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
              프로필 상점
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#61686b',
              margin: '0',
              padding: '0',
            }}>
              코인을 모아 새로운 프로필 아바타를 구매하세요!
            </p>
          </div>
        </div>
      </div>

      {/* 메시지 */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: '#33ccb3',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: '600',
          }}>
            {message}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        {/* 카테고리 */}
        {['free', 'basic', 'premium', 'legendary'].map((category) => {
          const categoryItems = AVATAR_SHOP.filter((a) => a.category === category);
          const categoryNames: Record<string, string> = {
            free: '무료',
            basic: '애니메이션',
            premium: '케이팝 데몬 헌터스',
            legendary: 'Progate & Entbe'
          };

          return (
            <div key={category} style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#269dd9',
                margin: '0 0 24px 0',
              }}>
                {categoryNames[category]}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '24px',
              }}>
                {categoryItems.map((avatar) => {
                  const isPurchased = purchasedAvatars.has(avatar.id);
                  const isSelected = playerAvatar === avatar.id;
                  const canAfford = displayCoins >= avatar.price;

                  return (
                    <div
                      key={avatar.id}
                      style={{
                        position: 'relative',
                        backgroundColor: '#f5fcff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        padding: '16px',
                        textAlign: 'center',
                        border: '2px solid',
                        borderColor: isSelected ? '#33ccb3' : isPurchased ? '#269dd9' : '#bfd0d9',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {avatar.image ? (
                        <div style={{
                          width: '80px',
                          height: '80px',
                          margin: '0 auto 12px auto',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '2px solid #bfd0d9',
                        }}>
                          <img
                            src={avatar.image}
                            alt={avatar.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '48px',
                          marginBottom: '8px',
                        }}>
                          {avatar.id}
                        </div>
                      )}
                      <h3 style={{
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#269dd9',
                        margin: '0 0 4px 0',
                      }}>
                        {avatar.name}
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: '#61686b',
                        margin: '0 0 12px 0',
                      }}>
                        {avatar.price} 코인
                      </p>

                      {isSelected ? (
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#33ccb3',
                          padding: '8px',
                        }}>
                          사용 중
                        </div>
                      ) : isPurchased ? (
                        <button
                          onClick={() => handleSelectAvatar(avatar.id)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#269dd9',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7db0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#269dd9'}
                        >
                          착용하기
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(avatar.id)}
                          disabled={!canAfford && avatar.price > 0}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: canAfford || avatar.price === 0 ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            backgroundColor:
                              avatar.price === 0
                                ? '#33ccb3'
                                : canAfford
                                ? '#269dd9'
                                : '#e7ecef',
                            color:
                              avatar.price === 0 || canAfford
                                ? '#ffffff'
                                : '#61686b',
                          }}
                          onMouseEnter={(e) => {
                            if (canAfford || avatar.price === 0) {
                              e.currentTarget.style.backgroundColor =
                                avatar.price === 0 ? '#29a895' : '#1e7db0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              avatar.price === 0
                                ? '#33ccb3'
                                : canAfford
                                ? '#269dd9'
                                : '#e7ecef';
                          }}
                        >
                          {avatar.price === 0 ? '받기' : '구매하기'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default ShopPage;