import { create } from 'zustand';
import { getFlats, getHomes, search } from '../services/newApi.service';
import { 
  getCategories,
  getFlatsByCategory,
  type Category,
  type HomePageFlats
} from '../services';
import type { Flat, Home, SearchRequest } from '../api/api';

export interface ApartmentsState {
  // Data
  apartments: Flat[];
  homes: Home[];
  categories: Category[];
  searchResults: Flat[];
  homePageFlats: HomePageFlats[];
  
  // Loading states
  isLoadingApartments: boolean;
  isLoadingHomes: boolean;
  isLoadingCategories: boolean;
  isLoadingHomePageFlats: boolean;
  isSearching: boolean;
  
  // Errors
  error: string | null;
  searchError: string | null;
  
  // Search/filter state
  currentSearchParams: SearchRequest | null;
  hasSearched: boolean;
  
  // Cache management
  lastFetch: {
    apartments: number | null;
    homes: number | null;
    categories: number | null;
    homePageFlats: number | null;
  };
}

export interface ApartmentsActions {
  // Load data
  loadApartments: (force?: boolean) => Promise<void>;
  loadHomes: (force?: boolean) => Promise<void>;
  loadCategories: (force?: boolean) => Promise<void>;
  loadHomePageFlats: (force?: boolean) => Promise<void>;
  loadAllData: (force?: boolean) => Promise<void>;
  
  // Individual data fetchers
  getApartmentById: (id: number) => Promise<Flat | null>;
  getHomeById: (id: number) => Promise<Home | null>;
  
  // Search
  searchApartments: (searchParams: SearchRequest) => Promise<void>;
  clearSearch: () => void;
  
  // Utility
  setError: (error: string | null) => void;
  setSearchError: (error: string | null) => void;
  clearErrors: () => void;
  isDataStale: (type: 'apartments' | 'homes' | 'categories' | 'homePageFlats') => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useApartmentsStore = create<ApartmentsState & ApartmentsActions>((set, get) => ({
  // Initial state
  apartments: [],
  homes: [],
  categories: [],
  searchResults: [],
  homePageFlats: [],
  
  isLoadingApartments: false,
  isLoadingHomes: false,
  isLoadingCategories: false,
  isLoadingHomePageFlats: false,
  isSearching: false,
  
  error: null,
  searchError: null,
  
  currentSearchParams: null,
  hasSearched: false,
  
  lastFetch: {
    apartments: null,
    homes: null,
    categories: null,
    homePageFlats: null,
  },

  // Cache helper
  isDataStale: (type: 'apartments' | 'homes' | 'categories' | 'homePageFlats') => {
    const lastFetch = get().lastFetch[type];
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_DURATION;
  },

  // Load apartments
  loadApartments: async (force = false) => {
    const { isDataStale } = get();
    if (!force && !isDataStale('apartments')) return;

    set({ isLoadingApartments: true, error: null });
    try {
      const apartments = await getFlats();
      set(state => ({ 
        apartments, 
        isLoadingApartments: false,
        lastFetch: { ...state.lastFetch, apartments: Date.now() },
        // If no search has been performed, show all apartments as search results
        ...(get().hasSearched ? {} : { searchResults: apartments })
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load apartments', 
        isLoadingApartments: false 
      });
    }
  },

  // Load homes/complexes
  loadHomes: async (force = false) => {
    const { isDataStale } = get();
    if (!force && !isDataStale('homes')) return;

    set({ isLoadingHomes: true, error: null });
    try {
      const homes = await getHomes();
      set(state => ({ 
        homes, 
        isLoadingHomes: false,
        lastFetch: { ...state.lastFetch, homes: Date.now() }
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load homes', 
        isLoadingHomes: false 
      });
    }
  },

  // Load categories
  loadCategories: async (force = false) => {
    const { isDataStale } = get();
    if (!force && !isDataStale('categories')) return;

    set({ isLoadingCategories: true, error: null });
    try {
      const categories = await getCategories();
      set(state => ({
        categories,
        isLoadingCategories: false,
        lastFetch: { ...state.lastFetch, categories: Date.now() }
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load categories', 
        isLoadingCategories: false 
      });
    }
  },

  // Load home page flats
  loadHomePageFlats: async (force = false) => {
    const { isDataStale, categories } = get();
    if (!force && !isDataStale('homePageFlats')) return;

    const homePageCategories = categories.filter(c => c.isOnMainPage);
    if (homePageCategories.length === 0) return;

    set({ isLoadingHomePageFlats: true, error: null });
    
    try {
      const results = await Promise.allSettled(
        homePageCategories.map(category =>
          getFlatsByCategory(category.id).then(flats => ({
            category,
            flats,
          }))
        )
      );

      const homePageFlats: HomePageFlats[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          homePageFlats.push(result.value);
        }
      });

      set(state => ({
        homePageFlats,
        isLoadingHomePageFlats: false,
        lastFetch: { ...state.lastFetch, homePageFlats: Date.now() }
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load home page flats', 
        isLoadingHomePageFlats: false 
      });
    }
  },

  // Get apartment by ID
  getApartmentById: async (id: number) => {
    const { apartments } = get();
    
    // First check if we have it in cache
    let apartment = apartments.find(apt => apt.id === id);
    if (apartment) return apartment;

    // If not in cache, try to load all apartments first
    await get().loadApartments();
    return get().apartments.find(apt => apt.id === id) || null;
  },

  // Get home by ID
  getHomeById: async (id: number) => {
    const { homes } = get();
    
    // First check if we have it in cache
    let home = homes.find(h => h.id === id);
    if (home) return home;

    // If not in cache, try to load all homes first
    await get().loadHomes();
    return get().homes.find(h => h.id === id) || null;
  },

  // Load all data at once
  loadAllData: async (force = false) => {
    const { loadApartments, loadHomes, loadCategories } = get();
    await Promise.allSettled([
      loadApartments(force), 
      loadHomes(force), 
      loadCategories(force)
    ]);
    
    // Load home page flats after categories are loaded
    await get().loadHomePageFlats(force);
  },

  // Search apartments
  searchApartments: async (searchParams: SearchRequest) => {
    set({ 
      isSearching: true, 
      searchError: null, 
      currentSearchParams: searchParams,
      hasSearched: true
    });
    
    try {
      const searchResults = await search(searchParams);
      set({ 
        searchResults, 
        isSearching: false,
      });
    } catch (error: any) {
      set({ 
        searchError: error.message || 'Search failed', 
        isSearching: false 
      });
    }
  },

  // Clear search and show all apartments
  clearSearch: () => {
    const { apartments } = get();
    set({
      searchResults: apartments,
      currentSearchParams: null,
      hasSearched: false,
      searchError: null,
    });
  },

  // Utility functions
  setError: (error: string | null) => set({ error }),
  setSearchError: (searchError: string | null) => set({ searchError }),
  clearErrors: () => set({ error: null, searchError: null }),
}));