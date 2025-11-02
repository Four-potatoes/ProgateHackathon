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
                <span className="text-sm font-semibold text-[#269dd9]">{playerName}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#269dd9]">내 컬렉션</h1>
                <p className="text-[#61686b] text-sm">스테이지를 클리어하여 잠금 해제된 카드를 확인하세요.</p>
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

      {/* 컬렉션 그리드 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {allItems.map((item) => {
            const isLocked = !item.isUnlocked;
            return (
              <div
                key={`${item.stageId}-${item.idx}`}
                onClick={() => handleSelectItem(item)}
                className={`
                  bg-[#f5fcff] rounded-lg shadow-md overflow-hidden border-2
                  transition-all duration-300 transform
                  ${isLocked ? 'opacity-40 cursor-not-allowed border-[#e7ecef]' : 'cursor-pointer hover:scale-105 hover:shadow-xl border-[#269dd9]'}
                `}
              >
                <div className="aspect-square overflow-hidden flex items-center justify-center bg-[#e0e7eb]">
                  <img
                    src={`/img/${item.folder}/${encodeURIComponent(item.img)}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`이미지 로드 실패: /img/${item.folder}/${item.img}`);
                    }}
                  />
                </div>
                <div className="p-3 text-center bg-white">
                  <h3 className="font-bold text-sm text-[#269dd9]">{item.title}</h3>
                  <p className="text-xs text-[#61686b]">{item.stageName}</p>
                  {isLocked && <p className="text-xs text-[#61686b] mt-1">잠금</p>}
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
                relative w-full aspect-[3/4] rounded-xl shadow-2xl
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
                className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <img
                  src={`/img/${selectedItem.folder}/${encodeURIComponent(selectedItem.img)}`}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`이미지 로드 실패: /img/${selectedItem.folder}/${selectedItem.img}`);
                  }}
                />
              </div>

              {/* 뒷면 - 정보 */}
              <div
                className="absolute inset-0 w-full h-full bg-[#269dd9] rounded-xl p-8 flex flex-col justify-center items-center text-center"
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
                <p className="text-xl text-white mb-4">{selectedItem.stageName}</p>
                <p className="text-lg text-white leading-relaxed">{selectedItem.desc}</p>

                <p className="text-sm text-white mt-6">클릭하여 뒤집기</p>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={handleCloseDetail}
              className="mt-6 w-full py-3 px-6 rounded-lg font-bold text-white bg-[#e61919] hover:bg-[#b31414] transition-colors"
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