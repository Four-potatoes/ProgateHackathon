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

  return (
    <div className="min-h-screen bg-[#e5f7ff]">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#bfd0d9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* 프로필 아바타 - 이미지 또는 이모지 */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f5fcff] border-2 border-[#269dd9] rounded-lg">
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
              <h1 className="text-[#171a1c] font-bold">{playerName}</h1>
              {isGuest && <p className="text-xs text-[#61686b]">게스트 모드</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f5fcff] border-2 border-[#269dd9] rounded-lg">
              <span className="font-semibold text-[#269dd9]">코인:</span>
              <span className="font-bold text-[#269dd9]">{coins}</span>
            </div>

            {isGuest ? (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-[#33ccb3] hover:bg-[#29a895] text-white rounded-lg font-semibold transition"
              >
                회원가입하기
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#e61919] hover:bg-[#b31414] text-white rounded-lg font-semibold transition"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 제목 */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#269dd9] mb-4">K-Everything Memory Game</h2>
            <p className="text-xl text-[#2e3538]">한국 문화를 배우며 카드를 맞추세요</p>
          </div>

          {/* 게스트 모드 알림 */}
          {isGuest && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-[#f5fcff] border-2 border-[#33ccb3] rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#269dd9] mb-2">게스트 모드로 플레이 중</h3>
                    <p className="text-sm text-[#2e3538] mb-2">
                      현재 브라우저에 게임 기록이 임시 저장됩니다. 회원가입 또는 로그인하면 데이터를 영구적으로 저장할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 스테이지 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {STAGES.map((stage) => {
              const isUnlocked = unlockedStages.includes(stage.id);
              const isCompleted = completedStages.includes(stage.id);

              return (
                <div
                  key={stage.id}
                  className={`relative bg-[#f5fcff] border-2 ${
                    isCompleted ? 'border-[#33ccb3]' : isUnlocked ? 'border-[#269dd9]' : 'border-[#bfd0d9]'
                  } rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 ${
                    !isUnlocked ? 'opacity-60' : ''
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4 text-xs px-3 py-1 bg-[#e7ecef] rounded text-[#61686b] font-bold">
                      LOCK
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 text-xs px-3 py-1 bg-[#33ccb3] rounded text-white font-bold">
                      CLEAR
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-[#269dd9] mb-2">Stage {stage.id}</h3>
                    <p className="text-xl text-[#2e3538]">{stage.name}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {stage.items.slice(0, 8).map((item) => (
                      <div key={item.idx} className="aspect-square bg-[#e0e7eb] rounded overflow-hidden border border-[#bfd0d9]">
                        <img
                          src={`/img/${stage.folder}/${encodeURIComponent(item.img)}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
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
                    className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-[#269dd9] hover:bg-[#1e7db0] text-white cursor-pointer'
                        : 'bg-[#e7ecef] text-[#61686b] cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? '게임 시작' : '잠금'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/wiki')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#33ccb3] hover:bg-[#29a895] transition-all duration-300"
            >
              한국 문화 백과
            </button>
            <button
              onClick={() => navigate('/achievements')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#eb9947] hover:bg-[#c27d35] transition-all duration-300"
            >
              배지 & 업적
            </button>
            <button
              onClick={() => navigate('/collection')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#6666cc] hover:bg-[#5252a8] transition-all duration-300"
            >
              내 컬렉션
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all duration-300"
            >
              AI 퀴즈
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#cc66cc] hover:bg-[#a852a8] transition-all duration-300"
            >
              프로필 상점
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all duration-300"
            >
              랭킹
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StagesPage;