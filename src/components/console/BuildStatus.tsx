import { motion, MotionValue, useTransform } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import { STATION_META } from "./actionsByStation";

interface Props {
  activeId: FrameId;
  activeIdx: number;
  total: number;
  label: string;
  progress: MotionValue<number>;
  onJump: (i: number) => void;
}

const BuildStatus = ({ activeId, activeIdx, total, label, progress, onJump }: Props) => {
  const meta = STATION_META[activeId];
  const slice = 1 / total;
  const start = activeIdx * slice;
  const local = useTransform(progress, [start, start + slice], [0, 1]);
  const widthPct = useTransform(local, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  const num = String(activeIdx + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  return (
    <button
      onClick={() => onJump(activeIdx)}
      className="group flex flex-col gap-1.5 text-left w-full h-full justify-center px-3 py-2"
      style={{ fontFamily: "var(--font-mono)" }}
      aria-label={`Section ${num} of ${tot}, ${label}`}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] tracking-[0.18em] text-amber-300/90">{num}</span>
        <span className="text-[10px] text-stone-400">/ {tot}</span>
        <span className="text-[11px] tracking-[0.18em] text-stone-100 uppercase ml-1">{label}</span>
      </div>

      <div className="relative h-[2px] w-full bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: widthPct, background: "hsl(38 60% 52%)" }}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-500/60" />
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(43 74% 55%)", boxShadow: "0 0 6px hsl(43 74% 55% / 0.7)" }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="w-1.5 h-1.5 rounded-full border border-stone-500/50" />
        </div>
        <span
          className="text-[10px] text-amber-200/70 truncate"
          style={{ fontFamily: "'Caveat', cursive", fontSize: "13px", lineHeight: 1 }}
        >
          now building · {meta.status}
        </span>
      </div>
    </button>
  );
};

export default BuildStatus;
