import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Toolbox3D, TBX_W, TBX_D, TBX_H_BASE, TBX_H_LID } from "./skills/ToolboxSvg";
import ToolboxInterior from "./skills/ToolboxInterior";
import DeskScene from "./DeskSceneStage";

/**
 * Toolbox → Skills → Desk bridge. Single pinned viewport.
 *
 * Phases (progress p):
 *   0.00–0.15  park on shelf (mirrors __toolboxRect)
 *   0.15–0.28  fly to centre + scale up
 *   0.28–0.40  rotate to top-down (-90°), shelf + spines fade out
 *   0.32–0.48  lid hinges open + skills interior fades in
 *   0.48–0.58  skills held open (top-down)
 *   0.55–0.72  close lid + rotate to 3/4 view + shrink + translate to desk-slot
 *   0.55–1.00  desk decorations draw in (table, plant, laptop, mug, notes)
 */
const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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
    const stage = stageRef.current;
    if (!pin || !actor || !stage) return;

    const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const seg = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
    const easeInOut = (x: number) => x * x * (3 - 2 * x);

    let raf = 0;
    const tick = () => {
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const rawP = clamp(-rect.top / total);

      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;

      // Live shelf rect (start position)
      const shelfEl = (window as any).__toolboxEl as HTMLElement | null;
      const shelfMeta = (window as any).__toolboxRect as { visible?: boolean } | null;
      let shelf: { width: number; height: number; cx: number; cy: number; top: number } | null = null;
      if (shelfEl && shelfEl.isConnected) {
        const tr = shelfEl.getBoundingClientRect();
        if (tr.width > 0) {
          shelf = {
            width: tr.width, height: tr.height, top: tr.top,
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

      // Start (shelf-parked) values
      const TBX_H = TBX_H_BASE + TBX_H_LID;
      let sx = 0, sy = 0, sScale = 0.25;
      if (shelf) {
        sScale = shelf.width / TBX_W;
        const shelfBottom = shelf.top + shelf.height;
        sx = shelf.cx - screenCx;
        sy = shelfBottom - (TBX_H * sScale) / 2 - screenCy;
      }

      // Desk-slot target (end position) — read live rect of DeskScene's slot
      const slotEl = stage.querySelector<HTMLElement>(".dsk-toolbox-slot");
      let dx = 0, dy = 0, dScale = endScale * 0.35;
      if (slotEl) {
        const tr = slotEl.getBoundingClientRect();
        if (tr.width > 0) {
          dScale = tr.width / TBX_W;
          const slotBottom = tr.top + tr.height;
          dx = tr.left + tr.width / 2 - screenCx;
          // sit ON the slot (bottom of actor aligns with bottom of slot)
          dy = slotBottom - (TBX_H * dScale) / 2 - screenCy;
        }
      }

      // === Phase: fly to centre (0.15 → 0.28) ===
      const flyU = easeInOut(seg(0.15, 0.28, p));
      // === Phase: land on desk (0.55 → 0.72) ===
      const landU = easeInOut(seg(0.55, 0.72, p));

      // x/y: shelf → centre → desk-slot
      let x = lerp(sx, 0, flyU);
      let y = lerp(sy, 0, flyU);
      x = lerp(x, dx, landU);
      y = lerp(y, dy, landU);

      // scale: shelf → endScale → dScale
      let scl = lerp(sScale, endScale, flyU);
      scl = lerp(scl, dScale, landU);

      actor.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      scale.set(scl);

      // === Rotations ===
      // Front-on while parked → flip to top-down 0.28-0.40 → settle to 3/4 view during landing 0.60-0.72
      const flipU = easeInOut(seg(0.28, 0.4, p));
      const settleU = easeInOut(seg(0.6, 0.72, p));
      const rx = lerp(0, -90, flipU) + settleU * 75; // -90 → -15
      const ry = settleU * 35;
      rotX.set(`${rx.toFixed(2)}deg`);
      rotY.set(`${ry.toFixed(2)}deg`);

      // === Lid: opens 0.32-0.48, closes 0.55-0.68 ===
      const lidOpen = easeInOut(seg(0.32, 0.48, p));
      const lidClose = easeInOut(seg(0.55, 0.68, p));
      const lid = lerp(0, 125, lidOpen) * (1 - lidClose);
      lidRot.set(`${lid.toFixed(2)}deg`);

      // === Interior ===
      const intIn = easeInOut(seg(0.4, 0.5, p));
      const intOut = easeInOut(seg(0.55, 0.65, p));
      interiorOpacity.set(intIn * (1 - intOut));
      interiorY.set(lerp(30, 0, intIn));

      // === Publish flags ===
      const showActor = shelfVisible || (hasSeenShelfRef.current && p > 0.05);
      actor.style.opacity = showActor ? "1" : "0";
      (window as any).__skillsFlipActive = showActor && p < 0.999;
      (window as any).__bridgeFadeOut = showActor ? clamp(seg(0.15, 0.35, p)) : 0;
      // Desk progress drives DeskScene draw-ins (table → notes)
      (window as any).__deskProgress = clamp(seg(0.5, 1.0, p));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      (window as any).__skillsFlipActive = false;
      (window as any).__bridgeFadeOut = 0;
      (window as any).__deskProgress = 0;
    };
  }, [endScale, scale, rotX, rotY, lidRot, interiorOpacity, interiorY]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox and desk"
      style={{ height: "360vh" }}
      className="relative"
    >
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        {/* Desk decorations layer (transparent, no own background) */}
        <div ref={stageRef} className="absolute inset-0">
          <DeskScene />
        </div>

        {/* Toolbox actor — single source of truth, shared across shelf → skills → desk */}
        <div
          className="absolute inset-0 flex items-center justify-center [perspective:1200px]"
          style={{ pointerEvents: "none" }}
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
