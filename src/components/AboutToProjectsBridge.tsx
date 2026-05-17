import { useEffect, useRef } from "react";
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
 * AboutToProjectsBridge (inline shelf layer)
 * --------------------------
 * The folding About card (from HeroIdBadge) parks into the rightmost slot
 * of this shelf, which IS the real Projects shelf — spines come from the DB.
 *
 * Publishes:
 *   window.__bridgeActive    boolean (stage is in view)
 *   window.__bridgeProgress  0..1 scroll-driven progress
 *   window.__bridgeSlotRect  { left, top, width, height, cx, cy } of the About slot
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));

interface Props {
  progressMV: MotionValue<number>;
}

const AboutToProjectsBridge = ({ progressMV }: Props) => {
  const pinRef = useRef<HTMLElement>(null);
  const shelfWrapRef = useRef<HTMLDivElement>(null);
  const ledgePathRef = useRef<SVGPathElement>(null);
  const spineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const aboutSlotRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { projects } = useProjects();

  useEffect(() => {
    const pin = pinRef.current;
    const ledgePath = ledgePathRef.current;
    const shelfWrap = shelfWrapRef.current;
    const slot = aboutSlotRef.current;
    if (!pin || !ledgePath || !shelfWrap || !slot) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      const b = ease(0.72, 1.0, t);

      (window as any).__bridgeActive = b > 0 && b < 1;
      (window as any).__bridgeProgress = b;

      const tLedge = ease(0.74, 1.0, b);
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));

      shelfWrap.style.opacity = String(Math.min(1, ease(0.70, 0.85, b) * 1.2));
      shelfWrap.style.pointerEvents = b > 0.95 ? "auto" : "none";

      for (let i = 0; i < projects.length; i++) {
        const el = spineRefs.current[i];
        if (!el) continue;
        const a = 0.20 + i * 0.06;
        const k = ease(a, a + 0.12, b);
        el.style.opacity = String(k);
        el.style.transform = `translateY(${(1 - k) * 8}px)`;
      }

      slot.style.opacity = String(ease(0.998, 1.0, b));

      publishSlotRect();
    };

    if (reduced) {
      (window as any).__bridgeProgress = 1;
      (window as any).__bridgeActive = false;
      ledgePath.style.strokeDashoffset = "0";
      shelfWrap.style.opacity = "1";
      spineRefs.current.forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
      });
      slot.style.opacity = "1";
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
  }, [projects, progressMV]);

  const INK = "hsl(38 60% 52%)";
  const INK_DIM = "hsl(38 45% 45%)";

  return (
    <section
      ref={pinRef}
      aria-label="Projects"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      className="w-full h-full"
    >
      <div
        className="absolute inset-0 w-full overflow-hidden"
        style={{ height: "100%" }}
      >
        {/* Top caption — "Filing this away." */}
        <div
          ref={topCapRef}
          className="absolute left-1/2 font-handwritten select-none pointer-events-none"
          style={{
            top: "12%",
            transform: "translateX(-50%)",
            fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
            color: "hsl(40 30% 85% / 0.75)",
            letterSpacing: "0.02em",
            willChange: "opacity",
          }}
        >
          Filing this away.
        </div>
        <div
          ref={subLblRef}
          className="absolute left-1/2 font-mono select-none pointer-events-none"
          style={{
            top: "calc(12% + 28px)",
            transform: "translateX(-50%)",
            fontSize: "9px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "hsl(40 30% 85% / 0.32)",
            willChange: "opacity",
          }}
        >
          FOLD · ROTATE · SHELVE
        </div>

        {/* Drawn shelf: warm-wood line + project spines + landing slot for About */}
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
          {/* spines row, sitting on top of the line */}
          <div
            className="absolute"
            style={{
              left: 0,
              right: 0,
              bottom: 8,
              height: SPINE_HEIGHT + 12,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-start",
              gap: 14,
              paddingLeft: 24,
              paddingRight: 24,
              overflow: "visible",
            }}
          >
            {projects.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => { spineRefs.current[i] = el; }}
                style={{
                  opacity: 0,
                  transform: "translateY(8px)",
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

          {/* Drawn warm-wood ledge with tick marks */}
          <svg
            width="100%"
            height="32"
            viewBox="0 0 1180 32"
            preserveAspectRatio="none"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              ref={ledgePathRef}
              d="M 6 8 L 1174 8"
              stroke={INK}
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.85"
            />
            <g ref={ledgeTicksRef} opacity="0">
              {Array.from({ length: 25 }).map((_, i) => {
                const x = 6 + i * ((1174 - 6) / 24);
                const major = i % 4 === 0;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={8}
                    x2={x}
                    y2={major ? 20 : 14}
                    stroke={INK_DIM}
                    strokeWidth={major ? 1 : 0.6}
                  />
                );
              })}
              <line x1="6" y1="0" x2="6" y2="20" stroke={INK_DIM} strokeWidth="0.8" />
              <line x1="1174" y1="0" x2="1174" y2="20" stroke={INK_DIM} strokeWidth="0.8" />
            </g>
          </svg>
        </div>

        {/* Dimension marks + technical labels */}
        <div
          ref={dimsRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0, willChange: "opacity" }}
        >
          <div
            className="absolute"
            style={{
              left: "calc(50% - min(38vw, 510px))",
              bottom: "calc(22% + 44px)",
              width: 16, height: 16,
              borderTop: `1.2px solid ${INK}`,
              borderLeft: `1.2px solid ${INK}`,
              opacity: 0.7,
            }}
          />
          <div
            className="absolute"
            style={{
              right: "calc(50% - min(38vw, 510px))",
              bottom: "calc(22% + 44px)",
              width: 16, height: 16,
              borderTop: `1.2px solid ${INK}`,
              borderRight: `1.2px solid ${INK}`,
              opacity: 0.7,
            }}
          />
          <div
            className="absolute font-mono"
            style={{
              left: "calc(50% - min(38vw, 510px) - 4px)",
              bottom: "calc(22% - 28px)",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: INK,
              opacity: 0.65,
            }}
          >
            SPINE_01 · W:78mm
          </div>
          <div
            className="absolute font-mono"
            style={{
              right: "calc(50% - min(38vw, 510px) - 4px)",
              bottom: "calc(22% - 28px)",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: INK,
              opacity: 0.65,
            }}
          >
            REV: A · 2026
          </div>
          <div
            className="absolute"
            style={{
              left: "50%",
              bottom: "calc(22% + 16px)",
              width: 1, height: 18,
              background: INK,
              opacity: 0.5,
            }}
          />
          <div
            className="absolute font-mono"
            style={{
              left: "50%",
              bottom: "calc(22% + 38px)",
              transform: "translateX(-50%)",
              fontSize: 9,
              letterSpacing: "0.4em",
              color: INK,
              opacity: 0.7,
            }}
          >
            ⌖
          </div>
        </div>

        {/* Bottom caption — "Selected work — pull a spine." */}
        <div
          ref={botCapRef}
          className="absolute font-handwritten select-none pointer-events-none"
          style={{
            left: "50%",
            bottom: "10%",
            transform: "translate(-50%, 8px)",
            fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
            color: "hsl(40 30% 85% / 0.78)",
            opacity: 0,
            willChange: "opacity, transform",
          }}
        >
          Selected work — pull a spine.
        </div>
      </div>
    </section>
  );
};

export default AboutToProjectsBridge;
