import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import ToolboxInterior from "./skills/ToolboxInterior";
import { ToolboxLidOnly, ToolboxBodyOnly } from "./skills/ToolboxSvg";


/**
 * ToolboxToSkillsBridge — pinned scroll-driven flip.
 * 0.00–0.30  Closed toolbox scales up and translates to centre.
 * 0.30–0.65  Lid swings open along its hinge; tray container reveals.
 * 0.65–1.00  Interior (skills) fades & scales in; section becomes interactive.
 */
const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  // Tray (body of toolbox) — scales/centres
  const trayScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.55, 1, 1]);
  const trayY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const trayOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Lid — hinge open (rotateX). Lid sits above the tray, hinge at its bottom.
  const lidRotate = useTransform(scrollYProgress, [0.3, 0.65], [0, -135]);
  const lidFilter = useTransform(scrollYProgress, [0.3, 0.65], [
    "drop-shadow(0 10px 15px rgba(0,0,0,0.5))",
    "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
  ]);

  // Interior reveal
  const interiorOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const interiorScale = useTransform(scrollYProgress, [0.45, 0.7], [0.92, 1]);

  // Settle indicator
  const settledOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox"
      style={{ height: "260vh" }}
      className="relative"
    >
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px] pb-6 flex items-center justify-center">
          {/* Stage */}
          <motion.div
            style={{
              y: trayY,
              scale: trayScale,
              opacity: trayOpacity,
              width: "min(92vw, 1100px)",
              height: "min(72vh, 620px)",
              position: "relative",
              perspective: "1200px",
            }}
          >
            {/* Lid (hinged at bottom edge) */}
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                left: 0, right: 0,
                bottom: "100%",
                height: "min(14vh, 92px)",
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
                rotateX: lidRotate,
                filter: lidFilter,
              }}
            >
              <ToolboxLidOnly />

            </motion.div>

            {/* Tray body */}
            <div
              className="rounded-md w-full h-full p-4 md:p-6 relative"
              style={{
                background: "linear-gradient(180deg, hsl(220 6% 22%) 0%, hsl(220 6% 16%) 100%)",
                border: "1px solid hsl(220 6% 10%)",
                boxShadow:
                  "inset 0 1px 0 hsl(220 6% 32%), inset 0 -1px 0 hsl(220 8% 8%), 0 18px 40px -10px rgba(0,0,0,0.6)",
                backgroundImage:
                  "linear-gradient(180deg, hsl(220 6% 22%) 0%, hsl(220 6% 16%) 100%), repeating-linear-gradient(180deg, transparent 0 2px, rgba(255,255,255,0.015) 2px 3px)",
              }}
            >
              {/* Header strip */}
              <motion.div
                className="flex items-center gap-3 mb-4"
                style={{ opacity: settledOpacity }}
              >
                <div className="h-px flex-1" style={{ background: "hsl(220 5% 28%)" }} />
                <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: "hsl(40 6% 52%)" }}>
                  Skills · The Toolbox
                </span>
                <div className="h-px flex-1" style={{ background: "hsl(220 5% 28%)" }} />
              </motion.div>

              {/* Interior */}
              <motion.div
                style={{ opacity: interiorOpacity, scale: interiorScale }}
                className="h-[calc(100%-2rem)]"
              >
                <ToolboxInterior />
              </motion.div>
            </div>

            {/* Subtle drop-shadow under closed/opening toolbox */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: -24,
                width: "70%",
                height: 24,
                background: "radial-gradient(50% 100% at 50% 0%, rgba(0,0,0,0.45), rgba(0,0,0,0))",
                filter: "blur(6px)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ToolboxToSkillsBridge;
