import {create} from 'zustand';
import {
  type Category,
  type Flat, type FlatWithCategory,
  getCategories,
  getFlats,
  getFlatsByCategory, getFlatsByHome,
  getHomes,
  type Home,
  type HomePageFlats,
  searchFlats,
  type SearchRequest
} from '../services';

export interface flatsState {
  flats: Flat[];
  homes: Home[];
  categories: Category[];
  searchResults: Flat[];

  homePageFlats: HomePageFlats[];
  flatsByHome: FlatWithCategory[];

  selectedCategory: Category | null;
  selectedFlat: Flat | null;
  selectedHome: Home | null;

  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingCategories: boolean;
  isLoadingHomePageFlats: boolean;
  isLoadingFilters: boolean;

  isSearching: boolean;

  error: string | null;
  searchError: string | null;

  currentSearchParams: SearchRequest;
  hasSearched: boolean;

  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;

  lastFetch: {
    flats: number | null;
    homes: number | null;
    categories: number | null;
    homePageFlats: number | null;
  };
}

export interface flatsActions {
  loadFlats: (force?: boolean) => Promise<void>;
  loadHomes: (force?: boolean) => Promise<void>;
  loadCategories: (force?: boolean) => Promise<void>;

  loadHomePageFlats: (force?: boolean) => Promise<void>;
  loadAllData: (force?: boolean) => Promise<void>;

  loadFlatsByHome: (homeId: number) => Promise<Flat[]>;
  loadFlatsByCategory: (categoryId: number) => Promise<Flat[]>;

  getFlatById: (id: number) => Promise<Flat | null>;
  getHomeById: (id: number) => Promise<Home | null>;

  setSelectedFlat: (flat: Flat | null) => void;
  setSelectedHome: (home: Home | null) => void;
  setSelectedCategory: (category: Category | null) => void;

  setFilters: (filters: Partial<SearchRequest>) => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  searchFlats: (page?: number) => Promise<void>;
  clearSearch: () => void;

  setError: (error: string | null) => void;
  setSearchError: (error: string | null) => void;
  clearErrors: () => void;

  invalidateCache: () => void;
  isDataStale: (type: 'flats' | 'homes' | 'categories' | 'homePageFlats') => boolean;
}

const defaultFilters: SearchRequest = {
  sortBy: 'price',
  sortOrder: 'asc',
};

const CACHE_DURATION = 5 * 60 * 1000;

