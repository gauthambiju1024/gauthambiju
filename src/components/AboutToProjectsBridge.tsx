import { useEffect, useMemo, useRef, useState } from "react";
import { MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useSiteData";
import ProjectSpine, { SPINE_COLORS, SPINE_WIDTH, SPINE_HEIGHT, ABOUT_SPINE_DATA } from "@/components/projects/ProjectSpine";
import AboutPopup from "@/components/about/AboutPopup";

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

  // Reset refs whenever the row shape changes
  useEffect(() => {
    rulePathRefs.current = new Array(rows.length).fill(null);
    rulePathLens.current = new Array(rows.length).fill(0);
    spineRefs.current = rows.map(() => []);
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

      // Shelf fades in just before the rules draw, hidden during About
      shelfWrap.style.opacity = String(seg(0.00, 0.10, bridge));
      shelfWrap.style.pointerEvents = bridge > 0.95 ? "auto" : "none";

      (window as any).__bridgeActive = bridge > 0 && bridge < 1;
      (window as any).__bridgeProgress = bridge;

      const settled = bridge > 0.96;
      (window as any).__bridgeSettled = settled;
      if (aboutSpineRef.current) {
        const k = clamp01((bridge - 0.94) / 0.05);
        aboutSpineRef.current.style.opacity = String(k);
        aboutSpineRef.current.style.pointerEvents = settled ? "auto" : "none";
      }
      slot.style.opacity = "0";

      // === DRAW: per-row rule stroke from center outward, staggered ===
      const drawT = seg(0.10, 0.55, bridge);
      const rowCount = Math.max(1, rulePathRefs.current.length);
      rulePathRefs.current.forEach((path, i) => {
        if (!path) return;
        const L = rulePathLens.current[i] || 0;
        if (L <= 0) return;
        const start = (i / rowCount) * 0.55;
        const end = start + 0.55;
        const d = clamp01((drawT - start) / (end - start));
        const e = easeInOut(d);
        path.style.strokeDashoffset = String(L * (1 - e));
      });

      // === ARCHIVE: spines rise from under the rule, staggered by row+col ===
      const archT = seg(0.40, 1.0, bridge);
      spineRefs.current.forEach((row, r) => {
        row.forEach((el, c) => {
          if (!el) return;
          const order = r * 0.16 + c * 0.03;
          const span = 0.40;
          const u = clamp01((archT - order) / span);
          const e = u <= 0 ? 0 : u >= 1 ? 1 : easeBack(u);
          const y = lerp(135, 0, e);
          el.style.transform = `translateY(${y.toFixed(2)}%)`;
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
                {/* clip-masked spine row */}
                <div
                  className="flex items-end"
                  style={{
                    gap: 14,
                    paddingLeft: 24,
                    paddingRight: 24,
                    minHeight: SPINE_HEIGHT + 12,
                    overflow: "hidden", // clip: spines start below this and rise into view
                  }}
                >
                  {row.items.map((p, i) => {
                    const myCol = col++;
                    return (
                      <div
                        key={p.id}
                        ref={registerSpine(rowIndex, myCol)}
                        style={{
                          flex: "0 0 auto",
                          transform: "translateY(135%)",
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

                  {/* push trailing widgets to the right */}
                  <div style={{ flex: "1 1 auto" }} />

                  {/* About spine — top row, last col, rises with the rest */}
                  {isTop && (() => {
                    const myCol = col++;
                    return (
                      <div
                        ref={registerSpine(rowIndex, myCol)}
                        style={{
                          position: "relative",
                          flex: "0 0 auto",
                          width: SPINE_WIDTH,
                          height: SPINE_HEIGHT,
                          transform: "translateY(135%)",
                          willChange: "transform",
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
                          <ProjectSpine data={ABOUT_SPINE_DATA} interactive onClick={() => setPopupOpen(true)} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Toolbox — bottom row, last col, also rises */}
                  {isBottom && (() => {
                    const myCol = col++;
                    return (
                      <div
                        ref={registerSpine(rowIndex, myCol)}
                        style={{
                          flex: "0 0 auto",
                          transform: "translateY(135%)",
                          willChange: "transform",
                        }}
                      >
                        <a
                          ref={toolboxRef}
                          href="#skills"
                          aria-label="Open toolbox"
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            width: 72,
                            height: 56,
                            transformOrigin: "bottom right",
                            pointerEvents: "auto",
                          }}
                        >
                          <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 22 14 Q 36 2 50 14" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
                            <rect x="6" y="16" width="60" height="34" rx="2" stroke={INK} strokeWidth="1.4" fill="none" />
                            <rect x="30" y="22" width="12" height="6" stroke={INK} strokeWidth="1.2" fill="none" />
                            <line x1="6" y1="32" x2="66" y2="32" stroke={INK} strokeWidth="1" opacity="0.5" />
                            <line x1="12" y1="50" x2="12" y2="54" stroke={INK} strokeWidth="1.2" />
                            <line x1="60" y1="50" x2="60" y2="54" stroke={INK} strokeWidth="1.2" />
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
