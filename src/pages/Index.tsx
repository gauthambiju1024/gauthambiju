import { useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";

const panelSections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-[hsl(var(--shelf-wood-light)/0.3)]' },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/40' },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/30' },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/20' },
  { key: 'writing', Component: WritingDesk, bg: 'editorial-bg', border: 'border-[hsl(var(--notebook-border)/0.3)]' },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent' },
];

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
      <div className="max-w-7xl mx-auto px-1 md:px-2 lg:px-4 pt-2 md:pt-4">
        <div id="home" className="blueprint-surface">
          <HeroSection />
        </div>
      </div>

      {/* About — Notebook panel */}
      <div className="max-w-7xl mx-auto px-1 md:px-2 lg:px-4 my-6 md:my-8">
        <div id="about" className="notebook notebook-grid relative">
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
      </div>

      {/* Floating section panels */}
      {panelSections.map(({ key, Component, bg, border }) => (
        <div key={key} className="max-w-7xl mx-auto px-1 md:px-2 lg:px-4 my-6 md:my-8">
          <div
            id={key}
            className={`section-panel ${bg} ${border}`}
          >
            <Component />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Index;
