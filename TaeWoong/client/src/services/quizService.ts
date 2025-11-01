import api from './api';
import { QuizQuestion } from '../types/quiz';

export const quizService = {
  generateQuiz: async (itemName: string): Promise<QuizQuestion> => {
    try {
      const response = await api.post('/ai/generate-quiz', { itemName });
      return response.data as QuizQuestion;
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      throw error;
    }
  },

  submitAnswer: async (quizId: string, answer: string): Promise<{ isCorrect: boolean; explanation: string }> => {
    try {
      const response = await api.post('/ai/submit-answer', { quizId, answer });
      return response.data as { isCorrect: boolean; explanation: string };
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }
};