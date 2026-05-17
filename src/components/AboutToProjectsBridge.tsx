import { useEffect, useMemo, useRef } from "react";
import { MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useSiteData";
import ProjectSpine, {
  SPINE_COLORS,
  ABOUT_SPINE_DATA,
  SPINE_WIDTH,
  SPINE_HEIGHT,
} from "@/components/projects/ProjectSpine";

/**
 * AboutToProjectsBridge — shelf + dossier-collapse layer.
 *
 * Choreography (b = ease(0.55, 1.0, parent progress)):
 *   P3 COLLAPSE  0.30 – 0.60   AboutGlobe flattens into a streak along shelf line
 *   P4 DRAW      0.46 – 0.74   shelf line strokes L→R
 *   P5 FILE      0.58 – 0.86   (owned by HeroIdBadge — spine arcs to slot)
 *   P6 ARCHIVE   0.74 – 1.00   neighbor spines rise from beneath the line (eBack)
 *
 * Publishes:
 *   window.__bridgeActive    boolean
 *   window.__bridgeProgress  0..1
 *   window.__bridgeSlotRect  { cx, cy, ... }
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));
const eInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);
const eBack = (t: number) => {
  const c = 1.35, d = c + 1;
  return 1 + d * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Props {
  progressMV: MotionValue<number>;
}

// One seed = one paper-particle that streaks from the globe rim to the shelf strip.
type Seed = { ox: number; oy: number; tx: number; ty: number; sp: number; bow: number };

const AboutToProjectsBridge = ({ progressMV }: Props) => {
  const pinRef = useRef<HTMLElement>(null);
  const shelfWrapRef = useRef<HTMLDivElement>(null);
  const ledgePathRef = useRef<SVGPathElement>(null);
  const spineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const aboutSlotRef = useRef<HTMLDivElement>(null);
  const collapseGlobeRef = useRef<HTMLDivElement>(null);
  const seedsLayerRef = useRef<HTMLDivElement>(null);
  const seedNodesRef = useRef<HTMLSpanElement[]>([]);
  const navigate = useNavigate();

  const { projects } = useProjects();

  // Stable seed geometry; recomputed only when viewport size shifts noticeably.
  const seedSpec = useRef<Seed[]>([]);
  const ensureSeeds = useMemo(() => () => {
    if (seedSpec.current.length === 24) return;
    const arr: Seed[] = [];
    for (let i = 0; i < 24; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 120;
      arr.push({
        ox: Math.cos(a) * r,
        oy: Math.sin(a) * r,
        tx: (Math.random() - 0.5) * 1100,
        ty: 0,
        sp: 0.55 + Math.random() * 0.4,
        bow: 50 + Math.random() * 140,
      });
    }
    seedSpec.current = arr;
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const ledgePath = ledgePathRef.current;
    const shelfWrap = shelfWrapRef.current;
    const slot = aboutSlotRef.current;
    const collapseGlobe = collapseGlobeRef.current;
    const seedsLayer = seedsLayerRef.current;
    if (!pin || !ledgePath || !shelfWrap || !slot || !collapseGlobe || !seedsLayer) return;

    ensureSeeds();

    // Materialize seed DOM once
    if (seedNodesRef.current.length !== 24) {
      seedsLayer.innerHTML = "";
      const nodes: HTMLSpanElement[] = [];
      for (let i = 0; i < 24; i++) {
        const el = document.createElement("span");
        el.style.cssText =
          "position:absolute;left:0;top:0;width:3px;height:3px;border-radius:50%;" +
          "background:hsl(40 30% 92% / 0.9);will-change:transform,opacity;opacity:0;" +
          "box-shadow:0 0 6px hsl(40 30% 92% / 0.5);";
        seedsLayer.appendChild(el);
        nodes.push(el);
      }
      seedNodesRef.current = nodes;
    }

    let ledgeLen = 1000;
    try { ledgeLen = ledgePath.getTotalLength() || 1000; } catch { /* noop */ }
    ledgePath.style.strokeDasharray = String(ledgeLen);
    ledgePath.style.strokeDashoffset = String(ledgeLen);

    const publishSlotRect = () => {
      const r = slot.getBoundingClientRect();
      (window as any).__bridgeSlotRect = {
        left: r.left, top: r.top, width: r.width, height: r.height,
        cx: r.left + r.width / 2, cy: r.top + r.height / 2,
      };
    };

    const update = () => {
      const t = clamp01(progressMV.get());
      const b = ease(0.55, 1.0, t);

      (window as any).__bridgeActive = b > 0 && b < 1;
      (window as any).__bridgeProgress = b;

      // P4 — DRAW shelf line (earlier than before, so it's down by FILE)
      const tLedge = eInOut(ease(0.46, 0.74, b));
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));

      shelfWrap.style.opacity = String(Math.min(1, ease(0.42, 0.62, b) * 1.2));
      shelfWrap.style.pointerEvents = b > 0.95 ? "auto" : "none";

      // P3 — COLLAPSE globe into a streak along the shelf line
      const tColl = ease(0.30, 0.60, b);
      const cE = eInOut(tColl);
      const globeRect = (window as any).__aboutGlobeRect as
        | { cx: number; cy: number; opacity: number } | null;

      // Shelf-line midpoint (viewport coords)
      const shelfRect = shelfWrap.getBoundingClientRect();
      const shelfCx = shelfRect.left + shelfRect.width / 2;
      const shelfCy = shelfRect.top + shelfRect.height - 4; // line sits near bottom

      if (globeRect && tColl > 0.01) {
        // Mirror initial position to the real globe; flatten toward shelf line.
        const startCx = globeRect.cx;
        const startCy = globeRect.cy;
        const gx = lerp(startCx, shelfCx, cE) - 210;
        const gy = lerp(startCy, shelfCy, cE) - 210;
        const sx = lerp(1, 1.9, cE);
        const sy = lerp(1, 0.014, cE);
        collapseGlobe.style.opacity = String(
          tColl < 0.82 ? globeRect.opacity * 0.6 + 0.4 : Math.max(0, 1 - ease(0.82, 1.0, tColl))
        );
        collapseGlobe.style.transform =
          `translate3d(${gx}px, ${gy}px, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;

        // Seeds streak outward from globe center, landing on the shelf strip.
        const nodes = seedNodesRef.current;
        const specs = seedSpec.current;
        for (let i = 0; i < nodes.length; i++) {
          const s = specs[i];
          const tt = clamp01(tColl / s.sp);
          const e = eOut(tt);
          const X = lerp(startCx + s.ox, shelfCx + s.tx, e);
          const Y = lerp(startCy + s.oy, shelfCy + s.ty, e) - Math.sin(e * Math.PI) * s.bow;
          nodes[i].style.transform = `translate3d(${X}px, ${Y}px, 0) scale(${lerp(1, 0.55, e).toFixed(3)})`;
          nodes[i].style.opacity = tt <= 0 ? "0" : String(lerp(0.9, 0.32, e));
        }
      } else {
        collapseGlobe.style.opacity = "0";
        const nodes = seedNodesRef.current;
        for (let i = 0; i < nodes.length; i++) nodes[i].style.opacity = "0";
      }

      // P6 — ARCHIVE: neighbor spines rise from beneath the shelf line with eBack
      const tArch = ease(0.74, 1.00, b);
      for (let i = 0; i < projects.length; i++) {
        const el = spineRefs.current[i];
        if (!el) continue;
        const order = i * 0.04;
        const e = eBack(clamp01((tArch - order) / 0.40));
        const ty = lerp(135, 0, clamp01(e));
        el.style.transform = `translateY(${ty.toFixed(2)}%)`;
        el.style.opacity = String(Math.min(1, tArch * 4));
      }

      slot.style.opacity = String(ease(0.998, 1.0, b));

      publishSlotRect();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      (window as any).__bridgeProgress = 1;
      (window as any).__bridgeActive = false;
      ledgePath.style.strokeDashoffset = "0";
      shelfWrap.style.opacity = "1";
      spineRefs.current.forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
      });
      slot.style.opacity = "1";
      collapseGlobe.style.opacity = "0";
      publishSlotRect();
      return;
    }

    const onResize = () => { update(); publishSlotRect(); };

    update();
    window.addEventListener("resize", onResize);
    let raf = 0;
    const loop = () => { update(); publishSlotRect(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      (window as any).__bridgeProgress = 0;
      (window as any).__bridgeActive = false;
      (window as any).__bridgeSlotRect = null;
    };
  }, [projects, progressMV, ensureSeeds]);

  const INK = "hsl(38 60% 52%)";

  return (
    <section
      ref={pinRef}
      aria-label="Projects"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      className="w-full h-full"
    >
      {/* COLLAPSE globe overlay — paper-cream radial that flattens toward the shelf line.
          Fixed to the viewport so its coords match __aboutGlobeRect (also viewport-fixed). */}
      <div
        ref={collapseGlobeRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0, top: 0,
          width: 420, height: 420,
          borderRadius: "50%",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 7,
          background:
            "radial-gradient(circle at 38% 34%, hsl(40 30% 96%) 0%, hsl(40 25% 88%) 38%, hsl(35 20% 70%) 70%, hsl(35 25% 50%) 100%)",
          boxShadow:
            "0 0 60px 18px hsl(40 30% 88% / 0.28), inset -28px -24px 60px hsl(35 25% 30% / 0.32)",
          transformOrigin: "50% 50%",
          willChange: "transform, opacity",
        }}
      />

      {/* Seeds — viewport-fixed so they share the globe's coordinate space */}
      <div
        ref={seedsLayerRef}
        aria-hidden
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8,
        }}
      />

      <div
        className="absolute inset-0 w-full overflow-hidden"
        style={{ height: "100%" }}
      >
        {/* Shelf: minimal line + project spines + landing slot for About */}
        <div
          ref={shelfWrapRef}
          className="absolute left-1/2"
          style={{
            bottom: "22%",
            transform: "translateX(-50%)",
            width: "min(88vw, 1180px)",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          {/* spines row, clipped so risers emerge from beneath the line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 8,
              height: SPINE_HEIGHT + 12,
              overflow: "hidden",
              pointerEvents: "auto",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                gap: 14,
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => { spineRefs.current[i] = el; }}
                  style={{
                    opacity: 0,
                    transform: "translateY(135%)",
                    willChange: "opacity, transform",
                    flex: "0 0 auto",
                  }}
                >
                  <ProjectSpine
                    data={{
                      title: p.title,
                      subtitle: p.subtitle ?? (p.tags ?? [])[0] ?? "",
                      year: p.year,
                      color: p.color,
                    }}
                    fallbackColor={SPINE_COLORS[i % SPINE_COLORS.length]}
                    interactive
                    onClick={() => navigate(`/projects/${p.slug}`)}
                  />
                </div>
              ))}

              {/* About-card landing slot (placeholder; the real card flies here) */}
              <div
                ref={aboutSlotRef}
                aria-hidden
                style={{
                  flex: "0 0 auto",
                  width: SPINE_WIDTH,
                  height: SPINE_HEIGHT,
                  marginLeft: 8,
                  opacity: 0,
                  willChange: "opacity",
                }}
              >
                <ProjectSpine data={ABOUT_SPINE_DATA} />
              </div>
            </div>
          </div>

          {/* Minimal shelf line */}
          <svg
            width="100%"
            height="8"
            viewBox="0 0 1180 8"
            preserveAspectRatio="none"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              ref={ledgePathRef}
              d="M 0 4 L 1180 4"
              stroke={INK}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AboutToProjectsBridge;
