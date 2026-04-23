import { ReactNode, useEffect, useRef, useState, ComponentType } from "react";
import { AnimatePresence, motion, useScroll, useTransform, MotionValue } from "framer-motion";
import DeskScene, { SlotConfig3D } from "./desk3d/DeskScene";
import { FrameId, FrameProps } from "./desk/frames/FrameTypes";

export interface SectionConfig {
  id: FrameId;
  label: string;
  Frame: ComponentType<FrameProps>;
  Section: ComponentType;
  slot: Omit<SlotConfig3D, "id" | "label">;
}

interface DeskStageProps {
  sections: SectionConfig[];
}

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

  if (reducedMotion) {
    return (
      <div>
        {sections.map(({ id, Section }) => (
          <section key={id} id={id} className="min-h-screen">
            <Section />
          </section>
        ))}
      </div>
    );
  }

  const active = sections[activeIndex];
  const ActiveFrame = active.Frame;
  const ActiveSection = active.Section;

  const slots3D: SlotConfig3D[] = sections.map((s) => ({ id: s.id, label: s.label, ...s.slot }));

  return (
    <div ref={containerRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>
      {sections.map((s, i) => (
        <span
          key={s.id}
          id={s.id}
          className="absolute left-0 w-1 pointer-events-none"
          style={{ top: `${i * 100}vh`, height: "100vh" }}
          aria-hidden="true"
        />
      ))}

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* STAGE — active panel takes the upper 82vh */}
        <div className="absolute inset-x-0 top-0" style={{ height: "82vh" }}>
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 pt-[96px] pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                style={{ opacity: stageOpacity, y: stageY }}
                className="relative w-full max-w-7xl h-full"
              >
                <div className="w-full h-full">
                  <ActiveFrame t={t} active>
                    <ActiveSection />
                  </ActiveFrame>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Soft seam blend just above the desk strip */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            bottom: "18vh",
            height: "1.5vh",
            background: "linear-gradient(to bottom, transparent, hsl(var(--background)))",
          }}
          aria-hidden="true"
        />

        {/* DESK — bottom 18vh strip */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: "18vh" }}>
          <DeskScene slots={slots3D} activeId={active.id} onSelect={handleJump} />
        </div>
      </div>
    </div>
  );
};

export default DeskStage;
