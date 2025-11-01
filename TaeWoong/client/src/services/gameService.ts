import api from './api';
import { GameProgress } from '../types/game';

export const gameService = {
  saveProgress: async (progress: GameProgress): Promise<void> => {
    try {
      await api.post('/game/progress', progress);
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  },

  loadProgress: async (): Promise<GameProgress | null> => {
    try {
      const response = await api.get('/game/progress');
      return response.data as GameProgress;
    } catch (error) {
      console.error('Failed to load game progress:', error);
      return null;
    }
  },

  saveScore: async (score: number, moves: number): Promise<void> => {
    try {
      await api.post('/game/score', { score, moves });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }
};