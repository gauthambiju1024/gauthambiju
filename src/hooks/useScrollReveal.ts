import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollRevealOptions {
  offset?: [string, string];
  yRange?: [number, number];
}

interface ScrollRevealResult {
  ref: React.RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

export function useScrollReveal(options: ScrollRevealOptions = {}): ScrollRevealResult {
  const { offset = ["start end", "end start"], yRange = [60, 0] } = options;
  const ref = useRef<HTMLDivElement>(null!);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Map first 40% of scroll progress to full reveal
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], yRange);

  return { ref, scrollYProgress, opacity, y };
}

export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null!);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return { ref, y, scrollYProgress };
}
