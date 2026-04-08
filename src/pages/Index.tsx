import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";
import { GapBuilder } from "@/components/build-story/GapBuilder";

const panelSections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-[hsl(var(--shelf-wood-light)/0.3)]', gapAction: 'shelve' as const, gapLabel: 'written → shelved' },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/40', gapAction: 'pin' as const, gapLabel: 'shelved → pinned' },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/30', gapAction: 'equip' as const, gapLabel: 'pinned → equipped' },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/20', gapAction: 'walk' as const, gapLabel: 'equipped → travelled' },
  { key: 'writing', Component: WritingDesk, bg: 'editorial-bg', border: 'border-[hsl(var(--notebook-border)/0.3)]', gapAction: 'type' as const, gapLabel: 'travelled → written up' },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent', gapAction: 'seal' as const, gapLabel: 'written up → sent' },
];

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <MarginDoodles />

      <div className="margin-content-wrapper relative z-[2]">
        <div className="px-0 md:px-1 pt-2 md:pt-4">
          <div id="home" className="blueprint-surface">
            <HeroSection />
          </div>
        </div>

        <GapBuilder action="write" label="measured → written" />

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

        {panelSections.map(({ key, Component, bg, border, gapAction, gapLabel }) => (
          <div key={key}>
            <GapBuilder action={gapAction} label={gapLabel} />
            <div className="px-0 md:px-1 my-6 md:my-8">
              <div id={key} className={`section-panel ${bg} ${border}`}>
                <Component />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
