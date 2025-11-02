export interface StageItem {
  idx: number;
  title: string;
  img: string;
  desc: string;
}

export interface Stage {
  id: number;
  name: string;
  items: StageItem[];
}

export interface GameCard {
  id: number;
  idx: number;
  title: string;
  img: string;
  flipped: boolean;
  matched: boolean;
}

export interface GameState {
  cards: GameCard[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  timeStarted: number | null;
  isComplete: boolean;
}

export interface GameProgress {
  unlockedStages: number[];
  completedStages: number[];
  currentStage: number;
  coins: number;
  viewedCollections?: string[];
  purchasedAvatars: string[];
  playerAvatar?: string;
}

export interface RankingEntry {
  id: number;
  userName: string;
  stageName: string;
  score: number;
  moves: number;
  timeTaken: number;
  createdAt: string;
}

export interface Avatar {
  id: string;
  name: string;
  price: number;
  category: 'free' | 'basic' | 'premium' | 'legendary';
}
