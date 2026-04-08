import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * BuilderCharacter
 * ----------------
 * A single line-drawn figure that travels down the left gutter as the user scrolls.
 * It swaps poses based on which panel the user is currently reading — at Hero it's
 * drafting, at About it's writing, at Projects it's shelving books, etc.
 *
 * Implementation:
 *   - One fixed-position wrapper anchored to the left margin.
 *   - `useScroll` drives vertical position via `useTransform`.
 *   - Scroll progress is bucketed into 8 panel indices; `AnimatePresence` crossfades
 *     the pose SVGs.
 *
 * Plug-in:
 *   Drop this inside <Index /> once, at the top level, alongside <MarginDoodles />.
 *   It positions itself fixed and does not affect layout.
 */

const POSES: Record<number, JSX.Element> = {
  // 0 — Hero: drafting at a table
  0: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L14 44 M20 30 L26 44" />
      <path d="M20 22 L10 28 M20 22 L30 28" />
      <rect x="4" y="28" width="32" height="2" />
      <path d="M8 28 L8 42 M32 28 L32 42" />
      <path d="M12 24 L16 22" strokeDasharray="1 1" />
    </g>
  ),
  // 1 — About: writing in a notebook
  1: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L16 44 M20 30 L25 44" />
      <path d="M20 22 L14 30 M20 22 L28 28" />
      <rect x="22" y="26" width="12" height="9" rx="1" />
      <path d="M24 29 L32 29 M24 32 L30 32" />
    </g>
  ),
  // 2 — Projects: placing books on a shelf
  2: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L16 44 M20 30 L25 44" />
      <path d="M20 22 L28 16 M20 22 L14 28" />
      <rect x="28" y="10" width="5" height="8" />
      <path d="M4 8 L4 24 M4 8 L14 8 M4 16 L14 16 M4 24 L14 24" />
      <rect x="6" y="10" width="2" height="5" />
      <rect x="9" y="10" width="2" height="5" />
    </g>
  ),
  // 3 — Thinking: pinning notes to a board
  3: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L16 44 M20 30 L25 44" />
      <path d="M20 22 L26 14 M20 22 L14 28" />
      <rect x="26" y="6" width="8" height="8" />
      <circle cx="30" cy="10" r="0.8" fill="currentColor" />
    </g>
  ),
  // 4 — Skills: organizing a toolbox
  4: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L16 44 M20 30 L25 44" />
      <path d="M20 22 L14 30 M20 22 L26 30" />
      <rect x="10" y="32" width="20" height="8" rx="1" />
      <path d="M14 32 L14 28 L26 28 L26 32" />
      <path d="M18 34 L18 38 M22 34 L22 38" />
    </g>
  ),
  // 5 — Journey: walking forward with a lantern
  5: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L14 44 M20 30 L26 42" />
      <path d="M20 22 L28 22 M20 22 L12 28" />
      <circle cx="30" cy="24" r="3" />
      <path d="M30 21 L30 19" />
    </g>
  ),
  // 6 — Writing: typing at a desk
  6: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 28 L16 44 M20 28 L24 44" />
      <path d="M20 20 L14 26 M20 20 L26 26" />
      <rect x="10" y="26" width="20" height="6" rx="1" />
      <path d="M12 28 L28 28" strokeDasharray="1 1" />
    </g>
  ),
  // 7 — Contact: sealing an envelope
  7: (
    <g>
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15 L20 30 L16 44 M20 30 L25 44" />
      <path d="M20 22 L14 28 M20 22 L26 22" />
      <rect x="24" y="18" width="12" height="8" />
      <path d="M24 18 L30 23 L36 18" />
    </g>
  ),
};

// Walking pose for transit — legs mid-stride, arms swinging.
const TRANSIT_POSE = (
  <g>
    <circle cx="20" cy="10" r="5" />
    <path d="M20 15 L20 30 L14 44 M20 30 L26 42" />
    <path d="M20 22 L12 26 M20 22 L28 20" />
  </g>
);

type Phase = { kind: "panel"; index: number } | { kind: "transit" };

export function BuilderCharacter() {
  const { scrollYProgress } = useScroll();

  // Travel range: 10% -> 90% of page height, expressed in viewport units.
  // Tweak these if your first/last panels need a different rest position.
  const y = useTransform(scrollYProgress, [0, 1], ["10vh", "85vh"]);

  const [phase, setPhase] = useState<Phase>({ kind: "panel", index: 0 });

  useEffect(() => {
    // Each of the 8 panels occupies 1/8 of scroll progress. Inside each
    // slice, the middle 60% is "working the panel" and the outer 20% on
    // each side is "in transit."
    const unsubscribe = scrollYProgress.on("change", (p) => {
      const slice = 1 / 8;
      const idx = Math.min(7, Math.floor(p / slice));
      const local = (p - idx * slice) / slice; // 0..1 inside this panel
      if (local > 0.2 && local < 0.8) {
        setPhase({ kind: "panel", index: idx });
      } else {
        setPhase({ kind: "transit" });
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const key =
    phase.kind === "transit" ? "transit" : `pose-${phase.index}`;
  const content = phase.kind === "transit" ? TRANSIT_POSE : POSES[phase.index];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-[14px] z-20 hidden lg:block"
      style={{ top: y }}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.svg
            key={key}
            width="40"
            height="48"
            viewBox="0 0 40 48"
            fill="none"
            stroke="hsl(38 60% 52%)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.75, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {content}
          </motion.svg>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
