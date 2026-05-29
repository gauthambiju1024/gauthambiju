/**
 * ToolboxToSkillsBridge — pinned scroll choreography:
 *   1. Library shelves recede upward and fade.
 *   2. 3D landscape toolbox lifts from a slot, rotates open at center, foam
 *      skill tray reveals on the interior floor.
 *   3. Toolbox rotates back to 3/4 view and lands on the FinalWorkbench desk
 *      scene (laptop, field notes, plant, lamp, mug, notebook).
 *
 * Background scenery from the source has been removed so the scene inherits
 * the site's walnut + ghost-grid background and MarginDoodles stay visible
 * on either side.
 */
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { SKILLS } from "./skills/skillsData";
import { FinalWorkbench } from "./skills/FinalWorkbench";

// Landscape toolbox proportions
const W = 800;
const H_BASE = 160;
const H_LID = 80;
const D = 500;

// Library shelf UI removed — the toolbox now lifts off the real ProjectsShelf
// toolbox rendered by AboutToProjectsBridge above. We track its rect via
// window.__toolboxRect for a pixel-perfect handoff.

const Face = ({
  w,
  h,
  transform,
  className,
  children,
  bg = "bg-[#1f2125]",
  innerBlur = false,
  pointerEvents = "none",
}: {
  w: number;
  h: number;
  transform: string;
  className?: string;
  children?: React.ReactNode;
  bg?: string;
  innerBlur?: boolean;
  pointerEvents?: "auto" | "none";
}) => (
  <div
    className={`absolute left-1/2 top-1/2 [backface-visibility:hidden] ${className ?? ""} ${bg}`}
    style={{
      width: w,
      height: h,
      marginLeft: -w / 2,
      marginTop: -h / 2,
      transform,
      pointerEvents,
    }}
  >
    {innerBlur && (
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] pointer-events-none" />
    )}
    {children}
  </div>
);

