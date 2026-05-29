import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import ToolboxInterior from "./skills/ToolboxInterior";
import Toolbox3D, { Toolbox3DHandle } from "./skills/Toolbox3D";

/**
 * ToolboxToSkillsBridge — continuous choreography spanning the END of the
 * projects shelf section and this entire section.
 *
 * Driven by TWO progresses:
 *   - window.__toolboxTakeoverProgress (0→1) — published by AboutToProjectsBridge
 *     during its tail. Drives LIFT + CARRY from shelf rect → center.
 *   - this section's scrollYProgress (0→1) — drives TILT to top view, LATCHES,
 *     LID swing, and INTERIOR reveal.
 *
 * One toolbox node only. No fades on the toolbox itself.
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => x * x * (3 - 2 * x);
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeInOutQuart = (x: number) =>
  x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
const phase = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  const flyRef = useRef<HTMLDivElement>(null);
  const toolboxHandle = useRef<Toolbox3DHandle>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let mounted = true;

    const tick = () => {
      if (!mounted) return;
      const ownP = clamp01(scrollYProgress.get());
      const takeover = clamp01((window as any).__toolboxTakeoverProgress ?? 0);
      const rect = (window as any).__toolboxRect;
      const fly = flyRef.current;
      if (!fly) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const active = takeover > 0.001 || (ownP > 0.0005 && ownP < 0.9995);
      if (!active || !rect) {
        fly.style.opacity = "0";
        fly.style.pointerEvents = "none";
        (window as any).__toolboxInFlight = false;
        raf = requestAnimationFrame(tick);
        return;
      }
      fly.style.opacity = "1";
      fly.style.pointerEvents = ownP > 0.6 ? "auto" : "none";
      (window as any).__toolboxInFlight = true;

      // Center-stage rect
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = Math.min(vw * 0.56, 480);
      const ch = cw * (76 / 96);
      const cL = vw / 2 - cw / 2;
      const cT = vh / 2 - ch / 2;

      // While in own section, lock position at center; before that, use takeover.
      const liftCarryT = ownP > 0.0005 ? 1 : takeover;
      const liftT = easeOutQuart(phase(liftCarryT, 0.0, 0.30));
      const carryT = smooth(phase(liftCarryT, 0.20, 1.0));

      // Phase windows for the 3D box
      const tiltT = easeInOutQuart(phase(ownP, 0.05, 0.40)); // rotateX 0 → -62
      const latchT = smooth(phase(ownP, 0.30, 0.38));         // 0 → 1
      const lidT = easeOutQuart(phase(ownP, 0.38, 0.62));     // 0 → 1
      const interiorT = phase(ownP, 0.60, 0.92);              // 0 → 1
      const headerT = phase(ownP, 0.85, 1.0);

      // ----- Position & size -----
      const shelfL = rect.left, shelfT = rect.top;
      const shelfW = rect.width, shelfH = rect.height;
      const hoverL = shelfL;
      const hoverT = shelfT - 80;

      let curL: number, curT: number, curW: number, curH: number;
      if (carryT <= 0) {
        curL = shelfL + (hoverL - shelfL) * liftT;
        curT = shelfT + (hoverT - shelfT) * liftT;
        curW = shelfW;
        curH = shelfH;
      } else {
        const sL = hoverL, sT = hoverT;
        const eL = cL, eT = cT;
        const midX = (sL + eL) / 2;
        const midY = Math.min(sT, eT) - 60;
        const t = carryT;
        const omt = 1 - t;
        curL = omt * omt * sL + 2 * omt * t * midX + t * t * eL;
        curT = omt * omt * sT + 2 * omt * t * midY + t * t * eT;
        curW = shelfW + (cw - shelfW) * carryT;
        curH = shelfH + (ch - shelfH) * carryT;
      }

      fly.style.left = `${curL.toFixed(2)}px`;
      fly.style.top = `${curT.toFixed(2)}px`;
      fly.style.width = `${curW.toFixed(2)}px`;
      fly.style.height = `${curH.toFixed(2)}px`;

      const shadowBlur = 10 + carryT * 30;
      const shadowY = 8 + carryT * 24;
      const shadowAlpha = 0.4 + carryT * 0.3;
      fly.style.filter = `drop-shadow(0 ${shadowY.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(0,0,0,${shadowAlpha.toFixed(2)}))`;

      // ----- 3D parts -----
      const h = toolboxHandle.current;
      if (h) {
        h.setRotX(-tiltT * 62);
        h.setLatches(latchT * 90);
        h.setLid(-lidT * 140);
        h.setInteriorReveal(interiorT);
      }

      if (headerRef.current) {
        const insetTop = (1 - clamp01(headerT)) * 100;
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
      <div className="sticky top-0 w-full" style={{ height: "100vh", pointerEvents: "none" }}>
        <div
          ref={headerRef}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "6vh",
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

      {/* The ONE flying 3D toolbox — fixed to viewport */}
      <div
        ref={flyRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 220,
          height: 174,
          pointerEvents: "auto",
          zIndex: 30,
          opacity: 0,
          willChange: "transform, left, top, width, height, filter",
        }}
      >
        <Toolbox3D ref={toolboxHandle} interior={<ToolboxInterior variant="top" />} />
      </div>
    </section>
  );
};

export default ToolboxToSkillsBridge;
