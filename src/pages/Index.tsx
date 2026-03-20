import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll } from 'framer-motion';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import BlogSection from "@/components/BlogSection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import SectionDots from "@/components/SectionDots";
import PageTransition from "@/components/PageTransition";
import { useHomepageSections } from "@/hooks/useSiteData";

const sectionMap: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  marquee: MarqueeText,
  beliefs: BeliefsSection,
  work: WorkSection,
  story: StorySection,
  blog: BlogSection,
  connect: ConnectSection,
  footer: Footer,
};

const sectionAnchors: Record<string, string> = {
  hero: 'about',
  work: 'work',
  blog: 'blog',
  connect: 'connect',
};

const sectionReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const navSections = ['about', 'work', 'blog', 'connect'];

const Index = () => {
  const { sections, loading } = useHomepageSections();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const [activeSection, setActiveSection] = useState('about');
  const [activeSection, setActiveSection] = useState('about');

  // Track active section for dots
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observers: IntersectionObserver[] = [];
    navSections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { root: container, rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [loading]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const groups = useMemo(() => {
    if (loading) return [['hero', 'marquee', 'beliefs'], ['work', 'story'], ['blog'], ['connect', 'footer']];
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
    <PageTransition>
      <div className="h-screen overflow-hidden desk-pattern flex flex-col" style={{ background: 'hsl(var(--background))' }}>
        {/* Navigation outside notebook — on desk background */}
        <div className="flex-shrink-0 w-full max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
          <Navigation scrollContainer={scrollRef} />
        </div>

        {/* Section dots */}
        <SectionDots activeSection={activeSection} onDotClick={scrollToSection} />

        {/* Notebook outer frame */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-2 md:px-4 lg:px-8 pb-3 md:pb-5">
          <div className="notebook notebook-grid relative w-full max-w-7xl h-full flex flex-col">
            {/* Fixed decorations */}
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
                  {gi > 0 && (
                    <motion.div
                      className="section-divider"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left center' }}
                    />
                  )}
                  {group.map((key) => {
                    const Component = sectionMap[key];
                    if (!Component) return null;
                    const anchorId = sectionAnchors[key];
                    const isFooter = key === 'footer';
                    return (
                      <motion.div
                        key={key}
                        id={anchorId}
                        variants={sectionReveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                      >
                        {isFooter ? <Component scrollContainer={scrollRef} /> : <Component />}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
