import { create } from 'zustand';
import { PublicService } from '../services/public.service';
import type { Flat, Home } from '../services';

export interface PropertiesState {
  // API Data
  flats: Flat[];
  homes: Home[];
  
  // Selected items
  selectedFlat: Flat | null;
  selectedHome: Home | null;
  
  // Featured/Popular content
  featuredHomes: Home[];
  popularFlats: Flat[];
  
  // Loading states
  isLoading: boolean;
  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingFeatured: boolean;
  
  // Error handling
  error: string | null;
  
  // Cache metadata
  lastFetch: {
    flats: number | null;
    homes: number | null;
    featured: number | null;
  };
}

export interface PropertiesActions {
  // Data fetching
  fetchFlats: (force?: boolean) => Promise<void>;
  fetchHomes: (force?: boolean) => Promise<void>;
  fetchFeaturedContent: (force?: boolean) => Promise<void>;
  
  // Single item fetching
  fetchFlatById: (id: number) => Promise<Flat | null>;
  fetchHomeById: (id: number) => Promise<Home | null>;
  
  // Related data fetching
  fetchFlatsByHome: (homeId: number) => Promise<Flat[]>;
  fetchHomesByCategory: (categoryId: number) => Promise<Home[]>;
  
  // Selection actions
  setSelectedFlat: (flat: Flat | null) => void;
  setSelectedHome: (home: Home | null) => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Cache management
  invalidateCache: () => void;
  isDataStale: (type: 'flats' | 'homes' | 'featured') => boolean;
}

export const usePropertiesStore = create<PropertiesState & PropertiesActions>((set, get) => ({
  // Initial state
  flats: [],
  homes: [],
  selectedFlat: null,
  selectedHome: null,
  featuredHomes: [],
  popularFlats: [],
  isLoading: false,
  isLoadingFlats: false,
  isLoadingHomes: false,
  isLoadingFeatured: false,
  error: null,
  lastFetch: {
    flats: null,
    homes: null,
    featured: null,
  },

  // Fetch all flats
  fetchFlats: async (force = false) => {
    const { lastFetch, isLoadingFlats } = get();
    const isStale = get().isDataStale('flats');
    
    if (!force && !isStale && lastFetch.flats) return;
    if (isLoadingFlats) return;

    set({ isLoadingFlats: true, error: null });

    try {
      const flats = await PublicService.getFlats();
      set({
        flats,
        isLoadingFlats: false,
        lastFetch: { ...get().lastFetch, flats: Date.now() },
      });
    } catch (error: any) {
      set({
        isLoadingFlats: false,
        error: error.message || 'Failed to fetch flats',
      });
    }
  },

  // Fetch all homes
  fetchHomes: async (force = false) => {
    const { lastFetch, isLoadingHomes } = get();
    const isStale = get().isDataStale('homes');
    
    if (!force && !isStale && lastFetch.homes) return;
    if (isLoadingHomes) return;

    set({ isLoadingHomes: true, error: null });

    try {
      const homes = await PublicService.getHomes();
      set({
        homes,
        isLoadingHomes: false,
        lastFetch: { ...get().lastFetch, homes: Date.now() },
      });
    } catch (error: any) {
      set({
        isLoadingHomes: false,
        error: error.message || 'Failed to fetch homes',
      });
    }
  },

  // Fetch featured content
  fetchFeaturedContent: async (force = false) => {
    const { lastFetch, isLoadingFeatured } = get();
    const isStale = get().isDataStale('featured');
    
    if (!force && !isStale && lastFetch.featured) return;
    if (isLoadingFeatured) return;

    set({ isLoadingFeatured: true, error: null });

    try {
      const [featuredHomes, popularFlats] = await Promise.all([
        PublicService.getFeaturedHomes(6),
        PublicService.getPopularFlats(6),
      ]);

      set({
        featuredHomes,
        popularFlats,
        isLoadingFeatured: false,
        lastFetch: { ...get().lastFetch, featured: Date.now() },
      });
    } catch (error: any) {
      set({
        isLoadingFeatured: false,
        error: error.message || 'Failed to fetch featured content',
      });
    }
  },

  // Fetch single flat by ID
  fetchFlatById: async (id: number) => {
    try {
      const flat = await PublicService.getFlatById(id);
      if (flat) {
        set({ selectedFlat: flat });
      }
      return flat;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch flat' });
      return null;
    }
  },

  // Fetch single home by ID
  fetchHomeById: async (id: number) => {
    try {
      const home = await PublicService.getHomeById(id);
      if (home) {
        set({ selectedHome: home });
      }
      return home;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch home' });
      return null;
    }
  },

  // Fetch flats by home
  fetchFlatsByHome: async (homeId: number) => {
    try {
      const flats = await PublicService.getFlatsByHome(homeId);
      return flats;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch flats for home' });
      return [];
    }
  },

  // Fetch homes by category
  fetchHomesByCategory: async (categoryId: number) => {
    try {
      const homes = await PublicService.getHomesByCategory(categoryId);
      return homes;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch homes by category' });
      return [];
    }
  },

  // Selection actions
  setSelectedFlat: (flat: Flat | null) => {
    set({ selectedFlat: flat });
  },

  setSelectedHome: (home: Home | null) => {
    set({ selectedHome: home });
  },

  // State management
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  // Cache management
  invalidateCache: () => {
    set({
      lastFetch: {
        flats: null,
        homes: null,
        featured: null,
      },
    });
  },

  // Check if data is stale (older than 5 minutes)
  isDataStale: (type: 'flats' | 'homes' | 'featured') => {
    const { lastFetch } = get();
    const lastFetchTime = lastFetch[type];
    if (!lastFetchTime) return true;
    
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() - lastFetchTime > fiveMinutes;
  },
}));

// Export selectors for easier use
export const useFlats = () => usePropertiesStore(state => state.flats);
export const useHomes = () => usePropertiesStore(state => state.homes);
export const useSelectedFlat = () => usePropertiesStore(state => state.selectedFlat);
export const useSelectedHome = () => usePropertiesStore(state => state.selectedHome);
export const useFeaturedHomes = () => usePropertiesStore(state => state.featuredHomes);
export const usePopularFlats = () => usePropertiesStore(state => state.popularFlats);
export const usePropertiesLoading = () => usePropertiesStore(state => ({
  isLoading: state.isLoading,
  isLoadingFlats: state.isLoadingFlats,
  isLoadingHomes: state.isLoadingHomes,
  isLoadingFeatured: state.isLoadingFeatured,
}));
export const usePropertiesError = () => usePropertiesStore(state => state.error);