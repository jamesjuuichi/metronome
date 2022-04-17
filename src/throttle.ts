import type { AnyFunction } from "./types";

export function throttle(fn: AnyFunction, interval: number = 100) {
  let lastTime = 0;
  let timeoutId: number | null = null;
  return (...args: any[]) => {
    const now = +new Date();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (now >= lastTime + interval) {
      lastTime = now;
      fn(...args);
    } else {
      timeoutId = window.setTimeout(() => {
        lastTime = now;
        fn(...args);
      }, interval - now + lastTime);
    }
  };
}
/**
 * NOTE: Experimentation on throttle animation frame
 */
