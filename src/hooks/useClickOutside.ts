import {useEffect} from 'react';

type AnyElement = HTMLElement | null;

export function useClickOutside(
  ref: { current: AnyElement },
  handler: (event: MouseEvent | TouchEvent) => void,
  options?: { enabled?: boolean; ignoreRefs?: Array<{ current: AnyElement }> }
) {
  const {enabled = true, ignoreRefs = []} = options || {};

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      if (event.target instanceof Node && el.contains(event.target)) {
        return;
      }

      for (const ignoreRef of ignoreRefs) {
        const ignoreEl = ignoreRef.current;
        if (ignoreEl && event.target instanceof Node && ignoreEl.contains(event.target)) {
          return;
        }
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled, ignoreRefs]);
}