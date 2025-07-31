import {create} from 'zustand';
import {
  getFlats,
  getHomes,
  getFlatById,
  getHomeById,
  getFlatsByHome,
  getFlatsByCategory,
  type Category,
  getCategories,
  type HomePageFlats, type FlatWithCategory,
} from '../services';
import type {Flat, Home} from '../services';

export interface PropertiesState {
  flats: Flat[];
  homes: Home[];
  categories: Category[];

  selectedCategory: Category | null;
  selectedFlat: Flat | null;
  selectedHome: Home | null;

  homePageFlats: HomePageFlats[];
  flatsByHome: FlatWithCategory[];

  isLoading: boolean;
  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingCategories: boolean;
  isLoadingHomePageFlats: boolean;

  error: string | null;

  lastFetch: {
    flats: number | null;
    homes: number | null;
    categories: number | null;
    homePageFlats: number | null;
  };
}

export interface PropertiesActions {
  fetchFlats: (force?: boolean) => Promise<void>;
  fetchHomes: (force?: boolean) => Promise<void>;
  fetchCategories: (force?: boolean) => Promise<void>;

  fetchFlatById: (id: number) => Promise<Flat | null>;
  fetchHomeById: (id: number) => Promise<Home | null>;

  fetchFlatsByHome: (homeId: number) => Promise<Flat[]>;
  fetchFlatsByCategory: (categoryId: number) => Promise<Flat[]>;

  fetchHomePageFlats: (categories: Category[], force?: boolean) => Promise<void>;

  setSelectedFlat: (flat: Flat | null) => void;
  setSelectedHome: (home: Home | null) => void;
  setSelectedCategory: (category: Category | null) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  invalidateCache: () => void;
  isDataStale: (type: 'flats' | 'homes' | 'categories' | 'homePageFlats') => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const usePropertiesStore = create<PropertiesState & PropertiesActions>((set, get) => ({
  flats: [],
  homes: [],
  categories: [],

  homePageFlats: [],
  flatsByHome: [],

  selectedFlat: null,
  selectedHome: null,
  selectedCategory: null,

  isLoading: false,
  isLoadingFlats: false,
  isLoadingHomes: false,
  isLoadingCategories: false,
  isLoadingHomePageFlats: false,

  error: null,

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

  fetchFlats: async (force = false) => {
    const {isDataStale} = get();

    if (!force && !isDataStale('flats')) {
      return;
    }

    set({isLoadingFlats: true, error: null});

    try {
      const flats = await getFlats();

      set(state => ({
        flats,
        isLoadingFlats: false,
        lastFetch: {...state.lastFetch, flats: Date.now()},
      }));

    } catch {
      set({
        isLoadingFlats: false,
        error: 'Failed to fetch flats',
      });
    }
  },

  fetchHomes: async (force = false) => {
    const {isDataStale} = get();

    if (!force && !isDataStale('homes')) {
      return;
    }

    set({isLoadingHomes: true, error: null});

    try {
      const homes = await getHomes();

      set(state => ({
        homes,
        isLoadingHomes: false,
        lastFetch: {...state.lastFetch, homes: Date.now()},
      }));

    } catch {
      set({
        isLoadingHomes: false,
        error: 'Failed to fetch homes',
      });
    }
  },

  fetchCategories: async (force = false) => {
    const {isDataStale} = get();

    if (!force && !isDataStale('categories')) {
      return;
    }

    set({isLoadingCategories: true, error: null});

    try {
      const categories = await getCategories();

      set(state => ({
        categories,
        isLoadingCategories: false,
        lastFetch: {...state.lastFetch, categories: Date.now()},
      }));

    } catch {
      set({
        isLoadingCategories: false,
        error: 'Failed to fetch categories',
      });
    }
  },

  fetchHomePageFlats: async (categories, force = false) => {
    const {isDataStale} = get();

    if (!force && !isDataStale('homePageFlats')) {
      return;
    }

    set({isLoadingHomePageFlats: true, error: null});

    const results = await Promise.allSettled(
      categories.map(category =>
        getFlatsByCategory(category.id).then(flats => ({
          category,
          flats,
        }))
      )
    );

    const currentFlats: HomePageFlats[] = [];
    const errors: string[] = [];

    results.forEach((res, idx) => {
      const category = categories[idx];
      if (res.status === 'fulfilled') {
        currentFlats.push(res.value);
      } else {
        currentFlats.push({
          category,
          flats: [],
        });
        errors.push(`Failed to fetch flats for category ${category.name}`);
      }
    });

    set(state => ({
      isLoadingHomePageFlats: false,
      lastFetch: {...state.lastFetch, homePageFlats: Date.now()},
      error: errors.length > 0 ? errors.join('; ') : null,
    }));

    if (currentFlats.length > 0) {
      set({homePageFlats: currentFlats})
    }
  },

  fetchFlatById: async (id: number) => {
    try {
      const flat = await getFlatById(id);

      if (flat) {
        set(state => ({
          flats: state.flats.map(f => f.id === id ? flat : f),
        }));
      }

      return flat;
    } catch {
      set({error: 'Failed to fetch flat'});
      return null;
    }
  },

  fetchHomeById: async (id: number) => {
    try {
      const home = await getHomeById(id);

      if (home) {
        set(state => ({
          homes: state.homes.map(h => h.id === id ? home : h),
        }));
      }

      return home;
    } catch {
      set({error: 'Failed to fetch home'});
      return null;
    }
  },

  fetchFlatsByHome: async (homeId: number) => {
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

  fetchFlatsByCategory: async (categoryId: number) => {
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

  setSelectedFlat: (flat: Flat | null) => {
    set({selectedFlat: flat});
  },

  setSelectedHome: (home: Home | null) => {
    set({selectedHome: home});
  },

  setSelectedCategory: (category: Category | null) => {
    set({selectedCategory: category});
  },

  setLoading: (isLoading: boolean) => set({isLoading}),
  setError: (error: string | null) => set({error}),
  clearError: () => set({error: null}),

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
}));