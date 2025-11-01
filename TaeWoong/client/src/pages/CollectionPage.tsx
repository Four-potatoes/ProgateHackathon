import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { STAGES } from '../constants/gameData';
import { GameItem } from '../types';

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { completedStages } = useGame();
  const [selectedItem, setSelectedItem] = useState<(GameItem & { stageName: string }) | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const allItems = STAGES.flatMap((stage) =>
    stage.items.map((item) => ({
      ...item,
      stageName: stage.name,
      isUnlocked: completedStages.includes(stage.id)
    }))
  );

  const handleSelectItem = (item: GameItem & { stageName: string; isUnlocked: boolean }) => {
    if (item.isUnlocked) {
      setSelectedItem(item);
      setIsFlipped(false);
    }
  };

  const handleCloseDetail = () => {
    setIsFlipped(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">📚 내 컬렉션</h1>
              <p className="text-gray-300 mt-2">스테이지를 클리어하여 잠금 해제된 카드를 눌러 상세 정보를 확인하세요.</p>
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

      {/* 컬렉션 그리드 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {allItems.map((item) => {
            const isLocked = !item.isUnlocked;
            return (
              <div
                key={`${item.stageName}-${item.idx}`}
                onClick={() => handleSelectItem(item)}
                className={`
                  bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden
                  transition-all duration-300 transform
                  ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:shadow-2xl'}
                `}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`../assets/img/${item.img}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="60" text-anchor="middle" dy=".35em"%3E' +
                        item.icon +
                        '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="p-3 text-center bg-white/5">
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-gray-300">{item.stageName}</p>
                  {isLocked && <p className="text-xs text-gray-500 mt-1">🔒 잠금</p>}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 상세 모달 */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseDetail}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              perspective: '1000px'
            }}
          >
            {/* 카드 */}
            <div
              className={`
                w-full aspect-[3/4] rounded-xl shadow-2xl overflow-hidden
                transition-transform duration-700 ease-out
                cursor-pointer
              `}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* 앞면 - 이미지 */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <img
                  src={`../assets/img/${selectedItem.img}`}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231f2937" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="80" text-anchor="middle" dy=".35em"%3E' +
                      selectedItem.icon +
                      '%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* 뒷면 - 정보 */}
              <div
                className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 p-8 flex flex-col justify-center items-center text-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseDetail();
                  }}
                  className="absolute top-4 right-4 text-3xl font-bold text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>

                <h3 className="text-4xl font-bold text-white mb-3">{selectedItem.title}</h3>
                <p className="text-xl text-purple-300 mb-4">{selectedItem.stageName}</p>
                <p className="text-lg text-gray-300 leading-relaxed">{selectedItem.desc}</p>

                <p className="text-sm text-gray-400 mt-6">📖 클릭하여 뒤집기</p>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={handleCloseDetail}
              className="mt-6 w-full py-3 px-6 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
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