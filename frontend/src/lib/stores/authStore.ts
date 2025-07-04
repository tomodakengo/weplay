import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginFormData, RegisterFormData } from '../types';
import apiClient from '../api';

interface AuthActions {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (data: LoginFormData) => {
        try {
          set({ isLoading: true });
          const response = await apiClient.login(data);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            apiClient.setToken(token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'ログインに失敗しました');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterFormData) => {
        try {
          set({ isLoading: true });
          const response = await apiClient.register(data);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            apiClient.setToken(token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'アカウント作成に失敗しました');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiClient.removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        const { token } = get();
        if (token) {
          apiClient.setToken(token);
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);