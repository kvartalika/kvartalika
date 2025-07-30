import { create } from 'zustand';
import { 
  searchHomes,
  advancedSearch,
  getFilterOptions,
} from '../services';
import type { Home, Flat, SearchRequest, PaginatedResponse } from '../services';
import { usePropertiesStore } from './properties.store';
import type { Apartment } from './properties.store';

export interface SearchFilters {
  // Text search
  query: string;
  
  // Price range
  minPrice?: number;
  maxPrice?: number;
  
  // Property characteristics
  rooms?: number[];
  minArea?: number;
  maxArea?: number;
  minFloor?: number;
  maxFloor?: number;
  
  // Legacy filters for compatibility
  bathrooms?: number[];
  finishing?: string[];
  
  // Location and amenities
  categoryId?: number;
  homeId?: number;
  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;
  
  // Sorting
  sortBy?: 'price' | 'rooms' | 'area' | 'location' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  priceRanges: { min: number; max: number }[];
  roomCounts: number[];
  areas: { min: number; max: number }[];
  amenities: string[];
  finishingTypes: string[];
  floorRanges: { min: number; max: number }[];
}

export interface SearchState {
  // Filters
  filters: SearchFilters;
  filterOptions: FilterOptions | null;
  
  // Search results
  searchResults: Home[];
  searchResultsFlats: Flat[];
  searchResultsApartments: Apartment[]; // Legacy compatibility
  
  // Pagination for advanced search
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  
  // Loading states
  isSearching: boolean;
  isLoadingFilters: boolean;
  
  // Error handling
  searchError: string | null;
  
  // Search history
  searchHistory: string[];
  recentSearches: SearchFilters[];
  
  // Quick filters (predefined)
  quickFilters: {
    id: string;
    name: string;
    filters: Partial<SearchFilters>;
  }[];
}

export interface SearchActions {
  // Filter management
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setQuickFilter: (filterId: string) => void;
  
  // Search execution
  performSearch: () => Promise<void>;
  performAdvancedSearch: (page?: number) => Promise<void>;
  
  // Filter options
  loadFilterOptions: () => Promise<void>;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // History management
  addToSearchHistory: (query: string) => void;
  saveRecentSearch: (filters: SearchFilters) => void;
  clearSearchHistory: () => void;
  
  // State management
  setSearchError: (error: string | null) => void;
  clearSearchResults: () => void;
  
  // Legacy compatibility
  filterLegacyApartments: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  rooms: [],
  bathrooms: [],
  finishing: [],
  sortBy: 'price',
  sortOrder: 'asc',
};

const defaultQuickFilters = [
  {
    id: 'affordable',
    name: 'Доступные',
    filters: { maxPrice: 5000000, sortBy: 'price' as const },
  },
  {
    id: 'premium',
    name: 'Премиум',
    filters: { minPrice: 10000000, sortBy: 'price' as const, sortOrder: 'desc' as const },
  },
  {
    id: 'family',
    name: 'Для семьи',
    filters: { rooms: [3, 4], minArea: 80, hasSchools: true },
  },
  {
    id: 'studio',
    name: 'Студии',
    filters: { rooms: [1], maxArea: 50 },
  },
  {
    id: 'new',
    name: 'Новые',
    filters: { sortBy: 'date' as const, sortOrder: 'desc' as const },
  },
];

