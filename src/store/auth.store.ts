import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {
  adminLogin,
  adminRegister,
  contentManagerLogin,
  contentManagerRegister,
  logout as apiLogout,
} from '../services';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse
} from '../services';

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

  isAuthenticated: boolean;
  isLoading: boolean;

  error: string | null;
}

export interface AuthActions {
  loginAsAdmin: (credentials: LoginRequest) => Promise<void>;
  loginAsContentManager: (credentials: LoginRequest) => Promise<void>;

  registerAdmin: (userData: RegisterRequest) => Promise<void>;
  registerContentManager: (userData: RegisterRequest) => Promise<void>;

  logout: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginAsAdmin: async (credentials: LoginRequest) => {
        set({isLoading: true, error: null});

        try {
          const response: AuthResponse = await adminLogin(credentials);

          set({
            role: response.role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            isLoading: false,
            error: 'Admin login failed',
            isAuthenticated: false,
            role: null,
          });
        }
      },

      loginAsContentManager: async (credentials: LoginRequest) => {
        set({isLoading: true, error: null});

        try {
          const response: AuthResponse = await contentManagerLogin(credentials);

          set({
            role: response.role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            isLoading: false,
            error: 'Content manager login failed',
            isAuthenticated: false,
            role: null,
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
        } catch {
          set({
            isLoading: false,
            error: 'Admin registration failed',
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
        } catch {
          set({
            isLoading: false,
            error: 'Content manager registration failed',
          });
        }
      },

      logout: () => {
        apiLogout();
        set({
          role: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => set({isLoading}),
      setError: (error: string | null) => set({error}),

      clearAuth: () => {
        apiLogout();
        set({
          role: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);