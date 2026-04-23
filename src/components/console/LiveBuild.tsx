import { useEffect, useRef, useState } from "react";
import { DEFAULT_SKETCH, Sketch, strokesToParts, PartSegments } from "./sketchUtils";

const INK = "hsl(38 55% 65%)";
const DIM = "hsl(38 35% 52%)";

/**
 * LiveBuild — mirrors the AssemblyHeader's progressive sketch in the bottom rail.
 * Uses the same scroll progress and the same `byop:sketch` channel, but renders
 * statically (no belt motion) at a larger scale so the user can see the build.
 */
const LiveBuild = () => {
  const [sketch, setSketch] = useState<Sketch>(DEFAULT_SKETCH);
  const [stage, setStage] = useState(0);
  const [stageProg, setStageProg] = useState(0);
  const partsRef = useRef<PartSegments>(strokesToParts(DEFAULT_SKETCH.strokes, 36));
  const rafRef = useRef(0);

  // Update parts when sketch changes
  useEffect(() => {
    partsRef.current = strokesToParts(sketch.strokes, 36);
  }, [sketch]);

  // Listen for sketch picks from BYOPDock
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Sketch | undefined;
      if (detail && detail.strokes) setSketch(detail);
    };
    window.addEventListener("byop:sketch", handler);
    const initial = (window as any).__byop_sketch as Sketch | undefined;
    if (initial && initial.strokes) setSketch(initial);
    return () => window.removeEventListener("byop:sketch", handler);
  }, []);

  // Track scroll progress (mirrors AssemblyHeader logic)
  useEffect(() => {
    let last = -1;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const s = Math.min(7, Math.floor(p * 8));
      const sp = p * 8 - s;
      const v = s * 1000 + Math.round(sp * 1000);
      if (v !== last) {
        last = v;
        setStage(s);
        setStageProg(sp);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const parts = partsRef.current;
  const partCount = Math.min(8, stage + (stageProg > 0 ? 1 : 0));
  const isComplete = partCount >= 8;

  return (
    <div className="h-full flex items-center justify-start gap-3 px-3" title={sketch.name}>
      <svg viewBox="-30 -22 60 44" className="h-[52px] w-[80px] flex-shrink-0">
        {parts.map((part, i) => {
          const op = i < stage ? 1 : i === stage ? Math.min(1, stageProg) : 0;
          if (op <= 0) return null;
          return (
            <g key={i} opacity={op.toFixed(2)}>
              {part.map((seg, j) => (
                <line
                  key={j}
                  x1={seg[0][0]}
                  y1={seg[0][1]}
                  x2={seg[1][0]}
                  y2={seg[1][1]}
                  stroke={INK}
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-col gap-1 leading-none">
        <div
          className="flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isComplete ? "hsl(120 50% 55%)" : "hsl(38 60% 55%)",
              boxShadow: isComplete
                ? "0 0 6px hsl(120 50% 55% / 0.8)"
                : "0 0 5px hsl(38 60% 55% / 0.7)",
              animation: isComplete ? undefined : "pulse 1.6s ease-in-out infinite",
            }}
          />
          <span className="text-[10px] tracking-[0.16em] uppercase" style={{ color: INK }}>
            parts {String(partCount).padStart(2, "0")}/08
          </span>
        </div>
        <span
          className="text-[9px] tracking-[0.18em] uppercase truncate max-w-[100px]"
          style={{ color: DIM, fontFamily: "var(--font-mono)" }}
        >
          {sketch.name}
        </span>
      </div>
    </div>
  );
};

export default LiveBuild;
