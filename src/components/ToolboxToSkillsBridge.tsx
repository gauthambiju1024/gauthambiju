import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Toolbox3D, TBX_W, TBX_D, TBX_H_BASE, TBX_H_LID } from "./skills/ToolboxSvg";
import ToolboxInterior from "./skills/ToolboxInterior";
import DeskSceneStage from "./DeskSceneStage";

/**
 * Toolbox → Skills bridge — RESTORED to the "perfect" version.
 *
 * Phases (progress p):
 *   0.00–0.25  park on the shelf rect (shelf prop hidden via __skillsFlipActive)
 *   0.25–0.45  fly to centre + scale up
 *   0.45–0.60  rotate to top-down (-90°)
 *   0.55–0.70  lid hinges open
 *   0.62–0.74  interior fades in
 *   0.85–1.00  settle: rotate back to -15° / +35°, slight shrink
 */
const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const hasSeenShelfRef = useRef(false);
  const handoffStartRef = useRef<number | null>(null);

  const scale = useMotionValue(0.25);
  const rotX = useMotionValue("0deg");
  const rotY = useMotionValue("0deg");
  const lidRot = useMotionValue("0deg");
  const interiorOpacity = useMotionValue(0);
  const interiorY = useMotionValue(30);

  const [endScale, setEndScale] = useState(1);

  useLayoutEffect(() => {
    const compute = () => {
      const max =
        Math.min(
          (window.innerWidth * 0.92) / TBX_W,
          (window.innerHeight * 0.78) / TBX_D,
          1.1
        ) * 0.6;
      setEndScale(max);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const actor = actorRef.current;
    if (!pin || !actor) return;

    const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const seg = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
    const easeInOut = (x: number) => x * x * (3 - 2 * x);

    let raf = 0;
    const tick = () => {
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      // Preserve the original 220vh skills choreography exactly: it used a
      // 120vh scrollable runway. The added desk stage starts only after that.
      const skillsRunway = vh * 1.2;
      const scrollPx = -rect.top;
      const rawP = clamp(scrollPx / skillsRunway);
      const deskP = clamp((scrollPx - skillsRunway) / skillsRunway);

      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;

      const shelfEl = (window as any).__toolboxEl as HTMLElement | null;
      const shelfMeta = (window as any).__toolboxRect as { visible?: boolean } | null;
      let shelf: { left: number; top: number; width: number; height: number; cx: number; cy: number } | null = null;
      if (shelfEl && shelfEl.isConnected) {
        const tr = shelfEl.getBoundingClientRect();
        if (tr.width > 0) {
          shelf = {
            left: tr.left, top: tr.top, width: tr.width, height: tr.height,
            cx: tr.left + tr.width / 2, cy: tr.top + tr.height / 2,
          };
        }
      }

      const shelfVisible = !!shelf && shelfMeta?.visible === true;
      if (shelfVisible && !hasSeenShelfRef.current) {
        hasSeenShelfRef.current = true;
        handoffStartRef.current = rawP;
      }
      if (!shelfVisible && rawP <= 0.01) {
        hasSeenShelfRef.current = false;
        handoffStartRef.current = null;
      }

      const startP = handoffStartRef.current ?? rawP;
      const p = hasSeenShelfRef.current ? clamp((rawP - startP) / Math.max(0.52, 1 - startP)) : 0;

      const TBX_H = TBX_H_BASE + TBX_H_LID;
      let sx = 0, sy = 0, sScale = 0.25;
      if (shelf) {
        sScale = shelf.width / TBX_W;
        const shelfBottom = shelf.top + shelf.height;
        sx = shelf.cx - screenCx;
        sy = shelfBottom - (TBX_H * sScale) / 2 - screenCy;
      }

      const flyU = easeInOut(seg(0.25, 0.45, p));
      const settleU = seg(0.85, 1.0, p);
      let x = lerp(sx, 0, flyU);
      let y = lerp(sy, 0, flyU) + settleU * 40;
      let scl = lerp(sScale, endScale, flyU) * lerp(1, 0.92, settleU);

      const flipU = easeInOut(seg(0.45, 0.6, p));
      const finalU = easeInOut(seg(0.85, 1.0, p));
      let rx = lerp(0, -90, flipU) + finalU * 75;
      let ry = finalU * 35;

      const lidOpen = easeInOut(seg(0.55, 0.7, p));
      const lidClose = easeInOut(seg(0.92, 1.0, p));
      const lid = lerp(0, 125, lidOpen) * (1 - lidClose);

      const deskSlot = (window as any).__deskToolboxSlot as
        | { width: number; cx: number; bottom: number }
        | undefined;
      const deskU = easeInOut(seg(0.06, 0.38, deskP));
      if (deskSlot && deskP > 0) {
        const deskScale = deskSlot.width / TBX_W;
        const deskX = deskSlot.cx - screenCx;
        const deskY = deskSlot.bottom - (TBX_H * deskScale) / 2 - screenCy;
        x = lerp(0, deskX, deskU);
        y = lerp(40, deskY, deskU);
        scl = lerp(endScale * 0.92, deskScale, deskU);
        rx = lerp(-15, -12, deskU);
        ry = lerp(35, 28, deskU);
      }

      actor.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      scale.set(scl);
      rotX.set(`${rx.toFixed(2)}deg`);
      rotY.set(`${ry.toFixed(2)}deg`);
      lidRot.set(`${lid.toFixed(2)}deg`);

      const intIn = easeInOut(seg(0.62, 0.74, p));
      const intOut = easeInOut(seg(0.92, 1.0, p));
      interiorOpacity.set(intIn * (1 - intOut));
      interiorY.set(lerp(30, 0, intIn));

      const showActor = shelfVisible || (hasSeenShelfRef.current && p > 0.05);
      actor.style.opacity = showActor ? "1" : "0";
      (window as any).__skillsFlipActive = showActor && p < 0.999;
      (window as any).__bridgeFadeOut = showActor ? clamp(seg(0.2, 0.45, p)) : 0;
      (window as any).__deskProgress = deskP;
      // Publish final-state for desk stage handoff
      (window as any).__skillsEndState = {
        scale: scl,
        rx, ry,
        // actor's screen-centre after settle
        cx: screenCx + x,
        cy: screenCy + y,
        active: showActor,
        done: p >= 0.999,
      };

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      (window as any).__skillsFlipActive = false;
      (window as any).__bridgeFadeOut = 0;
    };
  }, [endScale, scale, rotX, rotY, lidRot, interiorOpacity, interiorY]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox"
      style={{ height: "340vh" }}
      className="relative"
    >
      <span id="desk-scene" className="absolute left-0 w-1 h-1 pointer-events-none" style={{ top: "120vh" }} aria-hidden />
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        <DeskSceneStage />
        <div
          className="absolute inset-0 flex items-center justify-center [perspective:1200px]"
          style={{ pointerEvents: "none", zIndex: 10 }}
        >
          <div
            ref={actorRef}
            className="relative"
            style={{ pointerEvents: "auto", willChange: "transform, opacity", opacity: 0 }}
          >
            <Toolbox3D
              scale={scale}
              rotateX={rotX}
              rotateY={rotY}
              lidRotateX={lidRot}
              floorContent={
                <motion.div
                  style={{ opacity: interiorOpacity, y: interiorY }}
                  className="w-full h-full bg-[#0a0a0c] p-6 flex flex-col gap-4 relative rounded-md shadow-[inset_0_20px_50px_rgba(0,0,0,1)] overflow-hidden border-[6px] border-[#05080a]"
                >
                  <div className="absolute inset-0 opacity-70 bg-[repeating-linear-gradient(45deg,#0c0c0e_0,#0c0c0e_4px,transparent_4px,transparent_8px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_6px)] mix-blend-overlay pointer-events-none" />
                  <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                    <ToolboxInterior />
                  </div>
                </motion.div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolboxToSkillsBridge;
