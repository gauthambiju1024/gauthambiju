import { useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import { useHomepageSections } from "@/hooks/useSiteData";

const sectionMap: Record<string, React.ComponentType> = {
  hero: HeroSection,
  marquee: MarqueeText,
  beliefs: BeliefsSection,
  work: WorkSection,
  story: StorySection,
  connect: ConnectSection,
  footer: Footer,
};

// Map section keys to anchor IDs for scroll-spy
const sectionAnchors: Record<string, string> = {
  hero: 'about',
  work: 'work',
  connect: 'connect',
};

const Index = () => {
  const { sections, loading } = useHomepageSections();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Group into visual clusters for dividers (by page_group)
  const groups = useMemo(() => {
    if (loading) return [['hero', 'marquee', 'beliefs'], ['work', 'story'], ['connect', 'footer']];
    const g: string[][] = [];
    let lastGroup = '';
    for (const s of sections) {
      if (s.page_group !== lastGroup) {
        g.push([]);
        lastGroup = s.page_group;
      }
      g[g.length - 1].push(s.section_key);
    }
    return g;
  }, [sections, loading]);

  return (
    <div className="min-h-screen desk-pattern" style={{ background: 'hsl(var(--background))' }}>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      <Navigation />

      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 pb-8">
        {/* Single unified notebook */}
        <div className="notebook notebook-grid relative">
          {/* Spine */}
          <div className="notebook-spine hidden md:block" />
          {/* Margin line */}
          <div className="notebook-margin hidden md:block" />
          {/* Hole punches */}
          <div className="notebook-holes hidden md:block">
            <div className="notebook-hole" style={{ top: '80px' }} />
            <div className="notebook-hole" style={{ top: '33%' }} />
            <div className="notebook-hole" style={{ top: '66%' }} />
            <div className="notebook-hole" style={{ bottom: '80px' }} />
          </div>
          {/* Ribbon bookmarks */}
          <div className="ribbon-bookmark" style={{ top: '40px' }} />
          <div className="ribbon-bookmark" style={{ top: '120px', opacity: 0.5, width: '24px' }} />
          {/* Page fold */}
          <div className="page-fold" />

          {/* Content */}
          <div className="relative z-[1]">
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
