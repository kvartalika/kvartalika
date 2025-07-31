import { create } from 'zustand';
import { createRequest } from '../services';
import type { RequestCreate } from '../services';

export interface BookingForm {
  name: string;
  phone: string;
  email: string;
  message?: string;
  apartmentId?: number;
  complexId?: number;
  flatId?: number;
  homeId?: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 means persistent
  actions?: {
    label: string;
    action: () => void;
  }[];
}

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  type: 'hot_deals' | 'rooms' | 'custom';
  isVisible: boolean;
  order: number;
  rooms?: number;
  customFilter?: string; // JSON serialized filter function
  backgroundColor?: 'white' | 'gray';
  linkText?: string;
  linkUrl?: string;
}

export interface UIState {
  // Modal states
  modals: {
    booking: boolean;
    gallery: boolean;
    filters: boolean;
    login: boolean;
    register: boolean;
    contactForm: boolean;
    imagePreview: boolean;
    confirmDialog: boolean;
  };
  
  // Modal data
  modalData: {
    galleryImages?: string[];
    galleryIndex?: number;
    previewImage?: string;
    confirmDialog?: {
      title: string;
      message: string;
      onConfirm: () => void;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    };
  };
  
  // Forms
  bookingForm: BookingForm;
  contactForm: {
    name: string;
    email: string;
    phone: string;
    message: string;
    subject: string;
  };
  
  // Loading states
  loading: {
    global: boolean;
    booking: boolean;
    contact: boolean;
    upload: boolean;
  };
  
  // Notifications
  notifications: Notification[];
  
  // Homepage configuration
  homepageSections: HomepageSection[];
  
  // Layout and responsive
  layout: {
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
    headerHeight: number;
    footerHeight: number;
  };
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'auto';
  preferences: {
    showTutorial: boolean;
    autoSave: boolean;
    language: 'ru' | 'en';
    currency: 'RUB' | 'USD' | 'EUR';
    showPriceHistory: boolean;
  };
  
  // Error tracking
  errors: {
    [key: string]: string | null;
  };
}

export interface UIActions {
  // Modal actions
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  
  // Gallery actions
  openGallery: (images: string[], index?: number) => void;
  setGalleryIndex: (index: number) => void;
  
  // Image preview
  openImagePreview: (image: string) => void;
  
  // Confirm dialog
  showConfirmDialog: (config: UIState['modalData']['confirmDialog']) => void;
  hideConfirmDialog: () => void;
  
  // Booking form
  setBookingForm: (form: Partial<BookingForm>) => void;
  resetBookingForm: () => void;
  submitBooking: () => Promise<boolean>;
  
  // Contact form
  setContactForm: (form: Partial<UIState['contactForm']>) => void;
  resetContactForm: () => void;
  submitContactForm: () => Promise<boolean>;
  
  // Loading states
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Homepage sections
  setHomepageSections: (sections: HomepageSection[]) => void;
  updateHomepageSection: (id: string, updates: Partial<HomepageSection>) => void;
  reorderHomepageSections: (sections: HomepageSection[]) => void;
  
  // Layout
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
  
  // Theme and preferences
  setTheme: (theme: UIState['theme']) => void;
  setPreferences: (preferences: Partial<UIState['preferences']>) => void;
  
  // Error handling
  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;
}

const initialBookingForm: BookingForm = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

const initialContactForm: UIState['contactForm'] = {
  name: '',
  email: '',
  phone: '',
  message: '',
  subject: '',
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
    id: 'three_rooms',
    title: '3-комнатные квартиры',
    description: 'Просторные квартиры для больших семей',
    type: 'rooms',
    rooms: 3,
    isVisible: true,
    order: 2,
    backgroundColor: 'gray',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?rooms=3',
  },
  {
    id: 'two_rooms',
    title: '2-комнатные квартиры',
    description: 'Оптимальный выбор для небольшой семьи',
    type: 'rooms',
    rooms: 2,
    isVisible: true,
    order: 3,
    backgroundColor: 'white',
    linkText: 'Смотреть все',
    linkUrl: '/apartments?rooms=2',
  },
];

