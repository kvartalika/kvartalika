import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

export interface Apartment {
  id: number;
  complex: string;
  complexId: number;
  address: string;
  rooms: number;
  floor: number;
  bathrooms: number;
  bathroom: string;
  finishing: string;
  isHot: boolean;
  image: string;
  price: number;
  area: number;
  description?: string;
  images?: string[];
  floorPlan?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  viewers?: number;
  hasParks?: boolean;
  hasInfrastructure?: boolean;
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
  coordinates?: {
    lat: number;
    lng: number;
  };
  hasParks?: boolean;
  hasInfrastructure?: boolean;
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
  hasInfrastructure?: boolean;
  sortBy?: 'price' | 'rooms' | 'area' | 'distance';
  sortOrder?: 'asc' | 'desc';
  sortLocation?: {
    lat: number;
    lng: number;
  };
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

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager';
  createdAt: string;
}

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  message?: string;
  apartmentId?: number;
  complexId?: number;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager';
}

interface AppState {
  theme: Theme;
  apartments: Apartment[];
  complexes: Complex[];
  searchFilters: SearchFilters;
  filteredApartments: Apartment[];
  isLoading: boolean;
  selectedApartment: Apartment | null;
  selectedComplex: Complex | null;
  bookingForm: BookingForm;
  showBookingModal: boolean;
  admins: Admin[];
  inquiries: Inquiry[];
  
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
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
  setAdmins: (admins: Admin[]) => void;
  setInquiries: (inquiries: Inquiry[]) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt'>) => void;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'manager';
  }) => Promise<boolean>;
  hasRole: (role: 'admin' | 'manager') => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
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
  bathrooms: [],
  finishing: [],
  sortBy: 'price',
  sortOrder: 'asc',
};

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  return savedTheme || 'light';
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      apartments: [],
      complexes: [],
      searchFilters: initialSearchFilters,
      filteredApartments: [],
      isLoading: false,
      selectedApartment: null,
      selectedComplex: null,
      bookingForm: initialBookingForm,
      showBookingModal: false,
      admins: [],
      inquiries: [],
      user: null,
      isAuthenticated: false,

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

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

        if (searchFilters.hasInfrastructure !== undefined) {
          filtered = filtered.filter(apt => apt.hasInfrastructure === searchFilters.hasInfrastructure);
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
              case 'distance':
                if (searchFilters.sortLocation && a.coordinates && b.coordinates) {
                  aVal = calculateDistance(
                    searchFilters.sortLocation.lat,
                    searchFilters.sortLocation.lng,
                    a.coordinates.lat,
                    a.coordinates.lng
                  );
                  bVal = calculateDistance(
                    searchFilters.sortLocation.lat,
                    searchFilters.sortLocation.lng,
                    b.coordinates.lat,
                    b.coordinates.lng
                  );
                } else {
                  return 0;
                }
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

      setAdmins: (admins) => set({ admins }),
      setInquiries: (inquiries) => set({ inquiries }),
      
      addInquiry: (inquiry) => {
        const newInquiry: Inquiry = {
          ...inquiry,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          status: 'new'
        };
        set((state) => ({
          inquiries: [...state.inquiries, newInquiry]
        }));
      },

      login: async (email: string, password: string) => {
        const { admins } = get();
        
        const user = admins.find(admin => admin.email === email);
        
        if (user && password.length >= 6) {
          const authUser: AuthUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          };
          
          set({ 
            user: authUser, 
            isAuthenticated: true 
          });
          
          return true;
        }
        
        return false;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      register: async (userData) => {
        const { admins, setAdmins } = get();
        
        const existingUser = admins.find(admin => admin.email === userData.email);
        if (existingUser) {
          return false;
        }

        const newAdmin: Admin = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          role: userData.role,
          createdAt: new Date().toISOString()
        };

        setAdmins([...admins, newAdmin]);
        return true;
      },

      hasRole: (role: 'admin' | 'manager') => {
        const { user } = get();
        return user?.role === role || (role === 'manager' && user?.role === 'admin');
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isManager: () => {
        const { user } = get();
        return user?.role === 'manager' || user?.role === 'admin';
      }
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        admins: state.admins,
        inquiries: state.inquiries
      })
    }
  )
);

const store = useAppStore.getState();
applyTheme(store.theme);