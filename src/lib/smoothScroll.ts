import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let rafId = 0;
let reducedMotion = false;

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const initSmoothScroll = () => {
  if (typeof window === "undefined") return null;
  if (lenisInstance) return lenisInstance;

  reducedMotion = prefersReducedMotion();
  if (reducedMotion) {
    // Native scroll, no Lenis — respect user preference.
    return null;
  }

  lenisInstance = new Lenis({
    duration: 1.05,
    // Soft ease-out cubic-bezier feel
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    smoothWheel: true,
    syncTouch: false,
  });

  const raf = (time: number) => {
    lenisInstance?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  // Expose for debug / programmatic scrolls
  (window as any).__lenis = lenisInstance;

  return lenisInstance;
};

export const destroySmoothScroll = () => {
  cancelAnimationFrame(rafId);
  lenisInstance?.destroy();
  lenisInstance = null;
  if (typeof window !== "undefined") delete (window as any).__lenis;
};

/**
 * Centralized smooth scroll-to. Honors the fixed Assembly Header offset
 * (~100px). Falls back to native scrollTo when Lenis is disabled.
 */
export const smoothScrollTo = (
  target: string | HTMLElement | number,
  options: { offset?: number; immediate?: boolean } = {}
) => {
  const { offset = -100, immediate = false } = options;

  if (lenisInstance && !immediate) {
    lenisInstance.scrollTo(target as any, { offset, duration: 1.05 });
    return;
  }

  // Fallback: native smooth scroll
  if (typeof window === "undefined") return;
  let top = 0;
  if (typeof target === "number") {
    top = target + offset;
  } else if (typeof target === "string") {
    const el = document.querySelector(target) as HTMLElement | null;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY + offset;
  } else {
    top = target.getBoundingClientRect().top + window.scrollY + offset;
  }
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
};

export const stopSmoothScroll = () => lenisInstance?.stop();
export const startSmoothScroll = () => lenisInstance?.start();
