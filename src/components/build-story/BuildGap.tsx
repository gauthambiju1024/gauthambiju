import { useEffect, useRef, useId } from "react";

type Props = {
  refCode?: string;
  label?: string;
  width?: number;
};

const INK = "hsl(220 15% 45%)";
const INK_BRIGHT = "hsl(220 20% 55%)";
const ICON_STROKE = "hsl(220 40% 60%)";
const ABSTRACT_STROKE = "hsl(220 20% 52%)";
const METAL_DARK = "hsl(220 12% 14%)";
const METAL_STROKE = "hsl(220 10% 28%)";
const MUTED_LABEL = "hsl(220 10% 38%)";
const SPARK_FILL = "hsl(220 50% 65%)";

export function BuildGap({
  refCode = "GB.001 · REV 03",
  label = "measured → written",
  width = 900,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const hostRef = useRef<HTMLDivElement>(null);
  const partsGRef = useRef<SVGGElement>(null);
  const sparksGRef = useRef<SVGGElement>(null);
  const rollersGRef = useRef<SVGGElement>(null);
  const throughputRef = useRef<SVGTSpanElement>(null);
  const queueRef = useRef<SVGTSpanElement>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    const partsG = partsGRef.current;
    const sparksG = sparksGRef.current;
    const rollersG = rollersGRef.current;
    const throughputEl = throughputRef.current;
    const queueEl = queueRef.current;
    if (!host || !partsG || !sparksG || !rollersG || !throughputEl || !queueEl) return;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const BELT_Y = 67;
    const BELT_START_X = 60;
    const BELT_END_X = 840;
    const MID_X = 450;

    let rollerMarkup = "";
    for (let rx = 72; rx < BELT_END_X; rx += 22) {
      rollerMarkup += `<circle cx="${rx}" cy="${BELT_Y}" r="3.5" fill="${METAL_DARK}" stroke="${METAL_STROKE}" stroke-width="0.5"/>`;
      rollerMarkup += `<line class="bg-rm" data-cx="${rx}" x1="${rx}" y1="${BELT_Y - 3}" x2="${rx}" y2="${BELT_Y}" stroke="${MUTED_LABEL}" stroke-width="0.5"/>`;
    }
    rollersG.innerHTML = rollerMarkup;
    const marks = rollersG.querySelectorAll<SVGLineElement>(".bg-rm");

    const abstractRenderers: Array<(g: SVGGElement) => void> = [
      (g) => { g.innerHTML = `<line x1="-4" y1="0" x2="4" y2="0" stroke="${ABSTRACT_STROKE}" stroke-width="0.8"/>`; },
      (g) => { g.innerHTML = `<circle cx="0" cy="0" r="2" fill="none" stroke="${ABSTRACT_STROKE}" stroke-width="0.7"/>`; },
      (g) => { g.innerHTML = `<rect x="-3" y="-2" width="6" height="4" fill="none" stroke="${ABSTRACT_STROKE}" stroke-width="0.6"/>`; },
      (g) => { g.innerHTML = `<line x1="-3" y1="-3" x2="3" y2="3" stroke="${ABSTRACT_STROKE}" stroke-width="0.7"/><line x1="3" y1="-3" x2="-3" y2="3" stroke="${ABSTRACT_STROKE}" stroke-width="0.7"/>`; },
      (g) => { g.innerHTML = `<line x1="0" y1="-3" x2="0" y2="3" stroke="${ABSTRACT_STROKE}" stroke-width="0.7"/>`; },
      (g) => { g.innerHTML = `<circle cx="0" cy="0" r="1" fill="${ABSTRACT_STROKE}"/>`; },
    ];

    const iconRenderer = (g: SVGGElement) => {
      g.innerHTML = `<rect x="-4" y="-3" width="8" height="6" fill="none" stroke="${ICON_STROKE}" stroke-width="0.8"/><line x1="-2.5" y1="-1" x2="2.5" y2="-1" stroke="${ICON_STROKE}" stroke-width="0.5"/><line x1="-2.5" y1="1" x2="1.5" y2="1" stroke="${ICON_STROKE}" stroke-width="0.5"/>`;
    };

    type Part = { el: SVGGElement; x: number; icon: boolean; welded: boolean };
    type Spark = { el: SVGCircleElement; x: number; y: number; vx: number; vy: number; life: number };

    const parts: Part[] = [];
    const sparks: Spark[] = [];
    let t = 0;
    let cooldown = 0;
    let throughput = Math.floor(200 + Math.random() * 100);
    let partsSinceIcon = 0;

    function spawn() {
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("transform", `translate(${BELT_START_X}, ${BELT_Y})`);
      const isIcon = partsSinceIcon >= 4 && Math.random() > 0.5;
      if (isIcon) { iconRenderer(g); partsSinceIcon = 0; }
      else { abstractRenderers[Math.floor(Math.random() * abstractRenderers.length)](g); partsSinceIcon++; }
      partsG.appendChild(g);
      parts.push({ el: g, x: BELT_START_X, icon: isIcon, welded: false });
    }

    function emitSpark(x: number) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 1.2;
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("cx", String(x));
        c.setAttribute("cy", String(BELT_Y));
        c.setAttribute("r", "0.5");
        c.setAttribute("fill", SPARK_FILL);
        sparksG.appendChild(c);
        sparks.push({ el: c, x, y: BELT_Y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.5, life: 18 });
      }
    }

    let rafId = 0;
    function tick() {
      if (!runningRef.current) return;
      t++;

      for (let i = 0; i < marks.length; i++) {
        const cx = parseFloat(marks[i].getAttribute("data-cx") || "0");
        const ang = (t * 0.18 + i * 0.4) % (Math.PI * 2);
        marks[i].setAttribute("x2", String(cx + Math.sin(ang) * 2.8));
        marks[i].setAttribute("y2", String(BELT_Y + Math.cos(ang) * 2.8));
      }

      cooldown--;
      if (cooldown <= 0 && parts.length < 14) { spawn(); cooldown = 28 + Math.random() * 18; }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += 1.1;
        p.el.setAttribute("transform", `translate(${p.x.toFixed(1)}, ${BELT_Y})`);
        if (p.icon && !p.welded && p.x > MID_X - 2 && p.x < MID_X + 2) { p.welded = true; emitSpark(p.x); }
        if (p.x > BELT_END_X) { partsG.removeChild(p.el); parts.splice(i, 1); throughput++; throughputEl.textContent = String(throughput).padStart(4, "0"); }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life--;
        s.el.setAttribute("cx", String(s.x));
        s.el.setAttribute("cy", String(s.y));
        s.el.setAttribute("opacity", String(s.life / 18));
        if (s.life <= 0) { sparksG.removeChild(s.el); sparks.splice(i, 1); }
      }

      if (queueEl) queueEl.textContent = String(parts.length).padStart(2, "0");
      rafId = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) { if (!runningRef.current) { runningRef.current = true; rafId = requestAnimationFrame(tick); } }
          else { runningRef.current = false; }
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(host);

    return () => {
      io.disconnect();
      runningRef.current = false;
      cancelAnimationFrame(rafId);
      while (partsG.firstChild) partsG.removeChild(partsG.firstChild);
      while (sparksG.firstChild) sparksG.removeChild(sparksG.firstChild);
    };
  }, []);

  const arrowR = `bg-arrowR-${uid}`;
  const arrowL = `bg-arrowL-${uid}`;

  return (
    <div ref={hostRef} aria-hidden className="mx-auto my-4 w-full max-w-5xl">
      <svg viewBox={`0 0 ${width} 120`} width="100%" preserveAspectRatio="xMidYMid meet" className="block">
        <defs>
          <marker id={arrowR} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} opacity="0.6" />
          </marker>
          <marker id={arrowL} viewBox="0 0 10 10" refX="1" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill={INK} opacity="0.6" />
          </marker>
        </defs>

        {/* Dimension lines */}
        <g>
          <line x1="60" y1="2" x2="60" y2="22" stroke={INK} strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />
          <line x1="840" y1="2" x2="840" y2="22" stroke={INK} strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />
          <line x1="60" y1="22" x2="440" y2="22" stroke={INK} strokeWidth="0.6" markerStart={`url(#${arrowL})`} markerEnd={`url(#${arrowR})`} opacity="0.55" />
          <line x1="460" y1="22" x2="840" y2="22" stroke={INK} strokeWidth="0.6" markerStart={`url(#${arrowL})`} markerEnd={`url(#${arrowR})`} opacity="0.55" />
          <rect x="438" y="16" width="24" height="12" fill="hsl(220 15% 11%)" stroke={INK} strokeWidth="0.5" />
          <text x="450" y="25" fontFamily="monospace" fontSize="6.5" fill={INK_BRIGHT} textAnchor="middle">820</text>

          <g fontFamily="monospace" fontSize="5.5" fill={INK} opacity="0.6">
            <text x="120" y="16">100</text>
            <text x="200" y="16">200</text>
            <text x="280" y="16">300</text>
            <text x="360" y="16">400</text>
            <text x="540" y="16">500</text>
            <text x="620" y="16">600</text>
            <text x="700" y="16">700</text>
            <text x="780" y="16">800</text>
          </g>

          <path d="M 150 22 L 150 34 L 196 34" stroke={INK} strokeWidth="0.5" fill="none" strokeDasharray="2 2" opacity="0.55" />
          <text x="200" y="37" fontFamily="monospace" fontSize="6" fill={INK_BRIGHT} opacity="0.85">{refCode}</text>

          <path d="M 720 22 L 720 34 L 676 34" stroke={INK} strokeWidth="0.5" fill="none" strokeDasharray="2 2" opacity="0.55" />
          <text x="672" y="37" fontFamily="monospace" fontSize="6" fill={INK_BRIGHT} textAnchor="end" opacity="0.85">MEAS · TWICE</text>
        </g>

        {/* Belt */}
        <g>
          <rect x="60" y="48" width="780" height="38" fill="hsl(220 15% 8%)" stroke="hsl(220 10% 22%)" strokeWidth="0.6" rx="1" />
          <line x1="60" y1="51" x2="840" y2="51" stroke="hsl(220 10% 18%)" strokeWidth="0.4" />
          <line x1="60" y1="83" x2="840" y2="83" stroke="hsl(220 10% 18%)" strokeWidth="0.4" />

          <g ref={rollersGRef} />

          <g fontFamily="monospace" fontSize="6" fill={MUTED_LABEL} letterSpacing="1">
            <text x="60" y="102">LINE · 01 <tspan ref={throughputRef} fill={INK_BRIGHT} dx="6">0247</tspan>/hr</text>
            <text x="170" y="102">Q:<tspan ref={queueRef} fill={INK_BRIGHT}>00</tspan></text>
            <text x="200" y="102">TRQ:<tspan fill={INK_BRIGHT}>94%</tspan></text>
            <text x="250" y="102">SPD:<tspan fill={INK_BRIGHT}>1.2m/s</tspan></text>
            <text x="840" y="102" textAnchor="end">◉ ACTIVE</text>
          </g>

          <line x1="60" y1="110" x2="840" y2="110" stroke="hsl(220 10% 20%)" strokeWidth="0.3" strokeDasharray="1 3" />

          <g ref={partsGRef} />
          <g ref={sparksGRef} />
        </g>

        {/* Bottom callouts */}
        <g>
          <line x1="60" y1="114" x2="200" y2="114" stroke={INK} strokeWidth="0.5" opacity="0.5" />
          <line x1="700" y1="114" x2="840" y2="114" stroke={INK} strokeWidth="0.5" opacity="0.5" />
          <text x="206" y="117" fontFamily="monospace" fontSize="6" fill={INK} opacity="0.7">{label}</text>
          <text x="694" y="117" fontFamily="monospace" fontSize="6" fill={INK} textAnchor="end" opacity="0.7">dispatched · ok</text>
        </g>
      </svg>
    </div>
  );
}
