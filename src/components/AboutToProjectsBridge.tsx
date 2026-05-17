import { useEffect, useRef } from "react";

/**
 * AboutToProjectsBridge (v2)
 * --------------------------
 * Scroll-pinned transition that continues directly from the About card.
 * No separate slab spawns. A cream-card clone is fixed-positioned over the
 * existing flipped ID-card back (measured every frame), and:
 *
 *   A 0.00–0.10  Globe fade   — HeroIdBadge reads window.__bridgeProgress
 *                               and fades the globe + original card together.
 *   B 0.10–0.40  Tri-fold     — left/right thirds rotateY ±88°, slab scaleX → 0.12
 *   C 0.40–0.65  Rotate       — rotateY 0→90°, cream → walnut spine color
 *   D 0.65–1.00  Shelve       — translate down to a drawn shelf ledge,
 *                               ledge draws L→R, walnut plank fades in beneath
 *                               so it hands off into the ProjectsShelf below.
 *
 * Performance: single window scroll listener + rAF, direct ref mutation,
 * zero React re-renders during scroll.
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Cream paper → walnut spine (matches SPINE_COLORS[0] in ProjectsShelf)
const PAPER = { h: 40, s: 25, l: 92 };
const SPINE = { h: 170, s: 25, l: 22 };
const lerpHsl = (t: number) => {
  const h = PAPER.h + (SPINE.h - PAPER.h) * t;
  const s = PAPER.s + (SPINE.s - PAPER.s) * t;
  const l = PAPER.l + (SPINE.l - PAPER.l) * t;
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
};

// Cream paper grid (very faint notebook lines, matches AboutCardBack)
const PAPER_GRID =
  "linear-gradient(hsl(160 20% 16% / 0.04) 1px, transparent 1px)," +
  "linear-gradient(90deg, hsl(160 20% 16% / 0.04) 1px, transparent 1px)";
const PAPER_GRID_SIZE = "14px 14px, 14px 14px";

const FlapPanel = ({
  side,
  innerRef,
}: {
  side: "left" | "center" | "right";
  innerRef: React.RefObject<HTMLDivElement>;
}) => {
  const transformOrigin =
    side === "left" ? "right center" : side === "right" ? "left center" : "center";
  return (
    <div
      ref={innerRef}
      className="absolute top-0 bottom-0"
      style={{
        left: side === "left" ? 0 : side === "center" ? "33.333%" : "66.666%",
        width: "33.334%",
        transformOrigin,
        transformStyle: "preserve-3d",
        backgroundColor: `hsl(${PAPER.h} ${PAPER.s}% ${PAPER.l}%)`,
        backgroundImage: PAPER_GRID,
        backgroundSize: PAPER_GRID_SIZE,
        borderTop: "1px solid hsl(160 20% 16% / 0.18)",
        borderBottom: "1px solid hsl(160 20% 16% / 0.18)",
        borderLeft: side === "left" ? "1px solid hsl(160 20% 16% / 0.18)" : "none",
        borderRight: side === "right" ? "1px solid hsl(160 20% 16% / 0.18)" : "none",
        boxShadow:
          side === "center"
            ? "inset 6px 0 10px -6px rgba(0,0,0,0.18), inset -6px 0 10px -6px rgba(0,0,0,0.18)"
            : side === "left"
            ? "inset -8px 0 12px -8px rgba(0,0,0,0.22)"
            : "inset 8px 0 12px -8px rgba(0,0,0,0.22)",
        backfaceVisibility: "hidden",
      }}
    />
  );
};

const AboutToProjectsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);
  const leftFlapRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightFlapRef = useRef<HTMLDivElement>(null);

  const ledgeWrapRef = useRef<HTMLDivElement>(null);
  const ledgePathRef = useRef<SVGPathElement>(null);
  const plankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const clone = cloneRef.current;
    const slab = slabRef.current;
    const left = leftFlapRef.current;
    const center = centerRef.current;
    const right = rightFlapRef.current;
    const ledgeWrap = ledgeWrapRef.current;
    const ledgePath = ledgePathRef.current;
    const plank = plankRef.current;
    if (!pin || !clone || !slab || !left || !center || !right || !ledgeWrap || !ledgePath || !plank) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Prep ledge dash for L→R draw-in
    let ledgeLen = 900;
    try { ledgeLen = ledgePath.getTotalLength() || 900; } catch { /* noop */ }
    ledgePath.style.strokeDasharray = String(ledgeLen);
    ledgePath.style.strokeDashoffset = String(ledgeLen);

    // Fallback rect (in case the hero card wrap isn't found yet)
    const fallbackRect = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = 260;
      const h = 380;
      return { left: vw / 2 - w / 2, top: vh / 2 - h / 2, width: w, height: h };
    };

    const measureCard = () => {
      const el = document.querySelector('[data-hero-card-wrap]') as HTMLElement | null;
      if (!el) return fallbackRect();
      const r = el.getBoundingClientRect();
      // Skip absurd rects (element not yet positioned)
      if (r.width < 20 || r.height < 20) return fallbackRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    };

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = pin.offsetHeight - vh;
      if (travel <= 0) return;
      const scrolled = -rect.top;
      const t = clamp01(scrolled / travel);

      // Publish progress so HeroIdBadge fades globe + original card
      (window as any).__bridgeProgress = t;

      // Clone is visible only while bridge is active
      const visible = t > 0.002 && t < 0.999;
      clone.style.opacity = visible ? "1" : "0";
      clone.style.pointerEvents = "none";

      // Mirror the original card's on-screen rect (so the fold starts in place)
      const cr = measureCard();
      // Position is locked to the rect captured at the start of phase B (so the
      // card doesn't "follow" any residual motion of the original). We refresh
      // every frame during phase A and freeze at fold-start to be safe.
      if (t < 0.12) {
        clone.style.left = `${cr.left}px`;
        clone.style.top = `${cr.top}px`;
        clone.style.width = `${cr.width}px`;
        clone.style.height = `${cr.height}px`;
      }

      const tFold = ease(0.10, 0.40, t);
      const tRot = ease(0.40, 0.65, t);
      const tDrop = smooth(ease(0.65, 1.0, t));
      const tLedge = ease(0.70, 0.98, t);
      const tPlank = ease(0.78, 1.0, t);

      // Flap fold
      const flapAngle = tFold * 88;
      left.style.transform = `rotateY(${flapAngle}deg)`;
      right.style.transform = `rotateY(${-flapAngle}deg)`;

      // Crease deepens
      const creaseDark = 0.12 + tFold * 0.28;
      center.style.boxShadow = `inset 6px 0 12px -6px rgba(0,0,0,${creaseDark}), inset -6px 0 12px -6px rgba(0,0,0,${creaseDark})`;

      // Slab: scaleX collapse → rotateY 90° → drop
      const sx = 1 - tFold * 0.88;
      const ry = tRot * 90;
      // Drop distance: bottom of viewport minus clone's current top
      const dropPx = Math.max(0, vh * 0.72 - cr.top);
      const ty = tDrop * dropPx;
      slab.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scaleX(${sx.toFixed(3)}) rotateY(${ry.toFixed(2)}deg)`;

      // Color lerp toward walnut spine during rotate
      slab.style.backgroundColor = lerpHsl(smooth(tRot));

      // Ledge draws L→R; plank fades in beneath it
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));
      ledgeWrap.style.opacity = String(Math.min(1, tLedge * 1.2));
      plank.style.opacity = tPlank.toFixed(3);
    };

    if (reduced) {
      // Resolved end state
      (window as any).__bridgeProgress = 1;
      clone.style.opacity = "0";
      ledgePath.style.strokeDashoffset = "0";
      ledgeWrap.style.opacity = "1";
      plank.style.opacity = "1";
      return;
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      (window as any).__bridgeProgress = 0;
    };
  }, []);

  return (
    <section
      ref={pinRef}
      id="about-projects-bridge"
      aria-hidden
      style={{ height: "180vh" }}
      className="relative w-full"
    >
      {/* Pinned ledge / plank stage (sits inside normal flow) */}
      <div
        className="sticky w-full overflow-hidden"
        style={{ top: 100, height: "calc(100vh - 100px)" }}
      >
        {/* Walnut plank — the top of the bookshelf below */}
        <div
          ref={plankRef}
          className="absolute left-1/2 pointer-events-none"
          style={{
            bottom: "16%",
            transform: "translateX(-50%)",
            width: "min(78vw, 1040px)",
            height: 22,
            background:
              "linear-gradient(180deg, hsl(28 35% 28%) 0%, hsl(26 32% 22%) 50%, hsl(24 30% 16%) 100%)",
            backgroundImage:
              "repeating-linear-gradient(90deg, hsl(28 35% 28% / 0) 0 38px, hsl(20 25% 12% / 0.25) 38px 39px, hsl(28 35% 28% / 0) 39px 76px, hsl(20 25% 12% / 0.18) 76px 77px)",
            boxShadow:
              "0 8px 18px -6px hsl(160 30% 4% / 0.55), inset 0 1px 0 hsl(40 30% 60% / 0.18)",
            opacity: 0,
            willChange: "opacity",
          }}
        />

        {/* Drawn shelf ledge — single warm wood line */}
        <div
          ref={ledgeWrapRef}
          className="absolute left-1/2 pointer-events-none"
          style={{
            bottom: "calc(16% + 22px)",
            transform: "translateX(-50%)",
            width: "min(78vw, 1040px)",
            height: 6,
            opacity: 0,
            willChange: "opacity",
          }}
        >
          <svg width="100%" height="6" viewBox="0 0 1040 6" preserveAspectRatio="none" fill="none">
            <path
              ref={ledgePathRef}
              d="M 4 3 L 1036 3"
              stroke="hsl(28 35% 28%)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Folding clone — fixed to overlay the original about card */}
      <div
        ref={cloneRef}
        aria-hidden
        className="pointer-events-none"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 260,
          height: 380,
          zIndex: 9,
          opacity: 0,
          perspective: "2200px",
          perspectiveOrigin: "50% 45%",
          willChange: "opacity, left, top, width, height",
        }}
      >
        <div
          ref={slabRef}
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            backgroundColor: `hsl(${PAPER.h} ${PAPER.s}% ${PAPER.l}%)`,
            borderRadius: 4,
            boxShadow:
              "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            willChange: "transform, background-color",
          }}
        >
          <FlapPanel side="left" innerRef={leftFlapRef} />
          <FlapPanel side="center" innerRef={centerRef} />
          <FlapPanel side="right" innerRef={rightFlapRef} />
        </div>
      </div>
    </section>
  );
};

export default AboutToProjectsBridge;
