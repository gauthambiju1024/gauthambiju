import { useEffect, useRef } from "react";

/**
 * AboutToProjectsBridge (v3)
 * --------------------------
 * Scroll-pinned transition that continues directly from the About card.
 *
 *   A 0.00–0.14  Globe + original card fade out (HeroIdBadge reads
 *                window.__bridgeProgress); clone fades in at the same spot.
 *   B 0.14–0.42  Tri-fold     — left/right thirds rotateY ±88°.
 *   C 0.42–0.66  Rotate       — rotateY 0→90°, cream → walnut spine color.
 *   D 0.66–1.00  Shelve       — drop onto a drawn ledge; plank fades in
 *                               so it hands off into the ProjectsShelf below.
 *
 * While this section is on screen, window.__bridgeActive = true tells
 * HeroIdBadge to pin its stage to the viewport (rather than tracking #home,
 * which has already scrolled off), so the card stays visible to fade.
 *
 * Performance: single window scroll listener + rAF, direct ref mutation,
 * zero React re-renders during scroll.
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Cream paper → walnut spine
const PAPER = { h: 40, s: 25, l: 92 };
const SPINE = { h: 170, s: 25, l: 22 };
const lerpHsl = (t: number) => {
  const h = PAPER.h + (SPINE.h - PAPER.h) * t;
  const s = PAPER.s + (SPINE.s - PAPER.s) * t;
  const l = PAPER.l + (SPINE.l - PAPER.l) * t;
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
};

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

// Compute the viewport rect of the about card at end-of-flip,
// mirroring HeroIdBadge's math (stage = #home, ~vw × (vh-100), top 100).
const cardViewportRect = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const stageW = vw;
  const stageH = Math.max(200, vh - 100);
  const cardW0 = 260;
  const cardH0 = 380;
  const scale = Math.min((stageW * 0.45) / cardW0, (stageH * 0.78) / cardH0);
  const w = cardW0 * scale;
  const h = cardH0 * scale;
  const cx = stageW * 0.74;
  const cy = 100 + stageH / 2;
  return { left: cx - w / 2, top: cy - h / 2, width: w, height: h };
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

    let ledgeLen = 900;
    try { ledgeLen = ledgePath.getTotalLength() || 900; } catch { /* noop */ }
    ledgePath.style.strokeDasharray = String(ledgeLen);
    ledgePath.style.strokeDashoffset = String(ledgeLen);

    const positionClone = () => {
      const r = cardViewportRect();
      clone.style.left = `${r.left}px`;
      clone.style.top = `${r.top}px`;
      clone.style.width = `${r.width}px`;
      clone.style.height = `${r.height}px`;
    };
    positionClone();

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = pin.offsetHeight - vh;
      if (travel <= 0) return;
      const scrolled = -rect.top;
      const t = clamp01(scrolled / travel);

      // Active flag = sticky stage is on screen
      const active = rect.top <= 0 && rect.bottom >= vh * 0.5;
      (window as any).__bridgeActive = active;
      (window as any).__bridgeProgress = t;

      const visible = t > 0.001;
      clone.style.opacity = visible ? String(clamp01(t / 0.14)) : "0";

      const tFold = ease(0.14, 0.42, t);
      const tRot = ease(0.42, 0.66, t);
      const tDrop = smooth(ease(0.66, 1.0, t));
      const tLedge = ease(0.72, 0.98, t);
      const tPlank = ease(0.80, 1.0, t);

      const flapAngle = tFold * 88;
      left.style.transform = `rotateY(${flapAngle}deg)`;
      right.style.transform = `rotateY(${-flapAngle}deg)`;

      const creaseDark = 0.12 + tFold * 0.28;
      center.style.boxShadow = `inset 6px 0 12px -6px rgba(0,0,0,${creaseDark}), inset -6px 0 12px -6px rgba(0,0,0,${creaseDark})`;

      const sx = 1 - tFold * 0.88;
      const ry = tRot * 90;
      const cr = cardViewportRect();
      const dropPx = Math.max(0, vh * 0.72 - cr.top);
      const ty = tDrop * dropPx;
      slab.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scaleX(${sx.toFixed(3)}) rotateY(${ry.toFixed(2)}deg)`;
      slab.style.backgroundColor = lerpHsl(smooth(tRot));

      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));
      ledgeWrap.style.opacity = String(Math.min(1, tLedge * 1.2));
      plank.style.opacity = tPlank.toFixed(3);
    };

    if (reduced) {
      (window as any).__bridgeProgress = 1;
      (window as any).__bridgeActive = false;
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
    const onResize = () => { positionClone(); onScroll(); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      (window as any).__bridgeProgress = 0;
      (window as any).__bridgeActive = false;
    };
  }, []);

  return (
    <section
      ref={pinRef}
      id="about-projects-bridge"
      aria-hidden
      style={{ height: "200vh" }}
      className="relative w-full"
    >
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

      {/* Folding clone — fixed at the about-card's end-of-flip viewport position */}
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
          willChange: "opacity",
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
