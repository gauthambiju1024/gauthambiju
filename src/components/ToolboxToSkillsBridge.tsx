import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import ToolboxInterior from "./skills/ToolboxInterior";
import { Toolbox, ToolboxHandle } from "./skills/ToolboxSvg";

/**
 * ToolboxToSkillsBridge — one toolbox, six-phase scroll choreography.
 *
 * The SAME toolbox SVG from the projects shelf is rendered here as a single
 * fixed-position node. It reads `window.__toolboxRect` (published by the shelf)
 * and at p=0 sits exactly on the shelf — visually identical pixels, no handoff
 * needed. As scroll progresses it lifts, carries, sets down, unlatches, hinges
 * open, and the interior is revealed by a clip mask. Fully reversible.
 *
 * No opacity fades anywhere in the choreography — geometry-only.
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => x * x * (3 - 2 * x);
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeBack = (x: number) => {
  // light back-overshoot for the lift
  const s = 1.2;
  return x * x * ((s + 1) * x - s) + x; // gentle
};

const phase = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  const flyRef = useRef<HTMLDivElement>(null);
  const toolboxHandle = useRef<ToolboxHandle>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let mounted = true;

    const tick = () => {
      if (!mounted) return;
      const p = clamp01(scrollYProgress.get());
      const rect = (window as any).__toolboxRect;
      const fly = flyRef.current;
      if (!fly) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Visibility gates
      const shelfReady = !!rect && rect.visible;
      const sectionActive = p > 0.0005 && p < 0.9995;

      // Flying toolbox only matters while the section is active (it's
      // pixel-identical to the shelf one at p=0, so hiding it at the bounds
      // is invisible to the user).
      if (!sectionActive || !shelfReady) {
        fly.style.opacity = "0";
        (window as any).__toolboxInFlight = false;
        raf = requestAnimationFrame(tick);
        return;
      }
      fly.style.opacity = "1";
      (window as any).__toolboxInFlight = true;

      // Center-stage rect
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = Math.min(vw * 0.56, 480);
      const ch = cw * (76 / 96);
      const cL = vw / 2 - cw / 2;
      const cT = vh / 2 - ch / 2;

      // Per-phase progress (single timeline)
      const liftT = easeBack(phase(p, 0.0, 0.18));        // 0→1
      const carryT = smooth(phase(p, 0.18, 0.42));        // 0→1
      const settleT = smooth(phase(p, 0.42, 0.50));       // 0→1
      const latchT = smooth(phase(p, 0.50, 0.56));        // 0→1
      const lidT = easeOutQuart(phase(p, 0.56, 0.78));    // 0→1
      const interiorT = phase(p, 0.62, 1.0);              // 0→1 (linear; tile stagger lives in clip)

      // ----- Position & size -----
      // Anchors
      const shelfL = rect.left, shelfT = rect.top;
      const shelfW = rect.width, shelfH = rect.height;
      const hoverL = shelfL;
      const hoverT = shelfT - 80;

      let curL: number, curT: number, curW: number, curH: number;
      if (carryT <= 0) {
        // Phase 1 — straight lift, no size change
        curL = shelfL + (hoverL - shelfL) * liftT;
        curT = shelfT + (hoverT - shelfT) * liftT;
        curW = shelfW;
        curH = shelfH;
      } else {
        // Phase 2 — quadratic bezier arc to center, size lerps shelf→center
        const sL = hoverL, sT = hoverT;
        const eL = cL, eT = cT;
        const midX = (sL + eL) / 2;
        const midY = Math.min(sT, eT) - 80;
        const t = carryT;
        const omt = 1 - t;
        curL = omt * omt * sL + 2 * omt * t * midX + t * t * eL;
        curT = omt * omt * sT + 2 * omt * t * midY + t * t * eT;
        curW = shelfW + (cw - shelfW) * carryT;
        curH = shelfH + (ch - shelfH) * carryT;
      }

      // Settle overshoot (Phase 3 — small bounce after arrival)
      if (settleT > 0 && settleT < 1) {
        curT += Math.sin(settleT * Math.PI) * 5;
      }

      // Carry sway (Phase 2 — pendulum tilt that resolves to 0)
      let sway = 0;
      if (carryT > 0 && carryT < 1) {
        sway = Math.sin(carryT * Math.PI * 1.2) * 4 - carryT * 2;
      }

      fly.style.left = `${curL.toFixed(2)}px`;
      fly.style.top = `${curT.toFixed(2)}px`;
      fly.style.width = `${curW.toFixed(2)}px`;
      fly.style.height = `${curH.toFixed(2)}px`;
      fly.style.transform = `rotate(${sway.toFixed(2)}deg)`;

      // Shadow grows with size/altitude
      const shadowBlur = 10 + carryT * 28 + settleT * 6;
      const shadowY = 8 + carryT * 22 + settleT * 4;
      const shadowAlpha = 0.4 + carryT * 0.25;
      fly.style.filter = `drop-shadow(0 ${shadowY.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(0,0,0,${shadowAlpha.toFixed(2)}))`;

      // ----- Toolbox parts -----
      toolboxHandle.current?.setLatches(latchT * 90);
      toolboxHandle.current?.setLid(-lidT * 118);

      // Interior reveal via CSS clip-path (inset from top — grows upward as
      // it shrinks). At pct=0 fully clipped, at pct=1 fully shown.
      if (interiorRef.current) {
        const insetTop = (1 - clamp01(interiorT)) * 100;
        interiorRef.current.style.clipPath = `inset(${insetTop.toFixed(2)}% 0 0 0)`;
      }

      // Header reveal — also clipped, no fade.
      if (headerRef.current) {
        const insetTop = (1 - clamp01(phase(p, 0.78, 0.95))) * 100;
        headerRef.current.style.clipPath = `inset(${insetTop.toFixed(2)}% 0 0 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      (window as any).__toolboxInFlight = false;
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox"
      style={{ height: "260vh" }}
      className="relative"
    >
      {/* Sticky stage just holds the section height — the toolbox itself is
          fixed and tracks the shelf rect directly. */}
      <div className="sticky top-0 w-full" style={{ height: "100vh", pointerEvents: "none" }}>
        <div
          ref={headerRef}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "10vh",
            clipPath: "inset(100% 0 0 0)",
            willChange: "clip-path",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-16" style={{ background: "hsl(220 5% 28%)" }} />
            <span className="text-[11px] tracking-[0.35em] uppercase font-mono" style={{ color: "hsl(40 6% 60%)" }}>
              Skills · The Toolbox
            </span>
            <div className="h-px w-16" style={{ background: "hsl(220 5% 28%)" }} />
          </div>
        </div>
      </div>

      {/* The ONE flying toolbox — fixed to viewport, position is shelf rect at p=0 */}
      <div
        ref={flyRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 220,
          height: 174,
          pointerEvents: "none",
          zIndex: 30,
          opacity: 0,
          willChange: "transform, left, top, width, height, filter",
        }}
      >
        <Toolbox ref={toolboxHandle} />
        {/* Interior HTML overlay positioned over the body region of the SVG
            (viewBox 96×76, body x:8-88 / y:36-68 → 8.33%/47.37% / 83.33%/42.11%).
            Revealed by clip-path inset — no opacity fade. */}
        <div
          ref={interiorRef}
          style={{
            position: "absolute",
            left: "8.333%",
            top: "47.368%",
            width: "83.333%",
            height: "42.105%",
            clipPath: "inset(100% 0 0 0)",
            willChange: "clip-path",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          <div style={{ width: "100%", height: "100%", padding: "4%" }}>
            <ToolboxInterior />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolboxToSkillsBridge;
