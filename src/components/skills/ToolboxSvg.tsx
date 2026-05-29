/**
 * Shared toolbox artwork — single source of truth for the closed shelf toolbox
 * AND the Toolbox→Skills choreography. ONE SVG node, parts are direct-DOM
 * mutated by ref so no React re-renders happen during scroll.
 */
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";

export interface ToolboxHandle {
  /** Lid rotation in degrees around the hinge line (negative = open upward). */
  setLid(deg: number): void;
  /** Both latches rotate around their own pivots (0 = closed, ~90 = unlatched). */
  setLatches(deg: number): void;
}

interface ToolboxProps {
  width?: number | string;
  height?: number | string;
}

let __tbCounter = 0;

export const Toolbox = forwardRef<ToolboxHandle, ToolboxProps>(
  ({ width = "100%", height = "100%" }, ref) => {
    const lidRef = useRef<SVGGElement>(null);
    const latchLRef = useRef<SVGGElement>(null);
    const latchRRef = useRef<SVGGElement>(null);
    const id = useMemo(() => `tb-${++__tbCounter}`, []);

    useImperativeHandle(ref, () => ({
      setLid(deg) {
        lidRef.current?.setAttribute("transform", `rotate(${deg.toFixed(2)} 48 36)`);
      },
      setLatches(deg) {
        latchLRef.current?.setAttribute("transform", `rotate(${deg.toFixed(2)} 27 36)`);
        latchRRef.current?.setAttribute("transform", `rotate(${(-deg).toFixed(2)} 69 36)`);
      },
    }));

    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 96 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(220 6% 32%)" />
            <stop offset="0.5" stopColor="hsl(220 6% 24%)" />
            <stop offset="1" stopColor="hsl(220 6% 18%)" />
          </linearGradient>
          <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(220 6% 40%)" />
            <stop offset="1" stopColor="hsl(220 6% 24%)" />
          </linearGradient>
          <linearGradient id={`${id}-handle`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(0 0% 78%)" />
            <stop offset="0.5" stopColor="hsl(0 0% 58%)" />
            <stop offset="1" stopColor="hsl(0 0% 38%)" />
          </linearGradient>
        </defs>

        {/* Body (static) */}
        <g>
          <rect x="8" y="36" width="80" height="32" rx="2" fill={`url(#${id}-body)`} stroke="hsl(220 8% 10%)" strokeWidth="1" />
          <line x1="10" y1="42" x2="86" y2="42" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
          <line x1="10" y1="48" x2="86" y2="48" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
          <line x1="10" y1="54" x2="86" y2="54" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
          <line x1="10" y1="60" x2="86" y2="60" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
          <rect x="38" y="48" width="20" height="9" rx="1" fill="hsl(220 8% 14%)" stroke="hsl(220 8% 8%)" strokeWidth="0.5" />
          <text x="48" y="54.4" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" fill="hsl(40 8% 70%)" letterSpacing="0.6">TOOLS</text>
          <rect x="12" y="68" width="6" height="3" rx="0.5" fill="hsl(220 8% 12%)" />
          <rect x="78" y="68" width="6" height="3" rx="0.5" fill="hsl(220 8% 12%)" />
          {/* hinge sits at y=36 */}
          <line x1="8" y1="36" x2="88" y2="36" stroke="hsl(220 8% 8%)" strokeWidth="1" />
          <line x1="8" y1="36.7" x2="88" y2="36.7" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </g>

        {/* Lid group — rotates around (48, 36) */}
        <g ref={lidRef} transform="rotate(0 48 36)" style={{ transformBox: "fill-box" } as any}>
          <path d="M 30 22 Q 48 6 66 22" stroke={`url(#${id}-handle)`} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="30" cy="22" r="2.2" fill="hsl(220 8% 14%)" />
          <circle cx="66" cy="22" r="2.2" fill="hsl(220 8% 14%)" />
          <rect x="8" y="22" width="80" height="14" rx="2" fill={`url(#${id}-lid)`} stroke="hsl(220 8% 10%)" strokeWidth="1" />
          <line x1="10" y1="24.5" x2="86" y2="24.5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
          {/* Latches travel with lid; also rotate around own pivots */}
          <g ref={latchLRef} transform="rotate(0 27 36)">
            <rect x="22" y="32" width="10" height="8" rx="1" fill={`url(#${id}-handle)`} stroke="hsl(220 8% 10%)" strokeWidth="0.7" />
            <circle cx="27" cy="36" r="0.9" fill="hsl(220 8% 12%)" />
          </g>
          <g ref={latchRRef} transform="rotate(0 69 36)">
            <rect x="64" y="32" width="10" height="8" rx="1" fill={`url(#${id}-handle)`} stroke="hsl(220 8% 10%)" strokeWidth="0.7" />
            <circle cx="69" cy="36" r="0.9" fill="hsl(220 8% 12%)" />
          </g>
        </g>
      </svg>
    );
  }
);
Toolbox.displayName = "Toolbox";

/** Backward-compatible alias — the closed toolbox is just Toolbox at rest. */
export const ToolboxClosed = ({
  width = 220,
  height = 174,
}: { width?: number | string; height?: number | string }) => (
  <Toolbox width={width} height={height} />
);
