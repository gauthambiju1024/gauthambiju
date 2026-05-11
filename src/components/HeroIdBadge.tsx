import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MotionValue } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";

type HeroBadge = {
  name?: string;
  title?: string;
  idLabel?: string;
  ribbonLeft?: string;
  ribbonRight?: string;
};

interface Props {
  /** Optional scroll progress 0..1 controlling slide-to-center, scale, and rotateY flip. */
  progressMV?: MotionValue<number>;
  /** Element id of the hero panel to anchor the lanyard against. */
  anchorId?: string;
}

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const HeroIdBadge = ({ progressMV, anchorId = "home" }: Props) => {
  const { value: heroData, loading: heroLoading } = useSiteContent("hero", "main");
  const hero = heroData as { badge?: HeroBadge } | null;

  const badge: Required<HeroBadge> = {
    name: hero?.badge?.name || "GAUTHAM BIJU",
    title: hero?.badge?.title || "BUILDER · THINKER · MAKER",
    idLabel: hero?.badge?.idLabel || "ID · 0024",
    ribbonLeft: hero?.badge?.ribbonLeft || "GAUTHAM BIJU",
    ribbonRight: hero?.badge?.ribbonRight || "PORTFOLIO · 2026",
  };
  const portraitSrc = (hero as any)?.portrait || heroPortrait;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const lanyardLayerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
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

  // Track the hero panel rect + opacity into the fixed stage.
  useEffect(() => {
    const stage = stageRef.current;
    const anchor = document.getElementById(anchorId);
    if (!stage || !anchor) return;

    let lastW = 0, lastH = 0;
    const update = () => {
      const r = anchor.getBoundingClientRect();
      stage.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
      stage.style.width = `${r.width}px`;
      stage.style.height = `${r.height}px`;
      let op = 1;
      let el: HTMLElement | null = anchor;
      let depth = 0;
      while (el && depth < 8) {
        const o = parseFloat(getComputedStyle(el).opacity || "1");
        if (!Number.isNaN(o)) op *= o;
        el = el.parentElement;
        depth++;
      }
      stage.style.opacity = String(op);
      if (r.width > 0 && r.height > 0 && (r.width !== lastW || r.height !== lastH)) {
        lastW = r.width;
        lastH = r.height;
        updateLanyardRef.current?.();
      }
    };
    update();
    let mo: number | null = null;
    const tick = () => { update(); mo = requestAnimationFrame(tick); };
    mo = requestAnimationFrame(tick);
    return () => { if (mo) cancelAnimationFrame(mo); };
  }, [mounted, anchorId]);

  // Drag + lanyard + scroll-driven transforms.
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const cardWrap = cardWrapRef.current;
    if (!stage || !card || !cardWrap) return;

    let offsetX = 0, offsetY = 0;
    let dragging = false;
    let startX = 0, startY = 0;

    const updateLanyard = () => {
      const slot = slotRef.current;
      if (!slot) return;
      const slotRect = slot.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const targetX = slotRect.left - stageRect.left + slotRect.width / 2;
      const targetY = slotRect.top - stageRect.top + slotRect.height / 2;
      const w = stageRect.width;

      const sxL = w * 0.62, syL = -8;
      const cp1xL = sxL + 30, cp1yL = targetY * 0.25;
      const cp2xL = targetX - 50, cp2yL = targetY - 80;
      const dL = `M ${sxL} ${syL} C ${cp1xL} ${cp1yL}, ${cp2xL} ${cp2yL}, ${targetX} ${targetY}`;

      const sxR = w * 0.86, syR = -8;
      const cp1xR = sxR - 30, cp1yR = targetY * 0.3;
      const cp2xR = targetX + 50, cp2yR = targetY - 70;
      const dR = `M ${sxR} ${syR} C ${cp1xR} ${cp1yR}, ${cp2xR} ${cp2yR}, ${targetX} ${targetY}`;

      visualLeftRef.current?.setAttribute('d', dL);
      edgesLeftRef.current?.setAttribute('d', dL);
      textPathLeftRef.current?.setAttribute('d', dL);
      visualRightRef.current?.setAttribute('d', dR);
      edgesRightRef.current?.setAttribute('d', dR);
      textPathRightRef.current?.setAttribute('d', dR);

      const dx = targetX - (cp2xL + cp2xR) / 2;
      const dy = targetY - (cp2yL + cp2yR) / 2;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (clipRef.current) {
        clipRef.current.style.left = `${targetX - 12}px`;
        clipRef.current.style.top = `${targetY - 12}px`;
        clipRef.current.style.transform = `translateY(-15px) rotate(${angle - 90}deg)`;
      }
    };
    updateLanyardRef.current = updateLanyard;

    // Per-frame: combine drag offset, resting tilt, and scroll-driven (translate, scale, rotateY).
    const applyTransform = () => {
      const t = progressMV?.get() ?? 0;

      // Phase 1 (0.30..0.55): translate to viewport center + scale up. Tilt eases out.
      const p1 = smoothstep(0.30, 0.55, t);
      // Phase 2 (0.55..0.80): rotateY 0..180.
      const p2 = smoothstep(0.55, 0.80, t);

      // Compute resting card center vs. stage center.
      const stageRect = stage.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      // cardRect already reflects current transforms, so back out by using the resting offset
      // from layout: card is positioned at top:90, right:32, w:200, h≈card.offsetHeight.
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const restingLeft = stageRect.width - 32 - w;     // because right:32
      const restingTop = 90;                            // because top:90
      const stageCenterX = stageRect.width / 2;
      const stageCenterY = stageRect.height / 2;
      const restingCenterX = restingLeft + w / 2;
      const restingCenterY = restingTop + h / 2;
      const dxToCenter = (stageCenterX - restingCenterX) * p1;
      const dyToCenter = (stageCenterY - restingCenterY) * p1;

      const tilt = 8 * (1 - p1);
      // Scale so the card grows toward the viewer. Cap at panel-fitting size.
      const maxScale = Math.min(stageRect.width / w, stageRect.height / h) * 0.85;
      const scale = 1 + (maxScale - 1) * p1;
      const rotY = p2 * 180;

      const tx = offsetX + dxToCenter;
      const ty = offsetY + dyToCenter;

      cardWrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${tilt}deg) scale(${scale}) rotateY(${rotY}deg)`;

      // Lanyard stays attached (and stretches) through the slide; only fades during the flip.
      if (lanyardLayerRef.current) {
        lanyardLayerRef.current.style.opacity = String(1 - p2);
      }
      // Disable pointer events while moving.
      cardWrap.style.pointerEvents = p1 > 0.05 ? "none" : "auto";
      cardWrap.style.cursor = p1 > 0.05 ? "default" : "grab";

      updateLanyard();
    };

    let raf = 0;
    const loop = () => { applyTransform(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const onPointerDown = (e: PointerEvent) => {
      if ((progressMV?.get() ?? 0) > 0.05) return;
      const tgt = e.target as HTMLElement;
      if (tgt.closest('a,button,input,textarea')) return;
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
    const onPointerUp = () => { dragging = false; };

    cardWrap.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', updateLanyard);
    const ro = new ResizeObserver(() => updateLanyard());
    ro.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      cardWrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', updateLanyard);
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
        top: 0, left: 0, width: 0, height: 0,
        zIndex: 30,
        opacity: heroLoading ? 0 : 1,
        transition: "opacity 0.4s ease",
        perspective: 1800,
      }}
    >
      {/* Lanyard layer (fades out as card travels) */}
      <div ref={lanyardLayerRef} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5, overflow: "visible" }} xmlns="http://www.w3.org/2000/svg">
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
            <textPath href="#hero-lanyard-text-left" startOffset="50%">{badge.ribbonLeft}</textPath>
          </text>
          <text fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="700" fill="hsl(40 30% 96% / 0.7)" letterSpacing="2" textAnchor="middle">
            <textPath href="#hero-lanyard-text-right" startOffset="50%">{badge.ribbonRight}</textPath>
          </text>
        </svg>

        {/* Metal clip + plastic strap */}
        <div ref={clipRef} className="absolute flex flex-col items-center" style={{ zIndex: 8, filter: "drop-shadow(3px 8px 6px hsl(160 30% 4% / 0.5))", transformOrigin: "top center", pointerEvents: "none" }}>
          <div style={{ width: 24, height: 30, background: "linear-gradient(135deg, hsl(0 0% 96%) 0%, hsl(0 0% 70%) 50%, hsl(0 0% 44%) 100%)", borderRadius: "6px 6px 12px 12px", boxShadow: "inset 1px 1px 3px hsl(0 0% 100% / 0.9), inset -2px -2px 4px hsl(0 0% 0% / 0.5)", position: "relative", zIndex: 2 }}>
            <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 14, height: 8, background: "hsl(0 0% 30%)", borderRadius: 4, boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.7)" }} />
          </div>
          <div style={{ width: 16, height: 35, background: "linear-gradient(to right, hsl(0 0% 78% / 0.6), hsl(0 0% 100% / 0.8), hsl(0 0% 78% / 0.6))", border: "1px solid hsl(0 0% 100% / 0.5)", borderRadius: 2, marginTop: -6, position: "relative", display: "flex", justifyContent: "center", boxShadow: "0 2px 4px hsl(0 0% 0% / 0.3)" }}>
            <div style={{ width: 8, height: 8, background: "radial-gradient(circle at 30% 30%, hsl(0 0% 100%), hsl(0 0% 60%))", borderRadius: "50%", marginTop: 18, boxShadow: "0 2px 3px hsl(0 0% 0% / 0.6), inset 0 -1px 2px hsl(0 0% 0% / 0.4)" }} />
          </div>
        </div>
      </div>

      {/* ID Card wrapper — gets all transforms (drag + scroll-driven) */}
      <div
        ref={cardWrapRef}
        className="absolute select-none"
        style={{
          top: 90,
          right: 32,
          width: 260,
          transform: "rotate(8deg)",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          cursor: "grab",
          zIndex: 10,
          touchAction: "none",
          pointerEvents: "auto",
          willChange: "transform",
        }}
      >
        <div
          ref={cardRef}
          style={{
            width: 260,
            padding: "12px 14px 16px",
            background: "hsl(40 25% 92%)",
            borderRadius: 4,
            boxShadow: "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "relative",
          }}
        >
          <div aria-hidden style={{ position: "absolute", left: "50%", bottom: -28, transform: "translateX(-50%)", width: "115%", height: 40, background: "radial-gradient(ellipse at center, hsl(160 30% 4% / 0.55) 0%, hsl(160 30% 4% / 0) 70%)", filter: "blur(8px)", zIndex: -1, pointerEvents: "none" }} />
          <div ref={slotRef} aria-hidden style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 38, height: 7, borderRadius: 4, background: "hsl(160 30% 6%)", boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)", zIndex: 2 }} />
          <div style={{ width: "100%", height: 150, marginTop: 14, marginBottom: 12, backgroundImage: `url(${portraitSrc})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.12)", filter: "grayscale(1) contrast(1.2)" }} />
          <div className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: "hsl(160 20% 16%)", letterSpacing: "1.3px", marginBottom: 5, lineHeight: 1.2 }}>{badge.name}</div>
          <div className="font-mono" style={{ fontSize: 8.5, color: "hsl(160 15% 30% / 0.85)", letterSpacing: "1px", lineHeight: 1.45, whiteSpace: "pre-line" }}>{badge.title.replace(/\\n/g, "\n")}</div>
          <div style={{ width: "100%", borderTop: "1px dashed hsl(160 20% 16% / 0.3)", margin: "12px 0 10px" }} />
          <div className="flex items-end justify-between w-full">
            <span className="font-mono" style={{ fontSize: 8.5, color: "hsl(160 20% 16% / 0.75)", letterSpacing: "1.3px" }}>{badge.idLabel}</span>
            <div aria-hidden style={{ width: 38, height: 10, opacity: 0.85, background: "repeating-linear-gradient(90deg, hsl(160 20% 16%) 0 1px, hsl(40 25% 92%) 1px 2px, hsl(160 20% 16%) 2px 4px, hsl(40 25% 92%) 4px 5px, hsl(160 20% 16%) 5px 6px, hsl(40 25% 92%) 6px 8px)" }} />
          </div>
        </div>

        {/* Back face — same card size as front; complementary "stat sheet", no repeats from the front */}
        <div
          ref={backRef}
          style={{
            position: "absolute",
            inset: 0,
            width: 260,
            padding: "14px 14px 16px",
            background: "hsl(40 25% 92%)",
            borderRadius: 4,
            boxShadow: "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div aria-hidden style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 38, height: 7, borderRadius: 4, background: "hsl(160 30% 6%)", boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)" }} />

          <div className="flex items-center justify-between" style={{ marginTop: 14, marginBottom: 8 }}>
            <span className="font-mono" style={{ fontSize: 8, fontWeight: 700, color: "hsl(160 20% 16%)", letterSpacing: "1.4px" }}>· ABOUT</span>
            <span className="font-mono" style={{ fontSize: 8, color: "hsl(160 20% 16% / 0.6)", letterSpacing: "1.2px" }}>02 / 08</span>
          </div>

          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, fontStyle: "italic", color: "hsl(160 20% 14%)", lineHeight: 1.35, marginBottom: 8 }}>
            Notes on How I Work
          </div>

          <div style={{ fontSize: 8.5, color: "hsl(160 20% 16% / 0.85)", lineHeight: 1.45, marginBottom: 10 }}>
            Product-minded builder at the intersection of tech, business &amp; design. I want to know{" "}
            <span style={{ borderBottom: "1px solid hsl(160 20% 16% / 0.5)" }}>why</span> something should exist before figuring out{" "}
            <span style={{ borderBottom: "1px solid hsl(160 20% 16% / 0.5)" }}>how</span> to build it.
          </div>

          <div style={{ marginBottom: 8 }}>
            <div className="font-mono" style={{ fontSize: 7, color: "hsl(160 20% 16% / 0.55)", letterSpacing: "1.4px", marginBottom: 3 }}>TRAITS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "Systems Thinking",
                "Fast Learning",
                "Structured Problem Solving",
              ].map((t, i) => (
                <div key={t} style={{ display: "flex", gap: 6, fontSize: 8.5, color: "hsl(160 20% 16%)", lineHeight: 1.3 }}>
                  <span className="font-mono" style={{ color: "hsl(160 20% 16% / 0.5)" }}>0{i + 1}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div className="font-mono" style={{ fontSize: 7, color: "hsl(160 20% 16% / 0.55)", letterSpacing: "1.4px", marginBottom: 3 }}>FOCUS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {["Product", "AI Workflows", "Business × UX"].map((f) => (
                <span key={f} className="font-mono" style={{ fontSize: 7.5, padding: "2px 5px", border: "1px solid hsl(160 20% 16% / 0.25)", color: "hsl(160 20% 16%)", letterSpacing: "0.5px" }}>{f}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 6 }}>
            <div className="font-mono" style={{ fontSize: 7, color: "hsl(160 20% 16% / 0.55)", letterSpacing: "1.4px", marginBottom: 3 }}>QUICK FACTS</div>
            <div className="font-mono" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 8px", fontSize: 7.5, color: "hsl(160 20% 16%)" }}>
              <div><span style={{ opacity: 0.55 }}>Based</span> India</div>
              <div><span style={{ opacity: 0.55 }}>Edu</span> IIM Indore</div>
              <div><span style={{ opacity: 0.55 }}>Focus</span> Product</div>
              <div><span style={{ opacity: 0.55 }}>Now</span> Building</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ width: "100%", borderTop: "1px dashed hsl(160 20% 16% / 0.3)", margin: "0 0 6px" }} />
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 13, color: "hsl(160 20% 16% / 0.7)", lineHeight: 1.1, textAlign: "center" }}>
            "Build with intent. Ship what matters."
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HeroIdBadge;
