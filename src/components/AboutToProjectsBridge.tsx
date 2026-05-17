import { useEffect, useMemo, useRef, useState } from "react";
import { MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useSiteData";
import ProjectSpine, { SPINE_COLORS, SPINE_WIDTH, SPINE_HEIGHT, ABOUT_SPINE_DATA } from "@/components/projects/ProjectSpine";
import AboutPopup from "@/components/about/AboutPopup";

/**
 * AboutToProjectsBridge — multi-row library shelf.
 * Rows are grouped by project.category. The "MORE ABOUT ME" spine always
 * sits at the right end of the top row (the flying card lands there).
 * A toolbox sits on the bottom-right and scroll-zooms toward the next station.
 *
 * Publishes:
 *   window.__bridgeActive    boolean
 *   window.__bridgeProgress  0..1
 *   window.__bridgeSlotRect  { left, top, width, height, cx, cy } of the About slot
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

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

  useEffect(() => {
    const pin = pinRef.current;
    const shelfWrap = shelfWrapRef.current;
    const slot = aboutSlotRef.current;
    if (!pin || !shelfWrap || !slot) return;

    const publishSlotRect = () => {
      const r = slot.getBoundingClientRect();
      (window as any).__bridgeSlotRect = {
        left: r.left, top: r.top, width: r.width, height: r.height,
        cx: r.left + r.width / 2, cy: r.top + r.height / 2,
      };
    };

    const seg = (a: number, b: number, x: number) => {
      const u = clamp01((x - a) / (b - a));
      return u * u * (3 - 2 * u);
    };

    const update = () => {
      const t = clamp01(progressMV.get());
      const bridge = seg(0.72, 1.0, t);

      shelfWrap.style.opacity = String(clamp01(seg(0.30, 0.60, bridge)));
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

      // Toolbox scroll-zoom toward the SkillsToolbox station
      if (toolboxRef.current) {
        // Use the pin section's bottom as the "exit" point; further scroll zooms.
        const pinRect = pin.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // After pin exits the viewport (bottom < vh), grow toolbox over half a viewport.
        const past = clamp01((vh - pinRect.bottom) / (vh * 0.5));
        const scale = 1 + past * 0.8;
        toolboxRef.current.style.transform = `scale(${scale.toFixed(3)})`;
        toolboxRef.current.style.opacity = String(clamp01(seg(0.45, 0.75, bridge)));
      }

      publishSlotRect();
    };

    update();
    const onResize = () => { update(); publishSlotRect(); };
    window.addEventListener("resize", onResize);
    let raf = 0;
    const loop = () => { update(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      (window as any).__bridgeProgress = 0;
      (window as any).__bridgeActive = false;
      (window as any).__bridgeSlotRect = null;
    };
  }, [projects, progressMV]);

  const Row = ({
    category,
    items,
    isTop,
    isBottom,
    rowIndex,
  }: {
    category: string;
    items: typeof projects;
    isTop: boolean;
    isBottom: boolean;
    rowIndex: number;
  }) => {
    return (
      <div className="relative flex flex-col" style={{ alignItems: "stretch" }}>
        {/* spines */}
        <div
          className="flex items-end"
          style={{
            gap: 14,
            paddingLeft: 24,
            paddingRight: 24,
            minHeight: SPINE_HEIGHT + 12,
          }}
        >
          {items.map((p, i) => (
            <div key={p.id} style={{ flex: "0 0 auto" }}>
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
          ))}

          {/* push trailing widgets to the right */}
          <div style={{ flex: "1 1 auto" }} />

          {/* About spine pinned to top row */}
          {isTop && (
            <div
              style={{
                position: "relative",
                flex: "0 0 auto",
                width: SPINE_WIDTH,
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
                <ProjectSpine data={ABOUT_SPINE_DATA} interactive onClick={() => setPopupOpen(true)} />
              </div>
            </div>
          )}

          {/* Toolbox pinned to bottom row */}
          {isBottom && (
            <a
              ref={toolboxRef}
              href="#skills"
              aria-label="Open toolbox"
              style={{
                flex: "0 0 auto",
                width: 72,
                height: 56,
                display: "flex",
                alignItems: "flex-end",
                transformOrigin: "bottom right",
                willChange: "transform, opacity",
                pointerEvents: "auto",
              }}
            >
              <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* handle */}
                <path d="M 22 14 Q 36 2 50 14" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
                {/* body */}
                <rect x="6" y="16" width="60" height="34" rx="2" stroke={INK} strokeWidth="1.4" fill="none" />
                {/* latch */}
                <rect x="30" y="22" width="12" height="6" stroke={INK} strokeWidth="1.2" fill="none" />
                {/* tray line */}
                <line x1="6" y1="32" x2="66" y2="32" stroke={INK} strokeWidth="1" opacity="0.5" />
                {/* feet */}
                <line x1="12" y1="50" x2="12" y2="54" stroke={INK} strokeWidth="1.2" />
                <line x1="60" y1="50" x2="60" y2="54" stroke={INK} strokeWidth="1.2" />
              </svg>
            </a>
          )}
        </div>

        {/* ledge line with inline category label */}
        <div className="relative" style={{ height: 14 }}>
          <svg width="100%" height="14" viewBox="0 0 1180 14" preserveAspectRatio="none" style={{ display: "block" }}>
            <line x1="0" y1="6" x2="1180" y2="6" stroke={INK} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
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
            {category} · {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    );
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
            opacity: 0,
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

          {rows.map((row, idx) => (
            <Row
              key={row.category}
              category={row.category}
              items={row.items}
              isTop={idx === 0}
              isBottom={idx === rows.length - 1}
              rowIndex={idx}
            />
          ))}
        </div>
      </div>

      <AboutPopup open={popupOpen} onOpenChange={setPopupOpen} />
    </section>
  );
};

export default AboutToProjectsBridge;
