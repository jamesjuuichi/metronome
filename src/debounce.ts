import type { AnyFunction } from "./types";

export function debounce(fn: AnyFunction, delay: number = 200) {
  let timeoutId: number | null = null;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
