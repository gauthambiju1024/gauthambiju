import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import heroPortrait from "@/assets/hero-portrait.png";
import { useSiteContent } from "@/hooks/useSiteData";
import { MorphingText } from "./MorphingText";
import { ArrowUpRight } from "lucide-react";
const defaultWords = ["products", "systems", "platforms", "experiences"];

type HeroBadge = {
  name?: string;
  title?: string;
  idLabel?: string;
  ribbonLeft?: string;
  ribbonRight?: string;
};

const HeroSection = () => {
  const { value: heroData, loading: heroLoading } = useSiteContent('hero', 'main');
  const { value: wordsData } = useSiteContent('hero', 'rotating_words');

  const hero = heroData as { name?: string; tagline?: string; location?: string; portrait?: string; badge?: HeroBadge } | null;
  const rotatingWords = (wordsData as string[] | null) ?? defaultWords;
  const portraitSrc = hero?.portrait || heroPortrait;

  const badge: Required<HeroBadge> = {
    name: hero?.badge?.name || "GAUTHAM BIJU",
    title: hero?.badge?.title || "BUILDER · THINKER · MAKER",
    idLabel: hero?.badge?.idLabel || "ID · 0024",
    ribbonLeft: hero?.badge?.ribbonLeft || "GAUTHAM BIJU",
    ribbonRight: hero?.badge?.ribbonRight || "PORTFOLIO · 2026",
  };

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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

  // Track the hero section's rect + inherited opacity so the portaled overlay
  // follows panel slide/fade transitions while still rendering above clipping wrappers.
  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!stage || !section) return;

    let raf = 0;
    let lastW = 0, lastH = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      stage.style.top = `${r.top}px`;
      stage.style.left = `${r.left}px`;
      stage.style.width = `${r.width}px`;
      stage.style.height = `${r.height}px`;
      // Walk up the DOM and multiply opacities so we mirror PanelLayer fade.
      let op = 1;
      let el: HTMLElement | null = section;
      let depth = 0;
      while (el && depth < 8) {
        const o = parseFloat(getComputedStyle(el).opacity || "1");
        if (!Number.isNaN(o)) op *= o;
        el = el.parentElement;
        depth++;
      }
      stage.style.opacity = String(op);
      stage.style.pointerEvents = "none";
      // When the stage actually has size or its size changed, recompute the lanyard.
      if (r.width > 0 && r.height > 0 && (r.width !== lastW || r.height !== lastH)) {
        lastW = r.width;
        lastH = r.height;
        updateLanyardRef.current?.();
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(section);
    // Continuously follow framer-motion animated opacity.
    let mo: number | null = null;
    const tick = () => { update(); mo = requestAnimationFrame(tick); };
    mo = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (mo) cancelAnimationFrame(mo);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted]);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    let offsetX = 0, offsetY = 0;
    let dragging = false;
    let startX = 0, startY = 0;
    let rafId = 0;
    

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
      const dTL = dL;

      const sxR = w * 0.86, syR = -8;
      const cp1xR = sxR - 30, cp1yR = targetY * 0.3;
      const cp2xR = targetX + 50, cp2yR = targetY - 70;
      const dR = `M ${sxR} ${syR} C ${cp1xR} ${cp1yR}, ${cp2xR} ${cp2yR}, ${targetX} ${targetY}`;
      const dTR = dR;

      visualLeftRef.current?.setAttribute('d', dL);
      edgesLeftRef.current?.setAttribute('d', dL);
      textPathLeftRef.current?.setAttribute('d', dTL);
      visualRightRef.current?.setAttribute('d', dR);
      edgesRightRef.current?.setAttribute('d', dR);
      textPathRightRef.current?.setAttribute('d', dTR);

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

    const applyTransform = () => {
      card.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(8deg)`;
      updateLanyard();
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a,button,input,textarea')) return;
      dragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
      card.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
      if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; applyTransform(); });
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
    };

    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', updateLanyard);
    const ro = new ResizeObserver(() => updateLanyard());
    ro.observe(stage);

    requestAnimationFrame(() => requestAnimationFrame(updateLanyard));

    return () => {
      card.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', updateLanyard);
      ro.disconnect();
      updateLanyardRef.current = null;
    };
  }, [mounted]);

  return (
    <section ref={sectionRef} className="relative px-6 md:px-12 pt-4 pb-2 overflow-visible h-full flex flex-col justify-center">
      {/* Top bar */}
      <motion.div
        className="flex items-center justify-between mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: 'hsl(40 30% 85%)' }}>
          {hero?.name ?? "Gautham Biju"}
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase font-mono" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
          Field Notes / {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </motion.div>

      {/* Tagline box */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="w-6 h-6 border flex items-center justify-center" style={{ borderColor: 'hsl(0 0% 100% / 0.2)' }}>
          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>#</span>
        </div>
        <div className="px-3 py-1.5 border" style={{ borderColor: 'hsl(0 0% 100% / 0.15)' }}>
          <span className="text-[9px] tracking-[0.25em] uppercase font-mono" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>
            Intersection of Technology · Business · Design
          </span>
        </div>
      </motion.div>

      <div className="flex items-start gap-8 md:gap-12">
        {/* Left — Headline */}
        <div className="flex-1 relative z-10">
          {/* Dashed annotation arrow */}
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 100% / 0.2)' }}>{'--->'}</span>
          </motion.div>

          <div className="mb-2">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1]" style={{ color: 'hsl(40 30% 85% / 0.5)' }}>
              I'm learning to build
            </h1>
          </div>

          {/* Morphing word with dashed box */}
          <div className="mb-2 py-1 relative">
            <div className="border border-dashed inline-block px-3 py-1" style={{ borderColor: 'hsl(0 0% 100% / 0.2)' }}>
              <MorphingText
                words={rotatingWords}
                className="text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.15]"
                interval={3500}
              />
            </div>
            {/* Label tag connected to dashed box */}
            <span className="hidden md:inline-block ml-3 text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 100% / 0.25)' }}>
              {'--- [ ROTATING ]'}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="font-handwritten text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.1]" style={{ color: 'hsl(40 30% 85% / 0.5)' }}>
              for problems worth solving.
            </h1>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
              style={{ background: 'hsl(40 30% 90%)', color: 'hsl(160 20% 16%)' }}
            >
              View Work <ArrowUpRight className="w-3 h-3" />
            </button>
            <a
              href="#"
              className="px-5 py-2.5 border text-xs font-mono tracking-wider uppercase rounded-sm hover:opacity-80 transition-opacity"
              style={{ borderColor: 'hsl(0 0% 100% / 0.2)', color: 'hsl(40 30% 85%)' }}
            >
              Resume
            </a>
          </div>
        </div>

        {/* Right — spacer to keep headline width */}
        <div className="hidden md:block" style={{ width: "clamp(220px, 18vw, 280px)", flexShrink: 0 }} aria-hidden />
      </div>

      {/* Full-bleed lanyard + ID badge overlay (portaled to body so the card can extend outside the panel viewport) */}
      {mounted && createPortal(
      <div
        ref={stageRef}
        className="hero-card-stage hidden md:block pointer-events-none"
        style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, zIndex: 30, opacity: heroLoading ? 0 : 1, transition: "opacity 0.4s ease" }}
      >
        {/* (mat shadow now lives inside the card so it follows drag) */}


        {/* Lanyard SVG (full hero width) */}
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
            <textPath href="#hero-lanyard-text-left" startOffset="50%">
              {badge.ribbonLeft}
            </textPath>
          </text>
          <text fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="700" fill="hsl(40 30% 96% / 0.7)" letterSpacing="2" textAnchor="middle">
            <textPath href="#hero-lanyard-text-right" startOffset="50%">
              {badge.ribbonRight}
            </textPath>
          </text>
        </svg>

        {/* Metal clip + plastic strap */}
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

        {/* ID Card (draggable) — anchored top-right */}
        <div
          ref={cardRef}
          className="absolute select-none"
          style={{
            top: 90,
            right: 32,
            width: 200,
            padding: "12px 12px 16px",
            background: "hsl(40 25% 92%)",
            borderRadius: 4,
            boxShadow: "0 30px 40px -8px hsl(160 30% 4% / 0.55), 0 12px 24px -6px hsl(160 30% 4% / 0.4), inset 0 0 0 1px hsl(0 0% 100% / 0.5)",
            transform: "rotate(8deg)",
            transformOrigin: "center center",
            cursor: "grab",
            zIndex: 10,
            touchAction: "none",
            pointerEvents: "auto",
          }}
        >
          {/* Ground shadow — sits inside the card so it transforms (drag + rotate) with it */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              bottom: -28,
              transform: "translateX(-50%)",
              width: "115%",
              height: 40,
              background: "radial-gradient(ellipse at center, hsl(160 30% 4% / 0.55) 0%, hsl(160 30% 4% / 0) 70%)",
              filter: "blur(8px)",
              zIndex: -1,
              pointerEvents: "none",
            }}
          />
          <div
            ref={slotRef}
            aria-hidden
            style={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 38,
              height: 7,
              borderRadius: 4,
              background: "hsl(160 30% 6%)",
              boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.6), 0 1px 0 hsl(0 0% 100% / 0.7)",
              zIndex: 2,
            }}
          />

          <div
            style={{
              width: "100%",
              height: 130,
              marginTop: 14,
              marginBottom: 12,
              backgroundImage: `url(${portraitSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.12)",
              filter: "grayscale(1) contrast(1.2)",
            }}
          />

          <div
            className="font-mono"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "hsl(160 20% 16%)",
              letterSpacing: "1.3px",
              marginBottom: 5,
              lineHeight: 1.2,
            }}
          >
            {badge.name}
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 8.5,
              color: "hsl(160 15% 30% / 0.85)",
              letterSpacing: "1px",
              lineHeight: 1.45,
              whiteSpace: "pre-line",
            }}
          >
            {badge.title.replace(/\\n/g, "\n")}
          </div>

          <div style={{ width: "100%", borderTop: "1px dashed hsl(160 20% 16% / 0.3)", margin: "12px 0 10px" }} />

          <div className="flex items-end justify-between w-full">
            <span className="font-mono" style={{ fontSize: 8.5, color: "hsl(160 20% 16% / 0.75)", letterSpacing: "1.3px" }}>
              {badge.idLabel}
            </span>
            <div
              aria-hidden
              style={{
                width: 38,
                height: 10,
                opacity: 0.85,
                background:
                  "repeating-linear-gradient(90deg, hsl(160 20% 16%) 0 1px, hsl(40 25% 92%) 1px 2px, hsl(160 20% 16%) 2px 4px, hsl(40 25% 92%) 4px 5px, hsl(160 20% 16%) 5px 6px, hsl(40 25% 92%) 6px 8px)",
              }}
            />
          </div>
        </div>
      </div>,
      document.body)}

    </section>
  );
};

export default HeroSection;
