import { useEffect, useRef, useState, ComponentType } from "react";
import { useScroll, useTransform, MotionValue, useMotionValue } from "framer-motion";
import { motion } from "framer-motion";
import ConsoleRail from "./console/ConsoleRail";
import { FrameId, FrameProps } from "./desk/frames/FrameTypes";

export interface SectionConfig {
  id: FrameId;
  label: string;
  Frame: ComponentType<FrameProps>;
  Section: ComponentType;
}

interface DeskStageProps {
  sections: SectionConfig[];
}

interface PanelLayerProps {
  section: SectionConfig;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  tDummy: MotionValue<number>;
}

const PanelLayer = ({ section, index, total, scrollYProgress, tDummy }: PanelLayerProps) => {
  const slice = 1 / total;
  const center = (index + 0.5) * slice;
  const enterAt = Math.max(0, center - slice);
  const exitAt = Math.min(1, center + slice);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const fadeIn1 = enterAt;
  const fadeIn2 = enterAt + slice * 0.25;
  const fadeOut1 = exitAt - slice * 0.25;
  const fadeOut2 = exitAt;

  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [center, fadeOut1, fadeOut2, 1]
      : isLast
      ? [0, fadeIn1, fadeIn2, center]
      : [fadeIn1, fadeIn2, fadeOut1, fadeOut2],
    isFirst ? [1, 1, 0, 0] : isLast ? [0, 0, 1, 1] : [0, 1, 1, 0]
  );

  const GAP = 10;
  const offRight = `${100 + GAP}%`;
  const offLeft = `-${100 + GAP}%`;
  const x = useTransform(
    scrollYProgress,
    isFirst ? [0, center, exitAt] : isLast ? [enterAt, center, 1] : [enterAt, center, exitAt],
    isFirst ? ["0%", "0%", offLeft] : isLast ? [offRight, "0%", "0%"] : [offRight, "0%", offLeft]
  );

  const [interactive, setInteractive] = useState(index === 0);
  useEffect(() => opacity.on("change", (v) => setInteractive(v > 0.5)), [opacity]);

  const Frame = section.Frame;
  const Section = section.Section;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, x, pointerEvents: interactive ? "auto" : "none" }}
    >
      <Frame t={tDummy} active={interactive}>
        <Section />
      </Frame>
    </motion.div>
  );
};

const DeskStage = ({ sections }: DeskStageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeId, setActiveId] = useState<FrameId>(sections[0].id);
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const tDummy = useMotionValue(0.5) as MotionValue<number>;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(m.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  // Track active id based on dominant section + delayed tag reveal.
  useEffect(() => {
    let tagTimer: number | undefined;
    const unsub = scrollYProgress.on("change", (v) => {
      const i = Math.min(sections.length - 1, Math.max(0, Math.round(v * (sections.length - 1))));
      setActiveIdx(i);
      const id = sections[i].id;
      setActiveId((prev) => (prev === id ? prev : id));
      setShowTag(false);
      clearTimeout(tagTimer);
      tagTimer = window.setTimeout(() => setShowTag(true), 320);
    });
    tagTimer = window.setTimeout(() => setShowTag(true), 320);
    return () => { unsub(); clearTimeout(tagTimer); };
  }, [scrollYProgress, sections]);

  const handleJumpIndex = (idx: number) => {
    if (idx < 0 || idx >= sections.length || !containerRef.current) return;
    const el = containerRef.current;
    const total = sections.length;
    const targetProgress = (idx + 0.5) / total;
    const scrollable = (total - 1) * window.innerHeight;
    const top = el.offsetTop + targetProgress * scrollable;
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

  return (
    <div ref={containerRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>
      {sections.map((s, i) => {
        const total = sections.length;
        const topVh = ((i + 0.5) / total) * (total - 1) * 100;
        return (
          <span
            key={s.id}
            id={s.id}
            className="absolute left-0 w-1 pointer-events-none"
            style={{ top: `${topVh}vh`, height: "100vh" }}
            aria-hidden="true"
          />
        );
      })}

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0" style={{ height: "88vh" }}>
          <div className="absolute inset-0 px-0 pt-[88px] pb-1 overflow-hidden">
            <div className="relative w-full h-full overflow-hidden">
              {sections.map((s, i) => (
                <PanelLayer
                  key={s.id}
                  section={s}
                  index={i}
                  total={sections.length}
                  scrollYProgress={scrollYProgress}
                  tDummy={tDummy}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONSOLE RAIL — minimal local dock */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "clamp(72px, 9vh, 96px)",
            background: "linear-gradient(180deg, hsl(220 18% 10%), hsl(220 22% 7%))",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,255,255,0.02)",
            backgroundImage:
              "linear-gradient(180deg, hsl(220 18% 10%), hsl(220 22% 7%)), repeating-linear-gradient(0deg, transparent 0 23px, rgba(255,255,255,0.025) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(255,255,255,0.025) 23px 24px)",
            backgroundBlendMode: "normal, overlay, overlay",
          }}
        >
          <ConsoleRail
            activeId={activeId}
            activeIdx={activeIdx}
            sections={sections}
            progress={scrollYProgress}
            onJump={handleJumpIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default DeskStage;
