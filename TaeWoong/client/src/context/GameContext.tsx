import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameCard } from '../types';
import { ITEMS } from '../constants/gameData';

interface GameContextType {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  unlockedStages: number[];
  setUnlockedStages: (stages: number[]) => void;
  completedStages: number[];
  setCompletedStages: (stages: number[]) => void;
  
  // Game state
  cards: GameCard[];
  flipped: number[];
  matched: number[];
  moves: number;
  isWon: boolean;
  canClick: boolean;
  
  // Game actions
  initializeGame: (stageId: number) => void;
  handleCardClick: (cardId: number) => void;
  resetGame: () => void;
  
  // Profile
  coins: number;
  setCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  purchasedAvatars: Set<string>;
  addPurchasedAvatar: (avatar: string) => void;
  viewedCollections: Set<string>;
  addViewedCollection: (collectionId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const shuffleArray = (array: unknown[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [unlockedStages, setUnlockedStages] = useState<number[]>([1]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [canClick, setCanClick] = useState(true);
  
  const [coins, setCoins] = useState(0);
  const [purchasedAvatars, setPurchasedAvatars] = useState<Set<string>>(new Set(['😊']));
  const [viewedCollections, setViewedCollections] = useState<Set<string>>(new Set());

  const initializeGame = useCallback((stageId: number) => {
    const pairs = [...ITEMS, ...ITEMS].map((item, index) => ({
      ...item,
      id: index,
      pairId: item.idx
    } as GameCard));

    const shuffled = shuffleArray(pairs) as GameCard[];
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
    setCanClick(true);
    setCurrentStage(stageId);
  }, []);

  const handleCardClick = useCallback((cardId: number) => {
    setFlipped(prev => {
      if (canClick && prev.length < 2 && !prev.includes(cardId) && !matched.includes(cardId) && !isWon) {
        const newFlipped = [...prev, cardId];
        
        if (newFlipped.length === 2) {
          setCanClick(false);
          setMoves(m => m + 1);

          const [firstId, secondId] = newFlipped;
          const card1 = cards.find(c => c.id === firstId);
          const card2 = cards.find(c => c.id === secondId);

          if (card1 && card2 && card1.pairId === card2.pairId) {
            setMatched(prev => {
              const newMatched = [...prev, firstId, secondId];
              
              if (newMatched.length === cards.length) {
                setIsWon(true);
                
                // 스테이지 완료 처리
                setCompletedStages(prev => {
                  if (!prev.includes(currentStage)) {
                    return [...prev, currentStage];
                  }
                  return prev;
                });
                
                // 다음 스테이지 잠금 해제
                setUnlockedStages(prev => {
                  if (currentStage < 3 && !prev.includes(currentStage + 1)) {
                    return [...prev, currentStage + 1];
                  }
                  return prev;
                });
              }
              
              return newMatched;
            });
            
            setFlipped([]);
            setCanClick(true);
          } else {
            setTimeout(() => {
              setFlipped([]);
              setCanClick(true);
            }, 1000);
          }
        }
        
        return newFlipped;
      }
      return prev;
    });
  }, [canClick, matched, isWon, cards, currentStage]);

  const resetGame = useCallback(() => {
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
    setCanClick(true);
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoins(prev => prev + amount);
  }, []);

  const addPurchasedAvatar = useCallback((avatar: string) => {
    setPurchasedAvatars(prev => new Set([...prev, avatar]));
  }, []);

  const addViewedCollection = useCallback((collectionId: string) => {
    setViewedCollections(prev => new Set([...prev, collectionId]));
  }, []);

  const value: GameContextType = {
    currentStage,
    setCurrentStage,
    unlockedStages,
    setUnlockedStages,
    completedStages,
    setCompletedStages,
    cards,
    flipped,
    matched,
    moves,
    isWon,
    canClick,
    initializeGame,
    handleCardClick,
    resetGame,
    coins,
    setCoins,
    addCoins,
    purchasedAvatars,
    addPurchasedAvatar,
    viewedCollections,
    addViewedCollection
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};