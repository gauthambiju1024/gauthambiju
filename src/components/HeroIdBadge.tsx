import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MotionValue } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import AboutCardBack, { AboutJourneyData } from "./about/AboutCardBack";
import AboutGlobe, { GlobeMarker } from "./about/AboutGlobe";
import ProjectSpine, { SPINE_WIDTH, SPINE_HEIGHT, ABOUT_SPINE_DATA } from "./projects/ProjectSpine";

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
const snap = (v: number, q = 0.5) => Math.round(v / q) * q;

const HeroIdBadge = ({ progressMV, anchorId = "home" }: Props) => {
  const { value: heroData, loading: heroLoading } = useSiteContent("hero", "main");
  const { value: journeyData } = useSiteContent("about", "journey");
  const hero = heroData as { badge?: HeroBadge } | null;

  const badge: Required<HeroBadge> = {
    name: hero?.badge?.name || "GAUTHAM BIJU",
    title: hero?.badge?.title || "BUILDER · THINKER · MAKER",
    idLabel: hero?.badge?.idLabel || "ID · 0024",
    ribbonLeft: hero?.badge?.ribbonLeft || "GAUTHAM BIJU",
    ribbonRight: hero?.badge?.ribbonRight || "PORTFOLIO · 2026",
  };
  const portraitSrc = (hero as any)?.portrait || heroPortrait;

  const journey = (journeyData as AboutJourneyData) || {};
  const markers: GlobeMarker[] = useMemo(
    () =>
      ((journeyData as any)?.markers as GlobeMarker[]) || [
        { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
        { id: "ahmedabad", location: [23.0225, 72.5714], label: "Ahmedabad" },
        { id: "kerala", location: [9.9312, 76.2673], label: "Kerala" },
        { id: "indore", location: [22.7196, 75.8577], label: "Indore" },
      ],
    [journeyData]
  );

  // Shared state for globe ↔ back-of-card linking
  const [activeTab, setActiveTab] = useState<"overview" | "education" | "experience">("overview");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const onMarkerClick = (markerId: string) => {
    // Find entry whose markerId matches
    const allEntries = [
      ...(journey.education || []).map((e) => ({ ...e, _tab: "education" as const })),
      ...(journey.experience || []).map((e) => ({ ...e, _tab: "experience" as const })),
    ];
    const match = allEntries.find((e) => e.markerId === markerId);
    if (match) {
      setActiveTab(match._tab);
      setExpandedId(match.id);
    }
  };

  // Selected marker reflects the currently-expanded entry
  const selectedMarkerId = useMemo(() => {
    if (!expandedId) return null;
    const all = [...(journey.education || []), ...(journey.experience || [])];
    return all.find((e) => e.id === expandedId)?.markerId || null;
  }, [expandedId, journey]);

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const lanyardLayerRef = useRef<HTMLDivElement>(null);
  const globeLayerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const cardBackInnerRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);
  const backSlotRef = useRef<HTMLDivElement>(null);
  const foldCenterRef = useRef<HTMLDivElement>(null);
  const spineSkinRef = useRef<HTMLDivElement>(null);
  const foldLeftRef = useRef<HTMLDivElement>(null);
  const foldRightRef = useRef<HTMLDivElement>(null);
  const volRef = useRef<HTMLDivElement>(null);
  const visualLeftRef = useRef<SVGPathElement>(null);
  const visualRightRef = useRef<SVGPathElement>(null);
  const edgesLeftRef = useRef<SVGPathElement>(null);
  const edgesRightRef = useRef<SVGPathElement>(null);
  const textPathLeftRef = useRef<SVGPathElement>(null);
  const textPathRightRef = useRef<SVGPathElement>(null);
  const updateLanyardRef = useRef<(() => void) | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Track the hero panel rect into the fixed stage using transform (no jitter).
  useEffect(() => {
    const stage = stageRef.current;
    const anchor = document.getElementById(anchorId);
    if (!stage || !anchor) return;

    let lastW = 0, lastH = 0;
    const update = () => {
      let r: { left: number; top: number; width: number; height: number };
      r = anchor.getBoundingClientRect();
      const tx = snap(r.left);
      const ty = snap(r.top);
      stage.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      stage.style.width = `${snap(r.width)}px`;
      stage.style.height = `${snap(r.height)}px`;
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

    // Per-frame: combine drag offset, resting tilt, scroll-driven (translate, scale, rotateY),
    // and the bridge shrink/drop that turns the card into a shelved spine.
    const applyTransform = () => {
      const p = progressMV?.get() ?? 0;
      const seg = (a: number, b: number, x: number) => smoothstep(a, b, x);
      const eInOut = (x: number) =>
        x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

      // Pre-fold: hero→center slide and About flip (unchanged windows)
      const p1 = seg(0.35, 0.55, p);
      const p2 = seg(0.55, 0.72, p);

      // about→projects segment driver; all 5 spec phases are bridge-relative
      const bridge = smoothstep(0.72, 1.0, p);
      const tFold = seg(0.04, 0.40, bridge);
      const tTurn = seg(0.24, 0.56, bridge);
      const tFile = seg(0.58, 0.86, bridge);
      
      const tHide = seg(0.86, 0.90, bridge);

      const stageRect = stage.getBoundingClientRect();
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const restingLeft = stageRect.width - 32 - w;
      const restingTop = 90;
      const targetCenterX = stageRect.width * 0.74;
      const targetCenterY = stageRect.height / 2;
      const restingCenterX = restingLeft + w / 2;
      const restingCenterY = restingTop + h / 2;
      const dxToCenter = (targetCenterX - restingCenterX) * p1;
      const dyToCenter = (targetCenterY - restingCenterY) * p1;

      const tilt = 8 * (1 - p1);
      const maxScale = Math.min(stageRect.width * 0.45 / w, stageRect.height * 0.78 / h);
      const baseScale = 1 + (maxScale - 1) * p1;

      // Single rotateY driver: About flip + TURN
      const rotYFlip = p2 * 180 + eInOut(tTurn) * 180;

      if (backFaceRef.current) {
        backFaceRef.current.style.background = "hsl(40 25% 92%)";
      }

      // Wings overlay opacity
      if (volRef.current) {
        volRef.current.style.opacity = String(tFold > 0.01 ? 1 : 0);
        volRef.current.style.transform = "";
      }

      // FOLD — wings rotate around inner edges, card clips to centre column
      const fE = eInOut(tFold);
      const flapAngle = fE * 178;
      const clipPct = (33.333 * fE).toFixed(3);
      const clipCSS = `inset(0% ${clipPct}% 0% ${clipPct}%)`;
      if (cardRef.current) {
        cardRef.current.style.clipPath = clipCSS;
        (cardRef.current.style as any).webkitClipPath = clipCSS;
      }
      if (backFaceRef.current) {
        backFaceRef.current.style.clipPath = clipCSS;
        (backFaceRef.current.style as any).webkitClipPath = clipCSS;
      }
      if (foldLeftRef.current) {
        foldLeftRef.current.style.transform = `rotateY(${flapAngle.toFixed(2)}deg)`;
      }
      if (foldRightRef.current) {
        foldRightRef.current.style.transform = `rotateY(${(-flapAngle).toFixed(2)}deg)`;
      }
      if (foldCenterRef.current) {
        const cd = 0.18 + fE * 0.28;
        foldCenterRef.current.style.boxShadow =
          `inset 8px 0 14px -8px hsl(160 30% 4% / ${cd.toFixed(3)}), ` +
          `inset -8px 0 14px -8px hsl(160 30% 4% / ${cd.toFixed(3)}), ` +
          `inset 0 0 0 1px hsl(0 0% 100% / 0.44)`;
      }

      // FILE — fly to slot + scale down to spine dims
      const fileE = eInOut(tFile);
      const targetSx = SPINE_WIDTH / w;
      const targetSy = SPINE_HEIGHT / h;
      const fileScaleX = 1 + (targetSx - 1) * fileE;
      const fileScaleY = 1 + (targetSy - 1) * fileE;
      // Uniform scale via average (cardWrap holds single scale); use min to fit
      const fileScale = Math.min(fileScaleX, fileScaleY);
      const arcY = Math.sin(tFile * Math.PI) * -60;
      const settleDeg = tFile > 0 && tFile < 1 ? Math.sin(tFile * Math.PI) * -3 * (1 - tFile) : 0;

      let flyDx = 0, flyDy = 0;
      if (tFile > 0) {
        const slotRect = (window as any).__bridgeSlotRect as
          | { cx: number; cy: number } | null;
        if (slotRect) {
          const curCx = stageRect.left + restingCenterX + dxToCenter;
          const curCy = stageRect.top + restingCenterY + dyToCenter;
          flyDx = (slotRect.cx - curCx) * fileE;
          flyDy = (slotRect.cy - curCy) * fileE + arcY;
        }
      }

      const tx = snap(offsetX + dxToCenter + flyDx);
      const ty = snap(offsetY + dyToCenter + flyDy);
      const s = Math.round(baseScale * fileScale * 1000) / 1000;

      cardWrap.style.transform =
        `translate3d(${tx}px, ${ty}px, 0) rotate(${(tilt + settleDeg).toFixed(2)}deg) scale(${s}) ` +
        `rotateY(${rotYFlip.toFixed(2)}deg)`;

      // Lanyard fades with the About flip
      if (lanyardLayerRef.current) {
        lanyardLayerRef.current.style.opacity = String((1 - p2) * (1 - tFold));
      }
      if (globeLayerRef.current) {
        const globeOp = p2 * (1 - tFold);
        globeLayerRef.current.style.opacity = String(globeOp);
        globeLayerRef.current.style.pointerEvents =
          p2 > 0.5 && tFold < 0.02 ? "auto" : "none";
      }
      cardWrap.style.opacity = String(1 - tHide);
      cardWrap.style.pointerEvents = p1 > 0.05 || tFold > 0.02 ? "none" : "auto";
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
        zIndex: 3,
        opacity: heroLoading ? 0 : 1,
        transition: "opacity 0.4s ease",
        perspective: 1800,
        willChange: "transform",
      }}
    >
      {/* Globe layer — left of card, fades in with the flip */}
      <div
        ref={globeLayerRef}
        className="absolute"
        style={{
          left: "2%",
          top: "2%",
          width: "50%",
          height: "96%",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 6,
          transition: "opacity 0.05s linear",
          color: "hsl(40 25% 92%)",
        }}
      >
        <AboutGlobe markers={markers} selectedId={selectedMarkerId} onMarkerClick={onMarkerClick} />
      </div>

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
        data-hero-card-wrap
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
            height: 380,
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
          <div style={{ width: "100%", height: 230, marginTop: 14, marginBottom: 10, backgroundImage: `url(${portraitSrc})`, backgroundSize: "cover", backgroundPosition: "center 18%", boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.12)", filter: "grayscale(1) contrast(1.2)" }} />
          <div className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "hsl(160 20% 16%)", letterSpacing: "1.2px", marginBottom: 3, lineHeight: 1.2 }}>{badge.name}</div>
          <div className="font-mono" style={{ fontSize: 8, color: "hsl(160 15% 30% / 0.85)", letterSpacing: "0.9px", lineHeight: 1.4, whiteSpace: "pre-line" }}>{badge.title.replace(/\\n/g, "\n")}</div>
          <div style={{ width: "100%", borderTop: "1px dashed hsl(160 20% 16% / 0.3)", margin: "8px 0 6px" }} />
          <div className="flex items-end justify-between w-full">
            <span className="font-mono" style={{ fontSize: 8.5, color: "hsl(160 20% 16% / 0.75)", letterSpacing: "1.3px" }}>{badge.idLabel}</span>
            <div aria-hidden style={{ width: 38, height: 10, opacity: 0.85, background: "repeating-linear-gradient(90deg, hsl(160 20% 16%) 0 1px, hsl(40 25% 92%) 1px 2px, hsl(160 20% 16%) 2px 4px, hsl(40 25% 92%) 4px 5px, hsl(160 20% 16%) 5px 6px, hsl(40 25% 92%) 6px 8px)" }} />
          </div>
        </div>

        {/* Back face — Tabbed About panel */}
        <div
          ref={backFaceRef}
          style={{
            position: "absolute",
            inset: 0,
            width: 260,
            height: 380,
            padding: "20px 14px 14px",
            background: "hsl(40 25% 92%)",
            borderRadius: 4,
            boxShadow: "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
          }}
        >
          <div ref={backSlotRef} aria-hidden style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 38, height: 7, borderRadius: 4, background: "hsl(160 30% 6%)", boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)", zIndex: 2, pointerEvents: "none" }} />
          <div
            ref={cardBackInnerRef}
            style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, willChange: "opacity" }}
          >
            <AboutCardBack
              data={journey}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          </div>

          {/* Trifold packet — left/right wings overlay + a project-spine back */}
          <div
            ref={volRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              pointerEvents: "none",
              zIndex: 5,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              perspective: 1400,
              willChange: "opacity, transform",
            }}
          >
            {/* LEFT wing — folds behind (origin: right edge) */}
            <div
              ref={foldLeftRef}
              style={{
                position: "absolute",
                top: 0, bottom: 0, left: 0,
                width: "33.333%",
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
                transformOrigin: "right center",
                willChange: "transform",
              }}
            >
              {/* front face — transparent (clip on card handles hiding About content) */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "transparent", boxShadow: "inset -1px 0 0 hsl(160 30% 4% / 0.18)" }} />
              {/* back face — dark linen (visible once flap folds behind) */}
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "linear-gradient(150deg, hsl(160 18% 14%), hsl(160 24% 8%))", boxShadow: "inset 0 0 0 1px hsl(0 0% 100% / 0.06)" }} />
            </div>

            {/* CENTER crease shadow only — no front face so live AboutCardBack stays visible */}
            <div
              ref={foldCenterRef}
              style={{
                position: "absolute",
                top: 0, bottom: 0,
                left: "33.333%",
                width: "33.334%",
                pointerEvents: "none",
                willChange: "box-shadow",
                boxShadow: "inset 8px 0 14px -8px hsl(160 30% 4% / 0.18), inset -8px 0 14px -8px hsl(160 30% 4% / 0.18)",
              }}
            />

            {/* RIGHT wing — folds behind (origin: left edge) */}
            <div
              ref={foldRightRef}
              style={{
                position: "absolute",
                top: 0, bottom: 0, left: "66.667%",
                width: "33.333%",
                transformStyle: "preserve-3d",
                WebkitTransformStyle: "preserve-3d",
                transformOrigin: "left center",
                willChange: "transform",
              }}
            >
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "transparent", boxShadow: "inset 1px 0 0 hsl(160 30% 4% / 0.18)" }} />
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "linear-gradient(150deg, hsl(160 18% 14%), hsl(160 24% 8%))", boxShadow: "inset 0 0 0 1px hsl(0 0% 100% / 0.06)" }} />
            </div>

            {/* SPINE back face — real ProjectSpine markup, sized to fill 260×380 so FILE-phase
                scaleX/Y (SPINE_WIDTH/260, SPINE_HEIGHT/380) collapses it to shelf-row dimensions. */}
            <div
              ref={spineSkinRef}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "stretch",
                willChange: "opacity",
              }}
            >
              <div style={{ width: "100%", height: "100%" }}>
                <ProjectSpine
                  data={ABOUT_SPINE_DATA}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HeroIdBadge;
