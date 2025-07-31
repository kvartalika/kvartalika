import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {UserRole} from "./auth.store.ts";

export interface User {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO api
          const { mockApi } = await import('../services/mockApi');
          const data = await mockApi.login(email, password);
          const { user, accessToken } = data;

          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          // TODO api
          const { mockApi } = await import('../services/mockApi');
          await mockApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      refreshAccessToken: async () => {
        try {
          // TODO api
          const { mockApi } = await import('../services/mockApi');
          const { accessToken } = await mockApi.refreshToken();

          set({
            accessToken,
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken, isAuthenticated: true });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);