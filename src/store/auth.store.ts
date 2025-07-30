import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AuthService, 
  adminLogin, 
  adminRegister, 
  contentManagerLogin, 
  contentManagerRegister,
  logout as apiLogout,
  isAdminAuthenticated,
  isContentManagerAuthenticated,
  getCurrentAdmin,
  getCurrentContentManager
} from '../services';
import type { Admin, ContentManager, LoginRequest, RegisterRequest, AuthResponse } from '../services';

export type UserRole = 'admin' | 'content_manager';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  // User data
  user: AuthUser | null;
  role: UserRole | null;
  
  // Authentication status
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Error handling
  error: string | null;
  
  // Token info
  tokenExpiry: number | null;
}

export interface AuthActions {
  // Login actions
  loginAsAdmin: (credentials: LoginRequest) => Promise<void>;
  loginAsContentManager: (credentials: LoginRequest) => Promise<void>;
  
  // Register actions
  registerAdmin: (userData: RegisterRequest) => Promise<void>;
  registerContentManager: (userData: RegisterRequest) => Promise<void>;
  
  // Logout and session management
  logout: () => void;
  refreshUser: () => Promise<void>;
  
  // State management
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Token validation
  isTokenValid: () => boolean;
  checkAuthStatus: () => Promise<void>;
}

const transformAdminToAuthUser = (admin: Admin): AuthUser => ({
  id: admin.id,
  username: admin.username,
  email: admin.email,
  role: 'admin' as const,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const transformContentManagerToAuthUser = (cm: ContentManager): AuthUser => ({
  id: cm.id,
  username: cm.username,
  email: cm.email,
  role: 'content_manager' as const,
  isActive: cm.isActive,
  createdAt: cm.createdAt,
  updatedAt: cm.updatedAt,
});

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      tokenExpiry: null,

      // Admin login
      loginAsAdmin: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await adminLogin(credentials);
          const authUser = transformAdminToAuthUser(response.user as Admin);
          
          set({
            user: authUser,
            role: 'admin',
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokenExpiry: Date.now() + (response.expiresIn * 1000),
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Admin login failed',
            isAuthenticated: false,
            user: null,
            role: null,
          });
          throw error;
        }
      },

      // Content manager login
      loginAsContentManager: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await contentManagerLogin(credentials);
          const authUser = transformContentManagerToAuthUser(response.user as ContentManager);
          
          set({
            user: authUser,
            role: 'content_manager',
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokenExpiry: Date.now() + (response.expiresIn * 1000),
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Content manager login failed',
            isAuthenticated: false,
            user: null,
            role: null,
          });
          throw error;
        }
      },

      // Register admin
      registerAdmin: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
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
          throw error;
        }
      },

      // Register content manager
      registerContentManager: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
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
          throw error;
        }
      },

      // Logout
      logout: () => {
        apiLogout(); // Clear API tokens
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          error: null,
          tokenExpiry: null,
        });
      },

      // Refresh user data
      refreshUser: async () => {
        const { role } = get();
        
        if (!role) return;
        
        try {
          if (role === 'admin') {
            const admin = await getCurrentAdmin();
            if (admin) {
              set({ user: transformAdminToAuthUser(admin) });
            }
          } else if (role === 'content_manager') {
            const cm = await getCurrentContentManager();
            if (cm) {
              set({ user: transformContentManagerToAuthUser(cm) });
            }
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
          // Don't logout on refresh failure, token might still be valid
        }
      },

      // Check authentication status
      checkAuthStatus: async () => {
        const { isTokenValid } = get();
        
        if (!isTokenValid()) {
          get().logout();
          return;
        }

        // Check if we have valid tokens in the API client
        const hasAdminToken = isAdminAuthenticated();
        const hasContentToken = isContentManagerAuthenticated();
        
        if (hasAdminToken && !get().user) {
          try {
            const admin = await getCurrentAdmin();
            if (admin) {
              set({
                user: transformAdminToAuthUser(admin),
                role: 'admin',
                isAuthenticated: true,
              });
            }
          } catch (error) {
            console.error('Failed to get admin user:', error);
            get().logout();
          }
        } else if (hasContentToken && !get().user) {
          try {
            const cm = await getCurrentContentManager();
            if (cm) {
              set({
                user: transformContentManagerToAuthUser(cm),
                role: 'content_manager',
                isAuthenticated: true,
              });
            }
          } catch (error) {
            console.error('Failed to get content manager user:', error);
            get().logout();
          }
        } else if (!hasAdminToken && !hasContentToken && get().isAuthenticated) {
          // No valid tokens but store thinks we're authenticated
          get().logout();
        }
      },

      // Token validation
      isTokenValid: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        return Date.now() < tokenExpiry;
      },

      // State setters
      setUser: (user: AuthUser) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      
      clearAuth: () => {
        apiLogout();
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          error: null,
          tokenExpiry: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        tokenExpiry: state.tokenExpiry,
      }),
      // Rehydrate and check auth status
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check auth status after rehydration
          setTimeout(() => {
            state.checkAuthStatus();
          }, 100);
        }
      },
    }
  )
);

// Export selectors for easier use
export const useAuth = () => useAuthStore();
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthRole = () => useAuthStore(state => state.role);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);