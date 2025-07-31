/**
 * Legacy compatibility layer for useAuthStore
 * This file provides backward compatibility for the old useAuthStore interface
 * while using the new auth store underneath.
 */

// Re-export from the new auth store
export {
  useAuthStore,
  useAuth,
  useAuthUser,
  useAuthRole,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
} from './auth.store';

// Re-export types for backward compatibility
export type {
  AuthUser as User,
  UserRole,
  AuthState,
  AuthActions,
} from './auth.store';