export const useFlatsStore = create<flatsState & flatsActions>((set, get) => ({
  flats: [],
  homes: [],
  categories: [],

  searchResults: [],

  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  limit: 20,

  homePageFlats: [],
  flatsByHome: [],

  selectedFlat: null,
  selectedHome: null,
  selectedCategory: null,

  isLoadingFlats: false,
  isLoadingHomes: false,
  isLoadingCategories: false,
  isLoadingHomePageFlats: false,
  isSearching: false,
  isLoadingFilters: false,

  error: null,
  searchError: null,

  currentSearchParams: defaultFilters,
  hasSearched: false,

  lastFetch: {
    flats: null,
    homes: null,
    categories: null,
    homePageFlats: null,
  },

  isDataStale: (type: 'flats' | 'homes' | 'categories' | 'homePageFlats') => {
    const lastFetch = get().lastFetch[type];
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_DURATION;
  },

  loadFlats: async (force = false) => {
    const {isDataStale} = get();
    if (!force && !isDataStale('flats')) return;

    set({isLoadingFlats: true, error: null});
    try {
      const flats = await getFlats();
      set(state => ({
        flats: flats.filter((flat) => flat.published),
        isLoadingFlats: false,
        lastFetch: {...state.lastFetch, flats: Date.now()},
        ...(get().hasSearched ? {} : {searchResults: flats.filter((flat) => flat.published)})
      }));
    } catch (error) {
      set({
        error: (error instanceof Error) ? error.message : 'Failed to load flats',
        isLoadingFlats: false
      });
    }
  },

  loadHomes: async (force = false) => {
    const {isDataStale} = get();
    if (!force && !isDataStale('homes')) return;

    set({isLoadingHomes: true, error: null});
    try {
      const homes = await getHomes();
      set(state => ({
        homes: homes.filter((home) => home.published),
        isLoadingHomes: false,
        lastFetch: {...state.lastFetch, homes: Date.now()}
      }));
    } catch (error) {
      set({
        error: (error instanceof Error) ? error.message : 'Failed to load homes',
        isLoadingHomes: false
      });
    }
  },

  loadCategories: async (force = false) => {
    const {isDataStale} = get();
    if (!force && !isDataStale('categories')) return;

    set({isLoadingCategories: true, error: null});
    try {
      const categories = await getCategories();
      set(state => ({
        categories,
        isLoadingCategories: false,
        lastFetch: {...state.lastFetch, categories: Date.now()}
      }));
    } catch (error) {
      set({
        error: (error instanceof Error) ? error.message : 'Failed to load categories',
        isLoadingCategories: false
      });
    }
  },

  loadHomePageFlats: async (force = false) => {
    const {isDataStale, categories} = get();
    if (!force && !isDataStale('homePageFlats')) return;

    const homePageCategories = categories.filter(c => c.isOnMainPage);
    if (homePageCategories.length === 0) return;

    set({isLoadingHomePageFlats: true, error: null});

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
        lastFetch: {...state.lastFetch, homePageFlats: Date.now()}
      }));
    } catch (error) {
      set({
        error: (error instanceof Error) ? error.message : 'Failed to load home page flats',
        isLoadingHomePageFlats: false
      });
    }
  },

  getFlatById: async (id: number) => {
    const {flats} = get();

    const flat = flats.find(apt => apt.id === id);
    if (flat) return flat;

    await get().loadFlats();
    return get().flats.find(apt => apt.id === id) || null;
  },

  getHomeById: async (id: number) => {
    const {homes} = get();

    const home = homes.find(h => h.id === id);
    if (home) return home;

    await get().loadHomes();
    return get().homes.find(h => h.id === id) || null;
  },

  loadAllData: async (force = false) => {
    const {loadFlats, loadHomes, loadCategories} = get();
    await Promise.allSettled([
      loadFlats(force),
      loadHomes(force),
      loadCategories(force)
    ]);

    await get().loadHomePageFlats(force);
  },

  loadFlatsByHome: async (homeId: number) => {
    try {
      const flats = await getFlatsByHome(homeId);
      set({flatsByHome: flats});

      return flats;
    } catch {
      set({error: 'Failed to fetch flats by home'});
      set({flatsByHome: []});

      return [];
    }
  },

  loadFlatsByCategory: async (categoryId: number) => {
    try {
      const flats = await getFlatsByCategory(categoryId);

      set(state => {
        const updatedFlats = [...state.flats];
        flats.forEach(flat => {
          const existingIndex = updatedFlats.findIndex(h => h.id === flat.id);
          if (existingIndex >= 0) {
            updatedFlats[existingIndex] = flat;
          } else {
            updatedFlats.push(flat);
          }
        });

        return {flats: updatedFlats};
      });

      return flats;
    } catch {
      set({error: 'Failed to fetch flats by category'});
      return [];
    }
  },

  setFilters: (newFilters: Partial<SearchRequest>) => {
    set(state => ({
      currentSearchParams: {...state.currentSearchParams, ...newFilters},
      currentPage: 1,
    }));
  },

  searchFlats: async (page?: number) => {
    const {currentSearchParams, limit} = get();
    const pageToUse = page ?? get().currentPage;

    set({
      isSearching: true,
      searchError: null,
      hasSearched: true
    });

    try {
      const searchResults = await searchFlats(currentSearchParams);

      const totalResults = searchResults.length;
      const totalPages = Math.max(1, Math.ceil(totalResults / limit));
      const normalizedPage = Math.min(Math.max(1, pageToUse), totalPages);

      set({
        currentPage: normalizedPage,
        totalResults,
        totalPages,
        searchResults,
        isSearching: false,
      });
    } catch (error) {
      set({
        searchError: (error instanceof Error) ? error.message : 'Search failed',
        isSearching: false
      });
    }
  },

  setPage: (page: number) => {
    set(state => {
      const normalized = Math.min(Math.max(1, page), state.totalPages);
      return {currentPage: normalized};
    });
  },

  setLimit: (limit: number) => {
    set(state => {
      const totalPages = Math.max(1, Math.ceil(state.totalResults / limit));
      const currentPage = Math.min(state.currentPage, totalPages);
      return {limit, totalPages, currentPage};
    });
  },

  setSelectedFlat: (flat: Flat | null) => {
    set({selectedFlat: flat});
  },

  setSelectedHome: (home: Home | null) => {
    set({selectedHome: home});
  },

  setSelectedCategory: (category: Category | null) => {
    set({selectedCategory: category});
  },

  invalidateCache: () => {
    set({
      lastFetch: {
        categories: null,
        flats: null,
        homes: null,
        homePageFlats: null,
      },
    });
  },

  clearSearch: () => {
    const {flats} = get();
    set({
      searchResults: flats,
      currentSearchParams: defaultFilters,
      hasSearched: false,
      searchError: null,
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
    });
  },

  setError: (error: string | null) => set({error}),
  setSearchError: (searchError: string | null) => set({searchError}),
  clearErrors: () => set({error: null, searchError: null}),
}));