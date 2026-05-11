import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MotionValue } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import { journey } from "./about/journeyData";
import { setSelected, useSelectedJourneyId } from "./about/journeyStore";

type HeroBadge = {
  name?: string;
  title?: string;
  idLabel?: string;
  ribbonLeft?: string;
  ribbonRight?: string;
};

interface Props {
  progressMV?: MotionValue<number>;
  anchorId?: string;
  slotId?: string;
}

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const chips = ["Product", "Strategy", "Design", "Technology"];
const PAPER = "hsl(40 25% 92%)";
const INK = "hsl(160 20% 16%)";

const HeroIdBadge = ({ progressMV, anchorId = "home", slotId = "about-card-slot" }: Props) => {
  const { value: heroData, loading: heroLoading } = useSiteContent("hero", "main");
  const hero = heroData as { badge?: HeroBadge } | null;
  const portraitSrc = (hero as any)?.portrait || heroPortrait;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const lanyardLayerRef = useRef<HTMLDivElement>(null);
  const slotInnerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const visualLeftRef = useRef<SVGPathElement>(null);
  const visualRightRef = useRef<SVGPathElement>(null);
  const edgesLeftRef = useRef<SVGPathElement>(null);
  const edgesRightRef = useRef<SVGPathElement>(null);
  const textPathLeftRef = useRef<SVGPathElement>(null);
  const textPathRightRef = useRef<SVGPathElement>(null);
  const updateLanyardRef = useRef<(() => void) | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const selectedId = useSelectedJourneyId();

  // Stage tracking: lerps between hero rect and slot rect by p1.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let lastW = 0,
      lastH = 0;

    const update = () => {
      const anchor = document.getElementById(anchorId);
      const slot = document.getElementById(slotId);
      if (!anchor) return;

      const aR = anchor.getBoundingClientRect();
      const sR = slot ? slot.getBoundingClientRect() : aR;

      const t = progressMV?.get() ?? 0;
      const p1 = smoothstep(0.30, 0.55, smoothstep(0, 1, t));

      const left = lerp(aR.left, sR.left, p1);
      const top = lerp(aR.top, sR.top, p1);
      const width = lerp(aR.width, sR.width, p1);
      const height = lerp(aR.height, sR.height, p1);

      stage.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;

      // Opacity follows the hero panel only (so the card doesn't fade with About bg).
      let op = 1;
      let el: HTMLElement | null = anchor;
      let depth = 0;
      while (el && depth < 8) {
        const o = parseFloat(getComputedStyle(el).opacity || "1");
        if (!Number.isNaN(o)) op *= o;
        el = el.parentElement;
        depth++;
      }
      // Ensure card stays visible when docked into about (anchor faded but slot visible).
      stage.style.opacity = String(Math.max(op, p1));

      if (width > 0 && height > 0 && (width !== lastW || height !== lastH)) {
        lastW = width;
        lastH = height;
        updateLanyardRef.current?.();
      }
    };

    update();
    let raf = requestAnimationFrame(function tick() {
      update();
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [mounted, anchorId, slotId, progressMV]);

  // Drag + lanyard + scroll-driven card transform.
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const cardWrap = cardWrapRef.current;
    if (!stage || !card || !cardWrap) return;

    let offsetX = 0,
      offsetY = 0;
    let dragging = false;
    let startX = 0,
      startY = 0;

    const updateLanyard = () => {
      const slotInner = slotInnerRef.current;
      if (!slotInner) return;
      const slotRect = slotInner.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const targetX = slotRect.left - stageRect.left + slotRect.width / 2;
      const targetY = slotRect.top - stageRect.top + slotRect.height / 2;
      const w = stageRect.width;

      const sxL = w * 0.62,
        syL = -8;
      const cp1xL = sxL + 30,
        cp1yL = targetY * 0.25;
      const cp2xL = targetX - 50,
        cp2yL = targetY - 80;
      const dL = `M ${sxL} ${syL} C ${cp1xL} ${cp1yL}, ${cp2xL} ${cp2yL}, ${targetX} ${targetY}`;

      const sxR = w * 0.86,
        syR = -8;
      const cp1xR = sxR - 30,
        cp1yR = targetY * 0.3;
      const cp2xR = targetX + 50,
        cp2yR = targetY - 70;
      const dR = `M ${sxR} ${syR} C ${cp1xR} ${cp1yR}, ${cp2xR} ${cp2yR}, ${targetX} ${targetY}`;

      visualLeftRef.current?.setAttribute("d", dL);
      edgesLeftRef.current?.setAttribute("d", dL);
      textPathLeftRef.current?.setAttribute("d", dL);
      visualRightRef.current?.setAttribute("d", dR);
      edgesRightRef.current?.setAttribute("d", dR);
      textPathRightRef.current?.setAttribute("d", dR);

      const dx = targetX - (cp2xL + cp2xR) / 2;
      const dy = targetY - (cp2yL + cp2yR) / 2;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (clipRef.current) {
        clipRef.current.style.left = `${targetX - 12}px`;
        clipRef.current.style.top = `${targetY - 12}px`;
        clipRef.current.style.transform = `translateY(-15px) rotate(${angle - 90}deg)`;
      }
    };
    updateLanyardRef.current = updateLanyard;

    const applyTransform = () => {
      const raw = progressMV?.get() ?? 0;
      const t = smoothstep(0, 1, raw); // dampen wheel jitter

      const p1 = smoothstep(0.30, 0.55, t);
      const p2 = smoothstep(0.55, 0.90, t);

      const tilt = 5 * (1 - p1);
      const scale = 1 + 0.05 * p1;
      const rotY = p2 * 180;

      const tx = Math.round(offsetX * 2) / 2;
      const ty = Math.round(offsetY * 2) / 2;
      const sScale = Math.round(scale * 1000) / 1000;
      const sTilt = Math.round(tilt * 100) / 100;
      const sRot = Math.round(rotY * 100) / 100;

      cardWrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${sTilt}deg) scale(${sScale}) rotateY(${sRot}deg)`;

      // Lanyard fades during the slide (p1), not the flip.
      if (lanyardLayerRef.current) {
        lanyardLayerRef.current.style.opacity = String(1 - p1);
      }

      cardWrap.style.pointerEvents = p1 > 0.05 ? "none" : "auto";
      cardWrap.style.cursor = p1 > 0.05 ? "default" : "grab";

      updateLanyard();
    };

    let raf = 0;
    const loop = () => {
      applyTransform();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onPointerDown = (e: PointerEvent) => {
      if ((progressMV?.get() ?? 0) > 0.05) return;
      const tgt = e.target as HTMLElement;
      if (tgt.closest("a,button,input,textarea")) return;
      dragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
      cardWrap.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
    };
    const onPointerUp = () => {
      dragging = false;
    };

    cardWrap.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", updateLanyard);
    const ro = new ResizeObserver(() => updateLanyard());
    ro.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      cardWrap.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", updateLanyard);
      ro.disconnect();
      updateLanyardRef.current = null;
    };
  }, [mounted, progressMV]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={stageRef}
      className="hero-card-stage hidden md:block pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        transform: "translate3d(0,0,0)",
        transformOrigin: "top left",
        willChange: "transform",
        zIndex: 1,
        opacity: heroLoading ? 0 : 1,
        transition: "opacity 0.4s ease",
        perspective: 1800,
      }}
    >
      {/* Lanyard layer */}
      <div ref={lanyardLayerRef} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 5, overflow: "visible" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="hero-lanyard-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="8" stdDeviation="5" floodColor="hsl(160 30% 4%)" floodOpacity="0.55" />
            </filter>
            <pattern id="hero-fabric-front" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
              <rect width="8" height="8" fill="hsl(140 30% 28%)" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="hsl(140 25% 18%)" strokeWidth="3" />
              <line x1="4" y1="0" x2="4" y2="8" stroke="hsl(140 35% 38%)" strokeWidth="3" />
              <line x1="0" y1="2" x2="8" y2="2" stroke="hsl(0 0% 0% / 0.18)" strokeWidth="1" />
              <line x1="0" y1="6" x2="8" y2="6" stroke="hsl(0 0% 100% / 0.12)" strokeWidth="1" />
            </pattern>
            <pattern id="hero-fabric-back" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
              <rect width="8" height="8" fill="hsl(140 28% 18%)" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="hsl(140 20% 12%)" strokeWidth="3" />
              <line x1="4" y1="0" x2="4" y2="8" stroke="hsl(140 30% 22%)" strokeWidth="3" />
              <line x1="0" y1="2" x2="8" y2="2" stroke="hsl(0 0% 0% / 0.22)" strokeWidth="1" />
            </pattern>
          </defs>
          <path ref={visualRightRef} d="" fill="none" stroke="url(#hero-fabric-back)" strokeWidth="22" filter="url(#hero-lanyard-shadow)" strokeLinecap="round" />
          <path ref={edgesRightRef} d="" fill="none" stroke="hsl(0 0% 0% / 0.35)" strokeWidth="22" strokeDasharray="2 4" opacity="0.5" strokeLinecap="round" />
          <path ref={visualLeftRef} d="" fill="none" stroke="url(#hero-fabric-front)" strokeWidth="22" filter="url(#hero-lanyard-shadow)" strokeLinecap="round" />
          <path ref={edgesLeftRef} d="" fill="none" stroke="hsl(0 0% 0% / 0.28)" strokeWidth="22" strokeDasharray="2 4" opacity="0.5" strokeLinecap="round" />
          <path ref={textPathLeftRef} id="hero-lanyard-text-left" d="" fill="none" stroke="transparent" />
          <path ref={textPathRightRef} id="hero-lanyard-text-right" d="" fill="none" stroke="transparent" />
          <text fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="700" fill="hsl(40 30% 96% / 0.95)" letterSpacing="2" textAnchor="middle">
            <textPath href="#hero-lanyard-text-left" startOffset="50%">GAUTHAM BIJU</textPath>
          </text>
          <text fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="700" fill="hsl(40 30% 96% / 0.7)" letterSpacing="2" textAnchor="middle">
            <textPath href="#hero-lanyard-text-right" startOffset="50%">PORTFOLIO · 2026</textPath>
          </text>
        </svg>

        <div
          ref={clipRef}
          className="absolute flex flex-col items-center"
          style={{
            zIndex: 8,
            filter: "drop-shadow(3px 8px 6px hsl(160 30% 4% / 0.5))",
            transformOrigin: "top center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 24,
              height: 30,
              background: "linear-gradient(135deg, hsl(0 0% 96%) 0%, hsl(0 0% 70%) 50%, hsl(0 0% 44%) 100%)",
              borderRadius: "6px 6px 12px 12px",
              boxShadow: "inset 1px 1px 3px hsl(0 0% 100% / 0.9), inset -2px -2px 4px hsl(0 0% 0% / 0.5)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 14,
                height: 8,
                background: "hsl(0 0% 30%)",
                borderRadius: 4,
                boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.7)",
              }}
            />
          </div>
          <div
            style={{
              width: 16,
              height: 35,
              background: "linear-gradient(to right, hsl(0 0% 78% / 0.6), hsl(0 0% 100% / 0.8), hsl(0 0% 78% / 0.6))",
              border: "1px solid hsl(0 0% 100% / 0.5)",
              borderRadius: 2,
              marginTop: -6,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              boxShadow: "0 2px 4px hsl(0 0% 0% / 0.3)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                background: "radial-gradient(circle at 30% 30%, hsl(0 0% 100%), hsl(0 0% 60%))",
                borderRadius: "50%",
                marginTop: 18,
                boxShadow: "0 2px 3px hsl(0 0% 0% / 0.6), inset 0 -1px 2px hsl(0 0% 0% / 0.4)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Card wrapper — sits inside the stage, sized to slot */}
      <div
        ref={cardWrapRef}
        className="absolute select-none"
        style={{
          top: "50%",
          left: "50%",
          width: "min(100%, 360px)",
          aspectRatio: "5 / 7",
          transform: "translate(-50%, -50%) rotate(5deg)",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          cursor: "grab",
          zIndex: 10,
          touchAction: "none",
          pointerEvents: "auto",
          willChange: "transform",
        }}
      >
        <div ref={slotInnerRef} className="absolute inset-0" aria-hidden />
        {/* FRONT */}
        <div
          ref={cardRef}
          style={{
            position: "absolute",
            inset: 0,
            background: PAPER,
            borderRadius: 6,
            padding: "16px 18px 18px",
            boxShadow:
              "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 44,
              height: 8,
              borderRadius: 4,
              background: "hsl(160 30% 6%)",
              boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)",
            }}
          />
          <div
            className="font-mono"
            style={{ position: "absolute", top: 22, right: 14, fontSize: 8, color: `${INK}99`, letterSpacing: "1.4px" }}
          >
            ID · 0024
          </div>
          <div
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              marginTop: 22,
              backgroundImage: `url(${portraitSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.12)",
              filter: "grayscale(1) contrast(1.15)",
              borderRadius: 2,
            }}
          />
          <div
            className="font-mono"
            style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: INK, letterSpacing: "1.2px", lineHeight: 1.2 }}
          >
            GAUTHAM BIJU
          </div>
          <div
            className="font-mono"
            style={{ marginTop: 4, fontSize: 9, color: `${INK}cc`, letterSpacing: "1.1px", lineHeight: 1.4 }}
          >
            ENGINEER × MBA × PRODUCT BUILDER
          </div>
          <div
            className="font-mono"
            style={{ marginTop: 6, fontSize: 8.5, color: `${INK}99`, letterSpacing: "1.1px" }}
          >
            ◉ INDIA · KERALA
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {chips.map((c) => (
              <span
                key={c}
                className="font-mono"
                style={{
                  fontSize: 8,
                  padding: "2px 6px",
                  border: `1px solid ${INK}40`,
                  color: INK,
                  letterSpacing: "0.5px",
                  borderRadius: 2,
                }}
              >
                {c}
              </span>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: "100%", borderTop: `1px dashed ${INK}40`, margin: "10px 0 8px" }} />
          <div className="flex items-end justify-between">
            <span className="font-mono" style={{ fontSize: 8, color: `${INK}99`, letterSpacing: "1.2px" }}>
              PORTFOLIO · 2026
            </span>
            <div
              aria-hidden
              style={{
                width: 44,
                height: 12,
                opacity: 0.85,
                background:
                  "repeating-linear-gradient(90deg, hsl(160 20% 16%) 0 1px, hsl(40 25% 92%) 1px 2px, hsl(160 20% 16%) 2px 4px, hsl(40 25% 92%) 4px 5px, hsl(160 20% 16%) 5px 6px, hsl(40 25% 92%) 6px 8px)",
              }}
            />
          </div>
        </div>

        {/* BACK — Journey */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: PAPER,
            borderRadius: 6,
            padding: "16px 16px 14px",
            boxShadow:
              "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span className="font-mono" style={{ fontSize: 8, fontWeight: 700, color: INK, letterSpacing: "1.4px" }}>
              · JOURNEY
            </span>
            <span className="font-mono" style={{ fontSize: 8, color: `${INK}80`, letterSpacing: "1.2px" }}>
              STAMPED · 2026
            </span>
          </div>
          <div style={{ width: "100%", borderTop: `1px dashed ${INK}40`, marginBottom: 6 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {journey.map((e) => {
              const active = e.id === selectedId;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelected(e.id)}
                  className="text-left transition-colors"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "6px 7px",
                    borderRadius: 3,
                    background: active ? `${INK}10` : "transparent",
                    border: `1px solid ${active ? `${INK}40` : "transparent"}`,
                  }}
                >
                  <span
                    style={{
                      marginTop: 4,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: active ? INK : `${INK}50`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className="font-mono"
                        style={{ fontSize: 9.5, fontWeight: 700, color: INK, letterSpacing: "0.6px" }}
                      >
                        {e.label}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: 7.5, color: `${INK}80`, letterSpacing: "1px", whiteSpace: "nowrap" }}
                      >
                        {e.period}
                      </span>
                    </div>
                    <div style={{ fontSize: 8.5, color: `${INK}aa`, lineHeight: 1.3, marginTop: 1 }}>
                      {e.subtitle}
                    </div>
                  </div>
                  {active && (
                    <span className="font-mono" style={{ fontSize: 6.5, color: INK, letterSpacing: "1px", marginTop: 4 }}>
                      ●
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: "100%", borderTop: `1px dashed ${INK}40`, margin: "8px 0 6px" }} />
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 13,
              color: `${INK}b0`,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            "Build with intent. Ship what matters."
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HeroIdBadge;
