import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Toolbox3D, TBX_W, TBX_D, TBX_H_BASE, TBX_H_LID } from "./skills/ToolboxSvg";
import ToolboxInterior from "./skills/ToolboxInterior";

/**
 * Toolbox → Skills bridge.
 *
 * Imperative rAF-driven (no spring lag, no bounce). Each frame we:
 *   - read raw scroll progress from this section's bounding rect
 *   - read the LIVE shelf-toolbox rect (published by AboutToProjectsBridge)
 *   - drive motion values on the shared <Toolbox3D> directly via .set()
 *
 * Phases (progress p):
 *   0.00–0.25  park on the shelf rect (1:1 with shelf prop) — shelf prop is
 *              hidden via __skillsFlipActive so only one toolbox is visible.
 *   0.25–0.45  fly to centre + scale up
 *   0.45–0.60  rotate to top-down (-90°)
 *   0.45–0.85  lid hinges open, interior fades in
 *   0.85–1.00  settle: rotate back to -15° / +35°
 * From p>0.10 we publish __bridgeFadeOut so the shelf + spines fade away,
 * giving the actor full centre stage in the SAME viewport.
 */
const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);

  // Motion values written imperatively each frame — no spring, no bounce.
  const scale = useMotionValue(0.25);
  const rotX = useMotionValue("0deg");
  const rotY = useMotionValue("0deg");
  const lidRot = useMotionValue("0deg");
  const interiorOpacity = useMotionValue(0);
  const interiorY = useMotionValue(30);

  const [endScale, setEndScale] = useState(1);
  const [hasShelf, setHasShelf] = useState(false);

  // Compute the centre-stage target scale (40% smaller than viewport max).
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

  // Single rAF loop drives everything.
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
      // Total scrollable distance for this pinned section.
      const total = Math.max(1, rect.height - vh);
      // progress from when sticky engages to when it disengages
      const p = clamp(-rect.top / total);

      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;

      const shelf = (window as any).__toolboxRect as
        | { left: number; top: number; width: number; height: number; cx: number; cy: number; visible?: boolean }
        | null;

      // Only show the actor when the shelf has actually settled into view
      // (prevents the toolbox from appearing during the About panel).
      const shelfVisible = !!shelf && shelf.width > 0 && shelf.visible === true;

      // Start (parked-on-shelf) values — align by the BOTTOM of the actor to
      // the bottom of the shelf prop so the body rests ON the plank (no float).
      const TBX_H = TBX_H_BASE + TBX_H_LID; // 240
      let sx = 0, sy = 0, sScale = 0.25;
      if (shelfVisible) {
        sScale = shelf!.width / TBX_W;
        const shelfBottom = shelf!.top + shelf!.height;
        sx = shelf!.cx - screenCx;
        // actor's geometric centre needs to sit (TBX_H*scale)/2 above shelf bottom
        sy = shelfBottom - (TBX_H * sScale) / 2 - screenCy;
        if (!hasShelf) setHasShelf(true);
      }

      // === Position / scale ===
      // 0.00–0.25 park, 0.25–0.45 fly, 0.45–1.00 hold near centre with subtle settle.
      const flyU = easeInOut(seg(0.25, 0.45, p));
      const settleU = seg(0.85, 1.0, p);
      const x = lerp(sx, 0, flyU);
      const y = lerp(sy, 0, flyU) + settleU * 40;
      const scl = lerp(sScale, endScale, flyU) * lerp(1, 0.92, settleU);

      actor.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      scale.set(scl);

      // === Rotations ===
      // Front-on while parked, then flip to top-down between 0.45–0.60, then
      // settle to a 3/4 view between 0.85–1.00.
      const flipU = easeInOut(seg(0.45, 0.6, p));
      const finalU = easeInOut(seg(0.85, 1.0, p));
      const rx = lerp(0, -90, flipU) + finalU * 75; // -90 → -15
      const ry = finalU * 35; // 0 → 35
      rotX.set(`${rx.toFixed(2)}deg`);
      rotY.set(`${ry.toFixed(2)}deg`);

      // === Lid hinge ===
      // Opens 0.55–0.70, holds open, closes 0.92–1.00.
      const lidOpen = easeInOut(seg(0.55, 0.7, p));
      const lidClose = easeInOut(seg(0.92, 1.0, p));
      const lid = lerp(0, 125, lidOpen) * (1 - lidClose);
      lidRot.set(`${lid.toFixed(2)}deg`);

      // === Interior ===
      const intIn = easeInOut(seg(0.62, 0.74, p));
      const intOut = easeInOut(seg(0.92, 1.0, p));
      interiorOpacity.set(intIn * (1 - intOut));
      interiorY.set(lerp(30, 0, intIn));

      // === Publish handoff flags ===
      // Hide shelf prop & fade the whole shelf away as soon as the bridge
      // actually owns the toolbox.
      const owns = !!shelf && p > 0.001 && p < 0.999;
      (window as any).__skillsFlipActive = owns;
      // Shelf + spines fade out shortly after the actor lifts off.
      (window as any).__bridgeFadeOut = clamp(seg(0.2, 0.45, p));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      (window as any).__skillsFlipActive = false;
      (window as any).__bridgeFadeOut = 0;
    };
  }, [endScale, hasShelf, scale, rotX, rotY, lidRot, interiorOpacity, interiorY]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox"
      style={{ height: "220vh" }}
      className="relative"
    >
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        <div
          className="absolute inset-0 flex items-center justify-center [perspective:1200px]"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={actorRef}
            className="relative"
            style={{
              pointerEvents: "auto",
              willChange: "transform",
              opacity: hasShelf ? 1 : 0,
            }}
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
