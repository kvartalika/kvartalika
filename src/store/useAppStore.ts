import { create } from 'zustand';

export interface Apartment {
  id: number;
  complex: string;
  complexId: number;
  address: string;
  rooms: number;
  floor: number;
  bathroom: string;
  finishing: string;
  isHot: boolean;
  image: string;
  price: number;
  area: number;
  description?: string;
  images?: string[];
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
}

export interface SearchFilters {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number[];
  finishing?: string[];
  complex?: string;
  sortBy?: 'price' | 'rooms' | 'area';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingForm {
  name: string;
  phone: string;
  email: string;
  apartmentId?: number;
  complexId?: number;
  preferredDate?: string;
  message?: string;
}

interface AppState {
  // Data
  apartments: Apartment[];
  complexes: Complex[];
  
  // Search & Filters
  searchFilters: SearchFilters;
  filteredApartments: Apartment[];
  
  // UI State
  isLoading: boolean;
  selectedApartment: Apartment | null;
  selectedComplex: Complex | null;
  
  // Booking
  bookingForm: BookingForm;
  showBookingModal: boolean;
  
  // Actions
  setApartments: (apartments: Apartment[]) => void;
  setComplexes: (complexes: Complex[]) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  filterApartments: () => void;
  setSelectedApartment: (apartment: Apartment | null) => void;
  setSelectedComplex: (complex: Complex | null) => void;
  setBookingForm: (form: Partial<BookingForm>) => void;
  setShowBookingModal: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  resetBookingForm: () => void;
}

const initialBookingForm: BookingForm = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

const initialSearchFilters: SearchFilters = {
  query: '',
  rooms: [],
  finishing: [],
  sortBy: 'price',
  sortOrder: 'asc',
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  apartments: [],
  complexes: [],
  searchFilters: initialSearchFilters,
  filteredApartments: [],
  isLoading: false,
  selectedApartment: null,
  selectedComplex: null,
  bookingForm: initialBookingForm,
  showBookingModal: false,

  // Actions
  setApartments: (apartments) => {
    set({ apartments });
    get().filterApartments();
  },

  setComplexes: (complexes) => set({ complexes }),

  setSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }));
    get().filterApartments();
  },

  filterApartments: () => {
    const { apartments, searchFilters } = get();
    let filtered = [...apartments];

    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.complex.toLowerCase().includes(query) ||
        apt.address.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (searchFilters.minPrice) {
      filtered = filtered.filter(apt => apt.price >= searchFilters.minPrice!);
    }
    if (searchFilters.maxPrice) {
      filtered = filtered.filter(apt => apt.price <= searchFilters.maxPrice!);
    }

    // Rooms filter
    if (searchFilters.rooms && searchFilters.rooms.length > 0) {
      filtered = filtered.filter(apt => searchFilters.rooms!.includes(apt.rooms));
    }

    // Finishing filter
    if (searchFilters.finishing && searchFilters.finishing.length > 0) {
      filtered = filtered.filter(apt => searchFilters.finishing!.includes(apt.finishing));
    }

    // Complex filter
    if (searchFilters.complex) {
      filtered = filtered.filter(apt => apt.complex === searchFilters.complex);
    }

    // Sorting
    if (searchFilters.sortBy) {
      filtered.sort((a, b) => {
        let aVal: number, bVal: number;
        
        switch (searchFilters.sortBy) {
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
          default:
            return 0;
        }

        return searchFilters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    set({ filteredApartments: filtered });
  },

  setSelectedApartment: (apartment) => set({ selectedApartment: apartment }),
  setSelectedComplex: (complex) => set({ selectedComplex: complex }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setShowBookingModal: (show) => set({ showBookingModal: show }),

  setBookingForm: (form) => {
    set((state) => ({
      bookingForm: { ...state.bookingForm, ...form }
    }));
  },

  resetBookingForm: () => set({ bookingForm: initialBookingForm }),
}));