import { motion, MotionValue, useTransform } from 'framer-motion';

interface ScrollDoodlesProps {
  scrollYProgress: MotionValue<number>;
}

const Ruler = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h20v16H2z" /><path d="M6 4v4M10 4v6M14 4v4M18 4v8" />
  </svg>
);

const Protractor = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12" /><path d="M2 12a10 10 0 0 1 20 0" /><path d="M7 5l5 7" /><path d="M17 5l-5 7" />
  </svg>
);

const Pencil = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const TSquare = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16" /><path d="M12 6v16" /><path d="M8 6V2h8v4" />
  </svg>
);

const Compass = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="6" /><path d="M12 2v6" /><path d="M9 2h6" /><path d="M12 8l-4 12" /><path d="M12 8l4 12" />
  </svg>
);

const Crane = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4" /><path d="M6 4l12-2v4" /><path d="M18 6v4" /><path d="M18 10h-2v6h-2" /><path d="M4 22h4" /><path d="M6 10h3" />
  </svg>
);

const Hammer = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3l6 6-3 3-6-6" /><path d="M12 6L3 21" />
  </svg>
);

const Gear = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);

const Bricks = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="4" /><rect x="2" y="10" width="10" height="4" /><rect x="12" y="10" width="10" height="4" /><rect x="6" y="14" width="12" height="4" />
  </svg>
);

const Wrench = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const Lightbulb = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
  </svg>
);

const BlueprintRoll = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v16a2 2 0 0 0 2 2h12" /><path d="M4 4h16v12H8a4 4 0 0 0-4 4" /><path d="M20 4v12" />
  </svg>
);

const leftDoodles = [Ruler, Protractor, Pencil, TSquare, Compass, Ruler, Pencil];
const rightDoodles = [Crane, Hammer, Gear, Bricks, Wrench, Lightbulb, BlueprintRoll];

const ScrollDoodles = ({ scrollYProgress }: ScrollDoodlesProps) => {
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rightY = useTransform(scrollYProgress, [0, 1], [100, -500]);

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-10">
      {/* Left column */}
      <motion.div
        className="absolute left-3 xl:left-6 top-0 flex flex-col items-center gap-16 pt-24 text-primary/[0.12]"
        style={{ y: leftY }}
      >
        {leftDoodles.map((Icon, i) => (
          <div key={`l-${i}`} className={i % 2 === 0 ? 'rotate-6' : '-rotate-3'}>
            <Icon />
          </div>
        ))}
      </motion.div>

      {/* Right column */}
      <motion.div
        className="absolute right-3 xl:right-6 top-0 flex flex-col items-center gap-20 pt-40 text-primary/[0.12]"
        style={{ y: rightY }}
      >
        {rightDoodles.map((Icon, i) => (
          <div key={`r-${i}`} className={i % 2 === 0 ? '-rotate-6' : 'rotate-3'}>
            <Icon />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollDoodles;
