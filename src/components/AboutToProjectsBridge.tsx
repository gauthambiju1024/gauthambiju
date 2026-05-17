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
      const foldT = ease(0.72, 1.0, t);

      (window as any).__bridgeActive = foldT > 0 && foldT < 1;
      (window as any).__bridgeProgress = foldT;

      // Shelf line draw
      const tLedge = ease(0.72, 0.90, t);
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));
      shelfWrap.style.opacity = String(Math.min(1, ease(0.70, 0.80, t) * 1.2));
      shelfWrap.style.pointerEvents = t > 0.86 ? "auto" : "none";

      // Project spines stagger in
      for (let i = 0; i < projects.length; i++) {
        const el = spineRefs.current[i];
        if (!el) continue;
        const a = 0.76 + i * 0.025;
        const k = ease(a, a + 0.06, t);
        el.style.opacity = String(k);
        el.style.transform = `translateY(${(1 - k) * 8}px)`;
      }

      // The About-slot placeholder reveals only at the very end (card has landed)
      const aboutReveal = ease(0.998, 1.0, t);
      slot.style.opacity = String(aboutReveal);

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
              bottom: 2,
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

          {/* Drawn warm-wood line */}
          <svg
            width="100%"
            height="6"
            viewBox="0 0 1180 6"
            preserveAspectRatio="none"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              ref={ledgePathRef}
              d="M 4 3 L 1176 3"
              stroke="hsl(28 35% 28%)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AboutToProjectsBridge;
