import { useMemo } from 'react';
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

const pageGroupIds: Record<string, string> = {
  about: 'about',
  work: 'work',
  connect: 'connect',
};

const bookmarkTops: Record<string, string> = {
  about: '40px',
  work: '30px',
  connect: '50px',
};

const NotebookPage = ({ children, id, bookmarkTop }: { children: React.ReactNode; id?: string; bookmarkTop?: string }) => (
  <div id={id} className="notebook-page notebook-grid relative">
    <div className="notebook-spine hidden md:block" />
    <div className="notebook-margin hidden md:block" />
    <div className="notebook-holes hidden md:block">
      <div className="notebook-hole" style={{ top: '60px' }} />
      <div className="notebook-hole" style={{ top: '50%', transform: 'translateY(-50%)' }} />
      <div className="notebook-hole" style={{ bottom: '60px' }} />
    </div>
    {bookmarkTop && <div className="ribbon-bookmark" style={{ top: bookmarkTop }} />}
    <div className="page-fold" />
    <div className="relative z-[1]">{children}</div>
  </div>
);

const Index = () => {
  const { sections, loading } = useHomepageSections();

  // Group sections by page_group preserving order
  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const s of sections) {
      if (!groups[s.page_group]) groups[s.page_group] = [];
      groups[s.page_group].push(s.section_key);
    }
    return groups;
  }, [sections]);

  // Determine page order from section order
  const pageOrder = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const s of sections) {
      if (!seen.has(s.page_group)) {
        seen.add(s.page_group);
        order.push(s.page_group);
      }
    }
    return order;
  }, [sections]);

  // Fallback while loading
  const fallbackPages = [
    { group: 'about', keys: ['hero', 'marquee', 'beliefs'] },
    { group: 'work', keys: ['work', 'story'] },
    { group: 'connect', keys: ['connect', 'footer'] },
  ];

  const pages = loading ? fallbackPages : pageOrder.map(g => ({ group: g, keys: grouped[g] ?? [] }));

  return (
    <div className="min-h-screen desk-pattern" style={{ background: 'hsl(var(--background))' }}>
      <Navigation />
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 pb-8">
        {pages.map(({ group, keys }) => (
          <NotebookPage key={group} id={pageGroupIds[group]} bookmarkTop={bookmarkTops[group]}>
            {keys.map((key, i) => {
              const Component = sectionMap[key];
              if (!Component) return null;
              return (
                <div key={key}>
                  {i > 0 && key !== 'footer' && <div className="section-divider" />}
                  <Component />
                </div>
              );
            })}
          </NotebookPage>
        ))}
      </div>
    </div>
  );
};

export default Index;
