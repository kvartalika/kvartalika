import {usePhotoStore} from '../store/usePhotoStore';

type PhotoFieldMap<T> = {
  [K in keyof T]?: 'single' | 'array';
};

type ResolvedPhotos<T, M extends PhotoFieldMap<T>> = {
  [K in keyof M as M[K] extends 'array'
    ? `${string & K}Resolved`
    : M[K] extends 'single'
      ? `${string & K}Resolved`
      : never]: M[K] extends 'array' ? string[] : M[K] extends 'single' ? string | null : never;
};

export async function preloadPhotos<
  T,
  M extends PhotoFieldMap<T>
>(
  item: T,
  fieldMap: M
): Promise<T & ResolvedPhotos<T, M>> {
  const photoStore = usePhotoStore.getState();

  const paths: string[] = [];
  for (const key in fieldMap) {
    const mode = fieldMap[key];
    if (!mode) continue;
    const val = item[key as unknown as keyof T];
    if (!val) continue;

    if (mode === 'array' && Array.isArray(val)) {
      paths.push(...val.filter((v): v is string => typeof v === 'string'));
    } else if (mode === 'single' && typeof val === 'string') {
      paths.push(val);
    }
  }

  const uniquePaths = Array.from(new Set(paths));
  const loaded = await photoStore.loadPhotos(uniquePaths);

  const result: any = {...item};
  for (const key in fieldMap) {
    const mode = fieldMap[key];
    if (!mode) continue;
    const val = item[key as unknown as keyof T];
    const resolvedKey = `${key}Resolved` as keyof ResolvedPhotos<T, M>;
    if (mode === 'array' && Array.isArray(val)) {
      result[resolvedKey] = val
        .map((p: string) => loaded[p])
        .filter((u: string | null): u is string => Boolean(u));
    } else if (mode === 'single' && typeof val === 'string') {
      result[resolvedKey] = loaded[val] ?? null;
    }
  }

  return result as T & ResolvedPhotos<T, M>;
}