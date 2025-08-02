import {create} from 'zustand';
import {persist} from "zustand/middleware";

import type {RequestCreate} from '../services';
import {
  addSocialMedia,
  createRequest,
  deleteSocialMedia,
  getPageInfo,
  getSocialMedia,
  updatePageInfo,
  updateSocialMedia
} from '../services';

export interface BidForm {
  id?: number;
  name?: string;
  surname?: string;
  patronymic?: string;
  phone?: string;
  email?: string;
  createdAt: number;
  isChecked: boolean;
}

export interface PageInfo {
  phone?: string;
  email?: string;
  footerDescription?: string;
  title?: string;
  address?: string
  description?: string;
  published?: boolean;
}

export interface SocialMedia {
  id?: number;
  image?: string;
  link?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

export interface UIState {
  modals: {
    bid: boolean;
    manager: boolean;
    gallery: boolean;
    filters: boolean;
    login: boolean;
    register: boolean;
    imagePreview: boolean;
    confirmDialog: boolean;

    mainPage: boolean;
    social: boolean;
    bidManager: boolean
  };

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

  bidForm: BidForm;

  loading: {
    global: boolean;
    bid: boolean;
    upload: boolean;
  };

  pageInfo: PageInfo;
  socialMediaList: SocialMedia[];

  notifications: Notification[];

  errors: {
    [key: string]: string | null;
  };
}

export interface UIActions {
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;

  openGallery: (images: string[], index?: number) => void;
  setGalleryIndex: (index: number) => void;

  openImagePreview: (image: string) => void;

  showConfirmDialog: (config: UIState['modalData']['confirmDialog']) => void;
  hideConfirmDialog: () => void;

  // Bid form
  setBidForm: (form: Partial<BidForm>) => void;
  resetBidForm: () => void;
  submitBid: () => Promise<boolean>;

  // Loading states
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;

  // Homepage
  loadPageInfo: () => Promise<void>;
  updatePageInfo: (newPageInfo: PageInfo) => Promise<void>;

