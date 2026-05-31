import { useEffect, useRef, useState } from "react";

/**
 * Phase 0 / Phase 6 — dev-only FPS + long-task overlay.
 *
 * Lets smoothness be measured, not guessed. Target: sustained 60fps with no
 * long tasks > 50ms during the toolbox transition.
 *
 * Only mounts in dev builds, and only when enabled via `?perf` in the URL or
 * localStorage `perfOverlay=1`. Press the badge to toggle it off.
 */
export function PerfOverlay() {
  const [fps, setFps] = useState(0);
  const [minFps, setMinFps] = useState(60);
  const [longTasks, setLongTasks] = useState(0);
  const [worstTask, setWorstTask] = useState(0);
  const [hidden, setHidden] = useState(false);
  const frames = useRef(0);
  const last = useRef(performance.now());
  const localMin = useRef(60);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      frames.current++;
      const dt = t - last.current;
      if (dt >= 500) {
        const current = Math.round((frames.current * 1000) / dt);
        setFps(current);
        localMin.current = Math.min(localMin.current, current);
        setMinFps(localMin.current);
        frames.current = 0;
        last.current = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        let count = 0;
        let worst = 0;
        for (const entry of list.getEntries()) {
          count++;
          worst = Math.max(worst, entry.duration);
        }
        setLongTasks((n) => n + count);
        setWorstTask((w) => Math.max(w, Math.round(worst)));
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch {
      /* longtask API unsupported */
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  if (hidden) return null;

  const fpsColor = fps >= 55 ? "#7fb18a" : fps >= 40 ? "#d6b56a" : "#e06a5a";

  return (
    <div
      onClick={() => setHidden(true)}
      title="Click to hide"
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 99999,
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        lineHeight: 1.5,
        color: "#cbd5e1",
        background: "rgba(8,12,16,0.82)",
        border: "1px solid rgba(184,146,74,0.35)",
        borderRadius: 6,
        padding: "6px 10px",
        pointerEvents: "auto",
        cursor: "pointer",
        backdropFilter: "blur(4px)",
        userSelect: "none",
      }}
    >
      <div style={{ color: fpsColor, fontWeight: 600 }}>
        {fps} fps <span style={{ opacity: 0.6 }}>(min {minFps})</span>
      </div>
      <div style={{ opacity: longTasks ? 1 : 0.6 }}>
        long tasks: {longTasks} {worstTask ? `· worst ${worstTask}ms` : ""}
      </div>
    </div>
  );
}

/** Whether the overlay should be shown (dev + opt-in flag). */
export function perfOverlayEnabled(): boolean {
  if (!import.meta.env.DEV) return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("perf")) return true;
    return window.localStorage.getItem("perfOverlay") === "1";
  } catch {
    return false;
  }
}

export default PerfOverlay;