// Transform API Home to legacy Apartment for search results
const transformFlatToApartment = (flat: Flat): Apartment => ({
  id: flat.id,
  complex: flat.home?.name || "Неизвестный комплекс",
  complexId: flat.homeId,
  address: flat.home?.address || "Адрес не указан",
  rooms: flat.rooms,
  floor: flat.floor,
  bathroom: "Совмещенный",
  bathrooms: 1,
  finishing: "Чистовая",
  isHot: false,
  image: flat.photos?.[0]?.url || "/images/default-apartment.jpg",
  price: flat.price,
  area: flat.area,
  description: flat.description,
  images: flat.photos?.map(photo => photo.url),
  hasParks: flat.home?.amenities?.includes("Парковка") || false,
  hasSchools: flat.home?.amenities?.includes("Школа") || false,
  hasShops: flat.home?.amenities?.includes("Магазины") || false,
  distanceFromCenter: 5.0,
});

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
  // Initial state
  filters: defaultFilters,
  filterOptions: null,
  
  searchResults: [],
  searchResultsFlats: [],
  searchResultsApartments: [],
  
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  limit: 20,
  
  isSearching: false,
  isLoadingFilters: false,
  
  searchError: null,
  
  searchHistory: [],
  recentSearches: [],
  
  quickFilters: defaultQuickFilters,

  // Set filters
  setFilters: (newFilters: Partial<SearchFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    }));
  },

  // Reset filters to default
  resetFilters: () => {
    set({
      filters: defaultFilters,
      currentPage: 1,
      searchResults: [],
      searchResultsFlats: [],
      searchResultsApartments: [],
    });
  },

  // Apply quick filter
  setQuickFilter: (filterId: string) => {
    const quickFilter = get().quickFilters.find(qf => qf.id === filterId);
    if (quickFilter) {
      get().setFilters(quickFilter.filters);
      get().performSearch();
    }
  },

  // Perform basic search
  performSearch: async () => {
    const { filters } = get();
    
    set({ isSearching: true, searchError: null });
    
    try {
      // Convert filters to API format
      const searchParams: SearchRequest = {
        query: filters.query || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rooms: filters.rooms?.length ? filters.rooms : undefined,
        categoryId: filters.categoryId,
        homeId: filters.homeId,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
        minFloor: filters.minFloor,
        maxFloor: filters.maxFloor,
      };

      const results = await searchHomes(searchParams);
      
      // Extract flats from homes
      const flats: Flat[] = results.flatMap(home => home.flats || []);
      
      // Apply client-side filtering for legacy fields
      let filteredResults = [...results];
      let filteredFlats = [...flats];
      
      // Apply legacy filters
      if (filters.finishing && filters.finishing.length > 0) {
        // This would need to be enhanced based on actual API data structure
        // For now, we'll keep all results since finishing is not in the API
      }
      
      if (filters.hasParks !== undefined) {
        filteredResults = filteredResults.filter(home => 
          filters.hasParks ? home.amenities?.includes("Парковка") : !home.amenities?.includes("Парковка")
        );
      }
      
      if (filters.hasSchools !== undefined) {
        filteredResults = filteredResults.filter(home => 
          filters.hasSchools ? home.amenities?.includes("Школа") : !home.amenities?.includes("Школа")
        );
      }
      
      if (filters.hasShops !== undefined) {
        filteredResults = filteredResults.filter(home => 
          filters.hasShops ? home.amenities?.includes("Магазины") : !home.amenities?.includes("Магазины")
        );
      }
      
      // Re-extract flats after home filtering
      filteredFlats = filteredResults.flatMap(home => home.flats || []);
      
      // Apply sorting
      if (filters.sortBy) {
        filteredFlats.sort((a, b) => {
          let aVal: number, bVal: number;
          
          switch (filters.sortBy) {
            case 'price':
              aVal = a.price;
              bVal = b.price;
              break;
            case 'rooms':
              aVal = a.rooms;
              bVal = b.rooms;
              break;
            case 'area':
              aVal = a.area;
              bVal = b.area;
              break;
            case 'location':
              // Would need location data from API
              aVal = 0;
              bVal = 0;
              break;
            case 'date':
              aVal = new Date(a.updatedAt).getTime();
              bVal = new Date(b.updatedAt).getTime();
              break;
            default:
              return 0;
          }
          
          return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });
      }
      
      const apartments = filteredFlats.map(transformFlatToApartment);
      
      set({
        searchResults: filteredResults,
        searchResultsFlats: filteredFlats,
        searchResultsApartments: apartments,
        totalResults: filteredFlats.length,
        totalPages: Math.ceil(filteredFlats.length / get().limit),
        isSearching: false,
      });
      
      // Save to search history
      if (filters.query) {
        get().addToSearchHistory(filters.query);
      }
      get().saveRecentSearch(filters);
      
    } catch (error: any) {
      set({
        isSearching: false,
        searchError: error.message || 'Search failed',
      });
    }
  },

  // Perform advanced search with pagination
  performAdvancedSearch: async (page?: number) => {
    const { filters, limit, currentPage } = get();
    const pageToUse = page || currentPage;
    
    set({ isSearching: true, searchError: null });
    
    try {
      const searchParams: SearchRequest & { page: number; limit: number } = {
        query: filters.query || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rooms: filters.rooms?.length ? filters.rooms : undefined,
        categoryId: filters.categoryId,
        homeId: filters.homeId,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
        minFloor: filters.minFloor,
        maxFloor: filters.maxFloor,
        page: pageToUse,
        limit,
      };

      const response: PaginatedResponse<Home> = await advancedSearch(searchParams);
      
      // Extract flats from homes
      const flats: Flat[] = response.data.flatMap(home => home.flats || []);
      const apartments = flats.map(transformFlatToApartment);
      
      set({
        searchResults: response.data,
        searchResultsFlats: flats,
        searchResultsApartments: apartments,
        currentPage: pageToUse,
        totalPages: response.totalPages,
        totalResults: response.total,
        isSearching: false,
      });
      
      // Save to search history
      if (filters.query) {
        get().addToSearchHistory(filters.query);
      }
      get().saveRecentSearch(filters);
      
    } catch (error: any) {
      set({
        isSearching: false,
        searchError: error.message || 'Advanced search failed',
      });
    }
  },

  // Load filter options
  loadFilterOptions: async () => {
    set({ isLoadingFilters: true });
    
    try {
      const options = await getFilterOptions();
      
      // Add default finishing options for legacy compatibility
      const enhancedOptions: FilterOptions = {
        ...options,
        finishingTypes: ['Черновая', 'Чистовая', 'Под ключ'],
        floorRanges: [
          { min: 1, max: 5 },
          { min: 6, max: 10 },
          { min: 11, max: 20 },
          { min: 21, max: 50 },
        ],
      };
      
      set({
        filterOptions: enhancedOptions,
        isLoadingFilters: false,
      });
    } catch (error: any) {
      set({
        isLoadingFilters: false,
        searchError: error.message || 'Failed to load filter options',
      });
    }
  },

  // Pagination
  setPage: (page: number) => {
    set({ currentPage: page });
    get().performAdvancedSearch(page);
  },

  setLimit: (limit: number) => {
    set({ limit, currentPage: 1 });
    get().performAdvancedSearch(1);
  },

  // Search history
  addToSearchHistory: (query: string) => {
    if (!query.trim()) return;
    
    set(state => ({
      searchHistory: [
        query,
        ...state.searchHistory.filter(h => h !== query)
      ].slice(0, 10), // Keep only last 10 searches
    }));
  },

  saveRecentSearch: (filters: SearchFilters) => {
    // Only save non-empty searches
    if (!filters.query && !filters.minPrice && !filters.maxPrice && 
        (!filters.rooms || filters.rooms.length === 0)) {
      return;
    }
    
    set(state => ({
      recentSearches: [
        filters,
        ...state.recentSearches.filter(search => 
          JSON.stringify(search) !== JSON.stringify(filters)
        )
      ].slice(0, 5), // Keep only last 5 searches
    }));
  },

  clearSearchHistory: () => {
    set({
      searchHistory: [],
      recentSearches: [],
    });
  },

  // State management
  setSearchError: (searchError: string | null) => set({ searchError }),
  
  clearSearchResults: () => {
    set({
      searchResults: [],
      searchResultsFlats: [],
      searchResultsApartments: [],
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
    });
  },

  // Legacy compatibility - filter apartments from the properties store
  filterLegacyApartments: () => {
    const propertiesStore = usePropertiesStore.getState();
    const { filters } = get();
    
    let filtered = [...propertiesStore.apartments];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.complex.toLowerCase().includes(query) ||
        apt.address.toLowerCase().includes(query) ||
        (apt.description && apt.description.toLowerCase().includes(query))
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(apt => apt.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(apt => apt.price <= filters.maxPrice!);
    }

    if (filters.rooms && filters.rooms.length > 0) {
      filtered = filtered.filter(apt => filters.rooms!.includes(apt.rooms));
    }

    if (filters.bathrooms && filters.bathrooms.length > 0) {
      filtered = filtered.filter(apt => filters.bathrooms!.includes(apt.bathrooms));
    }

    if (filters.finishing && filters.finishing.length > 0) {
      filtered = filtered.filter(apt => filters.finishing!.includes(apt.finishing));
    }

    if (filters.minArea) {
      filtered = filtered.filter(apt => apt.area >= filters.minArea!);
    }
    
    if (filters.maxArea) {
      filtered = filtered.filter(apt => apt.area <= filters.maxArea!);
    }

    if (filters.hasParks !== undefined) {
      filtered = filtered.filter(apt => apt.hasParks === filters.hasParks);
    }

    if (filters.hasSchools !== undefined) {
      filtered = filtered.filter(apt => apt.hasSchools === filters.hasSchools);
    }

    if (filters.hasShops !== undefined) {
      filtered = filtered.filter(apt => apt.hasShops === filters.hasShops);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aVal: number, bVal: number;

        switch (filters.sortBy) {
          case 'price':
            aVal = a.price;
            bVal = b.price;
            break;
          case 'rooms':
            aVal = a.rooms;
            bVal = b.rooms;
            break;
          case 'area':
            aVal = a.area;
            bVal = b.area;
            break;
          case 'location':
            aVal = a.distanceFromCenter || 0;
            bVal = b.distanceFromCenter || 0;
            break;
          default:
            return 0;
        }

        return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    set({
      searchResultsApartments: filtered,
      totalResults: filtered.length,
      totalPages: Math.ceil(filtered.length / get().limit),
    });
  },
}));

// Export selectors for easier use
export const useSearchFilters = () => useSearchStore(state => state.filters);
export const useSearchResults = () => useSearchStore(state => ({
  homes: state.searchResults,
  flats: state.searchResultsFlats,
  apartments: state.searchResultsApartments,
}));
export const useSearchLoading = () => useSearchStore(state => state.isSearching);
export const useSearchError = () => useSearchStore(state => state.searchError);
export const useFilterOptions = () => useSearchStore(state => state.filterOptions);
export const useSearchPagination = () => useSearchStore(state => ({
  currentPage: state.currentPage,
  totalPages: state.totalPages,
  totalResults: state.totalResults,
  limit: state.limit,
}));
export const useSearchHistory = () => useSearchStore(state => ({
  searchHistory: state.searchHistory,
  recentSearches: state.recentSearches,
}));
export const useQuickFilters = () => useSearchStore(state => state.quickFilters);