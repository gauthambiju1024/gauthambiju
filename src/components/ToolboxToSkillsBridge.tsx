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
  const t = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });

  // Starting position read from the published shelf-toolbox rect so the centre
  // stage begins exactly where the shelf prop sat → seamless handoff.
  const [start, setStart] = useState({ x: 0, y: 0, scale: 0.4 });
  const [endScale, setEndScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      if (!slotRef.current) return;
      const slotRect = slotRef.current.getBoundingClientRect();
      const cx = slotRect.left + slotRect.width / 2;
      const cy = slotRect.top + slotRect.height / 2;
      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;

      const shelf = (window as any).__toolboxRect as
        | { left: number; top: number; width: number; height: number; cx: number; cy: number }
        | null;

      const max = Math.min(
        (window.innerWidth * 0.92) / TBX_W,
        (window.innerHeight * 0.78) / TBX_D,
        1.1
      );
      setEndScale(max);

      if (shelf && shelf.width > 0) {
        setStart({
          x: shelf.cx - screenCx,
          y: shelf.cy - screenCy,
          scale: shelf.width / TBX_W,
        });
      } else {
        // Fallback: come up from below if shelf rect not published yet
        setStart({ x: 0, y: window.innerHeight * 0.35, scale: 0.25 });
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

  // Stage X/Y: shelf-rect → centre → centre → desk-settle (slight offset).
  const x = useTransform(t, [0, 0.2, 0.8, 1], [start.x, 0, 0, 0]);
  const y = useTransform(t, [0, 0.2, 0.8, 1], [start.y, 0, 0, 40]);
  const scale = useTransform(
    t,
    [0, 0.05, 0.2, 0.8, 0.95],
    [start.scale, start.scale, endScale, endScale, endScale * 0.85]
  );

  // Rotations: rest → tilt → top-down → hold → desk view
  const rotX = useTransform(
    t,
    [0, 0.05, 0.2, 0.65, 0.95],
    ["0deg", "-12deg", "-90deg", "-90deg", "-15deg"]
  );
  const rotY = useTransform(
    t,
    [0, 0.05, 0.2, 0.65, 0.95],
    ["0deg", "-6deg", "0deg", "0deg", "30deg"]
  );

  // Lid hinge — closed → open → closed-on-settle
  const lidRot = useTransform(t, [0.30, 0.42, 0.65, 0.78], ["0deg", "125deg", "125deg", "0deg"]);

  // Interior reveal — fades in once the lid is mostly open, fades out before settle
  const interiorOpacity = useTransform(t, [0.40, 0.50, 0.65, 0.75], [0, 1, 1, 0]);
  const interiorY = useTransform(t, [0.40, 0.50, 0.65, 0.75], [30, 0, 0, -10]);

  // Section background fade (so the shelf below shows through at start)
  const bgOpacity = useTransform(t, [0, 0.18, 0.82, 1], [0, 1, 1, 0.3]);

  // Publish 'flip active' so the shelf prop can hide while we render the 3D one
  useEffect(() => {
    const unsub = t.on("change", (v) => {
      (window as any).__skillsFlipActive = v > 0.02;
    });
    return () => {
      unsub();
      (window as any).__skillsFlipActive = false;
    };
  }, [t]);

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
          className="absolute inset-0 flex items-center justify-center [perspective:2500px]"
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
