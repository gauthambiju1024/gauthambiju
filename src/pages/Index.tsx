import { useEffect, useRef } from 'react';
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
import ScrollThread from "@/components/ScrollThread";
import ParticleField from "@/components/ParticleField";

const panelSections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-[hsl(var(--shelf-wood-light)/0.3)]' },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/40' },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/30' },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/20' },
  { key: 'writing', Component: WritingDesk, bg: 'editorial-bg', border: 'border-[hsl(var(--notebook-border)/0.3)]' },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent' },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const ratio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      el.style.setProperty('--scroll-y', String(ratio));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen desk-pattern page-spotlight" style={{ background: 'hsl(var(--background))' }}>
      <ParticleField />
      <ScrollThread />
      <MarginDoodles />

      <div className="margin-content-wrapper relative z-[2]">
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[100]"
          style={{ scaleX }}
        />

        <div className="px-0 md:px-1 pt-2 md:pt-4">
          <div id="home" className="blueprint-surface">
            <HeroSection />
          </div>
        </div>

        <div className="px-0 md:px-1 my-6 md:my-8">
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

        {panelSections.map(({ key, Component, bg, border }) => (
          <div key={key} className="px-0 md:px-1 my-6 md:my-8">
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
