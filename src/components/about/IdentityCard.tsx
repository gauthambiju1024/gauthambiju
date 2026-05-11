import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import type { JourneyEntry } from "./journeyData";

interface Props {
  entries: JourneyEntry[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const PAPER = "hsl(40 25% 92%)";
const INK = "hsl(160 20% 16%)";

const chips = ["Product", "Strategy", "Design", "Technology"];

const IdentityCard = ({ entries, selectedId, onSelect }: Props) => {
  const { value: heroData } = useSiteContent("hero", "main");
  const hero = heroData as any;
  const portraitSrc = hero?.portrait || heroPortrait;
  const [flipped, setFlipped] = useState(false);

  const selected = entries.find((e) => e.id === selectedId) || null;

  return (
    <div className="w-full flex flex-col items-center">
      <div
        style={{
          perspective: 1600,
          width: "100%",
          maxWidth: 360,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.55, ease: [0.22, 0.8, 0.32, 1] }}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "5 / 7",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* FRONT */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: PAPER,
                borderRadius: 6,
                padding: "16px 18px 18px",
                boxShadow:
                  "0 30px 40px -8px hsl(160 30% 4% / 0.45), 0 12px 24px -6px hsl(160 30% 4% / 0.3), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* slot */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 44,
                  height: 8,
                  borderRadius: 4,
                  background: "hsl(160 30% 6%)",
                  boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)",
                }}
              />
              {/* corner code */}
              <div
                className="font-mono"
                style={{ position: "absolute", top: 22, right: 14, fontSize: 8, color: `${INK}99`, letterSpacing: "1.4px" }}
              >
                ID · 0024
              </div>

              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  marginTop: 22,
                  backgroundImage: `url(${portraitSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.12)",
                  filter: "grayscale(1) contrast(1.15)",
                  borderRadius: 2,
                }}
              />

              <div
                className="font-mono"
                style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: INK, letterSpacing: "1.2px", lineHeight: 1.2 }}
              >
                GAUTHAM BIJU
              </div>
              <div
                className="font-mono"
                style={{ marginTop: 4, fontSize: 9, color: `${INK}cc`, letterSpacing: "1.1px", lineHeight: 1.4 }}
              >
                ENGINEER × MBA × PRODUCT BUILDER
              </div>
              <div
                className="font-mono"
                style={{ marginTop: 6, fontSize: 8.5, color: `${INK}99`, letterSpacing: "1.1px" }}
              >
                ◉ INDIA · KERALA
              </div>

              {/* chips */}
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {chips.map((c) => (
                  <span
                    key={c}
                    className="font-mono"
                    style={{
                      fontSize: 8,
                      padding: "2px 6px",
                      border: `1px solid ${INK}40`,
                      color: INK,
                      letterSpacing: "0.5px",
                      borderRadius: 2,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div style={{ flex: 1 }} />
              <div style={{ width: "100%", borderTop: `1px dashed ${INK}40`, margin: "10px 0 8px" }} />
              <div className="flex items-end justify-between">
                <span className="font-mono" style={{ fontSize: 8, color: `${INK}99`, letterSpacing: "1.2px" }}>
                  PORTFOLIO · 2026
                </span>
                <div
                  aria-hidden
                  style={{
                    width: 44,
                    height: 12,
                    opacity: 0.85,
                    background:
                      "repeating-linear-gradient(90deg, hsl(160 20% 16%) 0 1px, hsl(40 25% 92%) 1px 2px, hsl(160 20% 16%) 2px 4px, hsl(40 25% 92%) 4px 5px, hsl(160 20% 16%) 5px 6px, hsl(40 25% 92%) 6px 8px)",
                  }}
                />
              </div>
            </div>

            {/* BACK */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: PAPER,
                borderRadius: 6,
                padding: "16px 16px 14px",
                boxShadow:
                  "0 30px 40px -8px hsl(160 30% 4% / 0.45), 0 12px 24px -6px hsl(160 30% 4% / 0.3), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <span className="font-mono" style={{ fontSize: 8, fontWeight: 700, color: INK, letterSpacing: "1.4px" }}>
                  · JOURNEY
                </span>
                <span className="font-mono" style={{ fontSize: 8, color: `${INK}80`, letterSpacing: "1.2px" }}>
                  STAMPED · 2026
                </span>
              </div>

              <div style={{ width: "100%", borderTop: `1px dashed ${INK}40`, marginBottom: 6 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {entries.map((e) => {
                  const active = e.id === selectedId;
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelect(active ? null : e.id)}
                      className="text-left transition-colors"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "6px 7px",
                        borderRadius: 3,
                        background: active ? `${INK}10` : "transparent",
                        border: `1px solid ${active ? `${INK}40` : "transparent"}`,
                      }}
                    >
                      <span
                        style={{
                          marginTop: 4,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: active ? INK : `${INK}50`,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 9.5,
                              fontWeight: 700,
                              color: INK,
                              letterSpacing: "0.6px",
                            }}
                          >
                            {e.label}
                          </span>
                          <span
                            className="font-mono"
                            style={{ fontSize: 7.5, color: `${INK}80`, letterSpacing: "1px", whiteSpace: "nowrap" }}
                          >
                            {e.period}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 8.5,
                            color: `${INK}aa`,
                            lineHeight: 1.3,
                            marginTop: 1,
                          }}
                        >
                          {e.subtitle}
                        </div>
                      </div>
                      {active && (
                        <span
                          className="font-mono"
                          style={{ fontSize: 6.5, color: INK, letterSpacing: "1px", marginTop: 4 }}
                        >
                          ●
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div style={{ flex: 1 }} />
              <div style={{ width: "100%", borderTop: `1px dashed ${INK}40`, margin: "8px 0 6px" }} />
              <div
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 13,
                  color: `${INK}b0`,
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                "Build with intent. Ship what matters."
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Flip toggle */}
      <button
        onClick={() => setFlipped((f) => !f)}
        className="font-mono mt-4 text-[10px] tracking-[0.25em] uppercase text-card-foreground/70 hover:text-card-foreground transition-colors flex items-center gap-2"
      >
        <span>{flipped ? "View Front" : "View Journey"}</span>
        <span style={{ display: "inline-block", transform: flipped ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>↻</span>
      </button>

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
            style={{ maxWidth: 420 }}
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
                <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: INK, letterSpacing: "1.2px" }}>
                  {selected.label.toUpperCase()}
                </span>
                <span className="font-mono" style={{ fontSize: 8, color: `${INK}80`, letterSpacing: "1px" }}>
                  {selected.period}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5" style={{ color: INK }}>
                <Row label="Role" value={selected.role} />
                <Row label="Worked on" value={selected.work} />
                <Row label="Skills" value={selected.skills.join(" · ")} mono />
                <Row label="Takeaway" value={selected.takeaway} italic />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Row = ({ label, value, mono, italic }: { label: string; value: string; mono?: boolean; italic?: boolean }) => (
  <div>
    <div className="font-mono" style={{ fontSize: 7.5, color: `${INK}80`, letterSpacing: "1.4px", marginBottom: 2 }}>
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

export default IdentityCard;
