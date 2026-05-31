import { useRef } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { STAGGER_STEP } from "@/lib/motion";

interface ScrollRevealOptions {
  offset?: [string, string];
  yRange?: [number, number];
  /**
   * Phase 4: opt-in spring smoothing of the revealed values for buttery,
   * consistent motion. Defaults to false so existing reveals are unchanged.
   */
  spring?: boolean;
  /** Index within a group, used to derive a subtle entrance stagger. */
  index?: number;
}

interface ScrollRevealResult {
  ref: React.RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  /** Suggested transition delay (s) for grouped/staggered reveals. */
  delay: number;
}

export function useScrollReveal(options: ScrollRevealOptions = {}): ScrollRevealResult {
  const { offset = ["start end", "end start"], yRange = [60, 0], spring = false, index = 0 } =
    options;
  const ref = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Reduced motion: fade only, no translation.
  const effectiveYRange: [number, number] = reduced ? [0, 0] : yRange;

  // Map first 35% of scroll progress to full reveal (unchanged default).
  const rawOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const rawY = useTransform(scrollYProgress, [0, 0.35], effectiveYRange);

  // Spring smoothing is opt-in and skipped under reduced motion.
  const useSmooth = spring && !reduced;
  const springCfg = { stiffness: 120, damping: 20, mass: 1 };
  const smoothOpacity = useSpring(rawOpacity, springCfg);
  const smoothY = useSpring(rawY, springCfg);

  const opacity = useSmooth ? smoothOpacity : rawOpacity;
  const y = useSmooth ? smoothY : rawY;

  return {
    ref,
    scrollYProgress,
    opacity,
    y,
    delay: reduced ? 0 : index * STAGGER_STEP,
  };
}

export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null!);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = reduced ? 0 : speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return { ref, y, scrollYProgress };
}
