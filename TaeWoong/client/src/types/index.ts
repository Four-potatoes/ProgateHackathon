// User & Auth Types
export interface User {
  id?: string;
  email?: string;
  name: string;
  avatar: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  avatar: string;
}

// Game Types
export interface GameItem {
  idx: number;
  title: string;
  icon: string;
  desc: string;
  img: string;
  color: string;
}

export interface GameCard extends GameItem {
  id: number;
  pairId: number;
}

export interface Stage {
  id: number;
  name: string;
  items: GameItem[];
}

export interface GameProgress {
  currentStage: number;
  unlockedStages: number[];
  completedStages: number[];
  playerAvatar: string;
  playerName: string;
  coins: number;
  viewedCollections: string[];
  purchasedAvatars: string[];
}

export interface RankingEntry {
  id?: string;
  name: string;
  stage: string;
  moves: number;
  timestamp?: string;
}

// Quiz Types
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  questionContext: Record<string, unknown>;
}

export interface QuizConversation {
  role: 'ai' | 'user';
  content: string;
  options?: string[];
}

export interface QuizState {
  conversation: QuizConversation[];
  loading: boolean;
  currentQuestion: QuizQuestion | null;
}