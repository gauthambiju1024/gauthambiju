import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * SchematicCallout
 * ----------------
 * A small architect-style annotation that sits in the gap between two panels.
 * As the user scrolls the gap into view, the dashed connector "draws" itself
 * (via stroke-dashoffset) and the label fades in once the line is ~90% drawn.
 *
 * This reuses the same scroll-progress + dashoffset pattern as your existing
 * MarginDoodles — so the technique will feel consistent across the site.
 *
 * Usage:
 *   Place one instance between each pair of panels inside <Index />:
 *
 *     <HeroPanel />
 *     <SchematicCallout fromLabel="measured" toLabel="written" side="left" />
 *     <AboutPanel />
 *     <SchematicCallout fromLabel="written" toLabel="shelved" side="right" />
 *     <ProjectsPanel />
 *     ...
 */

type Props = {
  fromLabel: string;
  toLabel: string;
  side?: "left" | "right";
};

export function SchematicCallout({ fromLabel, toLabel, side = "left" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Track this element's progress through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Draw the line between 20% and 60% of the element's scroll window.
  const pathLength = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  // Reveal the label once the line is nearly complete.
  const labelOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);

  const isLeft = side === "left";

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mx-auto my-2 h-14 w-full max-w-5xl"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 56"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        {/* Dimension tick from panel above */}
        <motion.path
          d={
            isLeft
              ? "M 80 0 L 80 20 L 240 20 L 240 36 L 360 36"
              : "M 720 0 L 720 20 L 560 20 L 560 36 L 440 36"
          }
          stroke="hsl(38 60% 52%)"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
          style={{ pathLength }}
        />
        {/* End caps */}
        <motion.circle
          cx={isLeft ? 80 : 720}
          cy={0}
          r="2"
          fill="hsl(38 60% 52%)"
          style={{ opacity: labelOpacity }}
        />
        <motion.circle
          cx={isLeft ? 360 : 440}
          cy={36}
          r="2"
          fill="hsl(38 60% 52%)"
          style={{ opacity: labelOpacity }}
        />
        {/* Dimension tick into panel below */}
        <motion.path
          d={
            isLeft
              ? "M 360 36 L 480 36 L 480 56"
              : "M 440 36 L 320 36 L 320 56"
          }
          stroke="hsl(38 60% 52%)"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
          style={{ pathLength }}
        />
      </svg>

      {/* Labels — tiny mono, like measurement text */}
      <motion.div
        className={`pointer-events-none absolute top-[14px] font-mono text-[9px] uppercase tracking-[0.15em] text-[hsl(38_60%_52%)] ${
          isLeft ? "left-[90px]" : "right-[90px]"
        }`}
        style={{ opacity: labelOpacity }}
      >
        {fromLabel}
      </motion.div>
      <motion.div
        className={`pointer-events-none absolute top-[30px] font-mono text-[9px] uppercase tracking-[0.15em] text-[hsl(38_60%_52%)] ${
          isLeft ? "left-[370px]" : "right-[370px]"
        }`}
        style={{ opacity: labelOpacity }}
      >
        → {toLabel}
      </motion.div>
    </div>
  );
}
