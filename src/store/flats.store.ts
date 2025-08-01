import {create} from 'zustand';
import {
  getCategories,
  getFlatsByCategory,
  type Category,
  type HomePageFlats,
  type Flat,
  type Home,
  type SearchRequest,
  getFlats,
  getHomes, searchFlats
} from '../services';

export interface flatsState {
  flats: Flat[];
  homes: Home[];
  categories: Category[];
  searchResults: Flat[];
  homePageFlats: HomePageFlats[];

  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingCategories: boolean;
  isLoadingHomePageFlats: boolean;
  isSearching: boolean;

  error: string | null;
  searchError: string | null;

  currentSearchParams: SearchRequest | null;
  hasSearched: boolean;

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

  getApartmentById: (id: number) => Promise<Flat | null>;
  getHomeById: (id: number) => Promise<Home | null>;

  searchFlats: (searchParams: SearchRequest) => Promise<void>;
  clearSearch: () => void;

  setError: (error: string | null) => void;
  setSearchError: (error: string | null) => void;
  clearErrors: () => void;
  isDataStale: (type: 'flats' | 'homes' | 'categories' | 'homePageFlats') => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const useFlatsStore = create<flatsState & flatsActions>((set, get) => ({
  flats: [],
  homes: [],
  categories: [],
  searchResults: [],
  homePageFlats: [],

  isLoadingFlats: false,
  isLoadingHomes: false,
  isLoadingCategories: false,
  isLoadingHomePageFlats: false,
  isSearching: false,

  error: null,
  searchError: null,

  currentSearchParams: null,
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
        flats,
        isLoadingFlats: false,
        lastFetch: {...state.lastFetch, flats: Date.now()},
        ...(get().hasSearched ? {} : {searchResults: flats})
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
        homes,
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

  getApartmentById: async (id: number) => {
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

  searchFlats: async (searchParams: SearchRequest) => {
    set({
      isSearching: true,
      searchError: null,
      currentSearchParams: searchParams,
      hasSearched: true
    });

    try {
      const searchResults = await searchFlats(searchParams);
      set({
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

  clearSearch: () => {
    const {flats} = get();
    set({
      searchResults: flats,
      currentSearchParams: null,
      hasSearched: false,
      searchError: null,
    });
  },

  setError: (error: string | null) => set({error}),
  setSearchError: (searchError: string | null) => set({searchError}),
  clearErrors: () => set({error: null, searchError: null}),
}));