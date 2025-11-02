import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { AVATAR_SHOP } from '../constants/gameData';

const RankingPage: React.FC = () => {
  const navigate = useNavigate();
  const { playerAvatar, playerName } = useAuth();
  const [rankingData, setRankingData] = useState<RankingEntry[]>([]);

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
    <div className="min-h-screen bg-[#e5f7ff]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#bfd0d9] shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <h1 className="text-3xl font-bold text-[#269dd9]">랭킹</h1>
                <p className="text-[#61686b] mt-1 text-sm">시도 횟수가 적을수록 높은 순위!</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/stages')}
              className="py-2 px-6 rounded-lg font-bold text-white bg-[#269dd9] hover:bg-[#1e7db0] transition-all"
            >
              스테이지 선택
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-2xl shadow-xl overflow-hidden">
          {/* 상위 3명 특별 표시 */}
          {rankingData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-white">
              {rankingData.slice(0, 3).map((entry, idx) => (
                <div
                  key={idx}
                  className={`
                    rounded-xl p-6 text-center border-2 transition-all shadow-sm
                    ${getRankColor(idx)}
                  `}
                >
                  <p className="text-4xl font-bold text-[#269dd9] mb-2">{getRankText(idx)}</p>
                  <p className="text-lg text-[#2e3538] font-semibold mt-2">{entry.name}</p>
                  <p className="text-sm text-[#61686b] mb-2">{entry.stage}</p>
                  <p className="text-2xl font-bold text-[#33ccb3]">{entry.moves}회</p>
                </div>
              ))}
            </div>
          )}

          {/* 랭킹 리스트 */}
          <div className="divide-y divide-[#bfd0d9]">
            {rankingData.length > 0 ? (
              rankingData.map((entry, idx) => (
                <div
                  key={idx}
                  className={`
                    flex justify-between items-center p-5 transition-all hover:bg-white
                    ${idx < 3 ? 'bg-white' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl font-bold text-[#269dd9] w-12 text-center">
                      {getRankText(idx)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#2e3538] text-lg">{entry.name}</p>
                      <p className="text-sm text-[#61686b]">{entry.stage}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#33ccb3]">{entry.moves}</p>
                    <p className="text-xs text-[#61686b]">시도 횟수</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#61686b] text-lg">아직 랭킹 데이터가 없습니다.</p>
                <p className="text-[#61686b] text-sm mt-2">게임을 완료하면 랭킹에 등록됩니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#269dd9] mb-3">순위 계산</h3>
            <ul className="text-sm text-[#2e3538] space-y-2">
              <li>• 시도 횟수 (moves)가 적을수록 높은 순위</li>
              <li>• 최고 기록부터 정렬됩니다</li>
              <li>• 상위 50개 기록이 표시됩니다</li>
            </ul>
          </div>
          <div className="bg-[#f5fcff] border-2 border-[#bfd0d9] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#269dd9] mb-3">팁</h3>
            <ul className="text-sm text-[#2e3538] space-y-2">
              <li>• 카드의 위치를 기억하며 플레이하세요</li>
              <li>• 집중력을 유지하면 시도 횟수를 줄일 수 있습니다</li>
              <li>• 랭킹에 등록되어 글로벌 순위를 경쟁하세요</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;