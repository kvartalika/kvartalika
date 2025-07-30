// Store exports - organized by functionality
export * from './auth.store';
export * from './properties.store';
export * from './search.store';
export * from './ui.store';
export * from './content.store';

// Main store hooks for easy importing
export {
  // Auth store
  useAuthStore,
  useAuth,
  useAuthUser,
  useAuthRole,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
} from './auth.store';

export {
  // Properties store
  usePropertiesStore,
  useFlats,
  useHomes,
  useApartments,
  useComplexes,
  useSelectedFlat,
  useSelectedHome,
  useSelectedApartment,
  useSelectedComplex,
  useFeaturedHomes,
  usePopularFlats,
  usePropertiesLoading,
  usePropertiesError,
} from './properties.store';

export {
  // Search store
  useSearchStore,
  useSearchFilters,
  useSearchResults,
  useSearchLoading,
  useSearchError,
  useFilterOptions,
  useSearchPagination,
  useSearchHistory,
  useQuickFilters,
} from './search.store';

export {
  // UI store
  useUIStore,
  useModals,
  useModalData,
  useBookingForm,
  useContactForm,
  useLoading,
  useNotifications,
  useHomepageSections,
  useLayout,
  useTheme,
  usePreferences,
  useErrors,
} from './ui.store';

export {
  // Content store
  useContentStore,
  useContentCategories,
  useContentDescriptions,
  useContentFlats,
  useContentHomes,
  useContentPhotos,
  useContentFooter,
  useContentManagers,
  useContentLoading,
  useContentErrors,
  useContentUI,
  useContentStats,
} from './content.store';

// Re-export types for convenience
export type {
  // Auth types
  AuthUser,
  UserRole,
  AuthState,
  AuthActions,
} from './auth.store';

export type {
  // Properties types
  Apartment,
  Complex,
  PropertiesState,
  PropertiesActions,
} from './properties.store';

export type {
  // Search types
  SearchFilters,
  FilterOptions,
  SearchState,
  SearchActions,
} from './search.store';

export type {
  // UI types
  BookingForm,
  Notification,
  HomepageSection,
  UIState,
  UIActions,
} from './ui.store';

export type {
  // Content types
  ContentState,
  ContentActions,
} from './content.store';

// Store initialization function
export const initializeStores = async () => {
  // Import store instances
  const { useAuthStore } = await import('./auth.store');
  const { usePropertiesStore } = await import('./properties.store');
  const { useSearchStore } = await import('./search.store');
  const { useUIStore } = await import('./ui.store');
  
  // Initialize auth check
  const authStore = useAuthStore.getState();
  await authStore.checkAuthStatus();
  
  // Load initial data if needed
  const propertiesStore = usePropertiesStore.getState();
  
  // Load properties data
  try {
    await Promise.all([
      propertiesStore.fetchFlats(),
      propertiesStore.fetchHomes(),
      propertiesStore.fetchFeaturedContent(),
    ]);
  } catch (error) {
    console.warn('Failed to load initial properties data:', error);
  }
  
  // Load search filter options
  try {
    const searchStore = useSearchStore.getState();
    await searchStore.loadFilterOptions();
  } catch (error) {
    console.warn('Failed to load filter options:', error);
  }
  
  // Apply saved theme
  const uiStore = useUIStore.getState();
  uiStore.setTheme(uiStore.theme);
};

// Store cleanup function
export const cleanupStores = () => {
  // Clear any timers, subscriptions, etc.
  const uiStore = useUIStore.getState();
  uiStore.clearNotifications();
  uiStore.closeAllModals();
  
  const searchStore = useSearchStore.getState();
  searchStore.clearSearchResults();
  
  const propertiesStore = usePropertiesStore.getState();
  propertiesStore.invalidateCache();
};

// Store helpers
export const getStoreStates = () => ({
  auth: useAuthStore.getState(),
  properties: usePropertiesStore.getState(),
  search: useSearchStore.getState(),
  ui: useUIStore.getState(),
  content: useContentStore.getState(),
});

// Global error handler for stores
export const handleStoreError = (storeName: string, error: any) => {
  console.error(`Store error in ${storeName}:`, error);
  
  const uiStore = useUIStore.getState();
  uiStore.addNotification({
    type: 'error',
    title: 'Ошибка приложения',
    message: `Произошла ошибка в ${storeName}: ${error.message || 'Неизвестная ошибка'}`,
    duration: 0, // Persistent
  });
};

// Store debugging helpers (development only)
export const debugStores = () => {
  if (process.env.NODE_ENV === 'development') {
    const states = getStoreStates();
    console.group('🏪 Store States');
    Object.entries(states).forEach(([name, state]) => {
      console.log(`${name}:`, state);
    });
    console.groupEnd();
  }
};

// Store reset for testing
export const resetAllStores = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const authStore = useAuthStore.getState();
    const uiStore = useUIStore.getState();
    const searchStore = useSearchStore.getState();
    const propertiesStore = usePropertiesStore.getState();
    
    // Reset auth
    authStore.clearAuth();
    
    // Reset UI
    uiStore.closeAllModals();
    uiStore.clearNotifications();
    uiStore.clearErrors();
    
    // Reset search
    searchStore.resetFilters();
    searchStore.clearSearchResults();
    searchStore.clearSearchHistory();
    
    // Reset properties cache
    propertiesStore.invalidateCache();
    
    console.log('🔄 All stores reset');
  }
};