import {create} from 'zustand';
import {getFile} from '../services';

interface PhotoState {
  cache: Record<string, string>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  loadPhoto: (path: string) => Promise<string | null>;
  loadPhotos: (paths: string[]) => Promise<Record<string, string | null>>;
  clearPhoto: (path: string) => void;
  clearAll: () => void;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  cache: {},
  loading: {},
  error: {},

  loadPhoto: async (path) => {
    const {cache, loading} = get();
    if (cache[path]) return cache[path];
    if (loading[path]) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const c = get().cache[path];
          if (c) {
            clearInterval(interval);
            resolve(c);
          }
          if (get().error[path]) {
            clearInterval(interval);
            resolve(null);
          }
        }, 50);
      });
    }

    set(state => ({
      loading: {...state.loading, [path]: true},
      error: {...state.error, [path]: null},
    }));

    try {
      const blob = await getFile([path]);
      if (!blob) throw new Error('No blob returned');
      const objectURL = URL.createObjectURL(blob);
      set(state => ({
        cache: {...state.cache, [path]: objectURL},
        loading: {...state.loading, [path]: false},
      }));
      return objectURL;
    } catch {
      set(state => ({
        error: {...state.error, [path]: 'Failed to load'},
        loading: {...state.loading, [path]: false},
      }));
      return null;
    }
  },

  loadPhotos: async (paths) => {
    const results: Record<string, string | null> = {};
    await Promise.all(
      paths.map(async (p) => {
        const url = await get().loadPhoto(p);
        results[p] = url;
      })
    );
    return results;
  },

  clearPhoto: (path) => {
    const {cache} = get();
    if (cache[path]) {
      URL.revokeObjectURL(cache[path]);
    }
    set(state => {
      const newCache = {...state.cache};
      delete newCache[path];
      const newLoading = {...state.loading};
      delete newLoading[path];
      const newError = {...state.error};
      delete newError[path];
      return {
        cache: newCache,
        loading: newLoading,
        error: newError,
      };
    });
  },

  clearAll: () => {
    const {cache} = get();
    Object.values(cache).forEach(url => URL.revokeObjectURL(url));
    set({
      cache: {},
      loading: {},
      error: {},
    });
  },
}));