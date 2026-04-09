import { useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";
import AssemblyHeader from "@/components/AssemblyHeader";

/** Parse hsla(h, s%, l%, a) → [h, s, l, a] */
function parseHSLA(str: string): [number, number, number, number] | null {
  const m = str.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  return [+m[1], +m[2], +m[3], m[4] != null ? +m[4] : 1];
}

/** Convert HSL → RGB (0-255) */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

const panelSections = [
  { key: 'projects', Component: ProjectsShelf, bg: 'shelf-bg', border: 'border-[hsl(var(--shelf-wood-light)/0.3)]' },
  { key: 'thinking', Component: ThinkingWall, bg: 'whiteboard-bg', border: 'border-border/40' },
  { key: 'skills', Component: SkillsToolbox, bg: 'toolbox-bg', border: 'border-border/30' },
  { key: 'journey', Component: JourneyTimeline, bg: '', border: 'border-primary/20' },
  { key: 'writing', Component: WritingDesk, bg: 'editorial-bg', border: 'border-[hsl(var(--notebook-border)/0.3)]' },
  { key: 'contact', Component: ContactClosing, bg: '', border: 'border-transparent' },
];

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.querySelector('[data-header-bg]') as HTMLElement | null;
    if (!header || !pageRef.current) return;
    const bg = header.getAttribute('data-header-bg-value') || '';
    const parsed = parseHSLA(bg);
    if (!parsed) return;
    const [h, s, l, a] = parsed;
    // Alpha-composite the header color over black (rgb 0,0,0)
    const [r, g, b] = hslToRgb(h, s, l);
    const solidR = Math.round(r * a);
    const solidG = Math.round(g * a);
    const solidB = Math.round(b * a);
    pageRef.current.style.background = `rgb(${solidR}, ${solidG}, ${solidB})`;
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <MarginDoodles />


      <div className="margin-content-wrapper relative z-[2]">
        <AssemblyHeader panelIds={["home","about","projects","thinking","skills","journey","writing","contact"]} />
        <div>
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
              <div id={key} className={`section-panel ${bg} ${border}`}>
                <Component />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
