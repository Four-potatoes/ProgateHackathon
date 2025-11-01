import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingEntry } from '../types';

const RankingPage: React.FC = () => {
  const navigate = useNavigate();
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

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '·';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border-yellow-400/50';
      case 1:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
      case 2:
        return 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-400/50';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">🏆 랭킹</h1>
              <p className="text-gray-300 mt-2">시도 횟수가 적을수록 높은 순위!</p>
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

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl overflow-hidden">
          {/* 상위 3명 특별 표시 */}
          {rankingData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-gradient-to-b from-white/10 to-transparent">
              {rankingData.slice(0, 3).map((entry, idx) => (
                <div
                  key={idx}
                  className={`
                    rounded-xl p-6 text-center border-2 transition-all
                    ${getRankColor(idx)}
                  `}
                >
                  <div className="text-5xl mb-3">{getMedalEmoji(idx)}</div>
                  <p className="text-2xl font-bold text-white">{idx + 1}위</p>
                  <p className="text-lg text-gray-200 font-semibold mt-2">{entry.name}</p>
                  <p className="text-sm text-gray-300 mb-2">{entry.stage}</p>
                  <p className="text-2xl font-bold text-purple-300">{entry.moves}회</p>
                </div>
              ))}
            </div>
          )}

          {/* 랭킹 리스트 */}
          <div className="divide-y divide-white/10">
            {rankingData.length > 0 ? (
              rankingData.map((entry, idx) => (
                <div
                  key={idx}
                  className={`
                    flex justify-between items-center p-5 transition-all hover:bg-white/5
                    ${idx < 3 ? 'bg-white/5' : ''}
                  `}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl font-bold text-gray-400 w-12 text-center">
                      {getMedalEmoji(idx)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{entry.name}</p>
                      <p className="text-sm text-gray-400">{entry.stage}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-300">{entry.moves}</p>
                    <p className="text-xs text-gray-400">시도 횟수</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg">아직 랭킹 데이터가 없습니다.</p>
                <p className="text-gray-500 text-sm mt-2">게임을 완료하면 랭킹에 등록됩니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">🏅 순위 계산</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• 시도 횟수 (moves)가 적을수록 높은 순위</li>
              <li>• 최고 기록부터 정렬됩니다</li>
              <li>• 상위 50개 기록이 표시됩니다</li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">💡 팁</h3>
            <ul className="text-sm text-gray-300 space-y-2">
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