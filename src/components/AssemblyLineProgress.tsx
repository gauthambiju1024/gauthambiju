import { useEffect, useRef } from "react";

const SECTIONS = ["Home", "About", "Projects", "Thinking", "Skills", "Journey", "Writing", "Contact"];
const BAR_H = 28;
const BELT_Y = 10;
const BELT_H = 8;
const PRODUCT_W = 18;
const PRODUCT_H = 10;

const AssemblyLineProgress = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const productRef = useRef<SVGGElement>(null);
  const rollersRef = useRef<SVGGElement>(null);
  const partsRef = useRef<SVGGElement[]>([]);
  const rafRef = useRef(0);
  const rollerOffset = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    const product = productRef.current;
    if (!svg || !product) return;

    // Build roller marks
    const rollersG = rollersRef.current;
    if (rollersG) {
      rollersG.innerHTML = "";
      for (let x = 0; x < 1200; x += 12) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(x));
        line.setAttribute("x2", String(x));
        line.setAttribute("y1", String(BELT_Y + 1));
        line.setAttribute("y2", String(BELT_Y + BELT_H - 1));
        line.setAttribute("stroke", "hsl(220 15% 40% / 0.15)");
        line.setAttribute("stroke-width", "0.5");
        rollersG.appendChild(line);
      }
    }

    let running = true;
    const tick = () => {
      if (!running) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

      // Move product
      const svgW = svg.viewBox.baseVal.width || 1200;
      const margin = 40;
      const travelW = svgW - margin * 2 - PRODUCT_W;
      const px = margin + progress * travelW;
      product.setAttribute("transform", `translate(${px}, ${BELT_Y - 1})`);

      // Product starts as faint outline, solidifies with scroll
      const baseRect = product.querySelector("rect");
      const detailLine = product.querySelector("line");
      if (baseRect) {
        const fillOpacity = 0.05 + progress * 0.2;
        baseRect.setAttribute("fill", `hsl(220 15% 35% / ${fillOpacity.toFixed(2)})`);
        baseRect.setAttribute("stroke-dasharray", progress > 0.5 ? "none" : "2 1.5");
      }
      if (detailLine) {
        detailLine.setAttribute("opacity", String(Math.min(1, progress * 2)));
      }

      // Show accumulated parts — require passing each section threshold
      const passedSections = Math.max(0, Math.floor(progress * (SECTIONS.length + 1)) - 1);
      partsRef.current.forEach((g, i) => {
        if (g) g.style.opacity = i < passedSections ? "1" : "0";
      });

      // Animate rollers
      rollerOffset.current = (rollerOffset.current + 0.3) % 12;
      if (rollersG) {
        rollersG.setAttribute("transform", `translate(${-rollerOffset.current}, 0)`);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const svgW = 1200;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        height: BAR_H,
        background: "hsl(var(--background) / 0.85)",
        borderBottom: "1px solid hsl(220 15% 40% / 0.12)",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgW} ${BAR_H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Belt track */}
        <rect
          x={0} y={BELT_Y} width={svgW} height={BELT_H}
          fill="none"
          stroke="hsl(220 15% 40% / 0.15)"
          strokeWidth={0.5}
        />
        <line
          x1={0} y1={BELT_Y + BELT_H / 2}
          x2={svgW} y2={BELT_Y + BELT_H / 2}
          stroke="hsl(220 15% 40% / 0.08)"
          strokeWidth={0.5}
          strokeDasharray="4 4"
        />

        {/* Roller marks */}
        <g ref={rollersRef} />

        {/* Section tick marks and labels */}
        {SECTIONS.map((label, i) => {
          const x = 40 + (i / (SECTIONS.length - 1)) * (svgW - 80);
          return (
            <g key={label}>
              <line
                x1={x} y1={BELT_Y - 2}
                x2={x} y2={BELT_Y + BELT_H + 2}
                stroke="hsl(220 15% 45% / 0.25)"
                strokeWidth={0.5}
              />
              <text
                x={x} y={BELT_Y + BELT_H + 8}
                textAnchor="middle"
                fill="hsl(220 15% 45% / 0.35)"
                fontSize={4.5}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.5"
              >
                {label.toUpperCase()}
              </text>
              {/* Station marker */}
              <circle
                cx={x} cy={BELT_Y - 3.5}
                r={1}
                fill="hsl(220 15% 45% / 0.2)"
              />
            </g>
          );
        })}

        {/* Product group */}
        <g ref={productRef}>
          {/* Base product shape */}
          <rect
            x={0} y={0} width={PRODUCT_W} height={PRODUCT_H}
            fill="hsl(220 15% 35% / 0.25)"
            stroke="hsl(220 15% 50% / 0.5)"
            strokeWidth={0.6}
            rx={1}
          />
          {/* Internal detail line */}
          <line
            x1={3} y1={PRODUCT_H / 2}
            x2={PRODUCT_W - 3} y2={PRODUCT_H / 2}
            stroke="hsl(220 15% 50% / 0.3)"
            strokeWidth={0.4}
          />

          {/* Accumulated parts — one per section */}
          {SECTIONS.map((_, i) => {
            const partX = 2 + (i % 4) * 3.5;
            const partY = i < 4 ? 1.5 : 5.5;
            return (
              <g
                key={i}
                ref={(el) => { if (el) partsRef.current[i] = el; }}
                style={{ opacity: 0, transition: "opacity 0.3s" }}
              >
                {i % 3 === 0 ? (
                  <circle cx={partX + 1} cy={partY + 1} r={1} fill="hsl(220 15% 55% / 0.6)" />
                ) : i % 3 === 1 ? (
                  <rect x={partX} y={partY} width={2.5} height={2} fill="hsl(220 15% 55% / 0.5)" rx={0.3} />
                ) : (
                  <line x1={partX} y1={partY} x2={partX + 2.5} y2={partY + 2} stroke="hsl(220 15% 55% / 0.5)" strokeWidth={0.5} />
                )}
              </g>
            );
          })}
        </g>

        {/* Left/right edge markers */}
        <text x={8} y={BELT_Y + BELT_H / 2 + 1.5} fill="hsl(220 15% 45% / 0.2)" fontSize={4} fontFamily="'JetBrains Mono', monospace">START</text>
        <text x={svgW - 8} y={BELT_Y + BELT_H / 2 + 1.5} textAnchor="end" fill="hsl(220 15% 45% / 0.2)" fontSize={4} fontFamily="'JetBrains Mono', monospace">END</text>
      </svg>
    </div>
  );
};

export default AssemblyLineProgress;
