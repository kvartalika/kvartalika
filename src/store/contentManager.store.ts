import {create} from 'zustand';
import {
  type BidRequest,
  createFlat,
  createHome, deleteBid,
  deleteFlat,
  deleteHome,
  type FlatWithCategoryRequest, getAllBids,
  type HomeRequest, updateBid,
  updateFlat,
  updateHome,
} from '../services';
import {useFlatsStore} from "./flats.store.ts";
import type {BidForm} from "./ui.store.ts";
import {useContentStore} from "./content.store.ts";

export interface ContentManagerState {
  bids: BidForm[];
  selectedBid: BidForm | null;

  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingBids: boolean;

  error: string | null;
}

export interface ContentManagerActions {
  addFlat: (FlatData: FlatWithCategoryRequest) => Promise<void>;
  editFlat: (id: number, FlatData: FlatWithCategoryRequest) => Promise<void>;
  removeFlat: (id: number) => Promise<void>;

  addHome: (HomeData: HomeRequest) => Promise<void>;
  editHome: (id: number, HomeData: HomeRequest) => Promise<void>;
  removeHome: (id: number) => Promise<void>;

  getBids: () => Promise<void>;
  editBid: (bid: BidForm) => void;
  getBid: (id: number) => Promise<void>;
  saveBid: (data: BidRequest) => Promise<boolean>;
  removeBid: (id: number) => Promise<void>;

  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useContentManagerStore = create<ContentManagerState & ContentManagerActions>((set, get) => ({
  bids: [],
  selectedBid: null,

  isLoadingFlats: false,
  isLoadingHomes: false,
  isLoadingBids: false,

  error: null,

  addFlat: async (FlatData: FlatWithCategoryRequest) => {
    set({error: null});

    try {
      await createFlat(FlatData);
      await useFlatsStore.getState().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add Flat',
      });
    }
  },

  editFlat: async (id: number, FlatData: FlatWithCategoryRequest) => {
    set({error: null});

    try {
      await updateFlat(id, FlatData);
      await useFlatsStore.getState().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update Flat',
      });
    }
  },

  removeFlat: async (id: number) => {
    set({error: null});

    try {
      await deleteFlat(id);
      await useFlatsStore.getState().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete Flat',
      });
    }
  },

  addHome: async (HomeData: HomeRequest) => {
    set({error: null});

    try {
      await createHome(HomeData);
      await useFlatsStore.getState().loadHomes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add Home',
      });
    }
  },

  editHome: async (id: number, HomeData: HomeRequest) => {
    set({error: null});

    try {
      await updateHome(id, HomeData);
      await useFlatsStore.getState().loadHomes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update Home',
      });
    }
  },

  removeHome: async (id: number) => {
    set({error: null});

    try {
      await deleteHome(id);
      await useFlatsStore.getState().loadHomes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete Home',
      });
    }
  },

  getBids: async () => {
    set({error: null});

    try {
      set({bids: await getAllBids()})
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update Flat',
        bids: [],
      });
    }
  },

  getBid: async (id: number) => {
    set({error: null});

    try {
      const bid = get().bids.find(b => b.id === id);

      if (bid) {
        set({selectedBid: bid});
        return;
      }

      await get().getBids();

      const loadedBid = get().bids.find(b => b.id === id);
      set({selectedBid: loadedBid});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update Flat',
      });
    }
  },

  editBid: (bid) => {
    useContentStore.setState({
      bidForm: {
        ...bid
      },
      ui: {...useContentStore.getState().ui, showForm: true, editMode: true},
    });

    set({
      selectedBid: bid,
    });
  },

  saveBid: async (data: BidRequest) => {
    useContentStore.setState(({
      loading: {
        ...useContentStore.getState().loading,
        saving: true
      }
    }));
    try {
      const {selectedBid} = get();
      if (selectedBid?.id) {
        await updateBid(selectedBid.id, data);
      }
      await get().getBids();
      useContentStore.getState().resetForms();
      useContentStore.getState().setShowForm(false);
      useContentStore.setState(({
        loading: {
          ...useContentStore.getState().loading,
          saving: false
        }
      }));
      return true;
    } catch (error) {
      set({error: error instanceof Error ? error.message : 'Failed to update Flat'});
      useContentStore.setState(({
        loading: {
          ...useContentStore.getState().loading,
          saving: false
        }
      }));
      return false;
    }
  },

  removeBid: async (id: number) => {
    set({error: null});

    try {
      await deleteBid(id);
      await useFlatsStore.getState().loadFlats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete Flat',
      });
    }
  },

  setError: (error: string | null) => set({error}),
  clearError: () => set({error: null}),
}));