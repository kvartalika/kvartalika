import { create } from 'zustand';
import { 
  PublicService,
  getFlats,
  getHomes,
  getFlatById,
  getHomeById,
  getFlatsByHome,
  getHomesByCategory,
  getFeaturedHomes,
  getPopularFlats
} from '../services';
import type { Flat, Home, Photo, Category } from '../services';

// Legacy types for backward compatibility
export interface Apartment {
  id: number;
  complex: string;
  complexId: number;
  address: string;
  rooms: number;
  floor: number;
  bathroom: string;
  bathrooms: number;
  finishing: string;
  isHot: boolean;
  image: string;
  price: number;
  area: number;
  description?: string;
  images?: string[];
  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;
  distanceFromCenter?: number;
  layout?: string;
}

export interface Complex {
  id: number;
  name: string;
  address: string;
  description: string;
  image: string;
  images?: string[];
  apartments: Apartment[];
  amenities?: string[];
  features?: string[];
  constructionHistory?: {
    startDate: string;
    endDate: string;
    phases: { name: string; date: string; description: string }[];
  };
}

export interface PropertiesState {
  // API Data
  flats: Flat[];
  homes: Home[];
  
  // Legacy Data (transformed from API)
  apartments: Apartment[];
  complexes: Complex[];
  
  // Selected items
  selectedFlat: Flat | null;
  selectedHome: Home | null;
  selectedApartment: Apartment | null;
  selectedComplex: Complex | null;
  
  // Featured/Popular content
  featuredHomes: Home[];
  popularFlats: Flat[];
  
  // Loading states
  isLoading: boolean;
  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingFeatured: boolean;
  
  // Error handling
  error: string | null;
  
  // Cache metadata
  lastFetch: {
    flats: number | null;
    homes: number | null;
    featured: number | null;
  };
}

export interface PropertiesActions {
  // Data fetching
  fetchFlats: (force?: boolean) => Promise<void>;
  fetchHomes: (force?: boolean) => Promise<void>;
  fetchFeaturedContent: (force?: boolean) => Promise<void>;
  
  // Single item fetching
  fetchFlatById: (id: number) => Promise<Flat | null>;
  fetchHomeById: (id: number) => Promise<Home | null>;
  
  // Related data fetching
  fetchFlatsByHome: (homeId: number) => Promise<Flat[]>;
  fetchHomesByCategory: (categoryId: number) => Promise<Home[]>;
  
  // Selection actions
  setSelectedFlat: (flat: Flat | null) => void;
  setSelectedHome: (home: Home | null) => void;
  setSelectedApartment: (apartment: Apartment | null) => void;
  setSelectedComplex: (complex: Complex | null) => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Cache management
  invalidateCache: () => void;
  isDataStale: (type: 'flats' | 'homes' | 'featured') => boolean;
  
  // Legacy compatibility
  refreshLegacyData: () => void;
}

// Transform API data to legacy format
const transformFlatToApartment = (flat: Flat): Apartment => ({
  id: flat.id,
  complex: flat.home?.name || "Неизвестный комплекс",
  complexId: flat.homeId,
  address: flat.home?.address || "Адрес не указан",
  rooms: flat.rooms,
  floor: flat.floor,
  bathroom: "Совмещенный", // Default, could be enhanced with API data
  bathrooms: 1, // Default, could be enhanced with API data
  finishing: "Чистовая", // Default, could be enhanced with API data
  isHot: false, // Default, could be enhanced with API data
  image: flat.photos?.[0]?.url || "/images/default-apartment.jpg",
  price: flat.price,
  area: flat.area,
  description: flat.description,
  images: flat.photos?.map(photo => photo.url),
  hasParks: flat.home?.amenities?.includes("Парковка") || false,
  hasSchools: flat.home?.amenities?.includes("Школа") || false,
  hasShops: flat.home?.amenities?.includes("Магазины") || false,
  distanceFromCenter: 5.0, // Default, could be enhanced with API data
});