// Generate unique ID for notifications
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  // Initial state
  modals: {
    booking: false,
    gallery: false,
    filters: false,
    login: false,
    register: false,
    contactForm: false,
    imagePreview: false,
    confirmDialog: false,
  },
  
  modalData: {},
  
  bookingForm: initialBookingForm,
  contactForm: initialContactForm,
  
  loading: {
    global: false,
    booking: false,
    contact: false,
    upload: false,
  },
  
  notifications: [],
  
  homepageSections: defaultHomepageSections,
  
  layout: {
    sidebarOpen: false,
    mobileMenuOpen: false,
    headerHeight: 80,
    footerHeight: 200,
  },
  
  theme: 'light',
  preferences: {
    showTutorial: true,
    autoSave: true,
    language: 'ru',
    currency: 'RUB',
    showPriceHistory: false,
  },
  
  errors: {},

  // Modal actions
  openModal: (modal, data) => {
    set(state => ({
      modals: { ...state.modals, [modal]: true },
      modalData: data ? { ...state.modalData, ...data } : state.modalData,
    }));
  },

  closeModal: (modal) => {
    set(state => ({
      modals: { ...state.modals, [modal]: false },
    }));
  },

  closeAllModals: () => {
    set(state => ({
      modals: Object.keys(state.modals).reduce((acc, key) => ({
        ...acc,
        [key]: false,
      }), {} as UIState['modals']),
      modalData: {},
    }));
  },

  // Gallery actions
  openGallery: (images, index = 0) => {
    set(state => ({
      modals: { ...state.modals, gallery: true },
      modalData: { ...state.modalData, galleryImages: images, galleryIndex: index },
    }));
  },

  setGalleryIndex: (index) => {
    set(state => ({
      modalData: { ...state.modalData, galleryIndex: index },
    }));
  },

  // Image preview
  openImagePreview: (image) => {
    set(state => ({
      modals: { ...state.modals, imagePreview: true },
      modalData: { ...state.modalData, previewImage: image },
    }));
  },

  // Confirm dialog
  showConfirmDialog: (config) => {
    set(state => ({
      modals: { ...state.modals, confirmDialog: true },
      modalData: { ...state.modalData, confirmDialog: config },
    }));
  },

  hideConfirmDialog: () => {
    set(state => ({
      modals: { ...state.modals, confirmDialog: false },
      modalData: { ...state.modalData, confirmDialog: undefined },
    }));
  },

  // Booking form
  setBookingForm: (form) => {
    set(state => ({
      bookingForm: { ...state.bookingForm, ...form },
    }));
  },

  resetBookingForm: () => {
    set({ bookingForm: initialBookingForm });
  },

  submitBooking: async () => {
    const { bookingForm, addNotification, setLoading } = get();
    
    setLoading('booking', true);
    
    try {
      // Transform to API format
      const requestData: RequestCreate = {
        name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email,
        message: bookingForm.message || '',
        flatId: bookingForm.flatId || bookingForm.apartmentId,
        homeId: bookingForm.homeId || bookingForm.complexId,
      };

      await createRequest(requestData);
      
      addNotification({
        type: 'success',
        title: 'Заявка отправлена',
        message: 'Мы свяжемся с вами в ближайшее время',
        duration: 5000,
      });
      
      get().resetBookingForm();
      get().closeModal('booking');
      setLoading('booking', false);
      
      return true;
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Ошибка отправки',
        message: error.message || 'Не удалось отправить заявку',
        duration: 0, // Persistent error
      });
      
      setLoading('booking', false);
      return false;
    }
  },

  // Contact form
  setContactForm: (form) => {
    set(state => ({
      contactForm: { ...state.contactForm, ...form },
    }));
  },

  resetContactForm: () => {
    set({ contactForm: initialContactForm });
  },

  submitContactForm: async () => {
    const { contactForm, addNotification, setLoading } = get();
    
    setLoading('contact', true);
    
    try {
      // Transform to API format
      const requestData: RequestCreate = {
        name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        message: `${contactForm.subject}\n\n${contactForm.message}`,
      };

      await createRequest(requestData);
      
      addNotification({
        type: 'success',
        title: 'Сообщение отправлено',
        message: 'Мы ответим вам в ближайшее время',
        duration: 5000,
      });
      
      get().resetContactForm();
      get().closeModal('contactForm');
      setLoading('contact', false);
      
      return true;
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Ошибка отправки',
        message: error.message || 'Не удалось отправить сообщение',
        duration: 0,
      });
      
      setLoading('contact', false);
      return false;
    }
  },

  // Loading states
  setLoading: (key, loading) => {
    set(state => ({
      loading: { ...state.loading, [key]: loading },
    }));
  },

  // Notifications
  addNotification: (notification) => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      duration: 5000, // Default duration
      ...notification,
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Homepage sections
  setHomepageSections: (sections) => {
    set({ homepageSections: sections });
  },

  updateHomepageSection: (id, updates) => {
    set(state => ({
      homepageSections: state.homepageSections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  },

  reorderHomepageSections: (sections) => {
    // Update order numbers based on array position
    const reorderedSections = sections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));
    
    set({ homepageSections: reorderedSections });
  },

  // Layout
  setSidebarOpen: (sidebarOpen) => {
    set(state => ({
      layout: { ...state.layout, sidebarOpen },
    }));
  },

  setMobileMenuOpen: (mobileMenuOpen) => {
    set(state => ({
      layout: { ...state.layout, mobileMenuOpen },
    }));
  },

  setHeaderHeight: (headerHeight) => {
    set(state => ({
      layout: { ...state.layout, headerHeight },
    }));
  },

  setFooterHeight: (footerHeight) => {
    set(state => ({
      layout: { ...state.layout, footerHeight },
    }));
  },

  // Theme and preferences
  setTheme: (theme) => {
    set({ theme });
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  setPreferences: (preferences) => {
    set(state => ({
      preferences: { ...state.preferences, ...preferences },
    }));
  },

  // Error handling
  setError: (key, error) => {
    set(state => ({
      errors: { ...state.errors, [key]: error },
    }));
  },

  clearErrors: () => {
    set({ errors: {} });
  },
}));

// Export selectors for easier use
export const useModals = () => useUIStore(state => state.modals);
export const useModalData = () => useUIStore(state => state.modalData);
export const useBookingForm = () => useUIStore(state => state.bookingForm);
export const useContactForm = () => useUIStore(state => state.contactForm);
export const useLoading = () => useUIStore(state => state.loading);
export const useNotifications = () => useUIStore(state => state.notifications);
export const useHomepageSections = () => useUIStore(state => state.homepageSections);
export const useLayout = () => useUIStore(state => state.layout);
export const useTheme = () => useUIStore(state => state.theme);
export const usePreferences = () => useUIStore(state => state.preferences);
export const useErrors = () => useUIStore(state => state.errors);