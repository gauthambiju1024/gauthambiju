import { useEffect, useRef } from "react";
import { useCardFold } from "./cardFoldContext";

/**
 * AboutToProjectsBridge
 * ---------------------
 * Pure scroll driver. Computes 0→1 progress through its own height and
 * writes it to the shared CardFoldContext. The actual fold animation
 * lives inside HeroIdBadge (which owns the real ID card DOM).
 *
 * Visually renders only a faint dashed gold ledge guide near the bottom
 * 10% — the "construction-reveal" affordance that the card lands on.
 */
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

const AboutToProjectsBridge = () => {
  const foldMV = useCardFold();
  const pinRef = useRef<HTMLElement>(null);
  const ledgeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const ledge = ledgeRef.current;
    if (!pin || !foldMV) return;

    let len = 800;
    try { if (ledge) len = ledge.getTotalLength() || 800; } catch { /* noop */ }
    if (ledge) {
      ledge.style.strokeDasharray = String(len);
      ledge.style.strokeDashoffset = String(len);
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = pin.offsetHeight - vh;
      if (travel <= 0) {
        foldMV.set(rect.top < 0 ? 1 : 0);
        return;
      }
      const t = clamp01(-rect.top / travel);
      foldMV.set(t);
      if (ledge) {
        const draw = clamp01((t - 0.78) / 0.18);
        ledge.style.strokeDashoffset = String(len * (1 - draw));
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [foldMV]);

  return (
    <section
      ref={pinRef}
      id="about-projects-bridge"
      aria-hidden
      style={{ height: "100vh" }}
      className="relative w-full hidden md:block"
    >
      <div className="sticky w-full pointer-events-none" style={{ top: 100, height: "calc(100vh - 100px)" }}>
        <svg
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "18%", width: "min(72vw, 920px)", height: 12 }}
          viewBox="0 0 920 12"
          fill="none"
        >
          <path
            ref={ledgeRef}
            d="M 10 6 L 910 6"
            stroke="hsl(var(--gold))"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </div>
    </section>
  );
};

export default AboutToProjectsBridge;
