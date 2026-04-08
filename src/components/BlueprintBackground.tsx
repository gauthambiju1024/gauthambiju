import { useEffect, useRef } from "react";

const SECTION_IDS = ["home", "about", "projects", "thinking", "skills", "journey", "writing", "contact"];
const CYAN = "hsl(200 60% 50%";
const FLASH_DURATION = 500;

const BlueprintBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<SVGSVGElement>(null);
  const crosshairRef = useRef<SVGGElement>(null);
  const sweepRef = useRef<SVGLineElement>(null);
  const toleranceRef = useRef<SVGCircleElement>(null);
  const coordTLRef = useRef<HTMLSpanElement>(null);
  const coordBRRef = useRef<HTMLSpanElement>(null);
  const dimArrowsRef = useRef<SVGGElement>(null);
  const originsRef = useRef<SVGGElement>(null);
  const flashTimer = useRef<number>(0);
  const sweepRaf = useRef<number>(0);

  useEffect(() => {
    const sectionEls = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sectionEls.length) return;

    const triggerFlash = () => {
      const grid = gridRef.current;
      const flash = flashRef.current;
      const crosshair = crosshairRef.current;
      const sweep = sweepRef.current;
      const tolerance = toleranceRef.current;
      const coordTL = coordTLRef.current;
      const coordBR = coordBRRef.current;
      const dimArrows = dimArrowsRef.current;
      const origins = originsRef.current;

      if (!grid || !flash || !crosshair || !sweep || !tolerance || !coordTL || !coordBR || !dimArrows || !origins) return;

      // Pulse grid
      grid.style.opacity = "0.15";

      // Show flash SVG
      flash.style.opacity = "1";
      crosshair.style.opacity = "1";
      sweep.style.opacity = "1";
      tolerance.style.opacity = "1";
      dimArrows.style.opacity = "1";
      origins.style.opacity = "1";

      // Coordinate readouts
      const sy = Math.round(window.scrollY);
      coordTL.textContent = `X:0 Y:${sy}`;
      coordBR.textContent = `X:${window.innerWidth} Y:${sy + window.innerHeight}`;
      coordTL.style.opacity = "1";
      coordBR.style.opacity = "1";

      // Tolerance ring expand
      tolerance.setAttribute("r", "0");
      tolerance.style.transition = "none";
      requestAnimationFrame(() => {
        tolerance.style.transition = `r ${FLASH_DURATION}ms ease-out, opacity ${FLASH_DURATION}ms ease-out`;
        tolerance.setAttribute("r", "80");
      });

      // Sweep rotation
      let start = performance.now();
      const rotateSweep = (now: number) => {
        const elapsed = now - start;
        const angle = (elapsed / FLASH_DURATION) * 360;
        sweep.setAttribute("transform", `rotate(${angle}, 50, 50)`);
        if (elapsed < FLASH_DURATION) {
          sweepRaf.current = requestAnimationFrame(rotateSweep);
        }
      };
      cancelAnimationFrame(sweepRaf.current);
      sweepRaf.current = requestAnimationFrame(rotateSweep);

      // Dim arrows stroke-dashoffset draw
      const paths = dimArrows.querySelectorAll("line");
      paths.forEach(p => {
        (p as SVGLineElement).style.transition = "none";
        (p as SVGLineElement).style.strokeDashoffset = "100";
        requestAnimationFrame(() => {
          (p as SVGLineElement).style.transition = `stroke-dashoffset ${FLASH_DURATION}ms ease-out`;
          (p as SVGLineElement).style.strokeDashoffset = "0";
        });
      });

      // Fade out
      clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => {
        grid.style.opacity = "0.03";
        flash.style.opacity = "0";
        crosshair.style.opacity = "0";
        sweep.style.opacity = "0";
        tolerance.style.opacity = "0";
        dimArrows.style.opacity = "0";
        origins.style.opacity = "0";
        coordTL.style.opacity = "0";
        coordBR.style.opacity = "0";
      }, FLASH_DURATION);
    };

    const observers: IntersectionObserver[] = [];
    sectionEls.forEach((el) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) triggerFlash();
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach(o => o.disconnect());
      clearTimeout(flashTimer.current);
      cancelAnimationFrame(sweepRaf.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Persistent faint grid */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          transition: `opacity ${FLASH_DURATION}ms ease-out`,
          backgroundImage: `
            linear-gradient(${CYAN} / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, ${CYAN} / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Flash overlay SVG */}
      <svg
        ref={flashRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0, transition: `opacity ${FLASH_DURATION}ms ease-out` }}
      >
        {/* Crosshair */}
        <g ref={crosshairRef} style={{ opacity: 0, transition: `opacity ${FLASH_DURATION}ms` }}>
          <line x1="50" y1="0" x2="50" y2="100" stroke={`${CYAN} / 0.1)`} strokeWidth="0.15" strokeDasharray="2 2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke={`${CYAN} / 0.1)`} strokeWidth="0.15" strokeDasharray="2 2" />
        </g>

        {/* Radial sweep */}
        <line
          ref={sweepRef}
          x1="50" y1="50" x2="50" y2="10"
          stroke={`${CYAN} / 0.08)`}
          strokeWidth="0.2"
          style={{ opacity: 0, transition: `opacity ${FLASH_DURATION}ms` }}
        />

        {/* Tolerance ring */}
        <circle
          ref={toleranceRef}
          cx="50" cy="50" r="0"
          fill="none"
          stroke={`${CYAN} / 0.1)`}
          strokeWidth="0.15"
          style={{ opacity: 0, transition: `opacity ${FLASH_DURATION}ms ease-out` }}
        />

        {/* Dimension arrows from corners */}
        <g ref={dimArrowsRef} style={{ opacity: 0, transition: `opacity ${FLASH_DURATION}ms` }}>
          <line x1="0" y1="0" x2="20" y2="20" stroke={`${CYAN} / 0.12)`} strokeWidth="0.15" strokeDasharray="100" strokeDashoffset="100" />
          <line x1="100" y1="0" x2="80" y2="20" stroke={`${CYAN} / 0.12)`} strokeWidth="0.15" strokeDasharray="100" strokeDashoffset="100" />
          <line x1="0" y1="100" x2="20" y2="80" stroke={`${CYAN} / 0.12)`} strokeWidth="0.15" strokeDasharray="100" strokeDashoffset="100" />
          <line x1="100" y1="100" x2="80" y2="80" stroke={`${CYAN} / 0.12)`} strokeWidth="0.15" strokeDasharray="100" strokeDashoffset="100" />
        </g>

        {/* Origin marks */}
        <g ref={originsRef} style={{ opacity: 0, transition: `opacity ${FLASH_DURATION}ms` }}>
          {[20, 40, 60, 80].map(x =>
            [20, 40, 60, 80].map(y => (
              <g key={`${x}-${y}`}>
                <line x1={x - 0.8} y1={y} x2={x + 0.8} y2={y} stroke={`${CYAN} / 0.08)`} strokeWidth="0.1" />
                <line x1={x} y1={y - 0.8} x2={x} y2={y + 0.8} stroke={`${CYAN} / 0.08)`} strokeWidth="0.1" />
              </g>
            ))
          )}
        </g>
      </svg>

      {/* Coordinate readouts */}
      <span
        ref={coordTLRef}
        className="absolute top-2 left-2 font-mono"
        style={{
          fontSize: 8,
          color: `${CYAN} / 0.2)`,
          opacity: 0,
          transition: `opacity ${FLASH_DURATION}ms ease-out`,
          letterSpacing: "0.5px",
        }}
      />
      <span
        ref={coordBRRef}
        className="absolute bottom-2 right-2 font-mono"
        style={{
          fontSize: 8,
          color: `${CYAN} / 0.2)`,
          opacity: 0,
          transition: `opacity ${FLASH_DURATION}ms ease-out`,
          letterSpacing: "0.5px",
        }}
      />
    </div>
  );
};

export default BlueprintBackground;
