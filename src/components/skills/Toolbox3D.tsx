/**
 * Toolbox3D — real CSS-3D toolbox built from face planes.
 *
 * A body cuboid (W × bodyH × D) with a hinged lid cuboid (W × lidH × D) on top.
 * At rest (rotX = 0) the front face shows the classic toolbox look. Rotating
 * around X tips the box forward to reveal the top opening; the lid hinges back
 * around its rear edge, exposing the interior tray.
 *
 * All face dimensions are computed in pixels via CSS custom properties driven
 * by a ResizeObserver. Per-frame mutations only touch the rotation CSS vars
 * on the wrapper/lid — zero React re-renders during scroll.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, ReactNode } from "react";

export interface Toolbox3DHandle {
  setRotX(deg: number): void;
  setRotY(deg: number): void;
  setLid(deg: number): void;
  setLatches(deg: number): void;
  setInteriorReveal(pct: number): void;
}

interface Props {
  interior?: ReactNode;
  /** Static rest pose (no imperative driving). */
  staticPose?: boolean;
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

// Palette
const BODY_FRONT = "linear-gradient(180deg, hsl(220 6% 32%) 0%, hsl(220 6% 24%) 50%, hsl(220 6% 18%) 100%)";
const BODY_SIDE = "linear-gradient(180deg, hsl(220 6% 22%) 0%, hsl(220 6% 14%) 100%)";
const BODY_BACK = "linear-gradient(180deg, hsl(220 6% 18%) 0%, hsl(220 6% 12%) 100%)";
const BODY_TOP_RIM = "linear-gradient(90deg, hsl(220 6% 16%) 0%, hsl(220 6% 22%) 50%, hsl(220 6% 16%) 100%)";
const LID_FRONT = "linear-gradient(180deg, hsl(220 6% 40%) 0%, hsl(220 6% 26%) 100%)";
const LID_SIDE = "linear-gradient(180deg, hsl(220 6% 28%) 0%, hsl(220 6% 18%) 100%)";
const LID_TOP = "linear-gradient(180deg, hsl(220 6% 44%) 0%, hsl(220 6% 30%) 100%)";
const LID_INSIDE = "hsl(220 8% 22%)";
const INTERIOR_FLOOR = "hsl(220 8% 6%)";
const HANDLE_METAL = "linear-gradient(180deg, hsl(0 0% 78%) 0%, hsl(0 0% 52%) 60%, hsl(0 0% 32%) 100%)";

