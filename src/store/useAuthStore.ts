// Legacy auth store wrapper for backward compatibility
// This file will be removed once all components are migrated to the new API

export { useAuthStore } from './useAuthStore.legacy';
export type { AuthUser, UserRole, AuthState } from './useAuthStore.legacy';