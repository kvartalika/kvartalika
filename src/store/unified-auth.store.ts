import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AuthUser, 
  AuthState, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  UserRole 
} from '../types/unified';

// Re-export UserRole for convenience
export type { UserRole } from '../types/unified';

interface AuthActions {
  // Login methods
  login: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (credentials: LoginRequest) => Promise<void>;
  loginAsContentManager: (credentials: LoginRequest) => Promise<void>;
  
  // Registration methods
  registerAdmin: (userData: RegisterRequest) => Promise<void>;
  registerContentManager: (userData: RegisterRequest) => Promise<void>;
  
  // Auth management
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  
  // State setters
  setUser: (user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: null,
};

export const useUnifiedAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement real login API
          // Mock login for now
          const mockUser = {
            id: 1,
            name: 'User',
            surname: 'Test',
            email: email,
            role: 'CLIENT' as any,
          };
          const mockToken = 'mock-token';

          set({
            user: mockUser,
            accessToken: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            role: mockUser.role,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      loginAsAdmin: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { adminLogin } = await import('../services');
          const response: AuthResponse = await adminLogin(credentials);

          set({
            user: response.user,
            role: response.role,
            accessToken: response.accessToken || '',
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Admin login failed',
            isAuthenticated: false,
            role: null,
          });
          throw error;
        }
      },

      loginAsContentManager: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { contentManagerLogin } = await import('../services');
          const response: AuthResponse = await contentManagerLogin(credentials);

          set({
            user: response.user,
            role: response.role,
            accessToken: response.accessToken || '',
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Content manager login failed',
            isAuthenticated: false,
            role: null,
          });
          throw error;
        }
      },

      registerAdmin: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { adminRegister } = await import('../services');
          await adminRegister(userData);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Admin registration failed',
          });
          throw error;
        }
      },

      registerContentManager: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const { contentManagerRegister } = await import('../services');
          await contentManagerRegister(userData);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Content manager registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Try API logout first
          const { logout: apiLogout } = await import('../services');
          await apiLogout();
        } catch (error) {
          console.error('API logout error:', error);
          // Continue with local logout even if API fails
        }

        // Mock logout completed above

        // Always clear local state
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          role: null,
        });
      },

      refreshAccessToken: async () => {
        try {
          // TODO: Implement refresh token API
          // For now, just use existing token
          const currentToken = get().accessToken;
          if (!currentToken) {
            throw new Error('No token to refresh');
          }
          // Keep existing token for now
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setUser: (user: AuthUser) => {
        set({ 
          user, 
          role: user.role,
          isAuthenticated: true
        });
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken, isAuthenticated: true });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          role: null,
        });
      },
    }),
    {
      name: 'unified-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);

// Export hooks for specific use cases
export const useAuth = () => {
  const store = useUnifiedAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    role: store.role,
    login: store.login,
    logout: store.logout,
    clearAuth: store.clearAuth,
  };
};

export const useAdminAuth = () => {
  const store = useUnifiedAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    role: store.role,
    loginAsAdmin: store.loginAsAdmin,
    registerAdmin: store.registerAdmin,
    logout: store.logout,
  };
};

export const useContentManagerAuth = () => {
  const store = useUnifiedAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    role: store.role,
    loginAsContentManager: store.loginAsContentManager,
    registerContentManager: store.registerContentManager,
    logout: store.logout,
  };
};