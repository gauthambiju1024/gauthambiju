import { useEffect, useRef, useState, ComponentType } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import DeskScene, { SlotConfig3D } from "./desk3d/DeskScene";
import { FrameId, FrameProps } from "./desk/frames/FrameTypes";
import { MotionValue, useMotionValue } from "framer-motion";

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: "0%",
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
  }),
};

const DeskStage = ({ sections }: DeskStageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevIndexRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Stable dummy MotionValue for frames that still expect `t`
  const tDummy = useMotionValue(0.5) as MotionValue<number>;

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
      if (i !== prevIndexRef.current) {
        setDirection(i > prevIndexRef.current ? 1 : -1);
        prevIndexRef.current = i;
        setActiveIndex(i);
      }
    });
  }, [scrollYProgress, sections.length]);

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
          <div className="absolute inset-0 px-4 md:px-8 pt-[96px] pb-2 overflow-hidden">
            <div className="relative w-full h-full max-w-7xl mx-auto overflow-hidden">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={active.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
                  className="absolute inset-0"
                  style={{
                    boxShadow:
                      direction > 0
                        ? "-30px 0 60px -20px rgba(0,0,0,0.55)"
                        : "30px 0 60px -20px rgba(0,0,0,0.55)",
                  }}
                >
                  <ActiveFrame t={tDummy} active>
                    <ActiveSection />
                  </ActiveFrame>
                </motion.div>
              </AnimatePresence>
            </div>
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