const Toolbox3D = forwardRef<Toolbox3DHandle, Props>(({ interior, staticPose }, ref) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const latchLRef = useRef<HTMLDivElement>(null);
  const latchRRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);

  // Compute pixel-sized CSS custom properties whenever container resizes.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      const h = el.clientHeight || w * (76 / 96);
      const bodyW = w * 0.833;           // x=8..88 of 96
      const bodyH = h * 0.421;           // y=36..68 of 76
      const lidH = h * 0.184;            // y=22..36 of 76
      const depth = Math.min(bodyW, h) * 0.42;
      el.style.setProperty("--w", `${bodyW}px`);
      el.style.setProperty("--bh", `${bodyH}px`);
      el.style.setProperty("--lh", `${lidH}px`);
      el.style.setProperty("--d", `${depth}px`);
      el.style.setProperty("--hd", `${depth / 2}px`);
      el.style.setProperty("--nhd", `${-depth / 2}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    setRotX(deg) { boxRef.current?.style.setProperty("--rx", `${deg.toFixed(2)}deg`); },
    setRotY(deg) { boxRef.current?.style.setProperty("--ry", `${deg.toFixed(2)}deg`); },
    setLid(deg) { lidRef.current?.style.setProperty("--lid", `${deg.toFixed(2)}deg`); },
    setLatches(deg) {
      if (latchLRef.current) latchLRef.current.style.transform = `translateX(-50%) rotate(${deg.toFixed(2)}deg)`;
      if (latchRRef.current) latchRRef.current.style.transform = `translateX(-50%) rotate(${(-deg).toFixed(2)}deg)`;
    },
    setInteriorReveal(pct) {
      if (interiorRef.current) {
        const insetTop = (1 - clamp01(pct)) * 100;
        interiorRef.current.style.clipPath = `inset(${insetTop.toFixed(2)}% 0 0 0)`;
      }
    },
  }));

  const face = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    backfaceVisibility: "hidden",
    ...extra,
  });

  // Body cuboid faces (origin is body's local center)
  const bodyFaces = (
    <>
      {/* Front */}
      <div style={face({ inset: 0, transform: "translateZ(var(--hd))", background: BODY_FRONT, border: "1px solid hsl(220 8% 10%)" })}>
        {/* horizontal seams */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "18%", height: 1, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "36%", height: 1, background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "62%", height: 1, background: "rgba(255,255,255,0.04)" }} />
        {/* TOOLS label */}
        <div style={{
          position: "absolute", left: "38%", top: "38%", width: "24%", height: "28%",
          background: "hsl(220 8% 13%)", border: "0.5px solid hsl(220 8% 7%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "ui-monospace, monospace", fontSize: "calc(var(--bh) * 0.18)",
          color: "hsl(40 8% 70%)", letterSpacing: "0.08em",
        }}>TOOLS</div>
        {/* feet */}
        <div style={{ position: "absolute", left: "6%", bottom: "-9%", width: "10%", height: "9%", background: "hsl(220 8% 10%)", borderRadius: 1 }} />
        <div style={{ position: "absolute", right: "6%", bottom: "-9%", width: "10%", height: "9%", background: "hsl(220 8% 10%)", borderRadius: 1 }} />
      </div>

      {/* Back */}
      <div style={face({ inset: 0, transform: "translateZ(var(--nhd)) rotateY(180deg)", background: BODY_BACK, border: "1px solid hsl(220 8% 6%)" })} />

      {/* Top — opening rim with foam tray inside */}
      <div style={face({
        left: 0, top: 0, width: "100%", height: "var(--d)",
        transform: "translateY(var(--nhd)) rotateX(90deg)",
        transformOrigin: "50% 100%",
        background: BODY_TOP_RIM,
        borderTop: "1px solid hsl(220 8% 8%)",
        overflow: "hidden",
      })}>
        {/* Inner well — slightly inset so we see a rim */}
        <div style={{
          position: "absolute", inset: "6%",
          background: INTERIOR_FLOOR,
          boxShadow: "inset 0 0 24px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}>
          <div
            ref={interiorRef}
            style={{ position: "absolute", inset: 0, clipPath: "inset(100% 0 0 0)", willChange: "clip-path" }}
          >
            {interior}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={face({
        left: 0, bottom: 0, width: "100%", height: "var(--d)",
        transform: "translateY(var(--hd)) rotateX(-90deg)",
        transformOrigin: "50% 0%",
        background: "hsl(220 8% 5%)",
      })} />

      {/* Left side */}
      <div style={face({
        top: 0, left: 0, width: "var(--d)", height: "100%",
        transform: "translateX(var(--nhd)) rotateY(-90deg)",
        transformOrigin: "100% 50%",
        background: BODY_SIDE,
      })} />

      {/* Right side */}
      <div style={face({
        top: 0, right: 0, width: "var(--d)", height: "100%",
        transform: "translateX(var(--hd)) rotateY(90deg)",
        transformOrigin: "0% 50%",
        background: BODY_SIDE,
      })} />
    </>
  );

  const lidFaces = (
    <>
      {/* Front of lid (visible at rest) */}
      <div style={face({ inset: 0, transform: "translateZ(var(--hd))", background: LID_FRONT, border: "1px solid hsl(220 8% 10%)" })}>
        {/* latch plates on front face */}
        <div style={{ position: "absolute", left: "23%", bottom: "-30%", width: "11%", height: "55%" }}>
          <div ref={latchLRef} style={{
            position: "absolute", left: "50%", top: 0, width: "100%", height: "100%",
            transform: "translateX(-50%) rotate(0deg)",
            transformOrigin: "50% 30%",
            background: HANDLE_METAL,
            border: "0.5px solid hsl(220 8% 10%)",
            borderRadius: 2,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.5)",
          }} />
        </div>
        <div style={{ position: "absolute", right: "23%", bottom: "-30%", width: "11%", height: "55%" }}>
          <div ref={latchRRef} style={{
            position: "absolute", left: "50%", top: 0, width: "100%", height: "100%",
            transform: "translateX(-50%) rotate(0deg)",
            transformOrigin: "50% 30%",
            background: HANDLE_METAL,
            border: "0.5px solid hsl(220 8% 10%)",
            borderRadius: 2,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.5)",
          }} />
        </div>
      </div>

      {/* Back of lid */}
      <div style={face({ inset: 0, transform: "translateZ(var(--nhd)) rotateY(180deg)", background: "hsl(220 8% 16%)" })} />

      {/* Top of lid — with handle */}
      <div style={face({
        left: 0, top: 0, width: "100%", height: "var(--d)",
        transform: "translateY(var(--nhd)) rotateX(90deg)",
        transformOrigin: "50% 100%",
        background: LID_TOP,
      })}>
        {/* Handle arch */}
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{
          position: "absolute", left: "25%", top: "20%", width: "50%", height: "60%", overflow: "visible",
        }}>
          <defs>
            <linearGradient id="tb3d-handle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="hsl(0 0% 80%)" />
              <stop offset="0.5" stopColor="hsl(0 0% 56%)" />
              <stop offset="1" stopColor="hsl(0 0% 34%)" />
            </linearGradient>
          </defs>
          <path d="M 8 56 Q 50 -6 92 56" stroke="url(#tb3d-handle)" strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="8" cy="56" r="4" fill="hsl(220 8% 14%)" />
          <circle cx="92" cy="56" r="4" fill="hsl(220 8% 14%)" />
        </svg>
      </div>

      {/* Bottom of lid (inside, visible when open) */}
      <div style={face({
        left: 0, bottom: 0, width: "100%", height: "var(--d)",
        transform: "translateY(var(--hd)) rotateX(-90deg)",
        transformOrigin: "50% 0%",
        background: LID_INSIDE,
      })} />

      {/* Left side of lid */}
      <div style={face({
        top: 0, left: 0, width: "var(--d)", height: "100%",
        transform: "translateX(var(--nhd)) rotateY(-90deg)",
        transformOrigin: "100% 50%",
        background: LID_SIDE,
      })} />

      {/* Right side of lid */}
      <div style={face({
        top: 0, right: 0, width: "var(--d)", height: "100%",
        transform: "translateX(var(--hd)) rotateY(90deg)",
        transformOrigin: "0% 50%",
        background: LID_SIDE,
      })} />
    </>
  );

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        perspective: "1400px",
        perspectiveOrigin: "50% 45%",
      }}
    >
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transformOrigin: "50% 70%",
          willChange: "transform",
        }}
      >
        {/* Body — anchored at top=47.4%, height=42.1%, centered horizontally */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "47.4%",
            width: "var(--w)",
            height: "var(--bh)",
            transform: "translateX(-50%)",
            transformStyle: "preserve-3d",
          }}
        >
          {bodyFaces}
        </div>

        {/* Lid — anchored at top=28.9%, height=18.4%. Hinges around its rear-bottom edge,
            which is at (y=100%, z=-d/2) within the lid's local box. */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "28.9%",
            width: "var(--w)",
            height: "var(--lh)",
            transform: "translateX(-50%)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            ref={lidRef}
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: "rotateX(var(--lid, 0deg))",
              transformOrigin: "50% 100% var(--nhd)",
              willChange: "transform",
            }}
          >
            {lidFaces}
          </div>
        </div>
      </div>
    </div>
  );
});

Toolbox3D.displayName = "Toolbox3D";

export default Toolbox3D;

/** Convenience: closed rest pose used by the shelf slot. */
export const Toolbox3DRest = ({ width = 220, height = 174 }: { width?: number | string; height?: number | string }) => (
  <div style={{ width, height }}>
    <Toolbox3D staticPose />
  </div>
);
