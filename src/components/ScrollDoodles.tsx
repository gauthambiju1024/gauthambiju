import { motion, MotionValue, useTransform } from 'framer-motion';

interface ScrollDoodlesProps {
  scrollYProgress: MotionValue<number>;
}

// SVG path data for each doodle
const leftDoodlePaths = [
  // Ruler
  ['M2 4h20v16H2z', 'M6 4v4', 'M10 4v6', 'M14 4v4', 'M18 4v8'],
  // Protractor
  ['M12 22V12', 'M2 12a10 10 0 0 1 20 0', 'M7 5l5 7', 'M17 5l-5 7'],
  // Pencil
  ['M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'],
  // T-Square
  ['M4 6h16', 'M12 6v16', 'M8 6V2h8v4'],
  // Compass
  ['M12 2v6', 'M9 2h6', 'M12 8l-4 12', 'M12 8l4 12'],
  // Bar Chart
  ['M4 20V10', 'M9 20V6', 'M14 20V12', 'M19 20V4', 'M2 20h20'],
  // Curly Braces
  ['M8 2c-3 0-4 2-4 4v4c0 2-2 2-2 2s2 0 2 2v4c0 2 1 4 4 4', 'M16 2c3 0 4 2 4 4v4c0 2 2 2 2 2s-2 0-2 2v4c0 2-1 4-4 4'],
  // Grid
  ['M2 2h20v20H2z', 'M2 8h20', 'M2 14h20', 'M8 2v20', 'M14 2v20'],
  // Coffee Cup
  ['M5 6h10v10a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V6z', 'M15 8h2a3 3 0 0 1 0 6h-2', 'M7 22h6'],
  // Lightbulb
  ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'],
  // Satellite
  ['M12 12l-8 8', 'M20 4l-8 8', 'M14 10l-4 4', 'M6 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0', 'M22 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0'],
  // Paper Plane
  ['M22 2L11 13', 'M22 2L15 22l-4-9-9-4z'],
];

const rightDoodlePaths = [
  // Crane
  ['M6 22V4', 'M6 4l12-2v4', 'M18 6v4', 'M18 10h-2v6h-2', 'M4 22h4', 'M6 10h3'],
  // Hammer
  ['M15 3l6 6-3 3-6-6', 'M12 6L3 21'],
  // Gear
  ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M12 1v4', 'M12 19v4', 'M4.22 4.22l2.83 2.83', 'M16.95 16.95l2.83 2.83', 'M1 12h4', 'M19 12h4', 'M4.22 19.78l2.83-2.83', 'M16.95 7.05l2.83-2.83'],
  // Bricks
  ['M2 6h20v4H2z', 'M2 10h10v4H2z', 'M12 10h10v4H12z', 'M6 14h12v4H6z'],
  // Wrench
  ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
  // Pie Chart
  ['M12 2a10 10 0 1 0 10 10', 'M12 2v10h10'],
  // Terminal
  ['M2 4h20v16H2z', 'M6 9l4 3-4 3', 'M12 16h6'],
  // Pen Tool
  ['M12 2l8 18H4z', 'M12 2v18'],
  // Rocket
  ['M12 2c-4 4-4 8-4 12h8c0-4 0-8-4-12z', 'M8 14l-2 4', 'M16 14l2 4', 'M10 22h4'],
  // Star
  ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  // WiFi/Antenna
  ['M12 20v-8', 'M12 6a8 8 0 0 1 8 8', 'M12 6a8 8 0 0 0-8 8', 'M12 10a4 4 0 0 1 4 4', 'M12 10a4 4 0 0 0-4 4'],
  // Blueprint Roll
  ['M4 4v16a2 2 0 0 0 2 2h12', 'M4 4h16v12H8a4 4 0 0 0-4 4', 'M20 4v12'],
];

interface DoodleItemProps {
  paths: string[];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  rotation: number;
  useGold?: boolean;
}

const DoodleItem = ({ paths, index, total, scrollYProgress, rotation, useGold }: DoodleItemProps) => {
  const start = (index / total) * 0.6;
  const end = Math.min(start + 0.25, 1);

  const drawProgress = useTransform(scrollYProgress, [start, end], [1, 0]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, useGold ? 0.14 : 0.2]);

  return (
    <motion.div style={{ opacity, rotate: rotation }}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={useGold ? 'text-[hsl(var(--gold))]' : 'text-primary'}
      >
        {paths.map((d, pi) => (
          <motion.path
            key={pi}
            d={d}
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: drawProgress }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

const ScrollDoodles = ({ scrollYProgress }: ScrollDoodlesProps) => {
  const leftY = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const rightY = useTransform(scrollYProgress, [0, 1], [100, -700]);

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-10">
      {/* Left column */}
      <motion.div
        className="doodle-column absolute left-3 xl:left-6 top-0 flex flex-col items-center gap-14 pt-24"
        style={{ y: leftY }}
      >
        {leftDoodlePaths.map((paths, i) => (
          <DoodleItem
            key={`l-${i}`}
            paths={paths}
            index={i}
            total={leftDoodlePaths.length}
            scrollYProgress={scrollYProgress}
            rotation={i % 3 === 0 ? 6 : i % 3 === 1 ? -4 : 2}
            useGold={i === 5 || i === 8}
          />
        ))}
      </motion.div>

      {/* Right column */}
      <motion.div
        className="doodle-column absolute right-3 xl:right-6 top-0 flex flex-col items-center gap-16 pt-40"
        style={{ y: rightY }}
      >
        {rightDoodlePaths.map((paths, i) => (
          <DoodleItem
            key={`r-${i}`}
            paths={paths}
            index={i}
            total={rightDoodlePaths.length}
            scrollYProgress={scrollYProgress}
            rotation={i % 3 === 0 ? -5 : i % 3 === 1 ? 3 : -2}
            useGold={i === 5 || i === 9}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollDoodles;
