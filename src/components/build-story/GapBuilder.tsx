import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * GapBuilder
 * ----------
 * Lives INSIDE the horizontal gap between two stacked panels.
 *
 * As the user scrolls past the gap, the character:
 *   1. Walks in from the left edge (real 2-frame walk cycle via rAF)
 *   2. Crosses the gap while scroll progress advances
 *   3. Stops on the right and performs a panel-specific action
 *   4. Leaves behind a small residue mark
 *
 * This does NOT use `position: fixed` — the component sits in normal document
 * flow as a 96px tall strip between panels. Each gap gets its own instance
 * with its own `action` prop, so you place 7 of them between the 8 panels.
 *
 * Usage in Index.tsx:
 *
 *   <HeroPanel />
 *   <GapBuilder action="write" label="measured → written" />
 *   <AboutPanel />
 *   <GapBuilder action="shelve" label="written → shelved" />
 *   <ProjectsShelf />
 *   <GapBuilder action="pin" label="shelved → pinned" />
 *   <ThinkingWall />
 *   <GapBuilder action="equip" label="pinned → equipped" />
 *   <SkillsToolbox />
 *   <GapBuilder action="walk" label="equipped → travelled" />
 *   <JourneyTimeline />
 *   <GapBuilder action="type" label="travelled → written up" />
 *   <WritingDesk />
 *   <GapBuilder action="seal" label="written up → sent" />
 *   <ContactClosing />
 */

type Action = "write" | "shelve" | "pin" | "equip" | "walk" | "type" | "seal";

type Props = {
  action: Action;
  label?: string;
  /** Set reverse=true to have the character walk right-to-left instead. */
  reverse?: boolean;
};

const CHAR_COLOR = "hsl(38 60% 62%)";
const INK_COLOR = "hsl(38 60% 52%)";

