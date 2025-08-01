import {create} from 'zustand';
import {
  searchFlats,
} from '../services';
import { search as newSearchFlats } from '../services/newApi.service';
import type {Flat, SearchRequest} from '../services';
import type { SearchRequest as NewSearchRequest } from '../api/api';

export interface SearchFilters {
  query?: string;

  minPrice?: number;
  maxPrice?: number;

  rooms?: number;

  bathrooms?: number;
  isDecorated?: boolean;

  homeId?: number;

  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;

  categoriesId?: number[];

  sortBy?: 'price' | 'rooms' | 'area' | 'location';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchState {
  filters: SearchFilters;

  searchResultsFlats: Flat[];

  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;

  isSearching: boolean;
  isLoadingFilters: boolean;

  searchError: string | null;
}

export interface SearchActions {
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  performSearch: (page?: number) => Promise<void>;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  setSearchError: (error: string | null) => void;
  clearSearchResults: () => void;
}

const defaultFilters: SearchFilters = {
  sortBy: 'price',
  sortOrder: 'asc',
};

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
  filters: defaultFilters,

  searchResultsFlats: [],

  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  limit: 20,

  isSearching: false,
  isLoadingFilters: false,

  searchError: null,

  setFilters: (newFilters: Partial<SearchFilters>) => {
    set(state => ({
      filters: {...state.filters, ...newFilters},
      currentPage: 1,
    }));
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      currentPage: 1,
      searchResultsFlats: [],
      totalPages: 1,
      totalResults: 0,
      searchError: null,
    });
  },

  performSearch: async (page?: number) => {
    const {filters, limit} = get();
    const pageToUse = page ?? get().currentPage;

    set({isSearching: true, searchError: null});

    try {
      // Try new API first, fallback to legacy API
      let allResults: Flat[] = [];
      
      try {
        // Convert filters to new API format
        const newSearchParams: NewSearchRequest = {
          query: filters.query,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          rooms: filters.rooms,
          bathrooms: filters.bathrooms,
          isDecorated: filters.isDecorated,
          homeId: filters.homeId,
          hasParks: filters.hasParks,
          hasSchools: filters.hasSchools,
          hasShops: filters.hasShops,
          categoriesId: filters.categoriesId,
        };
        
        allResults = await newSearchFlats(newSearchParams);
      } catch (newApiError) {
        // Fallback to legacy API
        console.warn('New API search failed, falling back to legacy API:', newApiError);
        const searchParams: SearchRequest = {...filters};
        allResults = await searchFlats(searchParams);
      }

      const totalResults = allResults.length;
      const totalPages = Math.max(1, Math.ceil(totalResults / limit));
      const normalizedPage = Math.min(Math.max(1, pageToUse), totalPages);

      set({
        searchResultsFlats: allResults,
        currentPage: normalizedPage,
        totalResults,
        totalPages,
        isSearching: false,
      });
    } catch (error) {
      set({
        isSearching: false,
        searchError: 'Search failed',
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

  setSearchError: (searchError: string | null) => set({searchError}),

  clearSearchResults: () => {
    set({
      searchResultsFlats: [],
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
    });
  },
}));