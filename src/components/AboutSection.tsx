import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import IdentityCard from "./about/IdentityCard";
import JourneyGlobe from "./about/JourneyGlobe";
import { journey } from "./about/journeyData";

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const opacity = useTransform(sp, [0, 0.18, 0.82, 1], [0.92, 1, 1, 0.92]);
  const y = useTransform(sp, [0, 0.18, 0.82, 1], [24, 0, 0, -24]);
  const scale = useTransform(sp, [0, 0.18, 0.82, 1], [0.985, 1, 1, 0.985]);

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 my-6 md:my-8">
      <section id="about" ref={sectionRef} className="relative w-full">
        <motion.div
          style={
            reduce
              ? undefined
              : { opacity, y, scale }
          }
          className="relative w-full rounded-md overflow-hidden"
        >
          <div
            className="relative w-full px-6 md:px-12 py-10 md:py-14"
            style={{
              background:
                "linear-gradient(180deg, hsl(40 28% 94%) 0%, hsl(40 24% 90%) 100%)",
              border: "1px solid hsl(160 20% 16% / 0.15)",
              boxShadow: "inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            }}
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-card-foreground/60">
                · 02 — About
              </span>
              <div className="h-px flex-1 bg-card-foreground/20" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-card-foreground/60">
                Identity Passport
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
              {/* Left: ID card + tray */}
              <div className="flex justify-center lg:justify-start">
                <IdentityCard
                  entries={journey}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>

              {/* Right: Globe */}
              <div className="flex flex-col items-center justify-center w-full">
                <JourneyGlobe entries={journey} selectedId={selectedId} />
                <p className="mt-5 font-mono text-[10px] tracking-[0.2em] uppercase text-card-foreground/55 text-center max-w-[420px]">
                  Flip the card → tap an entry to highlight a place on the globe.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutSection;
