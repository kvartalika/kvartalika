import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../services/auth.service';
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
          const response: AuthResponse = await AuthService.adminLogin(credentials);
          const authUser = transformAdminToAuthUser(response.user as Admin);
          
          set({
            user: authUser,
            role: 'admin',
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokenExpiry: Date.now() + (response.expiresIn || 3600) * 1000,
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
          const response: AuthResponse = await AuthService.contentManagerLogin(credentials);
          const authUser = transformContentManagerToAuthUser(response.user as ContentManager);
          
          set({
            user: authUser,
            role: 'content_manager',
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokenExpiry: Date.now() + (response.expiresIn || 3600) * 1000,
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

      // Admin registration
      registerAdmin: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.adminRegister(userData);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Admin registration failed',
          });
          throw error;
        }
      },

      // Content manager registration
      registerContentManager: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.contentManagerRegister(userData);
          set({ isLoading: false, error: null });
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
        AuthService.logout();
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
        
        try {
          if (role === 'admin') {
            const admin = await AuthService.getCurrentAdmin();
            if (admin) {
              const authUser = transformAdminToAuthUser(admin);
              set({ user: authUser });
            }
          } else if (role === 'content_manager') {
            const cm = await AuthService.getCurrentContentManager();
            if (cm) {
              const authUser = transformContentManagerToAuthUser(cm);
              set({ user: authUser });
            }
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
      },

      // State management
      setUser: (user: AuthUser) => set({ user }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearAuth: () => set({
        user: null,
        role: null,
        isAuthenticated: false,
        error: null,
        tokenExpiry: null,
      }),

      // Token validation
      isTokenValid: () => {
        const { tokenExpiry } = get();
        return tokenExpiry ? Date.now() < tokenExpiry : false;
      },

      // Check authentication status
      checkAuthStatus: async () => {
        const { isAuthenticated, role } = get();
        
        if (!isAuthenticated) return;

        const isAdminAuth = AuthService.isAdminAuthenticated();
        const isContentManagerAuth = AuthService.isContentManagerAuthenticated();

        if (!isAdminAuth && !isContentManagerAuth) {
          set({
            user: null,
            role: null,
            isAuthenticated: false,
            error: null,
            tokenExpiry: null,
          });
          return;
        }

        // Refresh user data if needed
        await get().refreshUser();
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
    }
  )
);

// Export convenience hooks
export const useAuth = () => useAuthStore();
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthRole = () => useAuthStore(state => state.role);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);