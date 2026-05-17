import { useEffect, useRef } from "react";

/**
 * AboutToProjectsBridge
 * ---------------------
 * Pinned scroll-driven transition between the About panel (blueprint surface)
 * and the Projects shelf (dark walnut). The blueprint slab tri-folds inward,
 * rotates 90° on Y to present its spine, then drops onto a freshly drawn
 * shelf ledge framed with construction-reveal dimension marks.
 *
 * No React re-renders during scroll — single window listener + rAF flag,
 * mutates refs only. Same pattern as MarginDoodles / Assembly belt.
 *
 *   A 0.00–0.15  Settle    blueprint visible, top caption fades in
 *   B 0.15–0.45  Tri-fold  side flaps rotateY ±88°, slab scaleX → 0.12
 *   C 0.45–0.70  Rotate    slab rotateY → 90°, color → walnut/teal, spine label
 *   D 0.70–1.00  Land      slab drops, ledge draws L→R, dims + bottom caption
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (a: number, b: number, t: number) => clamp01((t - a) / (b - a));
// Smoothstep for the few places that benefit from it (color lerp, drop).
const smooth = (t: number) => t * t * (3 - 2 * t);

// Blueprint green → walnut/teal spine (matches SPINE_COLORS[0] in ProjectsShelf)
const BG_FROM = { h: 160, s: 20, l: 16 };
const BG_TO = { h: 170, s: 25, l: 22 };
const lerpHsl = (t: number) => {
  const h = BG_FROM.h + (BG_TO.h - BG_FROM.h) * t;
  const s = BG_FROM.s + (BG_TO.s - BG_FROM.s) * t;
  const l = BG_FROM.l + (BG_TO.l - BG_FROM.l) * t;
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
};

const BLUEPRINT_BG =
  "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)," +
  "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)," +
  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)," +
  "linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)";
const BLUEPRINT_SIZE = "20px 20px, 20px 20px, 100px 100px, 100px 100px";

const FlapPanel = ({
  side,
  innerRef,
}: {
  side: "left" | "center" | "right";
  innerRef: React.RefObject<HTMLDivElement>;
}) => {
  const transformOrigin =
    side === "left" ? "right center" : side === "right" ? "left center" : "center";
  return (
    <div
      ref={innerRef}
      className="absolute top-0 bottom-0"
      style={{
        left: side === "left" ? 0 : side === "center" ? "33.333%" : "66.666%",
        width: "33.334%",
        transformOrigin,
        transformStyle: "preserve-3d",
        backgroundColor: `hsl(${BG_FROM.h} ${BG_FROM.s}% ${BG_FROM.l}%)`,
        backgroundImage: BLUEPRINT_BG,
        backgroundSize: BLUEPRINT_SIZE,
        borderTop: "1px solid hsl(160 15% 30% / 0.6)",
        borderBottom: "1px solid hsl(160 15% 30% / 0.6)",
        borderLeft: side === "left" ? "1px solid hsl(160 15% 30% / 0.6)" : "none",
        borderRight: side === "right" ? "1px solid hsl(160 15% 30% / 0.6)" : "none",
        // crease shading on the flap edges
        boxShadow:
          side === "center"
            ? "inset 8px 0 12px -8px rgba(0,0,0,0.45), inset -8px 0 12px -8px rgba(0,0,0,0.45)"
            : side === "left"
            ? "inset -10px 0 14px -10px rgba(0,0,0,0.55)"
            : "inset 10px 0 14px -10px rgba(0,0,0,0.55)",
        backfaceVisibility: "hidden",
      }}
    />
  );
};

const AboutToProjectsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const slabRef = useRef<HTMLDivElement>(null);
  const leftFlapRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightFlapRef = useRef<HTMLDivElement>(null);
  const spineLblRef = useRef<HTMLDivElement>(null);

  const topCapRef = useRef<HTMLDivElement>(null);
  const botCapRef = useRef<HTMLDivElement>(null);

  const ledgePathRef = useRef<SVGPathElement>(null);
  const ledgeTicksRef = useRef<SVGGElement>(null);
  const dimsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const slab = slabRef.current;
    const left = leftFlapRef.current;
    const center = centerRef.current;
    const right = rightFlapRef.current;
    const spineLbl = spineLblRef.current;
    const topCap = topCapRef.current;
    const botCap = botCapRef.current;
    const ledgePath = ledgePathRef.current;
    const ledgeTicks = ledgeTicksRef.current;
    const dims = dimsRef.current;
    if (!pin || !slab || !left || !center || !right || !spineLbl || !topCap || !botCap || !ledgePath || !ledgeTicks || !dims) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Prepare ledge dash for draw-in
    let ledgeLen = 800;
    try {
      ledgeLen = ledgePath.getTotalLength() || 800;
    } catch {
      /* noop */
    }
    ledgePath.style.strokeDasharray = String(ledgeLen);
    ledgePath.style.strokeDashoffset = String(ledgeLen);

    let ticking = false;

    const applyFinal = () => {
      // Show resolved end state for reduced-motion users
      slab.style.transform = "translateY(18vh) scaleX(0.12) rotateY(90deg)";
      slab.style.backgroundColor = lerpHsl(1);
      left.style.transform = "rotateY(88deg)";
      right.style.transform = "rotateY(-88deg)";
      spineLbl.style.opacity = "1";
      topCap.style.opacity = "0";
      botCap.style.opacity = "1";
      dims.style.opacity = "1";
      ledgePath.style.strokeDashoffset = "0";
    };

    if (reduced) {
      applyFinal();
      return;
    }

    const update = () => {
      ticking = false;
      const rect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = pin.offsetHeight - vh;
      if (travel <= 0) return;
      const scrolled = -rect.top;
      const t = clamp01(scrolled / travel);

      const tFold = ease(0.15, 0.45, t);
      const tRot = ease(0.45, 0.7, t);
      const tDrop = smooth(ease(0.7, 1.0, t));
      const tLedge = ease(0.74, 1.0, t);
      const tDims = ease(0.82, 1.0, t);
      const tTopCap = 1 - ease(0.0, 0.25, t);
      const tBotCap = ease(0.86, 1.0, t);
      const tSpineLbl = ease(0.55, 0.8, t);

      // Flap fold
      const flapAngle = tFold * 88;
      left.style.transform = `rotateY(${flapAngle}deg)`;
      right.style.transform = `rotateY(${-flapAngle}deg)`;

      // Center crease subtly darkens to read the fold
      const creaseDark = 0.15 + tFold * 0.25;
      center.style.boxShadow = `inset 8px 0 14px -8px rgba(0,0,0,${creaseDark}), inset -8px 0 14px -8px rgba(0,0,0,${creaseDark})`;

      // Slab transform — scaleX collapses with fold, rotateY in phase C, drop in D
      const sx = 1 - tFold * 0.88; // 1 → 0.12
      const ry = tRot * 90;
      const ty = tDrop * 18; // vh
      slab.style.transform = `translateY(${ty.toFixed(2)}vh) scaleX(${sx.toFixed(3)}) rotateY(${ry.toFixed(2)}deg)`;

      // Color lerp toward walnut/teal during rotate
      slab.style.backgroundColor = lerpHsl(smooth(tRot));

      // Captions
      topCap.style.opacity = tTopCap.toFixed(3);
      botCap.style.opacity = tBotCap.toFixed(3);
      botCap.style.transform = `translate(-50%, ${(1 - tBotCap) * 8}px)`;

      // Spine label (only meaningful once rotated)
      spineLbl.style.opacity = tSpineLbl.toFixed(3);

      // Ledge draw-in
      ledgePath.style.strokeDashoffset = String(ledgeLen * (1 - tLedge));
      ledgeTicks.style.opacity = tLedge.toFixed(3);

      // Dimension marks fade in
      dims.style.opacity = tDims.toFixed(3);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const INK = "hsl(38 60% 52%)";
  const INK_DIM = "hsl(38 45% 45%)";

  return (
    <section
      ref={pinRef}
      id="about-projects-bridge"
      aria-hidden
      style={{ height: "180vh" }}
      className="relative w-full"
    >
      <div
        className="sticky w-full"
        style={{ top: 100, height: "calc(100vh - 100px)" }}
      >
        <div
          ref={stageRef}
          className="absolute inset-0 overflow-hidden"
          style={{ perspective: "2200px", perspectiveOrigin: "50% 45%" }}
        >
          {/* Top caption */}
          <div
            ref={topCapRef}
            className="absolute left-1/2 font-handwritten select-none pointer-events-none"
            style={{
              top: "10%",
              transform: "translateX(-50%)",
              fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
              color: "hsl(40 30% 85% / 0.7)",
              letterSpacing: "0.02em",
            }}
          >
            Filing this away.
          </div>

          {/* Tiny mono sub-label under top caption */}
          <div
            className="absolute left-1/2 font-mono select-none pointer-events-none"
            style={{
              top: "calc(10% + 28px)",
              transform: "translateX(-50%)",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "hsl(40 30% 85% / 0.28)",
            }}
          >
            FOLD · ROTATE · SHELVE
          </div>

          {/* Slab assembly */}
          <div
            ref={slabRef}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "min(68vw, 880px)",
              height: "min(46vh, 380px)",
              marginLeft: "calc(min(68vw, 880px) / -2)",
              marginTop: "calc(min(46vh, 380px) / -2)",
              transformStyle: "preserve-3d",
              backgroundColor: `hsl(${BG_FROM.h} ${BG_FROM.s}% ${BG_FROM.l}%)`,
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.6), 0 10px 30px -8px rgba(0,0,0,0.4)",
              willChange: "transform, background-color",
            }}
          >
            {/* Three folding faces */}
            <FlapPanel side="left" innerRef={leftFlapRef} />
            <FlapPanel side="center" innerRef={centerRef} />
            <FlapPanel side="right" innerRef={rightFlapRef} />

            {/* Gold accent rules on the center face — read as a title block */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "36%",
                right: "36%",
                top: "14%",
                height: "1px",
                background: INK,
                opacity: 0.35,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "36%",
                right: "36%",
                bottom: "14%",
                height: "1px",
                background: INK,
                opacity: 0.35,
              }}
            />

            {/* Spine label — vertical, fades in once rotated */}
            <div
              ref={spineLblRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ opacity: 0, willChange: "opacity" }}
            >
              <span
                className="font-serif-display"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  color: "hsl(40 30% 88% / 0.92)",
                  fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Projects · 2022—Now
              </span>
            </div>
          </div>

          {/* Ledge — drawn in during phase D */}
          <svg
            className="absolute left-1/2 pointer-events-none"
            style={{
              bottom: "18%",
              transform: "translateX(-50%)",
              width: "min(72vw, 920px)",
              height: 32,
            }}
            viewBox="0 0 920 32"
            fill="none"
          >
            {/* Main ledge stroke */}
            <path
              ref={ledgePathRef}
              d="M 10 16 L 910 16"
              stroke={INK}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Tick marks */}
            <g ref={ledgeTicksRef} opacity="0">
              {Array.from({ length: 19 }).map((_, i) => {
                const x = 10 + i * 50;
                const major = i % 4 === 0;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={16}
                    x2={x}
                    y2={major ? 26 : 22}
                    stroke={INK_DIM}
                    strokeWidth={major ? 1 : 0.6}
                  />
                );
              })}
              {/* End caps */}
              <line x1="10" y1="6" x2="10" y2="26" stroke={INK_DIM} strokeWidth="0.8" />
              <line x1="910" y1="6" x2="910" y2="26" stroke={INK_DIM} strokeWidth="0.8" />
            </g>
          </svg>

          {/* Dimension marks + technical labels */}
          <div
            ref={dimsRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0, willChange: "opacity" }}
          >
            {/* Top-left bracket near spine landing */}
            <div
              className="absolute"
              style={{
                left: "calc(50% - min(36vw, 470px))",
                bottom: "calc(18% + 36px)",
                width: 16,
                height: 16,
                borderTop: `1.2px solid ${INK}`,
                borderLeft: `1.2px solid ${INK}`,
                opacity: 0.7,
              }}
            />
            {/* Top-right bracket */}
            <div
              className="absolute"
              style={{
                right: "calc(50% - min(36vw, 470px))",
                bottom: "calc(18% + 36px)",
                width: 16,
                height: 16,
                borderTop: `1.2px solid ${INK}`,
                borderRight: `1.2px solid ${INK}`,
                opacity: 0.7,
              }}
            />
            {/* Left side mono label */}
            <div
              className="absolute font-mono"
              style={{
                left: "calc(50% - min(36vw, 470px) - 4px)",
                bottom: "calc(18% - 28px)",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: INK,
                opacity: 0.65,
              }}
            >
              SPINE_01 · W:78mm
            </div>
            {/* Right side mono label */}
            <div
              className="absolute font-mono"
              style={{
                right: "calc(50% - min(36vw, 470px) - 4px)",
                bottom: "calc(18% - 28px)",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: INK,
                opacity: 0.65,
              }}
            >
              REV: A · 2025
            </div>
            {/* Center datum tick */}
            <div
              className="absolute"
              style={{
                left: "50%",
                bottom: "calc(18% + 14px)",
                width: 1,
                height: 18,
                background: INK,
                opacity: 0.5,
              }}
            />
            <div
              className="absolute font-mono"
              style={{
                left: "50%",
                bottom: "calc(18% + 34px)",
                transform: "translateX(-50%)",
                fontSize: 8,
                letterSpacing: "0.4em",
                color: INK,
                opacity: 0.7,
              }}
            >
              ⌖
            </div>
          </div>

          {/* Bottom caption */}
          <div
            ref={botCapRef}
            className="absolute font-handwritten select-none pointer-events-none"
            style={{
              left: "50%",
              bottom: "8%",
              transform: "translate(-50%, 8px)",
              fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
              color: "hsl(40 30% 85% / 0.75)",
              opacity: 0,
              willChange: "opacity, transform",
            }}
          >
            Selected work — pull a spine.
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutToProjectsBridge;
