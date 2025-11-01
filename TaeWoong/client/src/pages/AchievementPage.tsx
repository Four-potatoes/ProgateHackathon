import React from 'react';
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
    <div className="min-h-screen bg-[#e5f7ff]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#bfd0d9] shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Profile Display */}
              <div className="flex items-center gap-3">
                {currentAvatar?.image ? (
                  <img
                    src={currentAvatar.image}
                    alt={currentAvatar.name}
                    className="w-12 h-12 rounded-full border-2 border-[#269dd9]"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-[#269dd9] rounded-full text-2xl border-2 border-[#269dd9]">
                    {playerAvatar || '😊'}
                  </div>
                )}
                <span className="font-bold text-[#2e3538]">{playerName || 'Player'}</span>
              </div>
              <div className="border-l border-[#bfd0d9] h-8 mx-2"></div>
              <div>
                <h1 className="text-3xl font-bold text-[#269dd9]">배지 & 업적</h1>
                <p className="text-[#61686b] mt-1 text-sm">게임을 플레이하고 배지를 수집하세요!</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/stages')}
              className="py-2 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
            >
              스테이지로
            </button>
          </div>
        </div>
      </header>

      {/* 통계 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-[#269dd9]">{unlockedCount}</p>
            <p className="text-sm text-[#61686b] mt-2">배지 수집</p>
          </div>
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-[#269dd9]">{totalBadges}</p>
            <p className="text-sm text-[#61686b] mt-2">전체 배지</p>
          </div>
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-[#33ccb3]">
              {Math.round((unlockedCount / totalBadges) * 100)}%
            </p>
            <p className="text-sm text-[#61686b] mt-2">진행률</p>
          </div>
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-[#269dd9]">{completedStages.length}</p>
            <p className="text-sm text-[#61686b] mt-2">클리어한 스테이지</p>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="mb-8 bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[#2e3538] font-bold">배지 수집 진행도</p>
            <p className="text-[#61686b] text-sm">
              {unlockedCount} / {totalBadges}
            </p>
          </div>
          <div className="w-full h-4 bg-white border-2 border-[#bfd0d9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#33ccb3] transition-all duration-500"
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* 배지 그리드 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`
                relative rounded-xl p-6 transition-all duration-300 transform hover:scale-105 border-2
                ${
                  badge.unlocked
                    ? `${badge.color} border-[#269dd9] shadow-lg text-white`
                    : 'bg-white border-[#bfd0d9] opacity-50'
                }
              `}
            >
              {/* 배지 상태 표시 */}
              <div className="absolute top-4 right-4">
                {badge.unlocked ? (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#33ccb3] rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-[#bfd0d9] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* 배지 내용 */}
              <div className="mb-4">
                <h3 className={`text-xl font-bold ${badge.unlocked ? 'text-white' : 'text-[#61686b]'}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm ${badge.unlocked ? 'text-white/90' : 'text-[#61686b]'} mt-2`}>
                  {badge.description}
                </p>
              </div>

              {/* 조건 */}
              <div className={`text-xs font-semibold ${badge.unlocked ? 'text-white/80' : 'text-[#61686b]'}`}>
                {badge.condition}
              </div>

              {/* 진행도 바 */}
              {badge.progress !== undefined && badge.maxProgress !== undefined && !badge.unlocked && (
                <div className="mt-3">
                  <div className="w-full h-2 bg-[#bfd0d9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#33ccb3] transition-all duration-300"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${badge.unlocked ? 'text-white' : 'text-[#61686b]'}`}>
                    {badge.progress} / {badge.maxProgress}
                  </p>
                </div>
              )}

              {/* 언락 날짜 */}
              {badge.unlocked && badge.unlockedDate && (
                <div className="mt-3 text-xs text-white/80">
                  {badge.unlockedDate}에 해제됨
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* 팁 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6">
          <h3 className="text-[#269dd9] font-bold mb-3">배지를 더 많이 수집하는 팁</h3>
          <ul className="text-sm text-[#2e3538] space-y-2">
            <li>• 모든 스테이지를 클리어해서 "스테이지 마스터" 배지를 얻으세요</li>
            <li>• AI 퀴즈를 풀어서 코인을 모아 배지를 해제하세요</li>
            <li>• 매일 게임을 플레이해서 "연속 플레이어" 배지를 목표로 하세요</li>
            <li>• 빠르게 게임을 완료해서 "스피드 러너" 배지를 노려보세요</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AchievementPage;