import { useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import BlogSection from "@/components/BlogSection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useHomepageSections } from "@/hooks/useSiteData";

const sectionMap: Record<string, React.ComponentType> = {
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

const Index = () => {
  const { sections, loading } = useHomepageSections();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

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
      <div className="min-h-screen desk-pattern" style={{ background: 'hsl(var(--background))' }}>
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[100]"
          style={{ scaleX }}
        />

        <Navigation />

        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 pb-8">
          <div className="notebook notebook-grid relative">
            <div className="notebook-spine hidden md:block" />
            <div className="notebook-margin hidden md:block" />
            <div className="notebook-holes hidden md:block">
              <div className="notebook-hole" style={{ top: '80px' }} />
              <div className="notebook-hole" style={{ top: '33%' }} />
              <div className="notebook-hole" style={{ top: '66%' }} />
              <div className="notebook-hole" style={{ bottom: '80px' }} />
            </div>
            <div className="ribbon-bookmark" style={{ top: '40px' }} />
            <div className="ribbon-bookmark" style={{ top: '120px', opacity: 0.5, width: '24px' }} />
            <div className="page-fold" />

            <div className="relative z-[1]">
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
                    return (
                      <motion.div
                        key={key}
                        id={anchorId}
                        variants={sectionReveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                      >
                        <Component />
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
