import { useEffect, useMemo, useRef, useState } from "react";
import { MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useSiteData";
import ProjectSpine, { SPINE_COLORS, SPINE_WIDTH, SPINE_HEIGHT, ABOUT_SPINE_DATA } from "@/components/projects/ProjectSpine";
import AboutPopup from "@/components/about/AboutPopup";

/** Narrow spine width used by the hero filing animation; About spine stays this wide forever. */
const ABOUT_SPINE_W = 28;

/**
 * AboutToProjectsBridge — multi-row library shelf.
 * Animation pattern (from dossier-fold-transition-3 reference, applied to motion ONLY):
 *   - DRAW: each row's ledge is an SVG <path> whose dashoffset animates from L→0,
 *     staggered per row.
 *   - ARCHIVE: each spine lives inside a clip:hidden row; starts at translateY(135%)
 *     (hidden below the rule) and rises into place with a back-overshoot ease,
 *     staggered by row + col.
 * Visual style of rows / spines is unchanged.
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (x: number) => x * x * (3 - 2 * x);
const easeBack = (x: number) => {
  const s = 1.4;
  return x * x * ((s + 1) * x - s);
};

const INK = "hsl(38 60% 52%)";

interface Props {
  progressMV: MotionValue<number>;
}

const AboutToProjectsBridge = ({ progressMV }: Props) => {
  const pinRef = useRef<HTMLElement>(null);
  const shelfWrapRef = useRef<HTMLDivElement>(null);
  const aboutSlotRef = useRef<HTMLDivElement>(null);
  const aboutSpineRef = useRef<HTMLDivElement>(null);
  const toolboxRef = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);

  const { projects } = useProjects();

  // Group by category, ordered by smallest sort_order in each group
  const rows = useMemo(() => {
    const groups = new Map<string, typeof projects>();
    for (const p of projects) {
      const cat = p.category || "General";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(p);
    }
    const arr = Array.from(groups.entries()).map(([cat, items]) => ({
      category: cat,
      items: [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      minOrder: Math.min(...items.map((i) => i.sort_order ?? 0)),
    }));
    arr.sort((a, b) => a.minOrder - b.minOrder);
    return arr;
  }, [projects]);

  // Refs for the rule paths (one per row) and rising spines (per row, col).
  const rulePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const rulePathLens = useRef<number[]>([]);
  // spineRefs[rowIndex] = array of HTMLDivElement (each spine wrapper in row).
  // The About-spine slot (top row) is appended as the last entry of row 0.
  // The toolbox is appended as the last entry of the bottom row.
  const spineRefs = useRef<HTMLDivElement[][]>([]);

  // Size the length array only; do NOT wipe ref arrays — React's ref
  // callbacks have already populated them by the time this effect runs.
  useEffect(() => {
    rulePathLens.current.length = rows.length;
  }, [rows]);

  useEffect(() => {
    const pin = pinRef.current;
    const shelfWrap = shelfWrapRef.current;
    const slot = aboutSlotRef.current;
    if (!pin || !shelfWrap || !slot) return;

    // Measure rule path lengths once nodes are mounted
    const measureRules = () => {
      rulePathRefs.current.forEach((p, i) => {
        if (p) {
          try {
            const L = p.getTotalLength();
            rulePathLens.current[i] = L;
            p.style.strokeDasharray = `${L}`;
            p.style.strokeDashoffset = `${L}`;
          } catch {
            // ignore
          }
        }
      });
    };
    measureRules();

    const publishSlotRect = () => {
      const r = slot.getBoundingClientRect();
      (window as any).__bridgeSlotRect = {
        left: r.left, top: r.top, width: r.width, height: r.height,
        cx: r.left + r.width / 2, cy: r.top + r.height / 2,
      };
    };

    const seg = (a: number, b: number, x: number) => {
      const u = clamp01((x - a) / (b - a));
      return easeInOut(u);
    };

    const update = () => {
      const t = clamp01(progressMV.get());
      const bridge = seg(0.72, 1.0, t);

      // Shelf fades in just as the packet starts shrinking
      shelfWrap.style.opacity = String(seg(0.70, 0.80, bridge));
      shelfWrap.style.pointerEvents = bridge > 0.99 ? "auto" : "none";

      (window as any).__bridgeActive = bridge > 0 && bridge < 1;
      (window as any).__bridgeProgress = bridge;

      const settled = bridge > 0.98;
      (window as any).__bridgeSettled = settled;
      if (aboutSpineRef.current) {
        // Only reveal the shelf spine at the final landing position. The flight
        // spine owns the full travel, preventing midair double-spine ghosts.
        const k = clamp01((bridge - 0.985) / 0.015);
        aboutSpineRef.current.style.opacity = String(k);
        aboutSpineRef.current.style.pointerEvents = settled ? "auto" : "none";
      }
      slot.style.opacity = "0";

      // === DRAW: per-row rule stroke, staggered, completing well before About lands ===
      const drawWinStart = 0.74;
      const drawWinEnd = 0.92;
      const drawWinLen = drawWinEnd - drawWinStart;
      const rowCount = Math.max(1, rulePathRefs.current.length);
      const drawStagger = drawWinLen * 0.3;
      const drawPerRow = drawWinLen - drawStagger;
      rulePathRefs.current.forEach((path, i) => {
        if (!path) return;
        const L = rulePathLens.current[i] || 0;
        if (L <= 0) return;
        const rowOff = rowCount > 1 ? (i / (rowCount - 1)) * drawStagger : 0;
        const start = drawWinStart + rowOff;
        const end = start + drawPerRow;
        const d = clamp01((bridge - start) / (end - start));
        const e = easeInOut(d);
        path.style.strokeDashoffset = String(L * (1 - e));
      });

      // === ARCHIVE: project spines rise gradually AFTER About has fully landed.
      // Bridge only reaches 1.0 at the very end, so we cannot extend beyond it.
      // We rely on a longer per-spine span (0.55 of the window) with stagger to
      // give a soft, sequential rise rather than a synchronized pop.
      const archWinStart = 0.965;
      const archWinEnd = 1.0;
      const archWinLen = archWinEnd - archWinStart;
      const archSpan = archWinLen * 0.55;
      const archStaggerTotal = archWinLen - archSpan;
      let maxOrderRaw = 0;
      spineRefs.current.forEach((row, r) => {
        row.forEach((_, c) => {
          const raw = r * 1.0 + c * 0.18;
          if (raw > maxOrderRaw) maxOrderRaw = raw;
        });
      });
      spineRefs.current.forEach((row, r) => {
        row.forEach((el, c) => {
          if (!el) return;
          const raw = r * 1.0 + c * 0.18;
          const norm = maxOrderRaw > 0 ? raw / maxOrderRaw : 0;
          const start = archWinStart + norm * archStaggerTotal;
          const end = start + archSpan;
          const u = clamp01((bridge - start) / (end - start));
          // Drop from above with smooth cubic-out for Y, separate overshoot on rotation.
          const eY = u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3);
          const y = lerp(-160, 0, eY);
          // Rotation: tilts from -6deg, overshoots to +2deg around u=0.7, settles to 0
          let rot: number;
          if (u <= 0) rot = -6;
          else if (u >= 1) rot = 0;
          else if (u < 0.7) {
            const k = u / 0.7;
            rot = lerp(-6, 2, 1 - Math.pow(1 - k, 2));
          } else {
            const k = (u - 0.7) / 0.3;
            rot = lerp(2, 0, k);
          }
          el.style.transform = `translateY(${y.toFixed(2)}%) rotate(${rot.toFixed(2)}deg)`;
        });
      });


      publishSlotRect();
    };

    update();
    const onResize = () => { measureRules(); update(); publishSlotRect(); };
    window.addEventListener("resize", onResize);
    // Re-measure shortly after mount in case fonts/layout shift
    const reMeasure = setTimeout(() => { measureRules(); update(); }, 80);
    let raf = 0;
    const loop = () => { update(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(reMeasure);
      cancelAnimationFrame(raf);
      (window as any).__bridgeProgress = 0;
      (window as any).__bridgeActive = false;
      (window as any).__bridgeSlotRect = null;
    };
  }, [projects, progressMV, rows.length]);

  // Helper to register a spine wrapper into spineRefs at (rowIndex, colIndex)
  const registerSpine = (rowIndex: number, colIndex: number) => (el: HTMLDivElement | null) => {
    if (!spineRefs.current[rowIndex]) spineRefs.current[rowIndex] = [];
    if (el) {
      spineRefs.current[rowIndex][colIndex] = el;
    }
  };

  return (
    <section
      ref={pinRef}
      aria-label="Projects"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      className="w-full h-full"
    >
      <div className="absolute inset-0 w-full overflow-hidden" style={{ height: "100%" }}>
        <div
          ref={shelfWrapRef}
          className="absolute left-1/2"
          style={{
            bottom: "14%",
            transform: "translateX(-50%)",
            width: "min(88vw, 1180px)",
            opacity: 1,
            willChange: "opacity",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* PROJECTS heading */}
          <div className="flex items-center justify-center" style={{ gap: 14 }}>
            <span style={{ flex: 1, height: 1, background: INK, opacity: 0.4 }} />
            <span
              className="font-mono uppercase"
              style={{ color: INK, fontSize: 11, letterSpacing: "0.4em" }}
            >
              Projects
            </span>
            <span style={{ flex: 1, height: 1, background: INK, opacity: 0.4 }} />
          </div>

          {rows.map((row, rowIndex) => {
            const isTop = rowIndex === 0;
            const isBottom = rowIndex === rows.length - 1;
            // colIndex counter for registration (includes about slot + toolbox)
            let col = 0;
            return (
              <div key={row.category} className="relative flex flex-col" style={{ alignItems: "stretch" }}>
                {/* spine row — vertical clip (overflow-y) so spines rise from under the rule
                    without ever clipping horizontally */}
                <div
                  className="flex items-end"
                  style={{
                    gap: 14,
                    paddingLeft: 24,
                    paddingRight: 24,
                    minHeight: SPINE_HEIGHT + 12,
                    overflowY: "hidden",
                    overflowX: "visible",
                  }}
                >
                  {/* About spine — narrow first slot on the top shelf, used as the filing target.
                      Same width as the hero filing spine (no abrupt width change at landing). */}
                  {isTop && (
                    <div
                      style={{
                        position: "relative",
                        flex: "0 0 auto",
                        width: ABOUT_SPINE_W,
                        height: SPINE_HEIGHT,
                      }}
                    >
                      <div
                        ref={aboutSlotRef}
                        aria-hidden
                        style={{ position: "absolute", inset: 0, opacity: 0, visibility: "hidden" }}
                      />
                      <div
                        ref={aboutSpineRef}
                        style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", willChange: "opacity" }}
                      >
                        <ProjectSpine data={ABOUT_SPINE_DATA} interactive onClick={() => setPopupOpen(true)} fullHeight />
                      </div>
                    </div>
                  )}

                  {row.items.map((p, i) => {
                    const myCol = col++;
                    return (
                      <div
                        key={p.id}
                        ref={registerSpine(rowIndex, myCol)}
                        style={{
                          flex: "0 0 auto",
                          transform: "translateY(-160%) rotate(-6deg)",
                          willChange: "transform",
                        }}
                      >
                        <ProjectSpine
                          data={{
                            title: p.title,
                            subtitle: p.subtitle ?? (p.tags ?? [])[0] ?? "",
                            year: p.year,
                            color: p.color,
                          }}
                          fallbackColor={SPINE_COLORS[(rowIndex * 3 + i) % SPINE_COLORS.length]}
                          interactive
                          onClick={() => navigate(`/projects/${p.slug}`)}
                        />
                      </div>
                    );
                  })}

                  {/* spacer pushes toolbox to the right edge of the bottom row */}
                  {isBottom && <div style={{ flex: "1 1 auto" }} />}

                  {/* Realistic toolbox — bottom row, right edge */}
                  {isBottom && (() => {
                    const myCol = col++;
                    return (
                      <div
                        ref={registerSpine(rowIndex, myCol)}
                        style={{
                          flex: "0 0 auto",
                          transform: "translateY(-160%) rotate(-6deg)",
                          willChange: "transform",
                        }}
                      >
                        <a
                          ref={toolboxRef}
                          href="#skills"
                          aria-label="Open toolbox"
                          style={{
                            display: "block",
                            width: 96,
                            height: 76,
                            transformOrigin: "bottom right",
                            pointerEvents: "auto",
                          }}
                        >
                          <svg width="96" height="76" viewBox="0 0 96 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="tbBody" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="hsl(38 65% 58%)" />
                                <stop offset="0.5" stopColor="hsl(34 60% 48%)" />
                                <stop offset="1" stopColor="hsl(28 55% 32%)" />
                              </linearGradient>
                              <linearGradient id="tbLid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="hsl(40 70% 62%)" />
                                <stop offset="1" stopColor="hsl(32 60% 42%)" />
                              </linearGradient>
                              <linearGradient id="tbHandle" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="hsl(0 0% 78%)" />
                                <stop offset="0.5" stopColor="hsl(0 0% 58%)" />
                                <stop offset="1" stopColor="hsl(0 0% 38%)" />
                              </linearGradient>
                            </defs>

                            {/* ground shadow */}
                            <ellipse cx="48" cy="72" rx="38" ry="2.5" fill="rgba(0,0,0,0.35)" />

                            {/* handle */}
                            <path d="M 30 22 Q 48 6 66 22" stroke="url(#tbHandle)" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <circle cx="30" cy="22" r="2.2" fill="hsl(0 0% 28%)" />
                            <circle cx="66" cy="22" r="2.2" fill="hsl(0 0% 28%)" />

                            {/* lid */}
                            <rect x="8" y="22" width="80" height="14" rx="2" fill="url(#tbLid)" stroke="hsl(28 50% 22%)" strokeWidth="1" />
                            <line x1="10" y1="24.5" x2="86" y2="24.5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                            {/* hinge gap */}
                            <line x1="8" y1="36" x2="88" y2="36" stroke="hsl(28 55% 18%)" strokeWidth="1" />

                            {/* body */}
                            <rect x="8" y="36" width="80" height="32" rx="2" fill="url(#tbBody)" stroke="hsl(28 50% 20%)" strokeWidth="1" />
                            {/* faint wood/metal stripes */}
                            <line x1="10" y1="44" x2="86" y2="44" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
                            <line x1="10" y1="56" x2="86" y2="56" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />

                            {/* latches */}
                            <rect x="22" y="32" width="10" height="10" rx="1" fill="hsl(45 70% 55%)" stroke="hsl(28 50% 22%)" strokeWidth="0.8" />
                            <rect x="64" y="32" width="10" height="10" rx="1" fill="hsl(45 70% 55%)" stroke="hsl(28 50% 22%)" strokeWidth="0.8" />
                            <line x1="27" y1="34" x2="27" y2="40" stroke="hsl(28 55% 18%)" strokeWidth="0.8" />
                            <line x1="69" y1="34" x2="69" y2="40" stroke="hsl(28 55% 18%)" strokeWidth="0.8" />

                            {/* center label plaque */}
                            <rect x="40" y="48" width="16" height="8" rx="1" fill="hsl(28 50% 22%)" />
                            <text x="48" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" fill="hsl(40 60% 70%)" letterSpacing="0.5">TOOLS</text>

                            {/* feet */}
                            <rect x="12" y="68" width="6" height="3" rx="0.5" fill="hsl(28 50% 18%)" />
                            <rect x="78" y="68" width="6" height="3" rx="0.5" fill="hsl(28 50% 18%)" />

                            {/* top edge highlight */}
                            <line x1="10" y1="37" x2="86" y2="37" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
                          </svg>
                        </a>
                      </div>
                    );
                  })()}
                </div>

                {/* ledge — SVG path drawn from center outward */}
                <div className="relative" style={{ height: 14 }}>
                  <svg width="100%" height="14" viewBox="0 0 1180 14" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
                    <path
                      ref={(el) => { rulePathRefs.current[rowIndex] = el; }}
                      d="M 590 7 L 1180 7 M 590 7 L 0 7"
                      stroke={INK}
                      strokeWidth="1"
                      strokeLinecap="round"
                      opacity="0.7"
                      fill="none"
                      pathLength={1180}
                      style={{
                        strokeDasharray: 1180,
                        strokeDashoffset: 1180,
                        willChange: "stroke-dashoffset",
                      }}
                    />
                  </svg>
                  <span
                    className="font-mono uppercase"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      transform: "translateX(-50%)",
                      padding: "0 10px",
                      background: "hsl(35 24% 8%)",
                      color: INK,
                      fontSize: 9,
                      letterSpacing: "1.8px",
                      lineHeight: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.category} · {String(row.items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AboutPopup open={popupOpen} onOpenChange={setPopupOpen} />
    </section>
  );
};

export default AboutToProjectsBridge;
