import { AnimatePresence, motion } from "framer-motion";

export type JourneyEntry = {
  id: string;
  title: string;
  org?: string;
  period: string;
  location?: string;
  summary?: string;
  details?: string;
  link?: string;
  markerId?: string;
  logoUrl?: string;
  groupHeading?: string;
};

export type AboutJourneyData = {
  overview?: {
    blurb?: string;
    traits?: string[];
    focus?: string[];
    quickFacts?: { label: string; value: string }[];
    footer?: string;
  };
  education?: JourneyEntry[];
  experience?: JourneyEntry[];
};

type Tab = "overview" | "education" | "experience";

interface Props {
  data: AboutJourneyData;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

const ink = "hsl(160 20% 16%)";
const inkSoft = "hsl(160 20% 16% / 0.65)";
const inkFaint = "hsl(160 20% 16% / 0.4)";
const dash = "hsl(160 20% 16% / 0.25)";

const TabBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="font-mono"
    style={{
      fontSize: 7.5,
      letterSpacing: "1.4px",
      padding: "4px 7px",
      border: `1px solid ${active ? ink : dash}`,
      background: active ? ink : "transparent",
      color: active ? "hsl(40 25% 92%)" : ink,
      cursor: "pointer",
      flex: 1,
      pointerEvents: "auto",
    }}
  >
    {label}
  </button>
);

const EntryRow = ({
  entry,
  expanded,
  onToggle,
}: {
  entry: JourneyEntry;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <div
    style={{
      borderBottom: `1px dashed ${dash}`,
      padding: "6px 0",
      cursor: "pointer",
      pointerEvents: "auto",
    }}
    onClick={onToggle}
  >
    <div className="flex items-start gap-2">
      {entry.logoUrl && (
        <img
          src={entry.logoUrl}
          alt=""
          style={{ width: 18, height: 18, objectFit: "contain", marginTop: 1, filter: "grayscale(1) contrast(1.1)", flexShrink: 0 }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="flex items-start justify-between gap-2">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: ink, lineHeight: 1.2 }}>{entry.title}</div>
            {entry.org && (
              <div className="font-mono" style={{ fontSize: 7.5, color: inkSoft, lineHeight: 1.3, marginTop: 1 }}>
                {entry.org}
              </div>
            )}
          </div>
          <span className="font-mono" style={{ fontSize: 7, color: inkFaint, whiteSpace: "nowrap", paddingTop: 2 }}>
            {entry.period}
          </span>
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ paddingTop: 5, paddingBottom: 2 }}>
                {entry.summary && (
                  <div style={{ fontSize: 8, color: ink, lineHeight: 1.4, marginBottom: 4 }}>{entry.summary}</div>
                )}
                {entry.details && (
                  <div style={{ fontSize: 7.5, color: inkSoft, lineHeight: 1.5 }}>{entry.details}</div>
                )}
                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono"
                    style={{ fontSize: 7, color: ink, borderBottom: `1px solid ${ink}`, marginTop: 5, display: "inline-block", letterSpacing: "1px" }}
                  >
                    VIEW ↗
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const GroupHeading = ({ label }: { label: string }) => (
  <div className="font-mono" style={{ fontSize: 6.5, color: inkFaint, letterSpacing: "1.6px", margin: "8px 0 2px", textTransform: "uppercase" }}>
    · {label}
  </div>
);

const renderList = (entries: JourneyEntry[], expandedId: string | null, setExpandedId: (id: string | null) => void) => {
  let lastHeading: string | null = null;
  return entries.map((e) => {
    const showHeading = e.groupHeading && e.groupHeading !== lastHeading;
    if (e.groupHeading) lastHeading = e.groupHeading;
    return (
      <div key={e.id}>
        {showHeading && <GroupHeading label={e.groupHeading!} />}
        <EntryRow entry={e} expanded={expandedId === e.id} onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)} />
      </div>
    );
  });
};

const AboutCardBack = ({ data, activeTab, setActiveTab, expandedId, setExpandedId }: Props) => {
  const o = data.overview ?? {};
  const edu = data.education ?? [];
  const exp = data.experience ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <span className="font-mono" style={{ fontSize: 7.5, fontWeight: 700, color: ink, letterSpacing: "1.4px" }}>· ABOUT</span>
        <span className="font-mono" style={{ fontSize: 7, color: inkFaint, letterSpacing: "1.2px" }}>02 / 08</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1" style={{ marginBottom: 8 }}>
        <TabBtn label="OVERVIEW" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
        <TabBtn label="EDUCATION" active={activeTab === "education"} onClick={() => setActiveTab("education")} />
        <TabBtn label="EXPERIENCE" active={activeTab === "experience"} onClick={() => setActiveTab("experience")} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ height: "100%", overflowY: "auto", paddingRight: 2 }}
          >
            {activeTab === "overview" && (
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, fontStyle: "italic", color: ink, lineHeight: 1.35, marginBottom: 6 }}>
                  Notes on How I Work
                </div>
                {o.blurb && (
                  <div style={{ fontSize: 8, color: ink, lineHeight: 1.5, marginBottom: 8 }}>{o.blurb}</div>
                )}
                {o.traits && o.traits.length > 0 && (
                  <div style={{ marginBottom: 6 }}>
                    <div className="font-mono" style={{ fontSize: 6.5, color: inkFaint, letterSpacing: "1.4px", marginBottom: 2 }}>TRAITS</div>
                    {o.traits.map((t, i) => (
                      <div key={t} style={{ display: "flex", gap: 5, fontSize: 8, color: ink, lineHeight: 1.3 }}>
                        <span className="font-mono" style={{ color: inkFaint }}>0{i + 1}</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                )}
                {o.focus && o.focus.length > 0 && (
                  <div style={{ marginBottom: 6 }}>
                    <div className="font-mono" style={{ fontSize: 6.5, color: inkFaint, letterSpacing: "1.4px", marginBottom: 3 }}>FOCUS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {o.focus.map((f) => (
                        <span key={f} className="font-mono" style={{ fontSize: 7, padding: "2px 5px", border: `1px solid ${dash}`, color: ink }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {o.quickFacts && o.quickFacts.length > 0 && (
                  <div className="font-mono" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 8px", fontSize: 7, color: ink }}>
                    {o.quickFacts.map((q) => (
                      <div key={q.label}><span style={{ opacity: 0.55 }}>{q.label}</span> {q.value}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div>
                {edu.length === 0 && <div style={{ fontSize: 8, color: inkSoft }}>No entries.</div>}
                {edu.map((e) => (
                  <EntryRow key={e.id} entry={e} expanded={expandedId === e.id} onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)} />
                ))}
              </div>
            )}

            {activeTab === "experience" && (
              <div>
                {exp.length === 0 && <div style={{ fontSize: 8, color: inkSoft }}>No entries.</div>}
                {exp.map((e) => (
                  <EntryRow key={e.id} entry={e} expanded={expandedId === e.id} onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      {o.footer && (
        <>
          <div style={{ width: "100%", borderTop: `1px dashed ${dash}`, margin: "6px 0 4px" }} />
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 12, color: inkSoft, lineHeight: 1.1, textAlign: "center" }}>
            "{o.footer}"
          </div>
        </>
      )}
    </div>
  );
};

export default AboutCardBack;
