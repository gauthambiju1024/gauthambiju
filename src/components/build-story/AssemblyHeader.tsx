import { useEffect, useRef, useState } from "react";
import { SketchPopover, type PartSegments } from "./SketchPopover";

/**
 * AssemblyHeader (v4)
 * -------------------
 * Integrates the SketchPopover on the right edge. The popover owns the
 * sketch state internally — no need to lift it to App.tsx anymore. The
 * header receives parts data via the onChange callback from the popover.
 *
 * Layout:
 *   100px tall fixed header
 *   left:    instrumentation strip
 *   middle:  belt + product + arms + station labels
 *   right:   SketchPopover button (200px wide, slot from x=1188 to x=1388)
 *   bottom:  metadata strip
 *
 * Integration:
 *
 *   <AssemblyHeader panelIds={PANEL_IDS} />
 *   <main className="pt-[108px]">...</main>
 *
 * That's it. No state lift, no external props beyond panelIds.
 */

const INK = "hsl(38 48% 58%)";
const INK_BRIGHT = "hsl(38 55% 66%)";
const INK_HOT = "hsl(38 85% 72%)";
const MUTED = "hsl(220 10% 42%)";
const MUTED_DIM = "hsl(220 10% 32%)";
const GRID = "hsl(220 10% 26%)";
const METAL = "hsl(220 10% 50%)";

const STATION_NAMES = ["HERO", "ABOUT", "WORK", "THINK", "SKILL", "PATH", "WRITE", "SEND"];
const STATION_CODES = ["A7", "B3", "C1", "D4", "E9", "F2", "G6", "H0"];

type Props = {
  panelIds: string[];
  stationNames?: string[];
  stationCodes?: string[];
};

