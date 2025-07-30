import { create } from 'zustand';

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
  distanceFromCenter?: number; // For location sorting
  layout?: string; // Layout image URL
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

export interface SearchFilters {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number[];
  bathrooms?: number[];
  finishing?: string[];
  complex?: string;
  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;
  sortBy?: 'price' | 'rooms' | 'area' | 'location';
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

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  type: 'hot_deals' | 'rooms' | 'custom';
  isVisible: boolean;
  order: number;
  rooms?: number; // For room-specific sections
  customFilter?: (apartments: Apartment[]) => Apartment[];
  backgroundColor?: 'white' | 'gray';
  linkText?: string;
  linkUrl?: string;
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
  
  // Homepage
  homepageSections: HomepageSection[];
  
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
  setHomepageSections: (sections: HomepageSection[]) => void;
  updateHomepageSection: (id: string, updates: Partial<HomepageSection>) => void;
}

const initialBookingForm: BookingForm = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

const defaultHomepageSections: HomepageSection[] = [
  {
    id: 'hot_deals',
    title: '🔥 Новинки',
    description: 'Новые поступления и горячие предложения',
    type: 'hot_deals',
    isVisible: true,
    order: 1,
    backgroundColor: 'white',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?hot=true',
  },
  {
    id: 'by_complex_yantar',
    title: 'ЖК Янтарный',
    description: 'Квартиры в жилом комплексе Янтарный',
    type: 'custom',
    customFilter: (apartments) => apartments.filter(apt => apt.complex === 'ЖК Янтарный'),
    isVisible: true,
    order: 2,
    backgroundColor: 'gray',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?complex=' + encodeURIComponent('ЖК Янтарный'),
  },
  {
    id: 'by_complex_nizhniy',
    title: 'ЖК Нижний',
    description: 'Квартиры в жилом комплексе Нижний',
    type: 'custom',
    customFilter: (apartments) => apartments.filter(apt => apt.complex === 'ЖК Нижний'),
    isVisible: true,
    order: 3,
    backgroundColor: 'white',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?complex=' + encodeURIComponent('ЖК Нижний'),
  },
  {
    id: 'by_finishing_ready',
    title: 'С готовой отделкой',
    description: 'Квартиры с чистовой отделкой и под ключ',
    type: 'custom',
    customFilter: (apartments) => apartments.filter(apt => apt.finishing === 'Чистовая' || apt.finishing === 'Под ключ'),
    isVisible: true,
    order: 4,
    backgroundColor: 'gray',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?finishing=' + encodeURIComponent('Чистовая') + ',' + encodeURIComponent('Под ключ'),
  },
  {
    id: 'three_rooms',
    title: '3-комнатные квартиры',
    description: 'Просторные квартиры для больших семей',
    type: 'rooms',
    rooms: 3,
    isVisible: true,
    order: 5,
    backgroundColor: 'white',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?rooms=3',
  },
];

const initialSearchFilters: SearchFilters = {
  query: '',
  rooms: [],
  bathrooms: [],
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
  homepageSections: defaultHomepageSections,
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

    // Bathrooms filter
    if (searchFilters.bathrooms && searchFilters.bathrooms.length > 0) {
      filtered = filtered.filter(apt => searchFilters.bathrooms!.includes(apt.bathrooms));
    }

    // Finishing filter
    if (searchFilters.finishing && searchFilters.finishing.length > 0) {
      filtered = filtered.filter(apt => searchFilters.finishing!.includes(apt.finishing));
    }

    // Complex filter
    if (searchFilters.complex) {
      filtered = filtered.filter(apt => apt.complex === searchFilters.complex);
    }

    // Parks filter
    if (searchFilters.hasParks !== undefined) {
      filtered = filtered.filter(apt => apt.hasParks === searchFilters.hasParks);
    }

    // Schools filter
    if (searchFilters.hasSchools !== undefined) {
      filtered = filtered.filter(apt => apt.hasSchools === searchFilters.hasSchools);
    }

    // Shops filter
    if (searchFilters.hasShops !== undefined) {
      filtered = filtered.filter(apt => apt.hasShops === searchFilters.hasShops);
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
          case 'location':
            aVal = a.distanceFromCenter || 0;
            bVal = b.distanceFromCenter || 0;
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
  
  setHomepageSections: (sections) => set({ homepageSections: sections }),
  
  updateHomepageSection: (id, updates) => {
    set((state) => ({
      homepageSections: state.homepageSections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      )
    }));
  },
}));