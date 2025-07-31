/**
 * @deprecated This store has been replaced by the new auth.store.ts
 * 
 * Please use the new auth store instead:
 * import { useAuthStore } from '@/store'
 * 
 * Migration guide:
 * 
 * OLD:
 * import { useAuthStore } from '@/store/useAuthStore'
 * const { login, user } = useAuthStore()
 * 
 * NEW:
 * import { useAuthStore } from '@/store'
 * const { loginAsAdmin, loginAsContentManager, user } = useAuthStore()
 * 
 * The new auth store supports both admin and content manager authentication.
 * This file will be removed in a future version.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'CM';
  createdAt: string;
  updatedAt: string;
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

/**
 * @deprecated Use the new auth store from '@/store' instead
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        set({ isLoading: true, error: null });
        try {
          // Mock implementation for legacy compatibility
          const mockUser = {
            id: 1,
            name: 'Test',
            surname: 'User',
            patronymic: '',
            email: email,
            phone: '+1234567890',
            role: 'CM' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          const data = {
            user: mockUser,
            accessToken: 'mock-token-' + Date.now()
          };

          set({
            user: data.user,
            accessToken: data.accessToken,
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
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        try {
          // Mock logout - no actual API call needed
          console.log('Mock logout performed');
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
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        try {
          // Mock token refresh
          const accessToken = 'refreshed-mock-token-' + Date.now();

          set({
            accessToken,
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setUser: (user: User) => {
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        set({ user });
      },

      setAccessToken: (accessToken: string) => {
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        set({ accessToken, isAuthenticated: true });
      },

      clearAuth: () => {
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => {
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        set({ isLoading });
      },

      setError: (error: string | null) => {
        console.warn('⚠️ useAuthStore from useAuthStore.ts is deprecated. Use the new auth store instead.');
        set({ error });
      },
    }),
    {
      name: 'auth-storage-legacy',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);