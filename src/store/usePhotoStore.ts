import {create} from 'zustand';
import {
  type FlatWithCategoryRequest,
  getFile,
  type HomeRequest,
  type ResolvedFlat,
  type ResolvedHome
} from '../services';
import {preloadPhotos} from "../utils/photoPreloader.ts";

interface CacheEntry {
  url: string;
  lastAccess: number;
  createdAt: number;
}

interface PhotoState {
  cache: Record<string, CacheEntry>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  maxCacheSize: number;
  ttl: number;

  loadPhoto: (path: string) => Promise<string | null>;
  loadPhotos: (paths: string[]) => Promise<Record<string, string | null>>;
  clearPhoto: (path: string) => void;
  clearAll: () => void;
  prune: () => void;
  touchEntry: (path: string) => void;

  processFlat: (flat: FlatWithCategoryRequest) => Promise<ResolvedFlat>;
  processHome: (home: HomeRequest) => Promise<ResolvedHome>;
}

const DEFAULT_MAX_CACHE = 100;
const DEFAULT_TTL = 1000 * 60 * 5;

export const usePhotoStore = create<PhotoState>((set, get) => ({
  cache: {},
  loading: {},
  error: {},
  maxCacheSize: DEFAULT_MAX_CACHE,
  ttl: DEFAULT_TTL,

  processFlat: async (flat: FlatWithCategoryRequest) => {
    const flatWithResolved = await preloadPhotos(flat.flat, {
      images: 'array',
      layout: 'single',
    });

    return {
      flat: flatWithResolved,
      categories: flat.categories
    };
  },

  processHome: async (home: HomeRequest) => {
    return await preloadPhotos(home, {
      images: 'array',
      historyImages: 'array',
      yardsImages: 'array',
    });
  },

  touchEntry: (path: string) => {
    set(state => {
      const entry = state.cache[path];
      if (!entry) return {};
      return {
        cache: {
          ...state.cache,
          [path]: {...entry, lastAccess: Date.now()},
        }
      };
    });
  },

  loadPhoto: async (path) => {
    const {cache, loading} = get();

    get().prune();

    if (cache[path]) {
      get().touchEntry(path);
      return cache[path].url;
    }
    if (loading[path]) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const c = get().cache[path];
          if (c) {
            clearInterval(interval);
            get().touchEntry(path);
            resolve(c.url);
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

      set(state => {
        const newCache = {
          ...state.cache,
          [path]: {
            url: objectURL,
            lastAccess: Date.now(),
            createdAt: Date.now(),
          }
        };


        const keys = Object.keys(newCache);
        if (keys.length > state.maxCacheSize) {
          const sorted = keys
            .map(k => ({key: k, lastAccess: newCache[k].lastAccess}))
            .sort((a, b) => a.lastAccess - b.lastAccess);
          const toRemove = sorted.slice(0, keys.length - state.maxCacheSize);
          toRemove.forEach(r => {
            URL.revokeObjectURL(newCache[r.key].url);
            delete newCache[r.key];
          });
        }

        return {
          cache: newCache,
          loading: {...state.loading, [path]: false},
        };
      });

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
        results[p] = await get().loadPhoto(p);
      })
    );
    return results;
  },

  clearPhoto: (path) => {
    const {cache} = get();
    if (cache[path]) {
      URL.revokeObjectURL(cache[path].url);
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
    Object.values(cache).forEach(entry => URL.revokeObjectURL(entry.url));
    set({
      cache: {},
      loading: {},
      error: {},
    });
  },

  prune: () => {
    const {cache, ttl} = get();
    const now = Date.now();
    const newCache = {...cache};
    Object.entries(cache).forEach(([key, entry]) => {
      if (now - entry.lastAccess > ttl) {
        URL.revokeObjectURL(entry.url);
        delete newCache[key];
      }
    });
    if (Object.keys(newCache).length !== Object.keys(cache).length) {
      set({cache: newCache});
    }
  },
}));