export function GapBuilder({ action, label, reverse = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const charGroupRef = useRef<SVGGElement>(null);
  const leftLegRef = useRef<SVGLineElement>(null);
  const rightLegRef = useRef<SVGLineElement>(null);
  const leftArmRef = useRef<SVGLineElement>(null);
  const rightArmRef = useRef<SVGLineElement>(null);
  const bodyRef = useRef<SVGGElement>(null);

  // Track this gap's progress through the viewport.
  // 0 = top of gap is at bottom of viewport; 1 = bottom of gap is at top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to character X position (percentage of gap width).
  // 0.2 -> enter, 0.7 -> arrive, 0.7-1.0 -> perform action.
  const xPct = useTransform(
    scrollYProgress,
    [0.2, 0.7, 1],
    reverse ? [100, 0, 0] : [0, 100, 100]
  );

  // Phase tracks what the character is doing so the action pose can render.
  const [phase, setPhase] = useState<"idle" | "walking" | "acting">("idle");

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p < 0.2 || p > 0.95) setPhase("idle");
    else if (p < 0.7) setPhase("walking");
    else setPhase("acting");
  });

  // Walk cycle — animate limbs via rAF while walking.
  // This runs independently of scroll so legs keep moving at a natural cadence
  // even if the user scrolls slowly.
  useEffect(() => {
    if (phase !== "walking") return;
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.18;
      const stride = Math.sin(t);
      const counter = Math.sin(t + Math.PI);
      const bob = Math.abs(Math.sin(t)) * 1.2;

      if (leftLegRef.current) {
        leftLegRef.current.setAttribute("x2", String(stride * 4));
        leftLegRef.current.setAttribute("y2", String(32 - Math.abs(stride) * 2));
      }
      if (rightLegRef.current) {
        rightLegRef.current.setAttribute("x2", String(counter * 4));
        rightLegRef.current.setAttribute("y2", String(32 - Math.abs(counter) * 2));
      }
      if (leftArmRef.current) {
        leftArmRef.current.setAttribute("x2", String(-6 + counter * 3));
        leftArmRef.current.setAttribute("y2", String(16 + counter * 2));
      }
      if (rightArmRef.current) {
        rightArmRef.current.setAttribute("x2", String(6 + stride * 3));
        rightArmRef.current.setAttribute("y2", String(16 + stride * 2));
      }
      if (bodyRef.current) {
        bodyRef.current.setAttribute("transform", `translate(0, ${-bob})`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Action pose animation — a separate rAF loop for the "doing the thing" phase.
  useEffect(() => {
    if (phase !== "acting") return;
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.12;
      const osc = Math.sin(t);

      // Reset legs to standing
      if (leftLegRef.current) {
        leftLegRef.current.setAttribute("x2", "-2");
        leftLegRef.current.setAttribute("y2", "32");
      }
      if (rightLegRef.current) {
        rightLegRef.current.setAttribute("x2", "2");
        rightLegRef.current.setAttribute("y2", "32");
      }
      if (bodyRef.current) {
        bodyRef.current.setAttribute("transform", "translate(0, 0)");
      }

      // Each action drives a different limb animation
      switch (action) {
        case "write":
        case "type":
          if (rightArmRef.current) {
            rightArmRef.current.setAttribute("x2", String(10 + osc * 1.5));
            rightArmRef.current.setAttribute("y2", String(20 + Math.abs(osc) * 0.5));
          }
          if (leftArmRef.current) {
            leftArmRef.current.setAttribute("x2", "-4");
            leftArmRef.current.setAttribute("y2", "18");
          }
          break;
        case "shelve":
        case "pin":
          if (rightArmRef.current) {
            rightArmRef.current.setAttribute("x2", String(8));
            rightArmRef.current.setAttribute("y2", String(4 - Math.abs(osc) * 3));
          }
          if (leftArmRef.current) {
            leftArmRef.current.setAttribute("x2", "-4");
            leftArmRef.current.setAttribute("y2", "18");
          }
          break;
        case "equip":
          if (rightArmRef.current) {
            rightArmRef.current.setAttribute("x2", String(8 + osc * 2));
            rightArmRef.current.setAttribute("y2", String(20));
          }
          if (leftArmRef.current) {
            leftArmRef.current.setAttribute("x2", String(-8 - osc * 2));
            leftArmRef.current.setAttribute("y2", "20");
          }
          break;
        case "walk":
          // Continue walking in place
          if (rightArmRef.current) {
            rightArmRef.current.setAttribute("x2", String(6 + osc * 3));
            rightArmRef.current.setAttribute("y2", String(16 + osc * 2));
          }
          if (leftArmRef.current) {
            leftArmRef.current.setAttribute("x2", String(-6 - osc * 3));
            leftArmRef.current.setAttribute("y2", String(16 - osc * 2));
          }
          break;
        case "seal":
          if (rightArmRef.current) {
            rightArmRef.current.setAttribute("x2", String(6));
            rightArmRef.current.setAttribute("y2", String(12 + Math.abs(osc) * 4));
          }
          if (leftArmRef.current) {
            leftArmRef.current.setAttribute("x2", "-6");
            leftArmRef.current.setAttribute("y2", "18");
          }
          break;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, action]);

  // Idle reset — return to neutral pose
  useEffect(() => {
    if (phase !== "idle") return;
    if (leftLegRef.current) {
      leftLegRef.current.setAttribute("x2", "-2");
      leftLegRef.current.setAttribute("y2", "32");
    }
    if (rightLegRef.current) {
      rightLegRef.current.setAttribute("x2", "2");
      rightLegRef.current.setAttribute("y2", "32");
    }
    if (leftArmRef.current) {
      leftArmRef.current.setAttribute("x2", "-6");
      leftArmRef.current.setAttribute("y2", "16");
    }
    if (rightArmRef.current) {
      rightArmRef.current.setAttribute("x2", "6");
      rightArmRef.current.setAttribute("y2", "16");
    }
    if (bodyRef.current) {
      bodyRef.current.setAttribute("transform", "translate(0, 0)");
    }
  }, [phase]);

  const xStr = useTransform(xPct, (v) => `${v}%`);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mx-auto my-2 h-24 w-full max-w-5xl overflow-visible"
    >
      {/* Subtle dashed guide line the character walks along */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 96"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <line
          x1="40"
          y1="48"
          x2="760"
          y2="48"
          stroke={INK_COLOR}
          strokeWidth="0.5"
          strokeDasharray="2 6"
          opacity="0.35"
        />
      </svg>

      {/* The character — absolutely positioned, x driven by scroll. */}
      <motion.div
        className="absolute top-[20px]"
        style={{
          left: xStr,
          x: "-20px", // centre the 40px-wide svg on its anchor
        }}
      >
        <svg width="40" height="56" viewBox="-12 -10 52 56" fill="none">
          <g ref={charGroupRef}>
            <g ref={bodyRef}>
              <line
                ref={leftLegRef}
                x1="0"
                y1="18"
                x2="-2"
                y2="32"
                stroke={CHAR_COLOR}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                ref={rightLegRef}
                x1="0"
                y1="18"
                x2="2"
                y2="32"
                stroke={CHAR_COLOR}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="18"
                stroke={CHAR_COLOR}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                ref={leftArmRef}
                x1="0"
                y1="6"
                x2="-6"
                y2="16"
                stroke={CHAR_COLOR}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                ref={rightArmRef}
                x1="0"
                y1="6"
                x2="6"
                y2="16"
                stroke={CHAR_COLOR}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle
                cx="0"
                cy="-4"
                r="4"
                stroke={CHAR_COLOR}
                strokeWidth="1.6"
              />
              {/* Prop in hand — changes per action, only visible during "acting" */}
              {phase === "acting" && <ActionProp action={action} />}
            </g>
          </g>
        </svg>
      </motion.div>

      {/* Label — tiny mono caption at the end of the gap, fades in on arrival */}
      {label && (
        <motion.div
          className="pointer-events-none absolute bottom-1 right-12 font-mono text-[9px] uppercase tracking-[0.15em]"
          style={{
            color: INK_COLOR,
            opacity: useTransform(scrollYProgress, [0.75, 0.9], [0, 0.75]),
          }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

/** Small prop held by the character during its action phase. */
function ActionProp({ action }: { action: Action }) {
  switch (action) {
    case "write":
    case "type":
      return (
        <g>
          <rect
            x="4"
            y="14"
            width="14"
            height="10"
            fill="hsl(36 37% 96%)"
            stroke="hsl(218 30% 21%)"
            strokeWidth="0.6"
          />
          <line
            x1="6"
            y1="17"
            x2="14"
            y2="17"
            stroke="hsl(218 30% 21%)"
            strokeWidth="0.4"
          />
          <line
            x1="6"
            y1="20"
            x2="12"
            y2="20"
            stroke="hsl(218 30% 21%)"
            strokeWidth="0.4"
          />
        </g>
      );
    case "shelve":
      return (
        <rect
          x="6"
          y="-2"
          width="4"
          height="10"
          fill="none"
          stroke={CHAR_COLOR}
          strokeWidth="1"
        />
      );
    case "pin":
      return (
        <g>
          <rect
            x="6"
            y="-2"
            width="6"
            height="6"
            fill="hsl(50 80% 70%)"
            opacity="0.8"
          />
        </g>
      );
    case "equip":
      return (
        <path
          d="M 6 14 L 10 10 L 12 12 L 14 16"
          stroke={CHAR_COLOR}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      );
    case "walk":
      return null;
    case "seal":
      return (
        <rect
          x="4"
          y="10"
          width="12"
          height="8"
          fill="none"
          stroke={CHAR_COLOR}
          strokeWidth="1"
        />
      );
  }
}
