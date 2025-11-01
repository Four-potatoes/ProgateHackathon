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
      setCoins(displayCoins - avatar.price);
      addPurchasedAvatar(avatar.id);
      setMessage(`${avatar.name} 아바타를 구매했습니다! 🎉`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">🛒 프로필 상점</h1>
              <p className="text-gray-300 mt-2">코인을 모아 새로운 프로필 아바타를 구매하세요!</p>
            </div>
            <button
              onClick={() => navigate('/stages')}
              className="py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              스테이지 선택
            </button>
          </div>
        </div>
      </header>

      {/* 메시지 */}
      {message && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-40">
          {message}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 현재 프로필 */}
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-8 mb-12 text-center">
          <p className="text-gray-300 text-sm mb-2">현재 프로필 아바타</p>
          <div className="text-8xl mb-4">{playerAvatar}</div>
          <p className="text-white font-bold text-lg">💰 보유 코인: {displayCoins}</p>
        </div>

        {/* 상점 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          {AVATAR_SHOP.map((avatar) => {
            const isOwned = purchasedAvatars.has(avatar.id);
            const canAfford = displayCoins >= avatar.price;
            const isSelected = playerAvatar === avatar.id;

            return (
              <div
                key={avatar.id}
                className={`
                  bg-white/10 backdrop-blur-md border-2 rounded-xl p-4 text-center
                  transition-all duration-300
                  ${
                    isSelected
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/50'
                      : isOwned
                        ? 'border-green-400'
                        : canAfford
                          ? 'border-indigo-400'
                          : 'border-gray-500'
                  }
                `}
              >
                <div className="text-6xl mb-2">{avatar.id}</div>
                <p className="font-bold text-white text-sm">{avatar.name}</p>
                <div className="flex items-center justify-center gap-1 my-2">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold text-yellow-300">{avatar.price}</span>
                </div>

                {isSelected && <p className="text-xs text-yellow-300 font-bold mb-2">✓ 선택됨</p>}

                {isOwned ? (
                  <button
                    onClick={() => handleSelectAvatar(avatar.id)}
                    className={`
                      w-full py-2 px-3 text-sm rounded-lg font-bold transition-all
                      ${
                        isSelected
                          ? 'bg-yellow-500 text-white cursor-default'
                          : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                      }
                    `}
                  >
                    {isSelected ? '사용 중' : '선택'}
                  </button>
                ) : canAfford ? (
                  <button
                    onClick={() => handlePurchase(avatar.id)}
                    className="w-full py-2 px-3 text-sm rounded-lg font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                  >
                    구매하기
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-3 text-sm rounded-lg font-bold text-gray-500 bg-gray-600 cursor-not-allowed"
                  >
                    부족
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 카테고리 설명 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-2">📦 기본 (무료)</h3>
            <p className="text-gray-300 text-sm">기본 아바타 - 비용 없이 모두 사용 가능</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-2">⭐ 프리미엄 (10-15 코인)</h3>
            <p className="text-gray-300 text-sm">AI 퀴즈를 풀어 코인을 모아 구매하세요</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-2">💎 레전드 (100 코인)</h3>
            <p className="text-gray-300 text-sm">많은 코인이 필요한 특별한 아바타</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopPage;