import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameCard } from '../types';
import { STAGES } from '../constants/gameData';
import { gameService } from '../services/gameService';
import { useAuth } from './AuthContext';

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

  // Backend sync
  saveProgressToBackend: () => Promise<void>;
  loadProgressFromBackend: () => Promise<void>;
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

// localStorage 키
const STORAGE_KEY = 'game_progress';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isGuest, currentUser, isLoggedIn, playerAvatar } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorage에서 초기 상태 불러오기
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return {
          currentStage: data.currentStage || 1,
          unlockedStages: data.unlockedStages || [1],
          completedStages: data.completedStages || [],
          coins: data.coins || 0,
          purchasedAvatars: new Set<string>(data.purchasedAvatars || ['😊'])
        };
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return {
      currentStage: 1,
      unlockedStages: [1],
      completedStages: [],
      coins: 0,
      purchasedAvatars: new Set<string>(['😊'])
    };
  };

  const initialState = getInitialState();

  const [currentStage, setCurrentStage] = useState(initialState.currentStage);
  const [unlockedStages, setUnlockedStages] = useState<number[]>(initialState.unlockedStages);
  const [completedStages, setCompletedStages] = useState<number[]>(initialState.completedStages);

  const [cards, setCards] = useState<GameCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [canClick, setCanClick] = useState(true);

  const [coins, setCoins] = useState(initialState.coins);
  const [purchasedAvatars, setPurchasedAvatars] = useState<Set<string>>(initialState.purchasedAvatars);
  const [viewedCollections, setViewedCollections] = useState<Set<string>>(new Set());

  // 백엔드에서 진행 상황 불러오기
  const loadProgressFromBackend = useCallback(async () => {
    if (isGuest || !isLoggedIn) return;

    try {
      const progress = await gameService.loadProgress();
      if (progress) {
        setCurrentStage(progress.currentStage || 1);
        setUnlockedStages(progress.unlockedStages || [1]);
        setCompletedStages(progress.completedStages || []);
        setCoins(progress.coins || 0);
        setPurchasedAvatars(new Set(progress.purchasedAvatars || ['😊']));
      }
    } catch (error) {
      console.error('Failed to load progress from backend:', error);
    }
  }, [isGuest, isLoggedIn]);

  // 백엔드에 진행 상황 저장하기
  const saveProgressToBackend = useCallback(async () => {
    if (isGuest || !isLoggedIn) return;

    try {
      await gameService.saveProgress({
        currentStage,
        unlockedStages,
        completedStages,
        playerAvatar,
        coins,
        purchasedAvatars: Array.from(purchasedAvatars)
      });
    } catch (error) {
      console.error('Failed to save progress to backend:', error);
    }
  }, [isGuest, isLoggedIn, currentStage, unlockedStages, completedStages, playerAvatar, coins, purchasedAvatars]);

  // 로그인 시 백엔드에서 진행 상황 불러오기
  useEffect(() => {
    if (isLoggedIn && !isGuest && !isInitialized) {
      loadProgressFromBackend().then(() => setIsInitialized(true));
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isLoggedIn, isGuest, isInitialized, loadProgressFromBackend]);

  // 상태 변경 시 localStorage에 자동 저장 (모든 사용자)
  useEffect(() => {
    if (!isInitialized) return;

    const progressData = {
      currentStage,
      unlockedStages,
      completedStages,
      coins,
      purchasedAvatars: Array.from(purchasedAvatars)
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      console.log('Progress saved to localStorage:', progressData);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [isInitialized, currentStage, unlockedStages, completedStages, coins, purchasedAvatars]);

  // 상태 변경 시 백엔드에 자동 저장 (인증된 사용자만)
  useEffect(() => {
    if (!isInitialized || isGuest || !isLoggedIn) return;

    const timeoutId = setTimeout(() => {
      saveProgressToBackend();
    }, 1000); // 1초 디바운스

    return () => clearTimeout(timeoutId);
  }, [isInitialized, isGuest, isLoggedIn, currentStage, unlockedStages, completedStages, coins, purchasedAvatars, saveProgressToBackend]);

  const initializeGame = useCallback((stageId: number) => {
    // 현재 스테이지의 아이템 가져오기
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;

    const stageItems = stage.items;
    const pairs = [...stageItems, ...stageItems].map((item, index) => ({
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
                setCompletedStages(prev =>
                  !prev.includes(currentStage) ? [...prev, currentStage] : prev
                );

                // 다음 스테이지 잠금 해제
                setUnlockedStages(prev =>
                  currentStage < 3 && !prev.includes(currentStage + 1)
                    ? [...prev, currentStage + 1]
                    : prev
                );
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
    setCoins((prev: number) => prev + amount);
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
    addViewedCollection,
    saveProgressToBackend,
    loadProgressFromBackend
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