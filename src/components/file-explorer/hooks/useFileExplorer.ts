import {useCallback, useEffect, useState} from 'react';
import {useAdminStore, useUIStore} from '../../../store';


export interface FileExplorerState {
  currentDirectory: string[];
  setCurrentDirectory: (dirs: string[]) => void;
  directories: string[];
  files: string[];
  loadingDirs: boolean;
  loadingFiles: boolean;

  refreshDirs: () => Promise<void>;
  refreshFiles: () => Promise<void>;
  createDir: (name: string) => Promise<void>;
  deleteDir: (name: string) => Promise<void>;
  upload: (file: File) => Promise<void>;
  download: (path: string[]) => Promise<Blob | null>;
  deleteFile: (path: string[]) => Promise<void>;
}

export function useFileExplorer(): FileExplorerState {
  const {addNotification} = useUIStore.getState();
  const [currentDirectory, setCurrentDirectory] = useState<string[]>([]);
  const [loadingDirs, setLoadingDirs] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const {
    listDirectories,
    getDirectory,
    createDirectory,
    deleteDirectory,
    listFilesInDir,
    uploadFile,
    downloadFile,
    deleteFile,
    currentDirectoryFiles,
    directories
  } = useAdminStore.getState();

  const reloadDirs = useCallback(async () => {
    setLoadingDirs(true);
    try {
      await listDirectories();
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось загрузить папки'
      });
    } finally {
      setLoadingDirs(false);
    }
  }, [addNotification]);

  const loadCurrentDirectory = useCallback(async () => {
    setLoadingDirs(true);
    try {
      await getDirectory(currentDirectory);
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось открыть каталог'
      });
    } finally {
      setLoadingDirs(false);
    }
  }, [currentDirectory, addNotification]);

  const reloadFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      await listFilesInDir(currentDirectory);
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось загрузить файлы'
      });
    } finally {
      setLoadingFiles(false);
    }
  }, [currentDirectory, addNotification]);

  const createDir = useCallback(async (name: string) => {
    try {
      const path = [...currentDirectory, name]
      await createDirectory(path);
      await loadCurrentDirectory();
      addNotification({type: 'success', title: 'Создана папка', message: name});
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка создания',
        message: 'Не удалось создать папку'
      });
    }
  }, [currentDirectory, loadCurrentDirectory, addNotification]);

  const removeDir = useCallback(async (name: string) => {
    try {
      await deleteDirectory([name].concat(currentDirectory).filter(Boolean));
      await loadCurrentDirectory();
      addNotification({type: 'success', title: 'Удалено', message: name});
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось удалить папку'
      });
    }
  }, [currentDirectory, loadCurrentDirectory, addNotification]);

  const upload = useCallback(async (file: File) => {
    try {
      await uploadFile(currentDirectory, file);
      await reloadFiles();
      addNotification({
        type: 'success',
        title: 'Загружено',
        message: file.name
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось загрузить файл'
      });
    }
  }, [currentDirectory, reloadFiles, addNotification]);

  const download = useCallback(async (path: string[]) => {
    try {
      const blob = await downloadFile(path);
      addNotification({
        type: 'success',
        title: 'Скачано',
        message: path[path.length - 1]
      });
      return blob;
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось скачать файл'
      });
      return null;
    }
  }, [addNotification]);

  const removeFile = useCallback(async (path: string[]) => {
    try {
      await deleteFile(path);
      await reloadFiles();
      addNotification({
        type: 'success',
        title: 'Удалено',
        message: path[path.length - 1]
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Не удалось удалить файл'
      });
    }
  }, [reloadFiles, addNotification]);

  useEffect(() => {
    void reloadDirs();
  }, [reloadDirs]);

  useEffect(() => {
    if (currentDirectory.length >= 0) {
      void loadCurrentDirectory();
      void reloadFiles();
    }
  }, [currentDirectory, loadCurrentDirectory, reloadFiles]);

  return {
    directories,
    currentDirectory,
    setCurrentDirectory,
    files: currentDirectoryFiles,
    loadingDirs,
    loadingFiles,
    refreshDirs: loadCurrentDirectory,
    refreshFiles: reloadFiles,
    createDir,
    deleteDir: removeDir,
    upload,
    download,
    deleteFile: removeFile
  };
}