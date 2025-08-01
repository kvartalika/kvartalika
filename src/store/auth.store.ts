import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {AuthResponse, LoginRequest, RegisterRequest} from '../services';
import {
  adminLogin,
  adminRegister,
  contentManagerLogin,
  contentManagerRegister,
  logout as apiLogout,
} from '../services';

export type UserRole = 'CLIENT' | 'ADMIN' | 'CONTENT_MANAGER';

export interface AuthState {
  role: UserRole | null;
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

  logout: () => void;

  setAccessToken: (accessToken: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      role: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginAsAdmin: async (credentials: LoginRequest) => {
        set({isLoading: true, error: null});

        try {
          const response: AuthResponse = await adminLogin(credentials);

          set({
            accessToken: response.accessToken,
            role: response.role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            role: null,
            accessToken: null,
            isLoading: false,
            error: 'Admin login failed',
            isAuthenticated: false,
          });
        }
      },

      loginAsContentManager: async (credentials: LoginRequest) => {
        set({isLoading: true, error: null});

        try {
          const response: AuthResponse = await contentManagerLogin(credentials);

          set({
            accessToken: response.accessToken,
            role: response.role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            isLoading: false,
            accessToken: null,
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
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => set({isLoading}),
      setError: (error: string | null) => set({error}),

      setAccessToken: (accessToken: string) => set({
        accessToken,
        isAuthenticated: true
      }),

      clearAuth: () => {
        apiLogout();
        set({
          role: null,
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
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);