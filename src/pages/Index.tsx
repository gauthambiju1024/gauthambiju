import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";
import DeskConnector from "@/components/DeskConnectors";

const panelSections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-[hsl(var(--shelf-wood-light)/0.3)]' },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/40' },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/30' },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/20' },
  { key: 'writing', Component: WritingDesk, bg: 'editorial-bg', border: 'border-[hsl(var(--notebook-border)/0.3)]' },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent' },
];

/* Animated panel wrapper with dynamic shadow based on scroll position */
const AnimatedPanel = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const ref = useRef<HTMLDivElement>(null!);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Dynamic shadow: intensifies when centered in viewport
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.15, 0.35, 0.5, 0.35, 0.15]);
  const shadowY = useTransform(scrollYProgress, [0, 0.5, 1], [8, 25, 8]);
  const shadowBlur = useTransform(scrollYProgress, [0, 0.5, 1], [24, 80, 24]);

  // Subtle parallax for even panels
  const parallaxY = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [0, 0] : [6, -6]);

  const boxShadow = useTransform(
    [shadowOpacity, shadowY, shadowBlur],
    ([op, sy, sb]: number[]) =>
      `0 ${sy}px ${sb}px -12px hsl(0 0% 0% / ${op}), 0 8px 24px -4px hsl(0 0% 0% / ${op * 0.5})`
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.05 }}
      style={{ y: parallaxY }}
      className="will-change-transform"
    >
      <motion.div style={{ boxShadow }} className="rounded-2xl">
        {children}
      </motion.div>
    </motion.div>
  );
};

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen desk-pattern" style={{ background: 'hsl(var(--background))' }}>
      <MarginDoodles />

      <div className="margin-content-wrapper">

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Hero — Blueprint panel */}
      <motion.div
        className="px-0 md:px-1 pt-2 md:pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div id="home" className="blueprint-surface">
          <HeroSection />
        </div>
      </motion.div>

      {/* Connector: Blueprint → Notebook */}
      <DeskConnector index={0} />

      {/* About — Notebook panel with "placed down" entrance */}
      <motion.div
        className="px-0 md:px-1 my-2 md:my-4"
        initial={{ opacity: 0, y: 40, rotateX: 2 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: 'spring', stiffness: 70, damping: 22 }}
        style={{ perspective: 800 }}
      >
        <div id="about" className="notebook notebook-grid relative panel-entrance-glow">
          <div className="notebook-spine hidden md:block" />
          <div className="notebook-margin hidden md:block" />
          <div className="notebook-holes hidden md:block">
            <div className="notebook-hole" style={{ top: '80px' }} />
            <div className="notebook-hole" style={{ top: '33%' }} />
            <div className="notebook-hole" style={{ top: '66%' }} />
            <div className="notebook-hole" style={{ bottom: '80px' }} />
          </div>
          <div className="page-fold" />
          <div className="relative z-[1]">
            <AboutSection />
          </div>
        </div>
      </motion.div>

      {/* Floating section panels with connectors between them */}
      {panelSections.map(({ key, Component, bg, border }, idx) => (
        <div key={key}>
          {/* Connector before each panel (first connector is Notebook→Shelf) */}
          <DeskConnector index={idx + 1} />

          <div className="px-0 md:px-1 my-2 md:my-4">
            <AnimatedPanel index={idx}>
              <div
                id={key}
                className={`section-panel ${bg} ${border} panel-entrance-glow`}
              >
                <Component />
              </div>
            </AnimatedPanel>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Index;
