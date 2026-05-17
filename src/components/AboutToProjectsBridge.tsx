import { useEffect, useMemo, useRef } from "react";

/**
 * AboutToProjectsBridge (v4)
 * --------------------------
 * The real About card (rendered by HeroIdBadge) folds + drops onto a
 * minimalist drawn shelf line, joining a row of project spines that
 * appear staggered as the shelf line draws in left→right.
 *
 * This component owns ONLY the shelf + spines + window flags.
 * The folding happens on the real card via window.__bridgeProgress
 * and window.__bridgeSlotRect (the landing slot in viewport coords).
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));

// Project spine palette (mirrors ProjectsShelf SPINE_COLORS, muted)
const SPINES = [
  { color: "hsl(170 25% 28%)", w: 14, h: 92 },
  { color: "hsl(350 28% 30%)", w: 11, h: 80 },
  { color: "hsl(215 28% 28%)", w: 16, h: 96 },
  { color: "hsl(85 18% 28%)",  w: 12, h: 74 },
  { color: "hsl(15 30% 30%)",  w: 15, h: 88 },
  { color: "hsl(280 18% 30%)", w: 11, h: 70 },
  { color: "hsl(200 12% 32%)", w: 13, h: 84 },
];
// About spine sits in the rightmost slot — slightly taller, walnut.
const ABOUT_SLOT = { w: 16, h: 100 };

const AboutToProjectsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const shelfWrapRef = useRef<HTMLDivElement>(null);
  const ledgePathRef = useRef<SVGPathElement>(null);
  const spineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotRef = useRef<HTMLDivElement>(null);

  // Stagger appearance windows for spines
  const stagger = useMemo(
    () => SPINES.map((_, i) => 0.60 + i * 0.045),
    []
  );

  useEffect(() => {
    const pin = pinRef.current;
    const ledgePath = ledgePathRef.current;
    const shelfWrap = shelfWrapRef.current;
    const slot = slotRef.current;
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

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = pin.offsetHeight - vh;
      if (travel <= 0) return;
      const scrolled = -rect.top;
      const t = clamp01(scrolled / travel);

      const active = rect.top <= 0 && rect.bottom >= vh * 0.5;
      (window as any).__bridgeActive = active;
      (window as any).__bridgeProgress = t;

      // Shelf line draw
      const tLedge = ease(0.55, 0.92, t);
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));
      shelfWrap.style.opacity = String(Math.min(1, ease(0.50, 0.65, t) * 1.2));

      // Spines stagger in
      for (let i = 0; i < SPINES.length; i++) {
        const el = spineRefs.current[i];
        if (!el) continue;
        const a = stagger[i];
        const k = ease(a, a + 0.06, t);
        el.style.opacity = String(k);
        el.style.transform = `translateY(${(1 - k) * 8}px)`;
      }

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
      publishSlotRect();
      return;
    }

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    const onResize = () => { update(); publishSlotRect(); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // keep slot rect fresh during sticky scroll
    let raf = 0;
    const loop = () => { publishSlotRect(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      (window as any).__bridgeProgress = 0;
      (window as any).__bridgeActive = false;
      (window as any).__bridgeSlotRect = null;
    };
  }, [stagger]);

  return (
    <section
      ref={pinRef}
      id="about-projects-bridge"
      aria-hidden
      style={{ height: "200vh" }}
      className="relative w-full"
    >
      <div
        className="sticky w-full overflow-hidden"
        style={{ top: 100, height: "calc(100vh - 100px)" }}
      >
        {/* Minimalist drawn shelf: single warm-wood line + project spines + landing slot */}
        <div
          ref={shelfWrapRef}
          className="absolute left-1/2 pointer-events-none"
          style={{
            bottom: "22%",
            transform: "translateX(-50%)",
            width: "min(78vw, 1040px)",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          {/* spines + slot — anchored to the shelf line (line is at bottom: 0 of this box) */}
          <div
            className="absolute"
            style={{
              left: 0,
              right: 0,
              bottom: 2, // sit on top of the 1.5px line
              height: 110,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 10,
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            {SPINES.map((s, i) => (
              <div
                key={i}
                ref={(el) => { spineRefs.current[i] = el; }}
                style={{
                  width: s.w,
                  height: s.h,
                  backgroundColor: s.color,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)," +
                    "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 3px)",
                  boxShadow:
                    "0 -3px 6px hsl(160 30% 4% / 0.28), inset 0 1px 0 hsl(0 0% 100% / 0.08), inset 0 -1px 0 hsl(0 0% 0% / 0.25)",
                  borderRadius: "1px 1px 0 0",
                  opacity: 0,
                  transform: "translateY(8px)",
                  willChange: "opacity, transform",
                }}
              />
            ))}
            {/* The About-card landing slot — invisible reference rect at the right end */}
            <div
              ref={slotRef}
              aria-hidden
              style={{
                width: ABOUT_SLOT.w,
                height: ABOUT_SLOT.h,
                marginLeft: 6,
                // visible only as a subtle ghost outline
                outline: "1px dashed hsl(28 35% 28% / 0.25)",
                outlineOffset: -1,
                opacity: 0.6,
              }}
            />
          </div>

          {/* The drawn warm-wood line */}
          <svg
            width="100%"
            height="6"
            viewBox="0 0 1040 6"
            preserveAspectRatio="none"
            fill="none"
            style={{ display: "block" }}
          >
            <path
              ref={ledgePathRef}
              d="M 4 3 L 1036 3"
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
