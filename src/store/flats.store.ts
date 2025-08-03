import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {
  type Category,
  getCategories,
  getFlats,
  getFlatsByCategory,
  getHomes,
  type HomePageFlats, type ResolvedFlat, type ResolvedHome,
  searchFlats,
  type SearchRequest
} from '../services';
import {usePhotoStore} from "./usePhotoStore.ts";
import {publishChecker} from "../utils/publishChecker.ts";

export interface flatsState {
  flats: ResolvedFlat[];
  homes: ResolvedHome[];
  categories: Category[];
  searchResults: ResolvedFlat[];

  homePageFlats: HomePageFlats[];
  flatsByHome: ResolvedFlat[];

  selectedCategory: Category | null;
  selectedFlat: ResolvedFlat | null;
  selectedHome: ResolvedHome | null;

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

  loadFlatsByHome: (homeId: number) => Promise<ResolvedFlat[]>;
  loadFlatsByCategory: (categoryId: number) => Promise<ResolvedFlat[]>;

  getFlatById: (id: number) => Promise<ResolvedFlat | null>;
  getHomeById: (id: number) => Promise<ResolvedHome | null>;

  setSelectedFlat: (flat: ResolvedFlat | null) => void;
  setSelectedHome: (home: ResolvedHome | null) => void;
  setSelectedCategory: (category: Category | null) => void;

  setFilters: (filters: Partial<SearchRequest>) => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  searchFlats: (page?: number) => Promise<void>;
  clearSearch: () => void;
  resetFilters: () => void;

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

export const useFlatsStore = create<flatsState & flatsActions>()(persist((set, get) => ({
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
        const published = flats.filter(publishChecker);
        const resolved = await Promise.all(published.map(usePhotoStore.getState().processFlat));
        set(state => ({
          flats: resolved,
          isLoadingFlats: false,
          lastFetch: {...state.lastFetch, flats: Date.now()},
          ...(get().hasSearched ? {} : {searchResults: resolved})
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
        const published = homes.filter(publishChecker);
        const resolved = await Promise.all(published.map(usePhotoStore.getState().processHome));
        set(state => ({
          homes: resolved,
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
        const resolved = await Promise.allSettled(
          homePageCategories.map(async category => {
            const flats = await getFlatsByCategory(category.id);
            const published = flats.filter(publishChecker);
            const resolved = await Promise.all(published.map(usePhotoStore.getState().processFlat));
            return {category, flats: resolved};
          })
        );

        const homePageFlats: HomePageFlats[] = resolved
          .filter(r => r.status === 'fulfilled')
          .map(r => (r as PromiseFulfilledResult<HomePageFlats>).value);

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
      await get().loadFlats();
      const loadedFlat = get().flats.find(apt => apt.flat.id === id);
      if (loadedFlat) {
        set({selectedFlat: loadedFlat});
      }

      return loadedFlat || null;
    },

    getHomeById: async (id: number) => {
      await get().loadHomes();
      const loadedHome = get().homes.find(h => h.id === id);
      if (loadedHome) {
        set({selectedHome: loadedHome});
      }

      return loadedHome || null;
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
        await get().loadFlats(true);
        const {flats} = get();

        const published = flats.filter((item) => publishChecker(item) && item.flat.homeId === homeId);
        const resolved = await Promise.all(published.map(usePhotoStore.getState().processFlat));

        set({flatsByHome: resolved});

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
        const published = flats.filter(publishChecker);
        const resolved = await Promise.all(published.map(usePhotoStore.getState().processFlat));
        set(state => {
          const updatedFlats = [...state.flats];
          resolved.forEach(flat => {
            const existingIndex = updatedFlats.findIndex(h => h.flat.id === flat.flat.id);
            if (existingIndex >= 0) {
              updatedFlats[existingIndex] = flat;
            } else {
              updatedFlats.push(flat);
            }
          });

          return {flats: updatedFlats};
        });

        return resolved;
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
        const published = searchResults.filter(publishChecker);
        const resolved = await Promise.all(published.map(usePhotoStore.getState().processFlat));

        const totalResults = resolved.length;
        const totalPages = Math.max(1, Math.ceil(totalResults / limit));
        const normalizedPage = Math.min(Math.max(1, pageToUse), totalPages);

        set({
          currentPage: normalizedPage,
          totalResults,
          totalPages,
          searchResults: resolved,
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

    setSelectedFlat: (flat: ResolvedFlat | null) => {
      set({selectedFlat: flat});
    },

    setSelectedHome: (home: ResolvedHome | null) => {
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

    resetFilters: () => {
      set({
        currentSearchParams: defaultFilters,
        currentPage: 1,
        hasSearched: false,
        searchError: null,
      });
    },

    setError: (error: string | null) => set({error}),
    setSearchError: (searchError: string | null) => set({searchError}),
    clearErrors: () => set({error: null, searchError: null}),
  }),
  {
    name: 'flats-store',
    version: 1,
    partialize: (state) => ({
      flats: state.flats,
      homes: state.homes,
      homePageFlats: state.homePageFlats,
      categories: state.categories,
      searchResults: state.searchResults,
      flatsByHome: state.flatsByHome,

      currentSearchParams: state.currentSearchParams,
      currentPage: state.currentPage,
      limit: state.limit,
      hasSearched: state.hasSearched,
    }),
  }
));