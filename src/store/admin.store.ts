import {create} from 'zustand';
import {
  addAdmin,
  addContentManager, deleteAdmin, deleteContentManager, getAdmins,
  getContentManagers,
  type PaginationParams, updateAdmin, updateContentManager, type UserDto,
} from '../services';

export interface AdminState {
  contentManagers: UserDto[];
  admins: UserDto[];

  isLoadingContentManagers: boolean;
  isLoadingAdmins: boolean;

  error: string | null;
}

export interface AdminActions {
  loadContentManagers: (params?: PaginationParams) => Promise<void>;
  addContentManager: (managerData: UserDto) => Promise<void>;
  editContentManager: (email: string, managerData: Partial<UserDto>) => Promise<void>;
  removeContentManager: (email: string) => Promise<void>;

  loadAdmins: (params?: PaginationParams) => Promise<void>;
  addAdmin: (adminData: UserDto) => Promise<void>;
  editAdmin: (email: string, adminData: Partial<UserDto>) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;

  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState & AdminActions>((set, get) => ({
  contentManagers: [],
  admins: [],

  isLoadingContentManagers: false,
  isLoadingAdmins: false,

  error: null,

  loadContentManagers: async (params?: PaginationParams) => {
    set({isLoadingContentManagers: true, error: null});

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
    set({error: null});

    try {
      await addContentManager(managerData);
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add content manager',
      });
    }
  },

  editContentManager: async (email: string, managerData: Partial<UserDto>) => {
    set({error: null});

    try {
      await updateContentManager(email, managerData);
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update content manager',
      });
    }
  },

  removeContentManager: async (email: string) => {
    set({error: null});

    try {
      await deleteContentManager(email);
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete content manager',
      });
    }
  },

  loadAdmins: async (params?: PaginationParams) => {
    set({isLoadingAdmins: true, error: null});

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
    set({error: null});

    try {
      await addAdmin(adminData);
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add admin',
      });
    }
  },

  editAdmin: async (email: string, adminData: Partial<UserDto>) => {
    set({error: null});

    try {
      await updateAdmin(email, adminData);
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update admin',
      });
    }
  },

  removeAdmin: async (email: string) => {
    set({error: null});

    try {
      await deleteAdmin(email);
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete admin',
      });
    }
  },

  setError: (error: string | null) => set({error}),
  clearError: () => set({error: null}),
}));