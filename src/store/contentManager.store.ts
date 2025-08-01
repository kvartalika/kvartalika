import {create} from 'zustand';
import {
  createFlat,
  createHome,
  deleteFlat,
  deleteHome,
  type Flat,
  getFlats,
  getHomes,
  type Home,
  type PaginationParams,
  updateFlat,
  updateHome,
} from '../services';

export interface ContentManagerState {
  flats: Flat[];
  homes: Home[];

  isLoadingFlats: boolean;
  isLoadingHomes: boolean;

  error: string | null;
}

export interface ContentManagerActions {
  loadFlats: (params?: PaginationParams) => Promise<void>;
  addFlat: (FlatData: Flat) => Promise<void>;
  editFlat: (id: number, FlatData: Flat) => Promise<void>;
  removeFlat: (id: number) => Promise<void>;

  // Homes
  loadHomes: (params?: PaginationParams) => Promise<void>;
  addHome: (HomeData: Home) => Promise<void>;
  editHome: (id: number, HomeData: Home) => Promise<void>;
  removeHome: (id: number) => Promise<void>;

  // General
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useContentManagerStore = create<ContentManagerState & ContentManagerActions>((set, get) => ({
  flats: [],
  homes: [],

  isLoadingFlats: false,
  isLoadingHomes: false,

  error: null,

  // Flats
  loadFlats: async (params?: PaginationParams) => {
    set({ isLoadingFlats: true, error: null });

    try {
      const flats = await getFlats(params);
      set({
        flats: flats,
        isLoadingFlats: false,
      });
    } catch (error) {
      set({
        isLoadingFlats: false,
        error: error instanceof Error ? error.message : 'Failed to load Flats',
      });
    }
  },

  addFlat: async (FlatData: Flat) => {
    set({ error: null });

    try {
      await createFlat(FlatData);
      await get().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add Flat',
      });
    }
  },

  editFlat: async (id: number, FlatData: Flat) => {
    set({ error: null });

    try {
      await updateFlat(id, FlatData);
      await get().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update Flat',
      });
    }
  },

  removeFlat: async (id: number) => {
    set({ error: null });

    try {
      await deleteFlat(id);
      await get().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete Flat',
      });
    }
  },

  loadHomes: async (params?: PaginationParams) => {
    set({ isLoadingHomes: true, error: null });

    try {
      const Homes = await getHomes(params);
      set({
        homes: Homes,
        isLoadingHomes: false,
      });
    } catch (error) {
      set({
        isLoadingHomes: false,
        error: error instanceof Error ? error.message : 'Failed to load Homes',
      });
    }
  },

  addHome: async (HomeData: Home) => {
    set({ error: null });

    try {
      await createHome(HomeData);
      await get().loadHomes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add Home',
      });
    }
  },

  editHome: async (id: number, HomeData: Home) => {
    set({ error: null });

    try {
      await updateHome(id, HomeData);
      await get().loadHomes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update Home',
      });
    }
  },

  removeHome: async (id: number) => {
    set({ error: null });

    try {
      await deleteHome(id);
      await get().loadHomes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete Home',
      });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));