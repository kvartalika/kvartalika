import { create } from 'zustand';
import {
  createApartment,
  updateApartment,
  deleteApartment,
  createComplex,
  updateComplex,
  deleteComplex,
  getApartments,
  getComplexes,
} from '../services/newApiService';
import type {
  Flat,
  Home,
  ApiResponse,
  PaginationParams,
} from '../services/api.types';

export interface ContentManagerState {
  apartments: Flat[];
  complexes: Home[];
  
  isLoadingApartments: boolean;
  isLoadingComplexes: boolean;
  
  error: string | null;
}

export interface ContentManagerActions {
  // Apartments
  loadApartments: (params?: PaginationParams) => Promise<void>;
  addApartment: (apartmentData: any) => Promise<void>;
  editApartment: (id: number, apartmentData: any) => Promise<void>;
  removeApartment: (id: number) => Promise<void>;
  
  // Complexes
  loadComplexes: (params?: PaginationParams) => Promise<void>;
  addComplex: (complexData: any) => Promise<void>;
  editComplex: (id: number, complexData: any) => Promise<void>;
  removeComplex: (id: number) => Promise<void>;
  
  // General
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useContentManagerStore = create<ContentManagerState & ContentManagerActions>((set, get) => ({
  apartments: [],
  complexes: [],
  
  isLoadingApartments: false,
  isLoadingComplexes: false,
  
  error: null,

  // Apartments
  loadApartments: async (params?: PaginationParams) => {
    set({ isLoadingApartments: true, error: null });
    
    try {
      const apartments = await getApartments(params);
      set({
        apartments: apartments,
        isLoadingApartments: false,
      });
    } catch (error) {
      set({
        isLoadingApartments: false,
        error: error instanceof Error ? error.message : 'Failed to load apartments',
      });
    }
  },

  addApartment: async (apartmentData: any) => {
    set({ error: null });
    
    try {
      await createApartment(apartmentData);
      // Reload the list after adding
      await get().loadApartments();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add apartment',
      });
    }
  },

  editApartment: async (id: number, apartmentData: any) => {
    set({ error: null });
    
    try {
      await updateApartment(id, apartmentData);
      // Reload the list after updating
      await get().loadApartments();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update apartment',
      });
    }
  },

  removeApartment: async (id: number) => {
    set({ error: null });
    
    try {
      await deleteApartment(id);
      // Reload the list after deleting
      await get().loadApartments();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete apartment',
      });
    }
  },

  // Complexes
  loadComplexes: async (params?: PaginationParams) => {
    set({ isLoadingComplexes: true, error: null });
    
    try {
      const complexes = await getComplexes(params);
      set({
        complexes: complexes,
        isLoadingComplexes: false,
      });
    } catch (error) {
      set({
        isLoadingComplexes: false,
        error: error instanceof Error ? error.message : 'Failed to load complexes',
      });
    }
  },

  addComplex: async (complexData: any) => {
    set({ error: null });
    
    try {
      await createComplex(complexData);
      // Reload the list after adding
      await get().loadComplexes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add complex',
      });
    }
  },

  editComplex: async (id: number, complexData: any) => {
    set({ error: null });
    
    try {
      await updateComplex(id, complexData);
      // Reload the list after updating
      await get().loadComplexes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update complex',
      });
    }
  },

  removeComplex: async (id: number) => {
    set({ error: null });
    
    try {
      await deleteComplex(id);
      // Reload the list after deleting
      await get().loadComplexes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete complex',
      });
    }
  },

  // General
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));