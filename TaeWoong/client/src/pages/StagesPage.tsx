import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { STAGES } from '../constants/gameData';

const StagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { playerName, playerAvatar, isGuest, logout } = useAuth();
  const { currentStage, unlockedStages, completedStages, coins, initializeGame } = useGame();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{playerAvatar}</span>
            <div>
              <h1 className="text-white font-bold">{playerName}</h1>
              {isGuest && <p className="text-xs text-gray-300">게스트 모드</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-400 rounded-full">
              <span className="text-2xl">🪙</span>
              <span className="font-bold text-yellow-900">{coins}</span>
            </div>

            {!isGuest && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
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
            <h2 className="text-5xl font-bold text-white mb-4">K-Everything Memory Game</h2>
            <p className="text-xl text-gray-300">한국 문화를 배우며 카드를 맞추세요</p>
          </div>

          {/* 게스트 모드 알림 */}
          {isGuest && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">✅</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-2">게스트 모드로 플레이 중</h3>
                    <p className="text-sm text-green-700 mb-2">
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
                  className={`relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 ${
                    !isUnlocked ? 'opacity-50' : ''
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4 text-xs px-3 py-1 bg-gray-400 rounded-full text-white font-bold">
                      🔒 LOCK
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 text-xs px-3 py-1 bg-green-500 rounded-full text-white font-bold">
                      ✅ CLEAR
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">Stage {stage.id}</h3>
                    <p className="text-xl text-gray-300">{stage.name}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {stage.items.slice(0, 8).map((item) => (
                      <div key={item.idx} className="aspect-square bg-white/20 rounded-lg overflow-hidden">
                        <img
                          src={`../assets/img/${item.img}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="60" text-anchor="middle" dy=".3em"%3E' +
                              item.icon +
                              '%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleGameStart(stage.id)}
                    disabled={!isUnlocked}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
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
              onClick={() => navigate('/collection')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
            >
              📚 내 컬렉션
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
            >
              🪙 AI 퀴즈
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              🛒 프로필 상점
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className="py-3 px-8 rounded-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              🏆 랭킹
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StagesPage;