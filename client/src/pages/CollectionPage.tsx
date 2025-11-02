import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { STAGES, AVATAR_SHOP } from '../constants/gameData';

interface CollectionItemWithMeta {
  idx: number;
  title: string;
  icon: string;
  desc: string;
  img: string;
  color: string;
  stageName: string;
  stageId: number;
  folder: string;
  isUnlocked: boolean;
}

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedStages } = useGame();
  const { playerAvatar, playerName } = useAuth();
  const [selectedItem, setSelectedItem] = useState<CollectionItemWithMeta | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const allItems: CollectionItemWithMeta[] = STAGES.flatMap((stage) =>
    stage.items.map((item) => ({
      idx: item.idx,
      title: item.title,
      icon: item.icon,
      desc: item.desc,
      img: item.img,
      color: item.color,
      stageName: stage.name,
      stageId: stage.id,
      folder: stage.folder,
      isUnlocked: completedStages.includes(stage.id)
    }))
  );

  const handleSelectItem = (item: CollectionItemWithMeta) => {
    if (item.isUnlocked) {
      setSelectedItem(item);
      setIsFlipped(false);
    }
  };

  const handleCloseDetail = () => {
    setIsFlipped(false);
    setTimeout(() => setSelectedItem(null), 300);
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
              내 컬렉션
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#61686b',
              margin: '0',
              padding: '0',
            }}>
              스테이지를 클리어하여 잠금 해제된 카드를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 컬렉션 그리드 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '24px',
        }}>
          {allItems.map((item) => {
            const isLocked = !item.isUnlocked;
            return (
              <div
                key={`${item.stageId}-${item.idx}`}
                onClick={() => handleSelectItem(item)}
                style={{
                  backgroundColor: '#f5fcff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  border: `2px solid ${isLocked ? '#e7ecef' : '#269dd9'}`,
                  transition: 'all 0.3s ease',
                  transform: isLocked ? 'scale(1)' : 'scale(1)',
                  opacity: isLocked ? 0.4 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }
                }}
              >
                <div style={{
                  aspectRatio: '1/1',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e0e7eb',
                }}>
                  <img
                    src={`/img/${item.folder}/${encodeURIComponent(item.img)}`}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      console.error(`이미지 로드 실패: /img/${item.folder}/${item.img}`);
                    }}
                  />
                </div>
                <div style={{
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                }}>
                  <h3 style={{
                    fontWeight: '700',
                    fontSize: '14px',
                    color: '#269dd9',
                    margin: '0 0 4px 0',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#61686b',
                    margin: '0',
                  }}>
                    {item.stageName}
                  </p>
                  {isLocked && (
                    <p style={{
                      fontSize: '12px',
                      color: '#61686b',
                      marginTop: '4px',
                      margin: '4px 0 0 0',
                    }}>
                      잠금
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 상세 모달 */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={handleCloseDetail}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              perspective: '1000px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 카드 */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.7s ease-out',
                cursor: 'pointer',
              }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* 앞면 - 이미지 */}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={`/img/${selectedItem.folder}/${encodeURIComponent(selectedItem.img)}`}
                  alt={selectedItem.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    console.error(`이미지 로드 실패: /img/${selectedItem.folder}/${selectedItem.img}`);
                  }}
                />
              </div>

              {/* 뒷면 - 정보 */}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#269dd9',
                  borderRadius: '12px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseDetail();
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.8)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                >
                  ✕
                </button>

                <h3 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '12px',
                  margin: '0 0 12px 0',
                }}>
                  {selectedItem.title}
                </h3>
                <p style={{
                  fontSize: '18px',
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: '0 0 16px 0',
                }}>
                  {selectedItem.stageName}
                </p>
                <p style={{
                  fontSize: '16px',
                  color: '#ffffff',
                  lineHeight: '1.6',
                  margin: '0',
                }}>
                  {selectedItem.desc}
                </p>

                <p style={{
                  fontSize: '14px',
                  color: '#ffffff',
                  marginTop: '24px',
                  margin: '24px 0 0 0',
                }}>
                  클릭하여 뒤집기
                </p>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={handleCloseDetail}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#e61919',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b31414'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e61919'}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;