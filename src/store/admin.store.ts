import { create } from 'zustand';
import {
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../services/newApiService';
import type {
  ContentManager,
  Admin,
  UserDto,
  ApiResponse,
  PaginationParams,
} from '../services/api.types';

export interface AdminState {
  contentManagers: ContentManager[];
  admins: Admin[];
  
  isLoadingContentManagers: boolean;
  isLoadingAdmins: boolean;
  
  error: string | null;
}

export interface AdminActions {
  // Content Managers
  loadContentManagers: (params?: PaginationParams) => Promise<void>;
  addContentManager: (managerData: UserDto) => Promise<void>;
  editContentManager: (email: string, managerData: Partial<UserDto>) => Promise<void>;
  removeContentManager: (email: string) => Promise<void>;
  
  // Admins
  loadAdmins: (params?: PaginationParams) => Promise<void>;
  addAdmin: (adminData: UserDto) => Promise<void>;
  editAdmin: (email: string, adminData: Partial<UserDto>) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  
  // General
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState & AdminActions>((set, get) => ({
  contentManagers: [],
  admins: [],
  
  isLoadingContentManagers: false,
  isLoadingAdmins: false,
  
  error: null,

  // Content Managers
  loadContentManagers: async (params?: PaginationParams) => {
    set({ isLoadingContentManagers: true, error: null });
    
    try {
      const managers = await getContentManagers(params);
      set({
        contentManagers: managers,
        isLoadingContentManagers: false,
      });
    } catch (error) {
      set({
        isLoadingContentManagers: false,
        error: error instanceof Error ? error.message : 'Failed to load content managers',
      });
    }
  },

  addContentManager: async (managerData: UserDto) => {
    set({ error: null });
    
    try {
      await createContentManager(managerData);
      // Reload the list after adding
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add content manager',
      });
    }
  },

  editContentManager: async (email: string, managerData: Partial<UserDto>) => {
    set({ error: null });
    
    try {
      await updateContentManager(email, managerData);
      // Reload the list after updating
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update content manager',
      });
    }
  },

  removeContentManager: async (email: string) => {
    set({ error: null });
    
    try {
      await deleteContentManager(email);
      // Reload the list after deleting
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete content manager',
      });
    }
  },

  // Admins
  loadAdmins: async (params?: PaginationParams) => {
    set({ isLoadingAdmins: true, error: null });
    
    try {
      const admins = await getAdmins(params);
      set({
        admins: admins,
        isLoadingAdmins: false,
      });
    } catch (error) {
      set({
        isLoadingAdmins: false,
        error: error instanceof Error ? error.message : 'Failed to load admins',
      });
    }
  },

  addAdmin: async (adminData: UserDto) => {
    set({ error: null });
    
    try {
      await createAdmin(adminData);
      // Reload the list after adding
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add admin',
      });
    }
  },

  editAdmin: async (email: string, adminData: Partial<UserDto>) => {
    set({ error: null });
    
    try {
      await updateAdmin(email, adminData);
      // Reload the list after updating
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update admin',
      });
    }
  },

  removeAdmin: async (email: string) => {
    set({ error: null });
    
    try {
      await deleteAdmin(email);
      // Reload the list after deleting
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete admin',
      });
    }
  },

  // General
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));