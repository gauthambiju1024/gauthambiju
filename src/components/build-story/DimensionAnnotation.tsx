import { useEffect, useRef, useId } from "react";

type Props = {
  refCode?: string;
  label?: string;
};

const INK = "hsl(220 15% 45%)";
const INK_BRIGHT = "hsl(220 20% 55%)";

export function DimensionAnnotation({
  refCode = "A.01 → B.02",
  label = "measured → written",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const hostRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Measure path lengths
    const paths = pathsRef.current.filter(Boolean);
    const lengths = paths.map((p) => p.getTotalLength());
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lengths[i]}`;
      p.style.strokeDashoffset = `${lengths[i]}`;
      p.style.transition = "none";
    });

    let running = false;
    let rafId = 0;

    function tick() {
      if (!running) return;
      const rect = host!.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when bottom of host enters viewport, 1 when top leaves
      const raw = 1 - rect.bottom / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, raw * 1.8));
      progressRef.current = progress;

      paths.forEach((p, i) => {
        p.style.strokeDashoffset = `${lengths[i] * (1 - progress)}`;
      });

      rafId = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !running) {
            running = true;
            rafId = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting) {
            running = false;
          }
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(host);

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  const W = 900;
  const H = 64;
  const MID_Y = H / 2;
  const LEFT = 60;
  const RIGHT = 840;
  const CENTER = W / 2;

  const arrowR = `da-arR-${uid}`;
  const arrowL = `da-arL-${uid}`;

  const addPath = (el: SVGPathElement | null, idx: number) => {
    if (el) pathsRef.current[idx] = el;
  };

  // Tick positions
  const tickCount = 16;
  const tickSpacing = (RIGHT - LEFT) / tickCount;

  return (
    <div ref={hostRef} aria-hidden className="mx-auto my-2 w-full max-w-5xl">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        <defs>
          <marker id={arrowR} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 1 L 10 5 L 0 9 z" fill={INK} opacity="0.6" />
          </marker>
          <marker id={arrowL} viewBox="0 0 10 10" refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 10 1 L 0 5 L 10 9 z" fill={INK} opacity="0.6" />
          </marker>
        </defs>

        {/* Main dimension line — left to center */}
        <path
          ref={(el) => addPath(el, 0)}
          d={`M ${LEFT} ${MID_Y} L ${CENTER - 30} ${MID_Y}`}
          stroke={INK}
          strokeWidth="0.6"
          fill="none"
          markerStart={`url(#${arrowL})`}
          markerEnd={`url(#${arrowR})`}
          opacity="0.55"
        />
        {/* Main dimension line — center to right */}
        <path
          ref={(el) => addPath(el, 1)}
          d={`M ${CENTER + 30} ${MID_Y} L ${RIGHT} ${MID_Y}`}
          stroke={INK}
          strokeWidth="0.6"
          fill="none"
          markerStart={`url(#${arrowL})`}
          markerEnd={`url(#${arrowR})`}
          opacity="0.55"
        />

        {/* Extension lines from panels */}
        <path
          ref={(el) => addPath(el, 2)}
          d={`M ${LEFT} ${MID_Y - 14} L ${LEFT} ${MID_Y + 14}`}
          stroke={INK}
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="1 2"
          opacity="0.5"
        />
        <path
          ref={(el) => addPath(el, 3)}
          d={`M ${RIGHT} ${MID_Y - 14} L ${RIGHT} ${MID_Y + 14}`}
          stroke={INK}
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="1 2"
          opacity="0.5"
        />

        {/* Tick marks */}
        {Array.from({ length: tickCount + 1 }).map((_, i) => {
          const x = LEFT + i * tickSpacing;
          const isMajor = i % 4 === 0;
          return (
            <line
              key={i}
              x1={x}
              y1={MID_Y - (isMajor ? 5 : 3)}
              x2={x}
              y2={MID_Y + (isMajor ? 5 : 3)}
              stroke={INK}
              strokeWidth={isMajor ? "0.5" : "0.3"}
              opacity={isMajor ? "0.4" : "0.2"}
            />
          );
        })}

        {/* Center bubble callout with refCode */}
        <rect
          x={CENTER - 28}
          y={MID_Y - 7}
          width={56}
          height={14}
          rx={2}
          fill="hsl(220 15% 11%)"
          stroke={INK}
          strokeWidth="0.5"
          opacity="0.9"
        />
        <text
          x={CENTER}
          y={MID_Y + 3}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="5.5"
          fill={INK_BRIGHT}
          letterSpacing="0.3"
        >
          {refCode}
        </text>

        {/* Leader line from bubble to label */}
        <path
          ref={(el) => addPath(el, 4)}
          d={`M ${CENTER} ${MID_Y + 7} L ${CENTER} ${MID_Y + 18} L ${CENTER + 40} ${MID_Y + 18}`}
          stroke={INK}
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
        <text
          x={CENTER + 44}
          y={MID_Y + 21}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="5"
          fill={INK}
          opacity="0.6"
        >
          {label}
        </text>

        {/* Revision stamp */}
        <rect
          x={RIGHT - 48}
          y={MID_Y - 22}
          width={36}
          height={10}
          rx={1}
          fill="none"
          stroke={INK}
          strokeWidth="0.4"
          opacity="0.35"
        />
        <text
          x={RIGHT - 30}
          y={MID_Y - 14.5}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="4.5"
          fill={INK}
          opacity="0.45"
          letterSpacing="0.8"
        >
          REV 03
        </text>

        {/* North arrow */}
        <g opacity="0.35">
          <path
            ref={(el) => addPath(el, 5)}
            d={`M ${LEFT + 12} ${MID_Y - 10} L ${LEFT + 12} ${MID_Y - 20}`}
            stroke={INK}
            strokeWidth="0.6"
            fill="none"
            markerEnd={`url(#${arrowR})`}
          />
          <text
            x={LEFT + 12}
            y={MID_Y - 22}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="4"
            fill={INK}
          >
            N
          </text>
        </g>

        {/* Small dimension readouts */}
        <text
          x={LEFT + 60}
          y={MID_Y - 10}
          fontFamily="monospace"
          fontSize="4.5"
          fill={INK}
          opacity="0.35"
        >
          {(RIGHT - LEFT).toFixed(0)}
        </text>
      </svg>
    </div>
  );
}
