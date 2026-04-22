import { ReactNode, useEffect, useRef, useState, ComponentType } from "react";
import { AnimatePresence, motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Desk, { DeskSlotConfig } from "./desk/Desk";
import { FrameId, FrameProps } from "./desk/frames/FrameTypes";

export interface SectionConfig {
  id: FrameId;
  label: string;
  Frame: ComponentType<FrameProps>;
  Section: ComponentType;
  slot: Omit<DeskSlotConfig, "id" | "label">;
}

interface DeskStageProps {
  sections: SectionConfig[];
}

/**
 * DeskStage — orchestrates a sticky stage + sticky desk inside a tall scroll container.
 * Each section gets one viewport-height of scroll and snaps. Header & margins are
 * untouched (they live outside this component).
 */
const DeskStage = ({ sections }: DeskStageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(m.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const i = Math.min(sections.length - 1, Math.max(0, Math.floor(v * sections.length + 0.0001)));
      setActiveIndex(i);
    });
  }, [scrollYProgress, sections.length]);

  // local t for the active section: 0→1
  const t: MotionValue<number> = useTransform(scrollYProgress, (v) => {
    const seg = 1 / sections.length;
    const local = (v - activeIndex * seg) / seg;
    return Math.min(1, Math.max(0, local));
  });

  const stageOpacity = useTransform(t, [0, 0.15, 0.85, 1], [0.2, 1, 1, 0.2]);
  const stageY = useTransform(t, [0, 0.5, 1], [-30, 0, -30]);

  const handleJump = (id: FrameId) => {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0 || !containerRef.current) return;
    const el = containerRef.current;
    const top = el.offsetTop + idx * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // REDUCED-MOTION fallback: render sections stacked normally
  if (reducedMotion) {
    return (
      <div>
        {sections.map(({ id, Section }) => (
          <section key={id} id={id} className="min-h-screen">
            <Section />
          </section>
        ))}
        <div className="h-[40vh] desk-surface relative" aria-hidden="true">
          <Desk slots={sections.map((s) => ({ id: s.id, label: s.label, ...s.slot }))} activeId={sections[0].id} onSlotClick={() => {}} />
        </div>
      </div>
    );
  }

  const active = sections[activeIndex];
  const ActiveFrame = active.Frame;
  const ActiveSection = active.Section;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>
      {/* Hidden anchors for header pill IntersectionObserver — one per section, evenly spaced */}
      {sections.map((s, i) => (
        <span
          key={s.id}
          id={s.id}
          className="absolute left-0 w-1 pointer-events-none"
          style={{ top: `${i * 100}vh`, height: "100vh" }}
          aria-hidden="true"
        />
      ))}

      {/* Sticky viewport: stage on top, desk on bottom */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* STAGE */}
        <div className="stage-area absolute inset-x-0 top-0" style={{ height: "78vh" }}>
          <div className="stage-light absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 pt-[96px] pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                style={{ opacity: stageOpacity, y: stageY, perspective: 1500 }}
                className="relative w-full max-w-7xl h-full"
              >
                <motion.div
                  className="w-full h-full stage-float"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ActiveFrame t={t} active>
                    <ActiveSection />
                  </ActiveFrame>
                </motion.div>
                <div className="stage-ground-shadow absolute left-1/2 -translate-x-1/2 -bottom-2 w-[80%] h-6 pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="desk-horizon absolute inset-x-0 bottom-0 h-10" />
        </div>

        {/* DESK — 3D tilted */}
        <div className="absolute inset-x-0 bottom-0 desk-3d" style={{ height: "22vh" }}>
          <div className="desk-tilt">
            <Desk
              slots={sections.map((s) => ({ id: s.id, label: s.label, ...s.slot }))}
              activeId={active.id}
              onSlotClick={handleJump}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeskStage;