const InnerApp = ({ contentOpacity, contentY }: { contentOpacity: any; contentY: any }) => (
  <motion.div
    style={{ opacity: contentOpacity, y: contentY }}
    className="w-full h-full bg-[#121316] p-6 flex flex-col gap-6 relative rounded-md shadow-[inset_0_20px_50px_rgba(0,0,0,1)] overflow-hidden border-[8px] border-[#0b0c0e]"
  >
    <div className="absolute inset-0 opacity-80 bg-[repeating-linear-gradient(45deg,#0c0c0e_0,#0c0c0e_4px,transparent_4px,transparent_8px),repeating-linear-gradient(-45deg,#111_0,#111_4px,transparent_4px,transparent_8px)] mix-blend-overlay pointer-events-none" />

    <div className="relative z-10 flex-1 grid grid-cols-3 gap-6 h-full">
      {(Object.keys(SKILLS) as Array<keyof typeof SKILLS>).map((category, idx) => (
        <div key={category} className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-2 mb-3 mt-1">
            <div
              className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                idx === 0
                  ? "text-blue-500 bg-blue-500/80"
                  : idx === 1
                  ? "text-orange-500 bg-orange-500/80"
                  : "text-emerald-500 bg-emerald-500/80"
              }`}
            />
            <h2 className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase">
              {category}
            </h2>
          </div>

          <div className="flex-1 bg-[#0a0a0c]/80 p-3 rounded-xl shadow-[inset_0_10px_20px_rgba(0,0,0,1)] border border-white/[0.02] grid grid-rows-[repeat(auto-fill,minmax(40px,1fr))] gap-2 relative overflow-y-auto hide-scrollbar">
            {SKILLS[category].map((skill) => (
              <div key={skill} className="relative group perspective-1000 h-[45px]">
                <div className="absolute inset-0 bg-[#050505] rounded-[4px] shadow-[inset_0_4px_8px_rgba(0,0,0,1)]" />
                <div className="absolute inset-0.5 bg-gradient-to-b from-[#2a2c30] to-[#1a1b1e] rounded-[3px] shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#333] flex items-center justify-center p-2 group-hover:-translate-y-1 group-hover:scale-[1.02] transition-transform duration-200 cursor-default">
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 text-center leading-tight">
                    {skill}
                  </span>
                  <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#111] shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const ToolboxToSkillsBridge = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, startScale: 0.4, endScale: 1 });
  const [finalPos, setFinalPos] = useState({ x: -320, y: 180, scale: 0.8 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  useLayoutEffect(() => {
    let lastRect: { cx: number; cy: number; width: number } | null = null;
    const update = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Pull live position of the realistic shelf toolbox from
      // AboutToProjectsBridge. Cache the last seen rect so we still have a
      // sane origin once the user has scrolled past the projects section.
      const tr = (window as any).__toolboxRect as
        | { cx: number; cy: number; width: number; height: number }
        | undefined;
      if (tr && tr.width > 0) {
        lastRect = { cx: tr.cx, cy: tr.cy, width: tr.width };
      }
      if (lastRect) {
        const maxScale = Math.min(
          (window.innerWidth * 0.9) / W,
          (window.innerHeight * 0.85) / D,
          1.1,
        );
        setPos({
          x: lastRect.cx - centerX,
          y: lastRect.cy - centerY,
          startScale: lastRect.width / W,
          endScale: maxScale,
        });
      }

      const finalEl = document.querySelector(".final-toolbox");
      if (finalEl) {
        const fRect = finalEl.getBoundingClientRect();
        setFinalPos({
          x: fRect.left + fRect.width / 2 - centerX,
          y: fRect.top + fRect.height / 2 - centerY,
          scale: Math.max(fRect.width / W, 0.25),
        });
      }
    };
    update();
    let raf = 0;
    const loop = () => {
      update();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      (window as any).__toolboxInFlight = false;
    };
  }, []);

  // Tell AboutToProjectsBridge to hide its shelf toolbox while ours is flying.
  useEffect(() => {
    const unsub = smoothProgress.on("change", (v) => {
      (window as any).__toolboxInFlight = v > 0.001 && v < 0.995;
    });
    return () => unsub();
  }, [smoothProgress]);

  const cxAnim = useTransform(smoothProgress, [0, 0.25, 0.75, 0.95], [pos.x, 0, 0, finalPos.x]);
  const cyAnim = useTransform(smoothProgress, [0, 0.25, 0.75, 0.95], [pos.y, 0, 0, finalPos.y]);

  const zWrapper = useTransform(smoothProgress, [0, 0.25, 0.75, 0.95], [-D / 2, 0, 0, 40]);
  const cScale = useTransform(
    smoothProgress,
    [0, 0.25, 0.75, 0.95],
    [pos.startScale, pos.endScale, pos.endScale, finalPos.scale],
  );

  const rotX = useTransform(
    smoothProgress,
    [0, 0.15, 0.25, 0.75, 0.95],
    ["0deg", "-15deg", "-90deg", "-90deg", "-15deg"],
  );
  const rotY = useTransform(
    smoothProgress,
    [0, 0.15, 0.25, 0.75, 0.95],
    ["0deg", "-5deg", "0deg", "0deg", "35deg"],
  );

  const lidRotX = useTransform(
    smoothProgress,
    [0.3, 0.42, 0.6, 0.72],
    ["0deg", "125deg", "125deg", "0deg"],
  );

  const contentOpacity = useTransform(smoothProgress, [0.38, 0.46, 0.58, 0.66], [0, 1, 1, 0]);
  const contentY = useTransform(smoothProgress, [0.38, 0.46, 0.58, 0.66], [40, 0, 0, -20]);

  const tableOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const tableY = useTransform(smoothProgress, [0.85, 0.95], [100, 0]);

  return (
    <div
      ref={containerRef}
      id="skills"
      className="relative w-full"
      style={{ height: "450vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Final workbench desk scene */}
        <motion.div
          className="absolute inset-0 z-[80]"
          style={{ opacity: tableOpacity, y: tableY, pointerEvents: "none" }}
        >
          <FinalWorkbench />
        </motion.div>


        {/* 3D Toolbox entity */}
        <motion.div className="absolute inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 flex items-center justify-center [perspective:2500px]"
            style={{ x: cxAnim, y: cyAnim }}
          >
            <motion.div
              className="relative [transform-style:preserve-3d]"
              style={{
                width: W,
                height: H_BASE + H_LID,
                z: zWrapper,
                rotateX: rotX,
                rotateY: rotY,
                scale: cScale,
              }}
            >
              {/* BASE */}
              <div
                className="absolute inset-x-0 bottom-0 [transform-style:preserve-3d]"
                style={{ height: H_BASE }}
              >
                <Face
                  w={W}
                  h={H_BASE}
                  transform={`translateZ(${D / 2}px)`}
                  className="bg-[#0a0e12] border-x border-b border-t border-[rgba(184,146,74,0.30)] rounded-b-lg shadow-inner overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_4px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20 pointer-events-none" />
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-[8%] w-[40px] h-[80px] flex gap-[5px] opacity-20 transform -skew-x-12 mix-blend-overlay">
                    <div className="w-1.5 h-full bg-yellow-400" />
                    <div className="w-1.5 h-full bg-yellow-400" />
                    <div className="w-1.5 h-full bg-yellow-400" />
                    <div className="w-1.5 h-full bg-yellow-400" />
                  </div>
                  <div className="absolute top-0 w-full px-32 flex justify-between z-10">
                    <div className="w-20 h-16 bg-[rgba(10,14,18,0.96)] rounded-b shadow-[0_6px_15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(184,146,74,0.2)] flex flex-col items-center justify-end pb-2 border border-[rgba(184,146,74,0.40)] relative overflow-hidden">
                      <div className="absolute flex justify-between w-full px-2 top-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                      </div>
                      <span className="absolute top-1 font-mono text-[8px] font-bold text-[var(--bd-gold-hi)] opacity-40 tracking-widest pl-0.5 mix-blend-overlay">
                        L-01
                      </span>
                      <div className="absolute top-2 w-[80%] h-1 bg-[rgba(184,146,74,0.2)] rounded-full" />
                      <div className="w-6 h-4 bg-[#0a0e12] rounded border border-[rgba(184,146,74,0.40)] shadow-[inset_0_2px_4px_rgba(184,146,74,0.1),inset_0_-2px_4px_rgba(0,0,0,0.9)]" />
                    </div>
                    <div className="w-20 h-16 bg-[rgba(10,14,18,0.96)] rounded-b shadow-[0_6px_15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(184,146,74,0.2)] flex flex-col items-center justify-end pb-2 border border-[rgba(184,146,74,0.40)] relative overflow-hidden">
                      <div className="absolute flex justify-between w-full px-2 top-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                      </div>
                      <span className="absolute top-1 font-mono text-[8px] font-bold text-[var(--bd-gold-hi)] opacity-40 tracking-widest pl-0.5 mix-blend-overlay">
                        R-02
                      </span>
                      <div className="absolute top-2 w-[80%] h-1 bg-[rgba(184,146,74,0.2)] rounded-full" />
                      <div className="w-6 h-4 bg-[#0a0e12] rounded border border-[rgba(184,146,74,0.40)] shadow-[inset_0_2px_4px_rgba(184,146,74,0.1),inset_0_-2px_4px_rgba(0,0,0,0.9)]" />
                    </div>
                  </div>
                  <div className="absolute top-[55%] left-24 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-[12px] h-20 bg-gradient-to-b from-yellow-500/10 to-transparent absolute -top-[45px] blur-sm pointer-events-none" />
                    <div className="px-8 py-3 bg-[rgba(10,14,18,0.95)] rounded font-mono text-[18px] tracking-[0.4em] text-[var(--bd-gold-hi)] border border-[rgba(184,146,74,0.3)] shadow-[inset_0_2px_1px_rgba(255,255,255,0.05),0_5px_15px_rgba(0,0,0,0.8)] z-10 font-bold uppercase flex flex-col items-center gap-1">
                      <span className="text-[var(--bd-gold)] font-mono text-[9px] tracking-[0.3em] relative top-1 bg-[rgba(5,8,10,0.92)] px-2 rounded-sm border border-[rgba(184,146,74,0.2)] shadow-inner pb-0.5">
                        SYS_MDL
                      </span>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="w-2 h-2 rounded-full bg-[rgba(184,146,74,0.3)] shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.1)]" />
                        <span className="drop-shadow-[0_0_10px_rgba(184,146,74,0.4)] text-[22px] font-medium tracking-[0.3em] leading-none">
                          CORE
                        </span>
                        <div className="w-2 h-2 rounded-full bg-[rgba(184,146,74,0.3)] shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.1)]" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-[-1px] left-[-1px] w-12 h-12 border-l-[3px] border-b-[3px] border-[rgba(184,146,74,0.40)] rounded-bl-lg mix-blend-screen opacity-50" />
                  <div className="absolute bottom-[-1px] right-[-1px] w-12 h-12 border-r-[3px] border-b-[3px] border-[rgba(184,146,74,0.40)] rounded-br-lg mix-blend-screen opacity-50" />
                </Face>

                <Face
                  w={W}
                  h={H_BASE}
                  transform={`translateZ(-${D / 2}px) rotateY(180deg)`}
                  className="bg-[#0a0e12] border-x border-b border-[rgba(184,146,74,0.30)] rounded-b-lg"
                >
                  <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(184,146,74,0.5)_3px,rgba(184,146,74,0.5)_4px)]" />
                </Face>

                <Face w={D} h={H_BASE} transform={`translateX(-${W / 2}px) rotateY(-90deg)`} className="bg-[#0a0e12] border-x border-b border-[rgba(184,146,74,0.3)] rounded-b-lg" />
                <Face w={D} h={H_BASE} transform={`translateX(${W / 2}px) rotateY(90deg)`} className="bg-[#0a0e12] border-x border-b border-[rgba(184,146,74,0.3)] rounded-b-lg" />
                <Face w={W} h={D} transform={`translateY(${H_BASE / 2}px) rotateX(-90deg)`} bg="bg-[#08090a] rounded-lg" />

                <Face w={W} h={H_BASE} transform={`translateZ(${D / 2 - 4}px) rotateY(180deg)`} bg="bg-[#0b0c0e]" innerBlur />
                <Face w={W} h={H_BASE} transform={`translateZ(-${D / 2 - 4}px)`} bg="bg-[#0b0c0e]" innerBlur />
                <Face w={D} h={H_BASE} transform={`translateX(-${W / 2 - 4}px) rotateY(90deg)`} bg="bg-[#0b0c0e]" innerBlur />
                <Face w={D} h={H_BASE} transform={`translateX(${W / 2 - 4}px) rotateY(-90deg)`} bg="bg-[#0b0c0e]" innerBlur />

                <Face
                  w={W}
                  h={D}
                  transform={`translateY(${H_BASE / 2 - 4}px) rotateX(90deg)`}
                  bg="bg-[#050505] rounded-md"
                  pointerEvents="auto"
                >
                  <InnerApp contentOpacity={contentOpacity} contentY={contentY} />
                </Face>
              </div>

              {/* LID */}
              <motion.div
                className="absolute inset-x-0 top-0 [transform-style:preserve-3d]"
                style={{
                  height: H_LID,
                  transformOrigin: `50% 100% -${D / 2}px`,
                  rotateX: lidRotX,
                }}
              >
                <Face
                  w={W}
                  h={H_LID}
                  transform={`translateZ(${D / 2}px)`}
                  className="bg-[#0a0e12] border-x border-t border-[rgba(184,146,74,0.30)] rounded-t-lg shadow-[inset_0_2px_10px_rgba(184,146,74,0.05)] overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_4px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40" />
                  <div className="absolute bottom-0 w-full px-32 flex justify-between z-10">
                    <div className="w-20 h-10 bg-[rgba(10,14,18,0.96)] rounded-t-lg shadow-[inset_0_2px_10px_rgba(184,146,74,0.1)] border border-[rgba(184,146,74,0.40)] border-b-0 relative overflow-hidden">
                      <div className="absolute bottom-2 w-[80%] left-[10%] h-1 bg-[rgba(184,146,74,0.3)] rounded-full shadow-inner" />
                      <div className="absolute flex justify-between w-full px-[6px] bottom-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                      </div>
                    </div>
                    <div className="w-20 h-10 bg-[rgba(10,14,18,0.96)] rounded-t-lg shadow-[inset_0_2px_10px_rgba(184,146,74,0.1)] border border-[rgba(184,146,74,0.40)] border-b-0 relative overflow-hidden">
                      <div className="absolute bottom-2 w-[80%] left-[10%] h-1 bg-[rgba(184,146,74,0.3)] rounded-full shadow-inner" />
                      <div className="absolute flex justify-between w-full px-[6px] bottom-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[rgba(184,146,74,0.5)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 w-64 h-[50px] [transform-style:preserve-3d]">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`absolute inset-0 border-[14px] ${i === 0 ? "border-[#0a0e12]" : "border-[#05080a]"} border-b-0 rounded-t-2xl z-0 shadow-sm`}
                        style={{ transform: `translateZ(-${i * 4}px)` }}
                      />
                    ))}
                    <div
                      className="absolute inset-0 border-[16px] border-[#020304] border-b-0 rounded-t-2xl shadow-[inset_0_0_10px_rgba(0,0,0,1)]"
                      style={{ transform: "translateZ(-10px) scale(1.02)" }}
                    />
                  </div>
                  <div className="absolute top-[-1px] left-[-1px] w-12 h-12 border-l-4 border-t-4 border-[rgba(184,146,74,0.40)] rounded-tl-lg mix-blend-screen opacity-50 z-20" />
                  <div className="absolute top-[-1px] right-[-1px] w-12 h-12 border-r-4 border-t-4 border-[rgba(184,146,74,0.40)] rounded-tr-lg mix-blend-screen opacity-50 z-20" />
                </Face>

                <Face
                  w={W}
                  h={H_LID}
                  transform={`translateZ(-${D / 2}px) rotateY(180deg)`}
                  className="bg-[#0a0e12] border-x border-t border-[rgba(184,146,74,0.3)] rounded-t-lg"
                >
                  <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(184,146,74,0.5)_3px,rgba(184,146,74,0.5)_4px)]" />
                </Face>
                <Face w={D} h={H_LID} transform={`translateX(-${W / 2}px) rotateY(-90deg)`} className="bg-[#0a0e12] border-[rgba(184,146,74,0.3)] rounded-t-lg" />
                <Face w={D} h={H_LID} transform={`translateX(${W / 2}px) rotateY(90deg)`} className="bg-[#0a0e12] border-[rgba(184,146,74,0.3)] rounded-t-lg" />
                <Face
                  w={W}
                  h={D}
                  transform={`translateY(-${H_LID / 2}px) rotateX(90deg)`}
                  className="bg-[#0a0e12] border border-[rgba(184,146,74,0.4)] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] rounded-lg"
                >
                  <div className="absolute inset-10 border border-[rgba(184,146,74,0.1)] shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded pointer-events-none" />
                  <div className="absolute inset-20 border border-[rgba(184,146,74,0.1)] shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded pointer-events-none" />
                </Face>
                <Face w={W} h={H_LID} transform={`translateZ(${D / 2 - 4}px) rotateY(180deg)`} bg="bg-[#040608]" innerBlur />
                <Face w={W} h={H_LID} transform={`translateZ(-${D / 2 - 4}px)`} bg="bg-[#040608]" innerBlur />
                <Face w={D} h={H_LID} transform={`translateX(-${W / 2 - 4}px) rotateY(90deg)`} bg="bg-[#040608]" innerBlur />
                <Face w={D} h={H_LID} transform={`translateX(${W / 2 - 4}px) rotateY(-90deg)`} bg="bg-[#040608]" innerBlur />
                <Face
                  w={W}
                  h={D}
                  transform={`translateY(-${H_LID / 2 - 4}px) rotateX(-90deg)`}
                  className="bg-[#020304] rounded-lg"
                >
                  <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#070a0d_0,#070a0d_10px,transparent_10px,transparent_20px)] shadow-[inset_0_0_120px_rgba(0,0,0,1)]" />
                </Face>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolboxToSkillsBridge;
