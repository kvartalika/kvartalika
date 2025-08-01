import { create } from 'zustand';
import { 
  getAdmins, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin,
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager
} from '../services/newApi.service';
import type { UserDto } from '../types';

export interface AdminState {
  admins: UserDto[];
  contentManagers: UserDto[];
  isLoading: boolean;
  error: string | null;
}

export interface AdminActions {
  // Admin management
  loadAdmins: () => Promise<void>;
  addAdmin: (userData: UserDto) => Promise<void>;
  editAdmin: (email: string, userData: Partial<UserDto>) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  
  // Content Manager management
  loadContentManagers: () => Promise<void>;
  addContentManager: (userData: UserDto) => Promise<void>;
  editContentManager: (email: string, userData: Partial<UserDto>) => Promise<void>;
  removeContentManager: (email: string) => Promise<void>;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState & AdminActions>((set, get) => ({
  admins: [],
  contentManagers: [],
  isLoading: false,
  error: null,

  // Admin management
  loadAdmins: async () => {
    set({ isLoading: true, error: null });
    try {
      const admins = await getAdmins();
      set({ admins, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addAdmin: async (userData: UserDto) => {
    set({ isLoading: true, error: null });
    try {
      const newAdmin = await createAdmin(userData);
      set(state => ({ 
        admins: [...state.admins, newAdmin], 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  editAdmin: async (email: string, userData: Partial<UserDto>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAdmin = await updateAdmin(email, userData);
      set(state => ({
        admins: state.admins.map(admin => 
          admin.email === email ? updatedAdmin : admin
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeAdmin: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteAdmin(email);
      set(state => ({
        admins: state.admins.filter(admin => admin.email !== email),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Content Manager management
  loadContentManagers: async () => {
    set({ isLoading: true, error: null });
    try {
      const contentManagers = await getContentManagers();
      set({ contentManagers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addContentManager: async (userData: UserDto) => {
    set({ isLoading: true, error: null });
    try {
      const newContentManager = await createContentManager(userData);
      set(state => ({ 
        contentManagers: [...state.contentManagers, newContentManager], 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  editContentManager: async (email: string, userData: Partial<UserDto>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedContentManager = await updateContentManager(email, userData);
      set(state => ({
        contentManagers: state.contentManagers.map(cm => 
          cm.email === email ? updatedContentManager : cm
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeContentManager: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteContentManager(email);
      set(state => ({
        contentManagers: state.contentManagers.filter(cm => cm.email !== email),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Utility
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));