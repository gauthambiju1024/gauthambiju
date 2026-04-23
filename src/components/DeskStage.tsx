import { useEffect, useRef, useState, ComponentType } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionValue } from "framer-motion";
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

// Transition window — last X% of one slice crossfades into the next.
const FADE_WINDOW = 0.18;

interface PanelLayerProps {
  section: SectionConfig;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  tDummy: MotionValue<number>;
}

const PanelLayer = ({ section, index, total, scrollYProgress, tDummy }: PanelLayerProps) => {
  // Continuous 1:1 mapping: each panel travels horizontally from +100% (right)
  // through 0% (centered at its slice midpoint) to -100% (left), spanning the
  // range from the previous panel's center to the next panel's center.
  // Vertical scroll → horizontal travel with no static "hold" → smooth & gradual.
  const slice = 1 / total;
  const center = (index + 0.5) * slice;
  const enterAt = Math.max(0, center - slice);
  const exitAt = Math.min(1, center + slice);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Opacity: crossfade only near the edges (~25% of a slice) so off-stage panels
  // don't bleed through during the long continuous translation.
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
    isFirst
      ? [1, 1, 0, 0]
      : isLast
      ? [0, 0, 1, 1]
      : [0, 1, 1, 0]
  );

  // X: continuous travel across the panel's full visible window.
  // GAP adds breathing room between adjacent panels (10% viewport-width).
  const GAP = 10; // percent
  const offRight = `${100 + GAP}%`;
  const offLeft = `-${100 + GAP}%`;
  const x = useTransform(
    scrollYProgress,
    isFirst
      ? [0, center, exitAt]
      : isLast
      ? [enterAt, center, 1]
      : [enterAt, center, exitAt],
    isFirst
      ? ["0%", "0%", offLeft]
      : isLast
      ? [offRight, "0%", "0%"]
      : [offRight, "0%", offLeft]
  );

  // Hide pointer events when nearly invisible (avoid blocking interactions).
  const [interactive, setInteractive] = useState(index === 0);
  useEffect(() => {
    return opacity.on("change", (v) => setInteractive(v > 0.5));
  }, [opacity]);

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
  const [reducedMotion, setReducedMotion] = useState(false);
  const tDummy = useMotionValue(0.5) as MotionValue<number>;

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(m.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);

  // Track active id (for desk strip highlight) — based on dominant section.
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const i = Math.min(sections.length - 1, Math.max(0, Math.floor(v * sections.length + 0.5)));
      const id = sections[i].id;
      setActiveId((prev) => (prev === id ? prev : id));
    });
  }, [scrollYProgress, sections]);

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
        {/* STAGE — all panels stacked, opacity driven directly by scroll */}
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

        {/* Soft seam blend just above the desk strip */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            bottom: "12vh",
            height: "1.5vh",
            background: "linear-gradient(to bottom, transparent, hsl(var(--background)))",
          }}
          aria-hidden="true"
        />

        {/* DESK — bottom 12vh strip */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: "12vh" }}>
          <DeskScene slots={slots3D} activeId={activeId} onSelect={handleJump} />
        </div>
      </div>
    </div>
  );
};

export default DeskStage;
