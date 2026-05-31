import { useEffect } from "react";
import Lenis from "lenis";
import { setFrameDriver } from "@/lib/choreography";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

/**
 * Phase 1 — Global smooth-scroll foundation.
 *
 * A single virtual scroll (Lenis) eases the real scroll position into a
 * continuous stream. Because Lenis writes the eased value back to native
 * scroll, every existing reader — Framer Motion's `useScroll` /
 * `useScrollReveal`, and the bridges' `getBoundingClientRect()` math — sees the
 * smoothed position with no per-component changes.
 *
 * Lenis is advanced from the app's ONE rAF ticker (via setFrameDriver) so it
 * stays frame-synced with all scroll-linked motion (no competing loops).
 *
 * Under prefers-reduced-motion we skip Lenis entirely and use native scroll.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { reducedMotion, coarsePointer } = useDeviceCapability();

  useEffect(() => {
    if (reducedMotion) return; // native scroll for reduced-motion users

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Native touch scrolling is already smooth; opt out of syncTouch so we
      // don't fight the OS scroller on phones/tablets.
      syncTouch: false,
      touchMultiplier: coarsePointer ? 1 : 1.2,
    });

    document.documentElement.classList.add("lenis-active");

    const release = setFrameDriver((time) => {
      // Lenis expects a DOMHighResTimeStamp in ms (rAF passes exactly that).
      lenis.raf(time);
    });

    return () => {
      release();
      lenis.destroy();
      document.documentElement.classList.remove("lenis-active");
    };
  }, [reducedMotion, coarsePointer]);

  return <>{children}</>;
}

export default SmoothScroll;
