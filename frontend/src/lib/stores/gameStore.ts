import { create } from 'zustand';
import { Game, CreateGameFormData, ScoreUpdate } from '../types';
import apiClient from '../api';

interface GameState {
  games: Game[];
  currentGame: Game | null;
  isLoading: boolean;
  error: string | null;
}

interface GameActions {
  fetchGames: () => Promise<void>;
  fetchGame: (id: string) => Promise<void>;
  createGame: (data: CreateGameFormData) => Promise<Game>;
  updateScore: (gameId: string, scoreUpdate: ScoreUpdate) => Promise<void>;
  setCurrentGame: (game: Game | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  // State
  games: [],
  currentGame: null,
  isLoading: false,
  error: null,

  // Actions
  fetchGames: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.getGames();
      
      if (response.success && response.data) {
        set({ games: response.data, isLoading: false });
      } else {
        throw new Error(response.error || '試合一覧の取得に失敗しました');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '試合一覧の取得に失敗しました',
        isLoading: false 
      });
    }
  },

  fetchGame: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.getGame(id);
      
      if (response.success && response.data) {
        set({ currentGame: response.data, isLoading: false });
      } else {
        throw new Error(response.error || '試合情報の取得に失敗しました');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '試合情報の取得に失敗しました',
        isLoading: false 
      });
    }
  },

  createGame: async (data: CreateGameFormData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.createGame(data);
      
      if (response.success && response.data) {
        const newGame = response.data;
        set(state => ({ 
          games: [...state.games, newGame],
          isLoading: false 
        }));
        return newGame;
      } else {
        throw new Error(response.error || '試合の作成に失敗しました');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '試合の作成に失敗しました',
        isLoading: false 
      });
      throw error;
    }
  },

  updateScore: async (gameId: string, scoreUpdate: ScoreUpdate) => {
    try {
      const response = await apiClient.updateGame(gameId, scoreUpdate);
      
      if (response.success && response.data) {
        const updatedGame = response.data;
        
        // Update games list
        set(state => ({
          games: state.games.map(game => 
            game.id === gameId ? updatedGame : game
          ),
          currentGame: state.currentGame?.id === gameId ? updatedGame : state.currentGame
        }));
      } else {
        throw new Error(response.error || 'スコアの更新に失敗しました');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'スコアの更新に失敗しました'
      });
      throw error;
    }
  },

  setCurrentGame: (game: Game | null) => {
    set({ currentGame: game });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));