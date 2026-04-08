import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";
import { BuilderCharacter, SchematicCallout, PanelBleed } from "@/components/build-story";

const sections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-[hsl(var(--shelf-wood-light)/0.3)]', bleed: 'shelf' as const, callout: { from: 'written', to: 'shelved', side: 'right' as const } },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/40', bleed: 'whiteboard' as const, callout: { from: 'shelved', to: 'pinned', side: 'left' as const } },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/30', bleed: 'toolbox' as const, callout: { from: 'pinned', to: 'equipped', side: 'right' as const } },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/20', bleed: 'journey' as const, callout: { from: 'equipped', to: 'walked', side: 'left' as const } },
  { key: 'writing', Component: WritingDesk, bg: 'editorial-bg', border: 'border-[hsl(var(--notebook-border)/0.3)]', bleed: 'editorial' as const, callout: { from: 'walked', to: 'written up', side: 'right' as const } },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent', bleed: 'contact' as const, callout: { from: 'written up', to: 'sent', side: 'left' as const } },
];

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <BuilderCharacter />
      <MarginDoodles />

      <div className="margin-content-wrapper relative z-[2]">
        {/* Hero */}
        <div className="px-0 md:px-1 pt-2 md:pt-4 relative">
          <div id="home" className="blueprint-surface">
            <HeroSection />
          </div>
          <PanelBleed variant="blueprint" />
        </div>

        {/* About */}
        <SchematicCallout fromLabel="measured" toLabel="written" side="left" />
        <div className="px-0 md:px-1 my-6 md:my-8 relative">
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
          <PanelBleed variant="notebook" />
        </div>

        {/* Remaining sections */}
        {sections.map(({ key, Component, bg, border, bleed, callout }) => (
          <div key={key}>
            <SchematicCallout fromLabel={callout.from} toLabel={callout.to} side={callout.side} />
            <div className="px-0 md:px-1 my-6 md:my-8 relative">
              <div id={key} className={`section-panel ${bg} ${border}`}>
                <Component />
              </div>
              <PanelBleed variant={bleed} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
