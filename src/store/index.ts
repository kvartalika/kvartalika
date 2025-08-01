// Unified Store Index
// Central export point for all stores and hooks

// Re-export all types
export * from '../types/unified';

// Auth store (unified)
export * from './unified-auth.store';

// App store (deprecated - use unified stores instead)
// export { useAppStore } from './useAppStore';

// Other specialized stores
export { useFlatsStore } from './flats.store';
export { usePropertiesStore } from './properties.store';
export { useSearchStore } from './search.store';
export { useUIStore } from './ui.store';
export { useAdminStore } from './admin.store';
export { useContentStore } from './content.store';
export { useContentManagerStore } from './contentManager.store';

// Convenience hooks for common use cases
import { useUnifiedAuthStore } from './unified-auth.store';
// import { useAppStore } from './useAppStore'; // deprecated

export const useStores = () => ({
  auth: useUnifiedAuthStore(),
  // app: useAppStore(), // deprecated - use individual stores as needed
});

// Role-based access hooks
export const useIsAdmin = () => {
  const { role, isAuthenticated } = useUnifiedAuthStore();
  return isAuthenticated && role === 'ADMIN';
};

export const useIsContentManager = () => {
  const { role, isAuthenticated } = useUnifiedAuthStore();
  return isAuthenticated && (role === 'CONTENT_MANAGER' || role === 'CM');
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useUnifiedAuthStore();
  return isAuthenticated;
};