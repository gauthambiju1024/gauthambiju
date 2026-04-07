import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollThread = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90, restDelta: 0.001 });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.15, 0.15, 0]);

  return (
    <div ref={ref} className="fixed inset-0 z-[1] pointer-events-none">
      <svg
        viewBox="0 0 200 2000"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
      >
        <motion.path
          d="M 100 0 C 40 200, 160 300, 100 500 S 30 700, 100 900 S 170 1100, 100 1300 S 40 1500, 100 1700 S 160 1800, 100 2000"
          stroke="hsl(var(--primary))"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={{ pathLength, opacity }}
          fill="none"
        />
      </svg>
    </div>
  );
};

export default ScrollThread;
