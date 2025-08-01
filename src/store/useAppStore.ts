import {create} from 'zustand';
import type {
  Apartment,
  Complex,
  SearchFilters,
  BookingForm,
  HomepageSection,
} from '../types/unified';

interface AppState {
  apartments: Apartment[];
  complexes: Complex[];

  searchFilters: SearchFilters;
  filteredApartments: Apartment[];

  isLoading: boolean;
  selectedApartment: Apartment | null;
  selectedComplex: Complex | null;

  homepageSections: HomepageSection[];

  bookingForm: BookingForm;
  showBookingModal: boolean;

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

// TODO api

const initialBookingForm: BookingForm = {
  name: '',
  phone: '',
  email: '',
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

  setApartments: (apartments) => {
    set({apartments});
    get().filterApartments();
  },

  setComplexes: (complexes) => set({complexes}),

  setSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: {...state.searchFilters, ...filters}
    }));
    get().filterApartments();
  },

  filterApartments: () => {
    const {apartments, searchFilters} = get();
    let filtered = [...apartments];

    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.complex.toLowerCase().includes(query) ||
        apt.address.toLowerCase().includes(query)
      );
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(apt => apt.price >= searchFilters.minPrice!);
    }
    if (searchFilters.maxPrice) {
      filtered = filtered.filter(apt => apt.price <= searchFilters.maxPrice!);
    }

    if (searchFilters.rooms && searchFilters.rooms.length > 0) {
      filtered = filtered.filter(apt => searchFilters.rooms!.includes(apt.rooms));
    }

    if (searchFilters.bathrooms && searchFilters.bathrooms.length > 0) {
      filtered = filtered.filter(apt => searchFilters.bathrooms!.includes(apt.bathrooms));
    }

    if (searchFilters.finishing && searchFilters.finishing.length > 0) {
      filtered = filtered.filter(apt => searchFilters.finishing!.includes(apt.finishing));
    }

    if (searchFilters.complex) {
      filtered = filtered.filter(apt => apt.complex === searchFilters.complex);
    }

    if (searchFilters.hasParks !== undefined) {
      filtered = filtered.filter(apt => apt.hasParks === searchFilters.hasParks);
    }

    if (searchFilters.hasSchools !== undefined) {
      filtered = filtered.filter(apt => apt.hasSchools === searchFilters.hasSchools);
    }

    if (searchFilters.hasShops !== undefined) {
      filtered = filtered.filter(apt => apt.hasShops === searchFilters.hasShops);
    }

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

    set({filteredApartments: filtered});
  },

  setSelectedApartment: (apartment) => set({selectedApartment: apartment}),
  setSelectedComplex: (complex) => set({selectedComplex: complex}),
  setIsLoading: (loading) => set({isLoading: loading}),
  setShowBookingModal: (show) => set({showBookingModal: show}),

  setBookingForm: (form) => {
    set((state) => ({
      bookingForm: {...state.bookingForm, ...form}
    }));
  },

  resetBookingForm: () => set({bookingForm: initialBookingForm}),

  setHomepageSections: (sections) => set({homepageSections: sections}),

  updateHomepageSection: (id, updates) => {
    set((state) => ({
      homepageSections: state.homepageSections.map(section =>
        section.id === id ? {...section, ...updates} : section
      )
    }));
  },
}));