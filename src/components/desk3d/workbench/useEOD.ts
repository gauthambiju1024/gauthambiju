import { useEffect } from "react";
import { useMotionValue, animate, MotionValue } from "framer-motion";

/**
 * End-of-day mode. Returns a MotionValue [0..1]; 0 = fully awake,
 * 1 = EOD (lamp dim, laptop closed, clock ticked). After 30s of no
 * pointer movement / scroll / key, animates to 1. Any activity → 0.
 */
export const useEOD = (idleMs = 30000, disabled = false): MotionValue<number> => {
  const eod = useMotionValue(0);

  useEffect(() => {
    if (disabled) return;
    let t: number | undefined;
    let currentAnim: ReturnType<typeof animate> | null = null;

    const goTo = (v: number, dur: number) => {
      currentAnim?.stop();
      currentAnim = animate(eod, v, { duration: dur, ease: "easeInOut" });
    };

    const wake = () => {
      if (eod.get() > 0) goTo(0, 0.4);
      clearTimeout(t);
      t = window.setTimeout(() => goTo(1, 1.2), idleMs);
    };

    const events: Array<keyof WindowEventMap> = ["scroll", "mousemove", "pointerdown", "keydown", "touchstart", "wheel"];
    events.forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
    wake();

    return () => {
      clearTimeout(t);
      currentAnim?.stop();
      events.forEach((ev) => window.removeEventListener(ev, wake));
    };
  }, [eod, idleMs, disabled]);

  return eod;
};
