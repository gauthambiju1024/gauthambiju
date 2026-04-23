import { AnimatePresence, motion } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";

const stroke = "hsl(38 60% 52%)";
const ink = "hsl(36 37% 96%)";
const dim = "hsl(220 12% 55%)";

const Blueprint = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    <rect x="6" y="8" width="44" height="40" fill="hsl(160 25% 18%)" stroke={stroke} strokeWidth="0.7" />
    <path d="M 50 8 L 70 14 L 70 54 L 50 48 Z" fill="hsl(160 25% 14%)" stroke={stroke} strokeWidth="0.7" />
    <path d="M 70 14 L 88 8 L 88 48 L 70 54 Z" fill="hsl(160 25% 16%)" stroke={stroke} strokeWidth="0.7" />
    <path d="M 6 18 H 50 M 6 28 H 50 M 6 38 H 50" stroke={ink} strokeOpacity="0.18" strokeWidth="0.3" />
    <polygon points="88,8 96,8 88,16" fill={stroke} opacity="0.7" />
    <text x="100" y="30" fill={dim} fontSize="6" fontFamily="JetBrains Mono">REV·01</text>
  </svg>
);

const Letterhead = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    <rect x="10" y="8" width="100" height="40" rx="1" fill="hsl(36 30% 92%)" stroke={dim} strokeWidth="0.4" />
    <text x="20" y="26" fill="hsl(218 30% 21%)" fontSize="11" fontFamily="Instrument Serif" fontStyle="italic">GB</text>
    <line x1="20" y1="32" x2="60" y2="32" stroke={dim} strokeWidth="0.4" />
    <line x1="20" y1="38" x2="80" y2="38" stroke={dim} strokeWidth="0.4" />
    <line x1="20" y1="42" x2="50" y2="42" stroke={dim} strokeWidth="0.4" />
  </svg>
);

const BookSpines = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    {[
      { x: 28, c: "hsl(220 60% 50%)", h: 38 },
      { x: 44, c: "hsl(0 55% 45%)", h: 42 },
      { x: 60, c: "hsl(38 60% 42%)", h: 36 },
      { x: 76, c: "hsl(160 30% 32%)", h: 40 },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={48 - b.h} width="13" height={b.h} fill={b.c} stroke="hsl(220 30% 8%)" strokeWidth="0.4" />
        <line x1={b.x + 2} y1={50 - b.h} x2={b.x + 2} y2="46" stroke="hsl(38 60% 52%)" strokeWidth="0.3" opacity="0.7" />
      </g>
    ))}
    <line x1="20" y1="49" x2="100" y2="49" stroke={stroke} strokeWidth="0.6" />
  </svg>
);

const PinnedNotes = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    {[
      { x: 24, y: 14, r: -4, c: "hsl(48 80% 75%)" },
      { x: 46, y: 10, r: 3, c: "hsl(36 30% 94%)" },
      { x: 68, y: 16, r: -2, c: "hsl(48 75% 78%)" },
      { x: 86, y: 12, r: 5, c: "hsl(36 30% 92%)" },
    ].map((n, i) => (
      <g key={i} transform={`rotate(${n.r} ${n.x + 12} ${n.y + 14})`}>
        <rect x={n.x} y={n.y} width="24" height="28" fill={n.c} stroke="hsl(220 30% 18%)" strokeOpacity="0.15" strokeWidth="0.3" />
        <circle cx={n.x + 12} cy={n.y + 3} r="1.6" fill="hsl(38 60% 52%)" />
      </g>
    ))}
  </svg>
);

const Caliper = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    <rect x="14" y="24" width="80" height="6" fill="hsl(220 10% 32%)" stroke={dim} strokeWidth="0.3" />
    <rect x="34" y="20" width="6" height="14" fill="hsl(220 10% 22%)" />
    <rect x="64" y="20" width="6" height="14" fill="hsl(220 10% 22%)" />
    <line x1="14" y1="36" x2="94" y2="36" stroke={ink} strokeOpacity="0.3" strokeWidth="0.3" />
    {Array.from({ length: 9 }).map((_, i) => (
      <line key={i} x1={14 + i * 10} y1="36" x2={14 + i * 10} y2={i % 2 ? 39 : 41} stroke={ink} strokeOpacity="0.4" strokeWidth="0.3" />
    ))}
    <text x="100" y="30" fill={dim} fontSize="6" fontFamily="JetBrains Mono">04</text>
  </svg>
);

const MilestoneRail = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    <line x1="14" y1="32" x2="106" y2="32" stroke={stroke} strokeWidth="0.6" />
    {[18, 36, 54, 72, 90].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="32" r={i === 2 ? 3 : 2} fill={i === 2 ? "hsl(38 60% 52%)" : "hsl(220 12% 55%)"} />
        <text x={x - 5} y="46" fill={dim} fontSize="5" fontFamily="JetBrains Mono">{`'2${i + 1}`}</text>
      </g>
    ))}
  </svg>
);

const NotebookTabs = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    {[0, 1, 2].map((i) => (
      <rect key={i} x={20 + i * 6} y={12 + i * 3} width="60" height="34"
            fill={i === 0 ? "hsl(36 35% 94%)" : i === 1 ? "hsl(36 30% 90%)" : "hsl(36 28% 86%)"}
            stroke="hsl(220 30% 18%)" strokeOpacity="0.18" strokeWidth="0.3" />
    ))}
    <line x1="26" y1="22" x2="74" y2="22" stroke={dim} strokeWidth="0.3" />
    <line x1="26" y1="28" x2="68" y2="28" stroke={dim} strokeWidth="0.3" />
    <text x="86" y="28" fill={dim} fontSize="6" fontFamily="JetBrains Mono">12</text>
  </svg>
);

const LetterCard = () => (
  <svg viewBox="0 0 120 56" className="h-full w-auto">
    <rect x="14" y="12" width="70" height="36" fill="hsl(36 30% 94%)" stroke={dim} strokeWidth="0.4" />
    <path d="M 14 12 L 49 32 L 84 12" stroke={dim} strokeWidth="0.4" fill="none" />
    <circle cx="92" cy="36" r="3" fill="hsl(140 50% 45%)">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
    </circle>
    <text x="98" y="38" fill={ink} fontSize="6" fontFamily="JetBrains Mono">OPEN</text>
  </svg>
);

const ART: Record<FrameId, () => JSX.Element> = {
  home: Blueprint,
  about: Letterhead,
  projects: BookSpines,
  thinking: PinnedNotes,
  skills: Caliper,
  journey: MilestoneRail,
  writing: NotebookTabs,
  contact: LetterCard,
};

const LABELS: Record<FrameId, string> = {
  home: "blueprint · rev 01",
  about: "letterhead",
  projects: "shelf · 04",
  thinking: "wall · pinned",
  skills: "tool tray",
  journey: "milestones",
  writing: "essays · 12",
  contact: "open to roles",
};

const ArtifactPreview = ({ activeId }: { activeId: FrameId }) => {
  const Comp = ART[activeId];
  return (
    <div className="h-full flex items-center justify-end gap-3 px-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-3 h-full"
        >
          <span
            className="text-[10px] tracking-[0.16em] uppercase text-stone-400 hidden lg:inline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {LABELS[activeId]}
          </span>
          <div className="h-[64px] w-[140px] flex items-center justify-center">
            <Comp />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ArtifactPreview;
