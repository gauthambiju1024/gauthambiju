import { useMemo, useRef } from 'react';
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
import { useHomepageSections } from "@/hooks/useSiteData";

const sectionMap: Record<string, React.ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  projects: ProjectsShelf,
  thinking: ThinkingWall,
  skills: SkillsToolbox,
  journey: JourneyTimeline,
  writing: WritingDesk,
  contact: ContactClosing,
};

const sectionAnchors: Record<string, string> = {
  hero: 'home',
  about: 'about',
  projects: 'projects',
  thinking: 'thinking',
  skills: 'skills',
  journey: 'journey',
  writing: 'writing',
  contact: 'contact',
};

const defaultGroups = [
  ['hero', 'about'],
  ['projects'],
  ['thinking'],
  ['skills'],
  ['journey'],
  ['writing'],
  ['contact'],
];

const Index = () => {
  const { sections, loading } = useHomepageSections();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const groups = useMemo(() => {
    if (loading || sections.length === 0) return defaultGroups;
    // Only keep keys that have a matching component
    const valid = sections.filter(s => sectionMap[s.section_key]);
    if (valid.length === 0) return defaultGroups;
    const g: string[][] = [];
    let lastGroup = '';
    for (const s of valid) {
      if (s.page_group !== lastGroup) {
        g.push([]);
        lastGroup = s.page_group;
      }
      g[g.length - 1].push(s.section_key);
    }
    return g;
  }, [sections, loading]);

  return (
    <div className="h-screen overflow-hidden desk-pattern flex flex-col" style={{ background: 'hsl(var(--background))' }}>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation outside notebook */}
      <div className="flex-shrink-0 w-full max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
        <Navigation scrollContainer={scrollRef} />
      </div>

      {/* Notebook outer frame */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-2 md:px-4 lg:px-8 pb-3 md:pb-5">
        <div className="notebook notebook-grid relative w-full max-w-7xl h-full min-h-0 flex flex-col">
          <div className="notebook-spine hidden md:block" />
          <div className="notebook-margin hidden md:block" />
          <div className="notebook-holes hidden md:block">
            <div className="notebook-hole" style={{ top: '80px' }} />
            <div className="notebook-hole" style={{ top: '33%' }} />
            <div className="notebook-hole" style={{ top: '66%' }} />
            <div className="notebook-hole" style={{ bottom: '80px' }} />
          </div>
          <div className="page-fold" />

          {/* Scrollable interior */}
          <div
            ref={scrollRef}
            className="notebook-scroll-area relative z-[1] flex-1 overflow-y-auto"
          >
            {groups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="section-divider" />}
                {group.map((key) => {
                  const Component = sectionMap[key];
                  if (!Component) return null;
                  const anchorId = sectionAnchors[key];
                  return (
                    <div key={key} id={anchorId}>
                      <Component />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
