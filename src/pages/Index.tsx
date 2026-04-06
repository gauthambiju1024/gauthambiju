import { useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";

const panelSections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-border/20' },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/30' },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/20' },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/15' },
  { key: 'writing', Component: WritingDesk, bg: '', border: 'border-border/20' },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent' },
];

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen desk-pattern" style={{ background: 'hsl(var(--background))' }}>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
        <Navigation />
      </div>

      {/* Hero + About — clean workspace surface */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 pt-2 md:pt-4">
        <div className="workspace-surface">
          <div className="relative z-[1]">
            <div id="home">
              <HeroSection />
            </div>
            <div className="section-divider" />
            <div id="about">
              <AboutSection />
            </div>
          </div>
        </div>
      </div>

      {/* Floating section panels */}
      {panelSections.map(({ key, Component, bg, border }) => (
        <div key={key} className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 my-6 md:my-8">
          <div
            id={key}
            className={`section-panel ${bg} ${border}`}
          >
            <Component />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
