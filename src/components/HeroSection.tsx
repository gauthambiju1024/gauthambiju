import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    let offsetX = 0, offsetY = 0;
    let dragging = false;
    let startX = 0, startY = 0;
    let rafId = 0;
    let springing = false;

    const updateLanyard = () => {
      const slot = slotRef.current;
      if (!slot) return;
      const slotRect = slot.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const targetX = slotRect.left - stageRect.left + slotRect.width / 2;
      const targetY = slotRect.top - stageRect.top + slotRect.height / 2;
      const w = stageRect.width;

      const sxL = w * 0.55, syL = 0;
      const cp1xL = sxL + 20, cp1yL = targetY * 0.2;
      const cp2xL = targetX - 40, cp2yL = targetY - 60;
      const dL = `M ${sxL} ${syL} C ${cp1xL} ${cp1yL}, ${cp2xL} ${cp2yL}, ${targetX} ${targetY}`;
      const dTL = `M ${sxL - 200} ${syL - 100} L ${sxL} ${syL} C ${cp1xL} ${cp1yL}, ${cp2xL} ${cp2yL}, ${targetX} ${targetY}`;

      const sxR = w * 0.75, syR = 0;
      const cp1xR = sxR - 30, cp1yR = targetY * 0.3;
      const cp2xR = targetX + 40, cp2yR = targetY - 50;
      const dR = `M ${sxR} ${syR} C ${cp1xR} ${cp1yR}, ${cp2xR} ${cp2yR}, ${targetX} ${targetY}`;
      const dTR = `M ${sxR + 200} ${syR - 100} L ${sxR} ${syR} C ${cp1xR} ${cp1yR}, ${cp2xR} ${cp2yR}, ${targetX} ${targetY}`;

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

    const applyTransform = () => {
      card.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(8deg)`;
      updateLanyard();
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a,button,input,textarea')) return;
      dragging = true;
      springing = false;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
      card.setPointerCapture(e.pointerId);
      card.style.transition = 'none';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      offsetX = Math.max(-140, Math.min(140, e.clientX - startX));
      offsetY = Math.max(-140, Math.min(140, e.clientY - startY));
      if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; applyTransform(); });
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      const fromX = offsetX, fromY = offsetY;
      const startTs = performance.now();
      const duration = 500;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      springing = true;
      const tick = () => {
        if (!springing) return;
        const t = Math.min(1, (performance.now() - startTs) / duration);
        const k = 1 - ease(t);
        offsetX = fromX * k;
        offsetY = fromY * k;
        applyTransform();
        if (t < 1) requestAnimationFrame(tick);
        else springing = false;
      };
      requestAnimationFrame(tick);
    };

    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', updateLanyard);

    requestAnimationFrame(() => requestAnimationFrame(updateLanyard));

    return () => {
      card.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', updateLanyard);
    };
  }, []);

  return (
    <section className="relative px-6 md:px-12 pt-4 pb-2 overflow-hidden h-full flex flex-col justify-center">
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

        {/* Right — ID badge on lanyard, lying on the mat */}
        <motion.div
          className="hidden md:flex relative items-start justify-center pt-1 pr-2 pl-4"
          initial={{ opacity: 0, y: -10, rotate: -10 }}
          animate={{ opacity: heroLoading ? 0 : 1, y: 0, rotate: -6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          whileHover={{ rotate: -3, y: -2, transition: { duration: 0.2 } }}
          style={{ transformOrigin: "top center" }}
        >
          {/* mat shadow */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: "12%",
              right: "8%",
              top: "55%",
              bottom: "-6%",
              background: "radial-gradient(ellipse at center, hsl(160 30% 4% / 0.55) 0%, hsl(160 30% 4% / 0) 70%)",
              filter: "blur(10px)",
              zIndex: 0,
            }}
          />

          <div className="relative z-[1] flex flex-col items-center" style={{ width: "clamp(160px, 14vw, 200px)" }}>
            {/* Ribbon / lanyard loop + clip */}
            <svg
              viewBox="0 0 240 150"
              className="w-full"
              style={{ height: 130, marginBottom: -6, overflow: "visible", filter: "drop-shadow(3px 4px 4px hsl(160 30% 4% / 0.4))" }}
              preserveAspectRatio="xMidYMax meet"
            >
              {/* Closed ribbon loop — outer (shadow) edge */}
              <path
                d="M 116 142 C 70 110, 40 80, 50 40 C 58 8, 110 0, 160 8 C 210 16, 240 50, 220 90 C 205 120, 170 138, 128 142 Z"
                fill="hsl(140 35% 38%)"
                stroke="hsl(140 30% 24%)"
                strokeWidth="0.8"
              />
              {/* Inner cutout to make it a true loop (ribbon, not blob) */}
              <path
                d="M 122 132 C 88 108, 62 82, 70 50 C 78 22, 118 14, 158 22 C 200 30, 224 56, 208 86 C 196 110, 168 126, 132 132 Z"
                fill="hsl(160 30% 6%)"
              />
              {/* Highlight along outer top edge */}
              <path
                d="M 60 38 C 70 14, 116 6, 158 12 C 196 18, 222 42, 222 70"
                fill="none"
                stroke="hsl(140 42% 52%)"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Subtle fold/twist near top */}
              <path
                d="M 150 8 C 158 14, 162 22, 158 30"
                fill="none"
                stroke="hsl(140 30% 22%)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* tiny mono mark on ribbon */}
              <text x="180" y="46" fontSize="6" fill="hsl(40 30% 88% / 0.7)" fontFamily="monospace" textAnchor="middle" transform="rotate(18 180 46)">GB · 0024</text>
              {/* metal clip at bottom of loop */}
              <rect x="112" y="138" width="16" height="10" rx="2" fill="hsl(0 0% 72%)" stroke="hsl(0 0% 50%)" strokeWidth="0.5" />
              <rect x="115" y="140" width="10" height="2" fill="hsl(0 0% 88%)" />
            </svg>

            {/* Card body */}
            <div
              className="relative w-full"
              style={{
                background: "hsl(40 25% 92%)",
                border: "1px solid hsl(160 15% 30% / 0.25)",
                borderRadius: 4,
                padding: "14px 12px 10px",
                boxShadow: "4px 10px 26px hsl(160 30% 4% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
              }}
            >
              {/* punched hole */}
              <div
                aria-hidden
                className="absolute"
                style={{
                  top: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 14,
                  height: 4,
                  borderRadius: 2,
                  background: "hsl(160 20% 16%)",
                  boxShadow: "inset 0 1px 1px hsl(0 0% 0% / 0.6)",
                }}
              />

              {/* Photo window */}
              <div
                className="relative mx-auto"
                style={{
                  marginTop: 6,
                  width: "100%",
                  aspectRatio: "1 / 1",
                  border: "1px solid hsl(160 20% 16% / 0.3)",
                  background: "hsl(40 20% 88%)",
                  overflow: "hidden",
                  boxShadow: "inset 0 0 8px hsl(160 30% 10% / 0.25)",
                }}
              >
                <img
                  src={portraitSrc}
                  alt="Gautham portrait"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(0.4) contrast(1.05)" }}
                />
              </div>

              {/* Name */}
              <div
                className="font-mono uppercase mt-2.5"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  color: "hsl(160 20% 16%)",
                  fontWeight: 600,
                }}
              >
                {hero?.name ?? "Gautham Biju"}
              </div>

              {/* Role */}
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.25em",
                  color: "hsl(160 15% 30% / 0.75)",
                  marginTop: 2,
                }}
              >
                Builder · Thinker · Maker
              </div>

              {/* Dashed divider */}
              <div
                className="my-2"
                style={{ borderTop: "1px dashed hsl(160 20% 16% / 0.3)" }}
              />

              {/* ID + barcode */}
              <div className="flex items-end justify-between">
                <span
                  className="font-mono"
                  style={{ fontSize: 8, letterSpacing: "0.2em", color: "hsl(160 20% 16% / 0.7)" }}
                >
                  ID · 0024
                </span>
                <svg width="56" height="14" viewBox="0 0 56 14" aria-hidden>
                  {[1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3].map((w, i, arr) => {
                    const x = arr.slice(0, i).reduce((s, v) => s + v + 1, 0);
                    return <rect key={i} x={x} y="0" width={w} height="14" fill="hsl(160 20% 16% / 0.85)" />;
                  })}
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