const transformHomeToComplex = (home: Home): Complex => ({
  id: home.id,
  name: home.name,
  address: home.address,
  description: home.description,
  image: home.photos?.[0]?.url || "/images/default-complex.jpg",
  images: home.photos?.map(photo => photo.url),
  apartments: home.flats?.map(transformFlatToApartment) || [],
  amenities: home.amenities || [],
  features: home.amenities || [], // Map amenities to features for compatibility
});

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const usePropertiesStore = create<PropertiesState & PropertiesActions>((set, get) => ({
  // Initial state
  flats: [],
  homes: [],
  apartments: [],
  complexes: [],
  
  selectedFlat: null,
  selectedHome: null,
  selectedApartment: null,
  selectedComplex: null,
  
  featuredHomes: [],
  popularFlats: [],
  
  isLoading: false,
  isLoadingFlats: false,
  isLoadingHomes: false,
  isLoadingFeatured: false,
  
  error: null,
  
  lastFetch: {
    flats: null,
    homes: null,
    featured: null,
  },

  // Check if data is stale
  isDataStale: (type: 'flats' | 'homes' | 'featured') => {
    const lastFetch = get().lastFetch[type];
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_DURATION;
  },

  // Fetch flats
  fetchFlats: async (force = false) => {
    const { isDataStale } = get();
    
    if (!force && !isDataStale('flats')) {
      return; // Use cached data
    }

    set({ isLoadingFlats: true, error: null });
    
    try {
      const flats = await getFlats();
      
      set(state => ({
        flats,
        isLoadingFlats: false,
        lastFetch: { ...state.lastFetch, flats: Date.now() },
      }));
      
      // Update legacy apartments
      get().refreshLegacyData();
    } catch (error: any) {
      set({
        isLoadingFlats: false,
        error: error.message || 'Failed to fetch flats',
      });
    }
  },

  // Fetch homes
  fetchHomes: async (force = false) => {
    const { isDataStale } = get();
    
    if (!force && !isDataStale('homes')) {
      return; // Use cached data
    }

    set({ isLoadingHomes: true, error: null });
    
    try {
      const homes = await getHomes();
      
      set(state => ({
        homes,
        isLoadingHomes: false,
        lastFetch: { ...state.lastFetch, homes: Date.now() },
      }));
      
      // Update legacy complexes
      get().refreshLegacyData();
    } catch (error: any) {
      set({
        isLoadingHomes: false,
        error: error.message || 'Failed to fetch homes',
      });
    }
  },

  // Fetch featured content
  fetchFeaturedContent: async (force = false) => {
    const { isDataStale } = get();
    
    if (!force && !isDataStale('featured')) {
      return; // Use cached data
    }

    set({ isLoadingFeatured: true, error: null });
    
    try {
      const [featuredHomes, popularFlats] = await Promise.all([
        getFeaturedHomes(6),
        getPopularFlats(8),
      ]);
      
      set(state => ({
        featuredHomes,
        popularFlats,
        isLoadingFeatured: false,
        lastFetch: { ...state.lastFetch, featured: Date.now() },
      }));
    } catch (error: any) {
      set({
        isLoadingFeatured: false,
        error: error.message || 'Failed to fetch featured content',
      });
    }
  },

  // Fetch single flat
  fetchFlatById: async (id: number) => {
    try {
      const flat = await getFlatById(id);
      
      // Update the flat in the store if it exists
      if (flat) {
        set(state => ({
          flats: state.flats.map(f => f.id === id ? flat : f),
        }));
        
        get().refreshLegacyData();
      }
      
      return flat;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch flat' });
      return null;
    }
  },

  // Fetch single home
  fetchHomeById: async (id: number) => {
    try {
      const home = await getHomeById(id);
      
      // Update the home in the store if it exists
      if (home) {
        set(state => ({
          homes: state.homes.map(h => h.id === id ? home : h),
        }));
        
        get().refreshLegacyData();
      }
      
      return home;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch home' });
      return null;
    }
  },

  // Fetch flats by home
  fetchFlatsByHome: async (homeId: number) => {
    try {
      const flats = await getFlatsByHome(homeId);
      
      // Update flats in the store
      set(state => {
        const updatedFlats = [...state.flats];
        flats.forEach(flat => {
          const existingIndex = updatedFlats.findIndex(f => f.id === flat.id);
          if (existingIndex >= 0) {
            updatedFlats[existingIndex] = flat;
          } else {
            updatedFlats.push(flat);
          }
        });
        
        return { flats: updatedFlats };
      });
      
      get().refreshLegacyData();
      return flats;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch flats by home' });
      return [];
    }
  },

  // Fetch homes by category
  fetchHomesByCategory: async (categoryId: number) => {
    try {
      const homes = await getHomesByCategory(categoryId);
      
      // Update homes in the store
      set(state => {
        const updatedHomes = [...state.homes];
        homes.forEach(home => {
          const existingIndex = updatedHomes.findIndex(h => h.id === home.id);
          if (existingIndex >= 0) {
            updatedHomes[existingIndex] = home;
          } else {
            updatedHomes.push(home);
          }
        });
        
        return { homes: updatedHomes };
      });
      
      get().refreshLegacyData();
      return homes;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch homes by category' });
      return [];
    }
  },

  // Selection actions
  setSelectedFlat: (flat: Flat | null) => {
    set({ selectedFlat: flat });
    
    // Update legacy selected apartment
    if (flat) {
      set({ selectedApartment: transformFlatToApartment(flat) });
    }
  },

  setSelectedHome: (home: Home | null) => {
    set({ selectedHome: home });
    
    // Update legacy selected complex
    if (home) {
      set({ selectedComplex: transformHomeToComplex(home) });
    }
  },

  setSelectedApartment: (apartment: Apartment | null) => {
    set({ selectedApartment: apartment });
    
    // Try to find corresponding flat
    if (apartment) {
      const flat = get().flats.find(f => f.id === apartment.id);
      set({ selectedFlat: flat || null });
    }
  },

  setSelectedComplex: (complex: Complex | null) => {
    set({ selectedComplex: complex });
    
    // Try to find corresponding home
    if (complex) {
      const home = get().homes.find(h => h.id === complex.id);
      set({ selectedHome: home || null });
    }
  },

  // State management
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  // Cache management
  invalidateCache: () => {
    set({
      lastFetch: {
        flats: null,
        homes: null,
        featured: null,
      },
    });
  },

  // Refresh legacy data from API data
  refreshLegacyData: () => {
    const { flats, homes } = get();
    
    const apartments = flats.map(transformFlatToApartment);
    const complexes = homes.map(transformHomeToComplex);
    
    set({ apartments, complexes });
  },
}));

// Export selectors for easier use
export const useFlats = () => usePropertiesStore(state => state.flats);
export const useHomes = () => usePropertiesStore(state => state.homes);
export const useApartments = () => usePropertiesStore(state => state.apartments);
export const useComplexes = () => usePropertiesStore(state => state.complexes);
export const useSelectedFlat = () => usePropertiesStore(state => state.selectedFlat);
export const useSelectedHome = () => usePropertiesStore(state => state.selectedHome);
export const useSelectedApartment = () => usePropertiesStore(state => state.selectedApartment);
export const useSelectedComplex = () => usePropertiesStore(state => state.selectedComplex);
export const useFeaturedHomes = () => usePropertiesStore(state => state.featuredHomes);
export const usePopularFlats = () => usePropertiesStore(state => state.popularFlats);
export const usePropertiesLoading = () => usePropertiesStore(state => ({
  isLoading: state.isLoading,
  isLoadingFlats: state.isLoadingFlats,
  isLoadingHomes: state.isLoadingHomes,
  isLoadingFeatured: state.isLoadingFeatured,
}));
export const usePropertiesError = () => usePropertiesStore(state => state.error);