// Centralized store exports
// This file provides a unified interface for accessing all stores

export { useAuthStore } from './auth.store';
export { useUIStore } from './ui.store';
export { useContentStore } from './content.store';
export { useContentManagerStore } from './contentManager.store';
export { useAdminStore } from './admin.store';
export { useFlatsStore } from './flats.store';
export { usePropertiesStore } from './properties.store';
export { useSearchStore } from './search.store';

// Re-export types for convenience
export type { UserRole, AuthUser, AuthState, AuthActions } from './auth.store';
export type { UIState, UIActions, BidForm, PageInfo, SocialMedia, Notification } from './ui.store';
export type { SearchFilters } from './search.store';