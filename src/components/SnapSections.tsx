import { useEffect } from "react";

/**
 * Subtle idle-snap: when the user stops scrolling near one of the listed
 * section anchors, smooth-scroll to it. Threshold is small (proximity-style),
 * so it never fights deliberate scrolling.
 */
const SECTION_IDS = ["about", "projects", "skills"];
const PROXIMITY_PX = 220; // only snap if within this distance of an anchor
const IDLE_MS = 200;

const SnapSections = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    let lastY = window.scrollY;
    let snapping = false;

    const trySnap = () => {
      if (snapping) return;
      const targetY = window.scrollY;
      let best: { id: string; dist: number; top: number } | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // account for fixed header (~100px) used elsewhere via scroll-margin-top
        const absTop = rect.top + window.scrollY - 100;
        const dist = Math.abs(absTop - targetY);
        if (!best || dist < best.dist) best = { id, dist, top: absTop };
      }
      if (best && best.dist > 4 && best.dist < PROXIMITY_PX) {
        snapping = true;
        window.scrollTo({ top: best.top, behavior: "smooth" });
        window.setTimeout(() => { snapping = false; }, 700);
      }
    };

    const onScroll = () => {
      lastY = window.scrollY;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(trySnap, IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
};

export default SnapSections;
