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
const eBack = (t: number) => {
  const c = 1.35, d = c + 1;
  return 1 + d * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

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

    const seg = (a: number, b: number, x: number) => {
      const u = clamp01((x - a) / (b - a));
      return u * u * (3 - 2 * u);
    };

    const update = () => {
      const t = clamp01(progressMV.get());
      const bridge = seg(0.72, 1.0, t);

      // COLL — shelf rule strokes outward (bridge-relative)
      const tColl = seg(0.30, 0.60, bridge);
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tColl));

      shelfWrap.style.opacity = String(clamp01(seg(0.30, 0.55, bridge)));
      shelfWrap.style.pointerEvents = bridge > 0.95 ? "auto" : "none";

      (window as any).__bridgeActive = bridge > 0 && bridge < 1;
      (window as any).__bridgeProgress = bridge;

      // ARCH — staggered within 0.74..1.0 of bridge
      for (let i = 0; i < projects.length; i++) {
        const el = spineRefs.current[i];
        if (!el) continue;
        const start = 0.74 + i * 0.04;
        const k = eBack(seg(start, 0.98, bridge));
        el.style.opacity = String(clamp01(k * 1.4));
        el.style.transform = `translateY(${(1 - k) * 135}%)`;
      }

      // Slot placeholder fades in only after the folded green spine has landed
      slot.style.opacity = String(seg(0.86, 0.92, bridge));

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
        {/* Drawn shelf: minimal line + project spines + landing slot for About */}
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
