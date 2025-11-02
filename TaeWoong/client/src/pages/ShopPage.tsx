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

  const displayCoins = coins || authCoins;

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
    <div className="min-h-screen bg-[#e5f7ff]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#bfd0d9] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#269dd9]">프로필 상점</h1>
                <p className="text-[#61686b] text-sm">코인을 모아 새로운 프로필 아바타를 구매하세요!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#f5fcff] border-2 border-[#269dd9] rounded-lg">
                <span className="font-semibold text-[#269dd9]">코인:</span>
                <span className="font-bold text-[#269dd9]">{displayCoins}</span>
              </div>
              <button
                onClick={() => navigate('/stages')}
                className="py-2 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
              >
                스테이지 선택
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메시지 */}
      {message && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#33ccb3] text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
            {message}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 카테고리 */}
        {['free', 'basic', 'premium', 'legendary'].map((category) => {
          const categoryItems = AVATAR_SHOP.filter((a) => a.category === category);
          const categoryNames: Record<string, string> = {
            free: '무료',
            basic: '기본',
            premium: '프리미엄',
            legendary: '레전더리'
          };

          return (
            <div key={category} className="mb-12">
              <h2 className="text-3xl font-bold text-[#269dd9] mb-6">{categoryNames[category]}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {categoryItems.map((avatar) => {
                  const isPurchased = purchasedAvatars.has(avatar.id);
                  const isSelected = playerAvatar === avatar.id;
                  const canAfford = displayCoins >= avatar.price;

                  return (
                    <div
                      key={avatar.id}
                      className={`
                        relative bg-[#f5fcff] rounded-lg shadow-md p-4 text-center border-2 transition-all
                        ${isSelected ? 'border-[#33ccb3]' : isPurchased ? 'border-[#269dd9]' : 'border-[#bfd0d9]'}
                      `}
                    >
                      {avatar.image ? (
                        <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-[#bfd0d9]">
                          <img
                            src={avatar.image}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-6xl mb-2">{avatar.id}</div>
                      )}
                      <h3 className="font-bold text-sm text-[#269dd9] mb-1">{avatar.name}</h3>
                      <p className="text-xs text-[#61686b] mb-3">{avatar.price} 코인</p>

                      {isSelected ? (
                        <div className="text-xs font-semibold text-[#33ccb3] py-2">사용 중</div>
                      ) : isPurchased ? (
                        <button
                          onClick={() => handleSelectAvatar(avatar.id)}
                          className="w-full py-2 px-3 rounded bg-[#269dd9] hover:bg-[#1e7db0] text-white text-xs font-semibold transition"
                        >
                          착용하기
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(avatar.id)}
                          disabled={!canAfford && avatar.price > 0}
                          className={`
                            w-full py-2 px-3 rounded text-xs font-semibold transition
                            ${
                              avatar.price === 0
                                ? 'bg-[#33ccb3] hover:bg-[#29a895] text-white'
                                : canAfford
                                ? 'bg-[#269dd9] hover:bg-[#1e7db0] text-white'
                                : 'bg-[#e7ecef] text-[#61686b] cursor-not-allowed'
                            }
                          `}
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
