import type { AnyFunction } from './types';

export function debounce(fn: AnyFunction, delay = 200) {
  let timeoutId: number | null = null;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