  //Media
  loadSocialMediaList: () => Promise<void>;
  updateSocialMediaList: (list: SocialMedia[]) => Promise<void>;
  addSocialMediaList: (media: SocialMedia) => Promise<void>;
  deleteSocialMediaList: (id: number) => Promise<void>;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;
}

const initialBidForm: BidForm = {
  name: '',
  surname: '',
  patronymic: '',
  phone: '',
  email: '',
  createdAt: Date.now(),
  isChecked: false,
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<
  UIState & UIActions
>()(
  persist((set, get) => ({
      modals: {
        bid: false,
        manager: false,
        gallery: false,
        filters: false,
        login: false,
        register: false,
        imagePreview: false,
        confirmDialog: false,

        mainPage: false,
        social: false,
        bidManager: false
      },

      modalData: {},

      bidForm: initialBidForm,

      pageInfo: {
        phone: '',
        email: '',
        footerDescription: '',
        title: '',
        address: '',
        description: '',
        published: true
      },
      socialMediaList: [],

      loading: {
        global: false,
        bid: false,
        upload: false,
      },

      notifications: [],

      errors: {},

      openModal: (modal, data) => {
        set(state => ({
          modals: {...state.modals, [modal]: true},
          modalData: data ? {...state.modalData, ...data} : state.modalData,
        }));
      },

      closeModal: (modal) => {
        set(state => ({
          modals: {...state.modals, [modal]: false},
        }));
      },

      loadPageInfo: async () => {
        const {setLoading, addNotification} = get();
        setLoading('global', true);
        try {
          const info = await getPageInfo();
          set({pageInfo: info});
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось загрузить настройки страницы',
            duration: 2500,
          });
        } finally {
          setLoading('global', false);
        }
      },

      loadSocialMediaList: async () => {
        const {setLoading, addNotification} = get();
        setLoading('global', true);
        try {
          const list = await getSocialMedia();
          set({socialMediaList: list});
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось загрузить соцсети',
            duration: 2500,
          });
        } finally {
          setLoading('global', false);
        }
      },

      updateSocialMediaList: async (list: SocialMedia[]) => {
        const {setLoading, addNotification} = get();
        setLoading('upload', true);

        try {
          await updateSocialMedia(list);
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось обновить медиа',
            duration: 2500,
          });
        } finally {
          setLoading('upload', false);
        }
      },

      addSocialMediaList: async (media: SocialMedia) => {
        const {setLoading, addNotification} = get();
        setLoading('upload', true);

        try {
          await addSocialMedia(media);
          set({socialMediaList: [...get().socialMediaList, media]});
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось обновить медиа',
            duration: 2500,
          });
        } finally {
          setLoading('upload', false);
        }
      },

      deleteSocialMediaList: async (id: number) => {
        const {setLoading, addNotification} = get();
        setLoading('upload', true);

        try {
          await deleteSocialMedia(id);
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось удалить медиа',
            duration: 2500,
          });
        } finally {
          setLoading('upload', false);
        }
      },

      updatePageInfo: async (newPageInfo: PageInfo) => {
        const {setLoading, addNotification} = get();
        setLoading('upload', true);

        try {
          await updatePageInfo(newPageInfo);
          set({pageInfo: newPageInfo})
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка',
            message: 'Не удалось обновить настройки страницы',
            duration: 2500,
          });
        } finally {
          setLoading('upload', false);
        }
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
          modals: {...state.modals, gallery: true},
          modalData: {
            ...state.modalData,
            galleryImages: images,
            galleryIndex: index
          },
        }));
      },

      setGalleryIndex: (index) => {
        set(state => ({
          modalData: {...state.modalData, galleryIndex: index},
        }));
      },

      // Image preview
      openImagePreview: (image) => {
        set(state => ({
          modals: {...state.modals, imagePreview: true},
          modalData: {...state.modalData, previewImage: image},
        }));
      },

      // Confirm dialog
      showConfirmDialog: (config) => {
        set(state => ({
          modals: {...state.modals, confirmDialog: true},
          modalData: {...state.modalData, confirmDialog: config},
        }));
      },

      hideConfirmDialog: () => {
        set(state => ({
          modals: {...state.modals, confirmDialog: false},
          modalData: {...state.modalData, confirmDialog: undefined},
        }));
      },

      // bid form
      setBidForm: (form) => {
        set(state => ({
          bidForm: {...state.bidForm, ...form},
        }));
      },

      resetBidForm: () => {
        set({bidForm: initialBidForm});
      },

      submitBid: async () => {
        const {bidForm, addNotification, setLoading} = get();

        setLoading('bid', true);

        try {
          const requestData: RequestCreate = {
            name: bidForm.name,
            surname: bidForm.surname,
            patronymic: bidForm.patronymic,
            phone: bidForm.phone,
            email: bidForm.email,
          };

          await createRequest(requestData);

          addNotification({
            type: 'success',
            title: 'Заявка принята!',
            message: 'С вами свяжутся в течение 2-х рабочих дней',
            duration: 3500,
          });

          get().resetBidForm();
          setTimeout(() => get().closeModal('bid'), 3500);
          setLoading('bid', false);

          return true;
        } catch {
          addNotification({
            type: 'error',
            title: 'Ошибка отправки',
            message: 'Не удалось отправить заявку',
            duration: 1500,
          });

          setLoading('bid', false);
          return false;
        }
      },

      setLoading: (key, loading) => {
        set(state => ({
          loading: {...state.loading, [key]: loading},
        }));
      },

      addNotification: (notification) => {
        const id = generateId();
        const newNotification: Notification = {
          id,
          duration: 5000,
          ...notification,
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

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
        set({notifications: []});
      },

      setError: (key, error) => {
        set(state => ({
          errors: {...state.errors, [key]: error},
        }));
      },

      clearErrors: () => {
        set({errors: {}});
      }
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        modals: state.modals,
        bidForm: state.bidForm,
        socialMediaList: state.socialMediaList,
        pageInfo: state.pageInfo,
        loading: state.loading
      }),
    }
  )
);