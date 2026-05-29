import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Toolbox3D, TBX_W, TBX_H_BASE, TBX_H_LID, TBX_D } from "./skills/ToolboxSvg";
import ToolboxInterior from "./skills/ToolboxInterior";

/**
 * Toolbox → Skills bridge.
 * Pinned 260vh section. The SAME 3D toolbox that sits on the projects shelf
 * flies to centre, rotates to a top-down view, the lid hinges back, and the
 * admin-backed skills grid is revealed on the floor of the open tray.
 *
 * Timeline (scroll progress):
 *   0.00–0.05  pre-roll (toolbox is at the shelf's published rect)
 *   0.05–0.20  fly to centre + scale up, slight tilt (-15°, -5°)
 *   0.20–0.30  rotate to top-down (-90°, 0°)
 *   0.30–0.65  lid hinges open (0 → 125°); interior fades in
 *   0.65–0.95  settle on desk (rotate back to -15°, +35°); interior fades out
 */
const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const t = useSpring(scrollYProgress, { stiffness: 70, damping: 20, restDelta: 0.001 });

  // Starting position read from the published shelf-toolbox rect so the centre
  // stage begins exactly where the shelf prop sat → seamless handoff.
  const [start, setStart] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [endScale, setEndScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      if (!slotRef.current) return;
      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;

      const shelf = (window as any).__toolboxRect as
        | { left: number; top: number; width: number; height: number; cx: number; cy: number }
        | null;

      // 40% smaller than viewport-max
      const max = Math.min(
        (window.innerWidth * 0.92) / TBX_W,
        (window.innerHeight * 0.78) / TBX_D,
        1.1
      ) * 0.6;
      setEndScale(max);

      if (shelf && shelf.width > 0) {
        setStart({
          x: shelf.cx - screenCx,
          y: shelf.cy - screenCy,
          scale: shelf.width / TBX_W,
        });
      }
    };
    update();
    const id = setTimeout(update, 120);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const s = start ?? { x: 0, y: 0, scale: 0.25 };

  // Position: park on shelf rect (re-read live below) → centre → settle
  // We hold the actor exactly over the shelf prop until ~0.30 so the handoff
  // happens IN the same viewport as the shelf.
  const x = useTransform(t, [0, 0.3, 0.45, 0.85, 1], [s.x, s.x, 0, 0, 0]);
  const y = useTransform(t, [0, 0.3, 0.45, 0.85, 1], [s.y, s.y, 0, 0, 40]);
  const scale = useTransform(
    t,
    [0, 0.3, 0.45, 0.85, 1],
    [s.scale, s.scale, endScale, endScale, endScale * 0.85]
  );

  // Rotations — start front-on (matches shelf prop), then flip to top-down, then settle.
  const rotX = useTransform(
    t,
    [0, 0.3, 0.45, 0.85, 0.97],
    ["0deg", "0deg", "-90deg", "-90deg", "-15deg"]
  );
  const rotY = useTransform(
    t,
    [0, 0.3, 0.45, 0.85, 0.97],
    ["0deg", "0deg", "0deg", "0deg", "35deg"]
  );

  // Lid hinge — opens after the flip is complete
  const lidRot = useTransform(t, [0.45, 0.55, 0.78, 0.85], ["0deg", "125deg", "125deg", "0deg"]);

  // Interior reveal
  const interiorOpacity = useTransform(t, [0.50, 0.60, 0.78, 0.84], [0, 1, 1, 0]);
  const interiorY = useTransform(t, [0.50, 0.60, 0.78, 0.84], [30, 0, 0, -10]);

  // Section background fade — starts transparent so shelf shows through during park
  const bgOpacity = useTransform(t, [0, 0.25, 0.40, 0.90, 1], [0, 0, 1, 1, 0.3]);


  // Publish 'flip active' so the shelf prop hides whenever the bridge actually
  // owns the toolbox (pin engaged AND we have a valid start rect).
  useEffect(() => {
    const apply = (v: number) => {
      (window as any).__skillsFlipActive = !!start && v > 0.001 && v < 0.999;
    };
    apply(t.get());
    const unsub = t.on("change", apply);
    return () => {
      unsub();
      (window as any).__skillsFlipActive = false;
    };
  }, [t, start]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox"
      style={{ height: "260vh" }}
      className="relative"
    >
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        {/* Dark stage background */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: bgOpacity,
            background:
              "radial-gradient(ellipse at 50% 40%, hsl(220 18% 8%) 0%, hsl(220 22% 5%) 60%, hsl(220 24% 3%) 100%)",
          }}
        />

        {/* slot used purely as a screen-centre anchor for the layout-effect math */}
        <div ref={slotRef} className="absolute left-1/2 top-1/2 w-1 h-1" aria-hidden />

        {/* Stage with shared perspective */}
        <div
          className="absolute inset-0 flex items-center justify-center [perspective:1200px]"
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            className="relative"
            style={{ x, y, pointerEvents: "auto" }}
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
                  {/* Foam base texture */}
                  <div className="absolute inset-0 opacity-70 bg-[repeating-linear-gradient(45deg,#0c0c0e_0,#0c0c0e_4px,transparent_4px,transparent_8px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_6px)] mix-blend-overlay pointer-events-none" />
                  <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                    <ToolboxInterior />
                  </div>
                </motion.div>
              }
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ToolboxToSkillsBridge;
