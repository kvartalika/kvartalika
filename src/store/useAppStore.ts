/**
 * Legacy compatibility layer for useAppStore
 * This file provides backward compatibility for the old useAppStore interface
 * while using the new modular store system underneath.
 */

import { create } from 'zustand';
import { usePropertiesStore } from './properties.store';
import { useSearchStore } from './search.store';
import { useUIStore } from './ui.store';

// Re-export types from legacy file for compatibility
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
}

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  type: 'hot_deals' | 'rooms' | 'custom';
  isVisible: boolean;
  order: number;
  rooms?: number;
  customFilter?: (apartments: Apartment[]) => Apartment[];
  backgroundColor?: 'white' | 'gray';
  linkText?: string;
  linkUrl?: string;
}

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

export const useAppStore = create<AppState>((set, get) => ({
  apartments: [],
  complexes: [],
  searchFilters: {
    query: '',
  },
  filteredApartments: [],
  isLoading: false,
  selectedApartment: null,
  selectedComplex: null,
  homepageSections: [],
  bookingForm: {
    name: '',
    phone: '',
    email: '',
  },
  showBookingModal: false,

  setApartments: (apartments) => {
    set({ apartments });
    // Also update the properties store
    const propertiesStore = usePropertiesStore.getState();
    // The properties store manages legacy data through refreshLegacyData
    propertiesStore.refreshLegacyData();
  },

  setComplexes: (complexes) => {
    set({ complexes });
    // Also update the properties store
    const propertiesStore = usePropertiesStore.getState();
    // The properties store manages legacy data through refreshLegacyData
    propertiesStore.refreshLegacyData();
  },

  setSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }));
    // Also update the search store
    const searchStore = useSearchStore.getState();
    searchStore.setFilters(filters);
  },

  filterApartments: () => {
    const { apartments, searchFilters } = get();
    let filtered = [...apartments];

    if (searchFilters.query) {
      filtered = filtered.filter(apt =>
        apt.complex.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        apt.address.toLowerCase().includes(searchFilters.query.toLowerCase())
      );
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(apt => apt.price >= searchFilters.minPrice!);
    }

    if (searchFilters.maxPrice) {
      filtered = filtered.filter(apt => apt.price <= searchFilters.maxPrice!);
    }

    if (searchFilters.rooms?.length) {
      filtered = filtered.filter(apt => searchFilters.rooms!.includes(apt.rooms));
    }

    if (searchFilters.bathrooms?.length) {
      filtered = filtered.filter(apt => searchFilters.bathrooms!.includes(apt.bathrooms));
    }

    if (searchFilters.finishing?.length) {
      filtered = filtered.filter(apt => searchFilters.finishing!.includes(apt.finishing));
    }

    if (searchFilters.complex) {
      filtered = filtered.filter(apt => apt.complex === searchFilters.complex);
    }

    set({ filteredApartments: filtered });
  },

  setSelectedApartment: (apartment) => {
    set({ selectedApartment: apartment });
    // Also update the properties store
    const propertiesStore = usePropertiesStore.getState();
    propertiesStore.setSelectedApartment(apartment);
  },

  setSelectedComplex: (complex) => {
    set({ selectedComplex: complex });
    // Also update the properties store
    const propertiesStore = usePropertiesStore.getState();
    propertiesStore.setSelectedComplex(complex);
  },

  setBookingForm: (form) => {
    set((state) => ({
      bookingForm: { ...state.bookingForm, ...form }
    }));
    // Also update the UI store
    const uiStore = useUIStore.getState();
    uiStore.setBookingForm(form);
  },

  setShowBookingModal: (show) => {
    set({ showBookingModal: show });
    // Also update the UI store
    const uiStore = useUIStore.getState();
    uiStore.setShowBookingModal(show);
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
    // Also update the UI store
    const uiStore = useUIStore.getState();
    uiStore.setLoading(loading);
  },

  resetBookingForm: () => {
    set({
      bookingForm: {
        name: '',
        phone: '',
        email: '',
      }
    });
    // Also update the UI store
    const uiStore = useUIStore.getState();
    uiStore.resetBookingForm();
  },

  setHomepageSections: (sections) => {
    set({ homepageSections: sections });
    // Also update the UI store
    const uiStore = useUIStore.getState();
    uiStore.setHomepageSections(sections);
  },

  updateHomepageSection: (id, updates) => {
    set((state) => ({
      homepageSections: state.homepageSections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      )
    }));
    // Also update the UI store
    const uiStore = useUIStore.getState();
    uiStore.updateHomepageSection(id, updates);
  },
}));