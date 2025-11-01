export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  category?: string;
}

export interface QuizState {
  currentQuestion: QuizQuestion | null;
  selectedAnswer: string | null;
  showResult: boolean;
  result: QuizResult | null;
  loading: boolean;
  quizProgress: number;
  totalAnswered: number;
}

export interface QuizResult {
  isCorrect: boolean;
  reward: number;
  explanation: string;
}

export interface QuizData {
  [category: string]: QuizQuestion[];
}
