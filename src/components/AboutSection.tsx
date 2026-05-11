import { AnimatePresence, motion } from "framer-motion";
import IdentityCard from "./about/IdentityCard";
import JourneyGlobe from "./about/JourneyGlobe";
import { journey } from "./about/journeyData";
import { setSelected, useSelectedJourneyId } from "./about/journeyStore";

const INK = "hsl(160 20% 16%)";
const PAPER = "hsl(40 25% 92%)";

const AboutSection = () => {
  const selectedId = useSelectedJourneyId();
  const selected = journey.find((e) => e.id === selectedId) || null;

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 my-6 md:my-8">
      <section id="about" className="relative w-full">
        <div
          className="relative w-full px-6 md:px-12 py-10 md:py-14 rounded-md overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, hsl(40 28% 94%) 0%, hsl(40 24% 90%) 100%)",
            border: "1px solid hsl(160 20% 16% / 0.15)",
            boxShadow: "inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
          }}
        >
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-card-foreground/60">
              · 02 — About
            </span>
            <div className="h-px flex-1 bg-card-foreground/20" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-card-foreground/60">
              Identity Passport
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-14 items-center">
            {/* Left: Globe */}
            <div className="flex flex-col items-center justify-center w-full order-2 lg:order-1">
              <JourneyGlobe entries={journey} />
              <p className="mt-5 font-mono text-[10px] tracking-[0.2em] uppercase text-card-foreground/55 text-center max-w-[420px]">
                Tap an entry on the card to highlight a place on the globe.
              </p>
            </div>

            {/* Right: Card slot (desktop = portal lands here; mobile = static card) */}
            <div className="flex flex-col items-center justify-start w-full order-1 lg:order-2">
              {/* Desktop: empty slot reserving space for the portal-mounted card */}
              <div
                id="about-card-slot"
                className="hidden md:block w-full"
                style={{
                  maxWidth: 360,
                  aspectRatio: "5 / 7",
                }}
                aria-hidden
              />
              {/* Mobile: render the static IdentityCard inside the slot area */}
              <div className="block md:hidden w-full">
                <IdentityCard entries={journey} />
              </div>

              {/* Detail tray */}
              <AnimatePresence initial={false}>
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full mt-5 overflow-hidden"
                    style={{ maxWidth: 380 }}
                  >
                    <div
                      style={{
                        background: PAPER,
                        border: `1px solid ${INK}25`,
                        borderRadius: 4,
                        padding: "14px 16px",
                        boxShadow: "0 8px 24px -8px hsl(160 30% 4% / 0.3)",
                      }}
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <span
                          className="font-mono"
                          style={{ fontSize: 10, fontWeight: 700, color: INK, letterSpacing: "1.2px" }}
                        >
                          {selected.label.toUpperCase()}
                        </span>
                        <button
                          onClick={() => setSelected(selected.id)}
                          className="font-mono"
                          style={{ fontSize: 9, color: `${INK}80`, letterSpacing: "1px" }}
                        >
                          {selected.period} · close ✕
                        </button>
                      </div>
                      <Row label="Role" value={selected.role} />
                      <Row label="Worked on" value={selected.work} />
                      <Row label="Skills" value={selected.skills.join(" · ")} mono />
                      <Row label="Takeaway" value={selected.takeaway} italic />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Row = ({
  label,
  value,
  mono,
  italic,
}: {
  label: string;
  value: string;
  mono?: boolean;
  italic?: boolean;
}) => (
  <div className="mt-2.5">
    <div
      className="font-mono"
      style={{ fontSize: 7.5, color: `${INK}80`, letterSpacing: "1.4px", marginBottom: 2 }}
    >
      {label.toUpperCase()}
    </div>
    <div
      className={mono ? "font-mono" : ""}
      style={{
        fontSize: mono ? 10 : 11,
        color: INK,
        lineHeight: 1.4,
        fontStyle: italic ? "italic" : "normal",
      }}
    >
      {value}
    </div>
  </div>
);

export default AboutSection;
