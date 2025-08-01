import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {
  adminLogin,
  adminRegister,
  contentManagerLogin,
  contentManagerRegister,
  refreshAuth,
} from '../services/newApi.service';
import type { UserDto } from '../types';

// Auth types for the new API
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  password: string;
  telegramId?: string;
}

interface AuthResponse {
  accessToken: string;
  role: string;
  user?: UserDto;
}

export type UserRole = 'CLIENT' | 'ADMIN' | 'CONTENT_MANAGER';

export interface AuthUser {
  name?: string;
  surname?: string;
  patronymic?: string;
  email?: string;
  phone?: string;
  role: UserRole;
}

export interface AuthState {
  role: UserRole | null;
  user: UserDto | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  error: string | null;
}

export interface AuthActions {
  loginAsAdmin: (credentials: LoginRequest) => Promise<void>;
  loginAsContentManager: (credentials: LoginRequest) => Promise<void>;

  registerAdmin: (userData: RegisterRequest) => Promise<void>;
  registerContentManager: (userData: RegisterRequest) => Promise<void>;

  refreshToken: () => Promise<void>;
  logout: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      role: null,
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginAsAdmin: async (credentials: LoginRequest) => {
        set({isLoading: true, error: null});

        try {
          const response: AuthResponse = await adminLogin(credentials);

          // Store token in localStorage for API calls
          localStorage.setItem('auth-token', response.accessToken);

          set({
            role: response.role as UserRole,
            user: response.user || null,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Admin login failed',
            isAuthenticated: false,
            role: null,
            user: null,
            accessToken: null,
          });
        }
      },

      loginAsContentManager: async (credentials: LoginRequest) => {
        set({isLoading: true, error: null});

        try {
          const response: AuthResponse = await contentManagerLogin(credentials);

          // Store token in localStorage for API calls
          localStorage.setItem('auth-token', response.accessToken);

          set({
            role: response.role as UserRole,
            user: response.user || null,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Content manager login failed',
            isAuthenticated: false,
            role: null,
            user: null,
            accessToken: null,
          });
        }
      },

      registerAdmin: async (userData: RegisterRequest) => {
        set({isLoading: true, error: null});

        try {
          await adminRegister(userData);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Admin registration failed',
          });
        }
      },

      registerContentManager: async (userData: RegisterRequest) => {
        set({isLoading: true, error: null});

        try {
          await contentManagerRegister(userData);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Content manager registration failed',
          });
        }
      },

      refreshToken: async () => {
        try {
          const response: AuthResponse = await refreshAuth();
          
          // Update token in localStorage
          localStorage.setItem('auth-token', response.accessToken);

          set({
            role: response.role as UserRole,
            user: response.user || null,
            accessToken: response.accessToken,
            isAuthenticated: true,
            error: null,
          });
        } catch (error: any) {
          // If refresh fails, logout the user
          get().logout();
        }
      },

      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem('auth-token');
        set({
          role: null,
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => set({isLoading}),
      setError: (error: string | null) => set({error}),

      clearAuth: () => {
        // Clear token from localStorage
        localStorage.removeItem('auth-token');
        set({
          role: null,
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        role: state.role,
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);