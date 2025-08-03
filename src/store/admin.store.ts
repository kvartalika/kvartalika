import {create} from 'zustand';
import {
  addAdmin,
  addContentManager,
  createDirectory,
  deleteAdmin,
  deleteContentManager,
  deleteDirectory,
  deleteFile,
  downloadFile,
  type FileEntry,
  getAdmins,
  getContentManagers,
  getDirectory,
  getFile,
  listDirectories,
  listFilesInDir,
  type PaginationParams,
  updateAdmin,
  updateContentManager,
  uploadFile,
  type UserDto,
} from '../services';
import type {UserRole} from "./auth.store.ts";

export interface AdminState {
  contentManagers: UserDto[];
  admins: UserDto[];

  isLoadingContentManagers: boolean;
  isLoadingAdmins: boolean;

  directories: string[];

  currentPath: string[]
  currentDirectoryDirs: string[];
  currentDirectoryFiles: FileEntry[];

  isLoadingDirectories: boolean;
  isLoadingFiles: boolean;
  isUploadingFile: boolean;
  isManagingDirectory: boolean;

  error: string | null;
  fileError: string | null;
  directoryError: string | null;
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

  listDirectories: () => Promise<void>;
  getDirectory: (pathParts: string[]) => Promise<void>;
  createDirectory: (path: string[]) => Promise<void>;
  deleteDirectory: (pathParts: string[]) => Promise<void>;

  listFilesInDir: (dirParts: string[]) => Promise<void>;
  uploadFile: (dirParts: string[], file: File) => Promise<void>;
  downloadFile: (pathParts: string[]) => Promise<Blob | null>;
  getFile: (pathParts: string[]) => Promise<Blob | null>;
  deleteFile: (pathParts: string[]) => Promise<void>;

  setCurrentPath: (pathParts: string[]) => void;

  setError: (error: string | null) => void;
  clearError: () => void;
  clearFileError: () => void;
  clearDirectoryError: () => void;
}

export const useAdminStore = create<AdminState & AdminActions>((set, get) => ({
  contentManagers: [],
  admins: [],

  isLoadingContentManagers: false,
  isLoadingAdmins: false,

  directories: [],
  currentPath: [],
  currentDirectoryDirs: [],
  currentDirectoryFiles: [],
  isLoadingDirectories: false,
  isLoadingFiles: false,
  isUploadingFile: false,
  isManagingDirectory: false,

  error: null,
  fileError: null,
  directoryError: null,

  setCurrentPath: (pathParts: string[]) => set({currentPath: pathParts}),

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

    const formalizedData = {
      ...managerData,
      role: 'CONTENT_MANAGER' as UserRole,
    };

    try {
      await addContentManager(formalizedData);
      await get().loadContentManagers();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add content manager',
      });
    }
  },

  editContentManager: async (email: string, managerData: Partial<UserDto>) => {
    set({error: null});

    const formalizedData = {
      ...managerData,
      role: 'CONTENT_MANAGER' as UserRole,
    };

    try {
      await updateContentManager(email, formalizedData);
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

    const formalizedData = {
      ...adminData,
      role: 'ADMIN' as UserRole,
    };

    try {
      await addAdmin(formalizedData);
      await get().loadAdmins();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add admin',
      });
    }
  },

  editAdmin: async (email: string, adminData: Partial<UserDto>) => {
    set({error: null});

    const formalizedData = {
      ...adminData,
      role: 'ADMIN' as UserRole,
    };

    try {
      await updateAdmin(email, formalizedData);
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

  listDirectories: async () => {
    set({isLoadingDirectories: true, directoryError: null});
    try {
      const dirsResponse = await listDirectories();
      const dirs = dirsResponse.directories;

      set({directories: dirs, isLoadingDirectories: false});
    } catch (e) {
      set({
        isLoadingDirectories: false,
        directoryError: e instanceof Error ? e.message : 'Failed to list directories',
      });
    }
  },

  getDirectory: async () => {
    set({isLoadingDirectories: true, directoryError: null});
    try {

      const contents = await getDirectory(get().currentPath);
      const children = contents.children;

      set({currentDirectoryDirs: children, isLoadingDirectories: false});
    } catch (e) {
      set({
        isLoadingDirectories: false,
        directoryError: e instanceof Error ? e.message : 'Failed to get directory',
      });
    }
  },

  createDirectory: async (pathParts: string[]) => {
    set({isManagingDirectory: true, directoryError: null});
    try {
      await createDirectory(pathParts);
      await get().listDirectories();
      set({isManagingDirectory: false});
    } catch (e) {
      set({
        isManagingDirectory: false,
        directoryError: e instanceof Error ? e.message : 'Failed to create directory'
      });
    }
  },

  deleteDirectory: async (pathParts: string[]) => {
    set({isManagingDirectory: true, directoryError: null});
    try {
      await deleteDirectory(pathParts);
      await get().listDirectories();
      set({isManagingDirectory: false});
    } catch (e) {
      set({
        isManagingDirectory: false,
        directoryError: e instanceof Error ? e.message : 'Failed to delete directory'
      });
    }
  },

  listFilesInDir: async (dirParts) => {
    set({isLoadingFiles: true, fileError: null});
    try {
      const filesResponses = await listFilesInDir(dirParts);
      const files = filesResponses.files.map(file => ({
        blob: file,
        name: file as unknown as string,
      }));

      set({currentDirectoryFiles: files, isLoadingFiles: false});
    } catch (e) {
      set({
        isLoadingFiles: false,
        fileError: e instanceof Error ? e.message : 'Failed to list files',
      });
    }
  },

  uploadFile: async (dirParts, file) => {
    set({isUploadingFile: true, fileError: null});
    try {
      await uploadFile(dirParts, file);
      await get().listFilesInDir(dirParts);
      set({isUploadingFile: false});
    } catch (e) {
      set({
        isUploadingFile: false,
        fileError: e instanceof Error ? e.message : 'Failed to upload file',
      });
    }
  },

  downloadFile: async (pathParts) => {
    try {
      return await downloadFile(pathParts);
    } catch (e) {
      set({fileError: e instanceof Error ? e.message : 'Failed to download file'});
      return null;
    }
  },

  getFile: async (pathParts) => {
    try {
      return await getFile(pathParts);
    } catch (e) {
      set({fileError: e instanceof Error ? e.message : 'Failed to get file'});
      return null;
    }
  },

  deleteFile: async (pathParts) => {
    set({isLoadingFiles: true, fileError: null});
    try {
      await deleteFile(pathParts);
      set({isLoadingFiles: false});
    } catch (e) {
      set({
        isLoadingFiles: false,
        fileError: e instanceof Error ? e.message : 'Failed to delete file',
      });
    }
  },

  setError: (error) => set({error}),
  clearError: () => set({error: null}),
  clearFileError: () => set({fileError: null}),
  clearDirectoryError: () => set({directoryError: null}),
}));