export function AssemblyHeader({
  panelIds,
  stationNames = STATION_NAMES,
  stationCodes = STATION_CODES,
}: Props) {
  const prodRef = useRef<SVGGElement>(null);
  const progLineRef = useRef<SVGLineElement>(null);
  const rollersRef = useRef<SVGGElement>(null);
  const armsRef = useRef<SVGGElement>(null);
  const sparksRef = useRef<SVGGElement>(null);
  const stationDotsRef = useRef<SVGGElement>(null);
  const stationBarsRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<SVGGElement>(null);

  const clockRef = useRef<SVGTSpanElement>(null);
  const queueRef = useRef<SVGTSpanElement>(null);
  const etaRef = useRef<SVGTextElement>(null);
  const dutyRef = useRef<SVGTSpanElement>(null);
  const dispRef = useRef<SVGTSpanElement>(null);
  const fmsgRef = useRef<SVGTSpanElement>(null);
  const partsLabelRef = useRef<SVGTSpanElement>(null);
  const sourceLabelRef = useRef<SVGTSpanElement>(null);
  const vtxRef = useRef<SVGTSpanElement>(null);
  const segRef = useRef<SVGTSpanElement>(null);

  const progressRef = useRef(0);
  const userPartsRef = useRef<PartSegments | null>(null);
  const sketchNameRef = useRef<string>("none");

  const handleSketchChange = (parts: PartSegments | null, name: string) => {
    userPartsRef.current = parts;
    sketchNameRef.current = name;
    if (sourceLabelRef.current) {
      sourceLabelRef.current.textContent = "·" + name.toUpperCase().replace(".", "-");
    }
    if (vtxRef.current) {
      let totalVtx = 0;
      if (parts) for (const part of parts) totalVtx += part.length * 2;
      vtxRef.current.textContent = String(totalVtx).padStart(3, "0");
    }
    if (segRef.current) {
      segRef.current.textContent = String(parts ? parts.length : 0).padStart(2, "0");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const prod = prodRef.current;
    const progLine = progLineRef.current;
    const rollers = rollersRef.current;
    const arms = armsRef.current;
    const sparks = sparksRef.current;
    const stationDots = stationDotsRef.current;
    const stationBars = stationBarsRef.current;
    const labels = labelsRef.current;
    if (!prod || !progLine || !rollers || !arms || !sparks || !stationDots || !stationBars || !labels) return;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const BS = 170;
    const BE = 1180;
    const BL = BE - BS;
    const Y = 55;

    let rollersHtml = "";
    for (let rx = 176; rx < BE; rx += 10) {
      rollersHtml += `<circle cx="${rx}" cy="${Y}" r="1.6" fill="hsl(220 12% 11%)" stroke="${GRID}" stroke-width="0.3"/>`;
      rollersHtml += `<line class="ah4-rm" data-cx="${rx}" x1="${rx}" y1="${Y - 1.3}" x2="${rx}" y2="${Y}" stroke="hsl(220 10% 36%)" stroke-width="0.3"/>`;
    }
    rollers.innerHTML = rollersHtml;
    const rMarks = rollers.querySelectorAll<SVGLineElement>(".ah4-rm");

    let armsHtml = "";
    for (let i = 0; i < 8; i++) {
      const x = BS + (i / 7) * BL;
      armsHtml += `<g class="ah4-arm" data-x="${x}">`;
      armsHtml += `<line x1="${x}" y1="20" x2="${x}" y2="44" stroke="hsl(220 10% 28%)" stroke-width="0.5"/>`;
      armsHtml += `<circle cx="${x}" cy="44" r="0.9" fill="hsl(220 10% 22%)" stroke="${METAL}" stroke-width="0.3"/>`;
      armsHtml += `<line class="ah4-s1" x1="${x}" y1="44" x2="${x}" y2="48" stroke="${METAL}" stroke-width="0.8"/>`;
      armsHtml += `<circle class="ah4-j" cx="${x}" cy="48" r="0.7" fill="hsl(220 10% 28%)" stroke="${METAL}" stroke-width="0.3"/>`;
      armsHtml += `<line class="ah4-s2" x1="${x}" y1="48" x2="${x}" y2="52" stroke="${METAL}" stroke-width="0.7"/>`;
      armsHtml += `<circle class="ah4-t" cx="${x}" cy="52" r="0.8" fill="none" stroke="${INK}" stroke-width="0.4"/>`;
      armsHtml += `</g>`;
    }
    arms.innerHTML = armsHtml;
    const armEls = arms.querySelectorAll<SVGGElement>(".ah4-arm");

    let dotsHtml = "";
    for (let i = 0; i < 8; i++) {
      const x = BS + (i / 7) * BL;
      dotsHtml += `<line x1="${x}" y1="20" x2="${x}" y2="44" stroke="${GRID}" stroke-width="0.4"/>`;
      dotsHtml += `<line x1="${x}" y1="66" x2="${x}" y2="80" stroke="${GRID}" stroke-width="0.4"/>`;
      dotsHtml += `<circle class="ah4-sd" data-i="${i}" cx="${x}" cy="76" r="1.2" fill="none" stroke="${MUTED_DIM}" stroke-width="0.5"/>`;
    }
    stationDots.innerHTML = dotsHtml;
    const sDots = stationDots.querySelectorAll<SVGCircleElement>(".ah4-sd");

    let barsHtml = "";
    for (let i = 0; i < 8; i++) {
      const x = BS + (i / 7) * BL;
      barsHtml += `<rect x="${x - 22}" y="70" width="44" height="1.5" fill="hsl(220 10% 18%)"/>`;
      barsHtml += `<rect class="ah4-bar" data-i="${i}" x="${x - 22}" y="70" width="0" height="1.5" fill="${INK}"/>`;
    }
    stationBars.innerHTML = barsHtml;
    const barEls = stationBars.querySelectorAll<SVGRectElement>(".ah4-bar");

    let labelsHtml = "";
    for (let i = 0; i < 8; i++) {
      const x = BS + (i / 7) * BL;
      labelsHtml += `<text x="${x - 28}" y="33" text-anchor="start" font-size="4.5" fill="${MUTED_DIM}">${String(i + 1).padStart(2, "0")}</text>`;
      labelsHtml += `<text class="ah4-name" data-i="${i}" x="${x}" y="33" text-anchor="middle" font-size="5.5" fill="${MUTED}" style="cursor:pointer" data-jump="${i}">${stationNames[i]}</text>`;
      labelsHtml += `<text x="${x + 28}" y="33" text-anchor="end" font-size="4.5" fill="${MUTED_DIM}">·${stationCodes[i]}</text>`;
      labelsHtml += `<text x="${x}" y="40" text-anchor="middle" font-size="4" fill="${MUTED_DIM}">PRT.0${i + 1}</text>`;
    }
    labels.innerHTML = labelsHtml;
    const nameEls = labels.querySelectorAll<SVGTextElement>(".ah4-name");

    const clickHandlers: Array<() => void> = [];
    nameEls.forEach((el) => {
      const i = parseInt(el.getAttribute("data-jump") || "0");
      const handler = () => {
        const target = document.getElementById(panelIds[i]);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      el.addEventListener("click", handler);
      clickHandlers.push(handler);
    });

    function renderProduct(stage: number, stageProg: number) {
      const parts = userPartsRef.current;
      if (!parts || parts.length === 0) {
        prod!.innerHTML = `<text x="0" y="2" text-anchor="middle" font-family="monospace" font-size="6" fill="${MUTED_DIM}">PICK A DESIGN →</text>`;
        return;
      }
      let html = "";
      for (let i = 0; i <= stage && i < parts.length; i++) {
        const op = i < stage ? 1 : Math.min(1, stageProg);
        html += `<g opacity="${op.toFixed(2)}">`;
        for (const seg of parts[i]) {
          html += `<line x1="${seg[0][0].toFixed(1)}" y1="${seg[0][1].toFixed(1)}" x2="${seg[1][0].toFixed(1)}" y2="${seg[1][1].toFixed(1)}" stroke="${INK_BRIGHT}" stroke-width="0.7" stroke-linecap="round"/>`;
        }
        html += `</g>`;
      }
      prod!.innerHTML = html;
    }

    type Spark = { el: SVGCircleElement; x: number; y: number; vx: number; vy: number; life: number };
    const sparkList: Spark[] = [];

    function emitSpark(x: number, y: number) {
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.5 + Math.random() * 0.8;
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("cx", String(x));
        c.setAttribute("cy", String(y));
        c.setAttribute("r", "0.35");
        c.setAttribute("fill", INK_HOT);
        sparks!.appendChild(c);
        sparkList.push({ el: c, x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.2, life: 12 });
      }
    }

    let t = 0;
    let rafId = 0;

    function frame() {
      t++;
      const p = progressRef.current;

      for (let i = 0; i < rMarks.length; i++) {
        const cx = parseFloat(rMarks[i].getAttribute("data-cx") || "0");
        const a = (t * 0.25 + i * 0.3) % (Math.PI * 2);
        rMarks[i].setAttribute("x2", String(cx + Math.sin(a) * 1.3));
        rMarks[i].setAttribute("y2", String(Y + Math.cos(a) * 1.3));
      }

      const prodX = BS + p * BL;
      prod!.setAttribute("transform", `translate(${prodX.toFixed(1)}, ${Y})`);
      progLine!.setAttribute("x2", String(prodX));

      const stage = Math.min(7, Math.floor(p * 8));
      const stageProg = p * 8 - stage;
      renderProduct(stage, stageProg);

      if (partsLabelRef.current) {
        const partCount = userPartsRef.current ? Math.min(8, stage + (stageProg > 0 ? 1 : 0)) : 0;
        partsLabelRef.current.textContent = "·" + String(partCount).padStart(2, "0");
      }

      for (let i = 0; i < sDots.length; i++) {
        const si = parseInt(sDots[i].getAttribute("data-i") || "0");
        if (si < stage) {
          sDots[i].setAttribute("fill", INK);
          sDots[i].setAttribute("stroke", INK);
          barEls[si].setAttribute("width", "44");
        } else if (si === stage) {
          sDots[i].setAttribute("fill", INK);
          sDots[i].setAttribute("stroke", INK);
          barEls[si].setAttribute("width", String(44 * stageProg));
        } else {
          sDots[i].setAttribute("fill", "none");
          sDots[i].setAttribute("stroke", MUTED_DIM);
          barEls[si].setAttribute("width", "0");
        }
        nameEls[si].setAttribute("fill", si <= stage ? INK : MUTED);
      }

      for (let i = 0; i < armEls.length; i++) {
        const ax = parseFloat(armEls[i].getAttribute("data-x") || "0");
        const dist = Math.abs(ax - prodX);
        const close = dist < 40;
        const engage = dist < 8;
        const ext = close ? Math.max(0, 1 - dist / 40) : 0;
        const jit = engage ? Math.sin(t * 0.6) * 0.5 : 0;
        const s1 = armEls[i].querySelector(".ah4-s1") as SVGLineElement;
        const s2 = armEls[i].querySelector(".ah4-s2") as SVGLineElement;
        const j = armEls[i].querySelector(".ah4-j") as SVGCircleElement;
        const tp = armEls[i].querySelector(".ah4-t") as SVGCircleElement;
        const jY = 48 + ext * 2;
        const tY = 52 + ext * 3 + jit;
        s1.setAttribute("y2", String(jY));
        j.setAttribute("cy", String(jY));
        s2.setAttribute("y1", String(jY));
        s2.setAttribute("y2", String(tY));
        tp.setAttribute("cy", String(tY));
        tp.setAttribute("stroke", engage ? INK_HOT : INK);
        if (engage && userPartsRef.current && t % 5 === 0) emitSpark(ax, tY);
      }

      for (let i = sparkList.length - 1; i >= 0; i--) {
        const s = sparkList[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.1;
        s.life--;
        s.el.setAttribute("cx", String(s.x));
        s.el.setAttribute("cy", String(s.y));
        s.el.setAttribute("opacity", String(s.life / 12));
        if (s.life <= 0) {
          sparks!.removeChild(s.el);
          sparkList.splice(i, 1);
        }
      }

      if (clockRef.current && t % 30 === 0) {
        const d = new Date();
        clockRef.current.textContent =
          String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
      }
      if (dutyRef.current) dutyRef.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
      if (queueRef.current) queueRef.current.textContent = "·" + String(Math.max(0, 8 - stage - 1)).padStart(3, "0");
      if (etaRef.current) etaRef.current.textContent = `ETA ${(3.2 * (1 - p)).toFixed(1)}s`;
      if (dispRef.current) {
        if (p >= 0.99 && userPartsRef.current) {
          dispRef.current.textContent = "OK";
          dispRef.current.setAttribute("fill", "hsl(120 50% 55%)");
        } else {
          dispRef.current.textContent = "--";
          dispRef.current.setAttribute("fill", MUTED);
        }
      }
      if (fmsgRef.current) {
        fmsgRef.current.textContent = !userPartsRef.current
          ? "AWAITING INPUT"
          : p >= 0.99
          ? "COMPLETE"
          : "BUILDING";
      }

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      nameEls.forEach((el, idx) => el.removeEventListener("click", clickHandlers[idx]));
    };
  }, [panelIds, stationNames, stationCodes]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50"
      style={{ background: "hsl(220 15% 9%)", borderBottom: "0.5px solid hsl(220 10% 20%)" }}
    >
      <div className="relative">
        <svg
          viewBox="0 0 1400 100"
          preserveAspectRatio="xMidYMid meet"
          className="block h-[100px] w-full"
        >
          <defs>
            <pattern id="ah4-grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="hsl(220 10% 16%)" strokeWidth="0.25" />
            </pattern>
          </defs>

          <rect width="1400" height="100" fill="url(#ah4-grid)" opacity="0.7" />
          <line x1="0" y1="20" x2="1400" y2="20" stroke="hsl(220 10% 18%)" strokeWidth="0.4" />
          <line x1="0" y1="80" x2="1400" y2="80" stroke="hsl(220 10% 18%)" strokeWidth="0.4" />

          <g fontFamily="monospace" fontSize="6.5" fill={MUTED} letterSpacing="1.2">
            <text x="14" y="12">GB · BUILD.OS</text>
            <text x="96" y="12" fill={INK}>● LIVE</text>
            <text x="140" y="12">v4.6.2</text>
            <text x="186" y="12">SID:A7X2</text>
            <text x="250" y="12">TRQ<tspan fill={INK}>·94</tspan></text>
            <text x="296" y="12">TMP<tspan fill={INK}>·42°</tspan></text>
            <text x="346" y="12">V<tspan fill={INK}>·1.2</tspan>m/s</text>
            <text x="408" y="12">PWR<tspan fill={INK}>·100</tspan></text>
            <text x="462" y="12">SRC<tspan ref={sourceLabelRef} fill={INK}>·NONE</tspan></text>
            <text x="544" y="12">PARTS<tspan ref={partsLabelRef} fill={INK}>·00</tspan></text>

            <text x="1180" y="12" textAnchor="end">
              UTC <tspan ref={clockRef} fill={INK}>14:23:07</tspan>
            </text>
            <text ref={etaRef} x="1112" y="12" textAnchor="end">ETA 3.2s</text>
            <text x="1056" y="12" textAnchor="end">OP·A7/B3/C1</text>
          </g>

          <g ref={stationDotsRef} />

          <rect x="170" y="44" width="1010" height="22" fill="hsl(220 15% 6%)" stroke="hsl(220 10% 22%)" strokeWidth="0.4" />
          <line x1="170" y1="48" x2="1180" y2="48" stroke="hsl(220 10% 14%)" strokeWidth="0.3" />
          <line x1="170" y1="62" x2="1180" y2="62" stroke="hsl(220 10% 14%)" strokeWidth="0.3" />
          <g ref={rollersRef} />

          <rect x="14" y="44" width="152" height="22" fill="none" stroke="hsl(220 10% 22%)" strokeWidth="0.4" />
          <text x="20" y="52" fontFamily="monospace" fontSize="5.5" fill={MUTED} letterSpacing="0.8">
            INTAKE<tspan fill={INK} dx="4">SKETCH</tspan>
          </text>
          <text x="20" y="60" fontFamily="monospace" fontSize="4.5" fill={MUTED_DIM}>
            vec→part·N
          </text>
          <line x1="166" y1="55" x2="170" y2="55" stroke={INK} strokeWidth="0.5" />

          <line ref={progLineRef} x1="170" y1="55" x2="170" y2="55" stroke={INK_BRIGHT} strokeWidth="0.6" />

          <g ref={prodRef} transform="translate(170, 55)" />
          <g ref={armsRef} />
          <g ref={sparksRef} />
          <g ref={labelsRef} fontFamily="monospace" letterSpacing="1" />
          <g ref={stationBarsRef} />

          <line x1="0" y1="88" x2="1400" y2="88" stroke="hsl(220 10% 16%)" strokeWidth="0.3" strokeDasharray="1 3" />

          <g fontFamily="monospace" fontSize="5" fill={MUTED_DIM} letterSpacing="0.6">
            <text x="14" y="96">BOARD·REV.03</text>
            <text x="90" y="96">2026.04.09</text>
            <text x="152" y="96">CAL·OK</text>
            <text x="192" y="96">ERR·000</text>
            <text x="236" y="96">
              DUTY·<tspan ref={dutyRef} fill={INK}>00</tspan>%
            </text>
            <text x="296" y="96">
              VTX·<tspan ref={vtxRef} fill={INK}>000</tspan>
            </text>
            <text x="356" y="96">
              SEG·<tspan ref={segRef} fill={INK}>00</tspan>
            </text>
            <text x="1386" y="96" textAnchor="end">
              ⊿ 0 <tspan ref={fmsgRef}>AWAITING INPUT</tspan>
            </text>
          </g>
        </svg>

        <SketchPopover onChange={handleSketchChange} initialPreset="drone.v1" />
      </div>
    </div>
  );
}
