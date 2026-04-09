import { useEffect, useRef, useState } from "react";

/**
 * AssemblyHeader (v7) — compact
 * -----------------------------
 * Half the height of v6 (90px instead of 180). Achieved by:
 *
 *   - Removing the bottom metadata strip (BOARD·REV / date / CAL / DUTY / msg).
 *   - Removing per-station sub-labels (01 · HOME, 02 · ABOUT, ...).
 *   - Removing per-station progress bars.
 *   - Tightening vertical spacing throughout.
 *   - Shrinking the design box on the right from 132px tall to 72px.
 *
 * Kept:
 *   - Overall progress spine (far left), now narrower (3px) and shorter.
 *   - Top instrumentation strip (all labels preserved, tighter kerning).
 *   - Serif nav row above the belt.
 *   - The belt itself with rollers, bearings, end rails, direction ports.
 *   - Intake/dispatch labels.
 *   - Compact design box on the right with live preview + click-to-change CTA.
 *   - Popover for preset picking and custom drawing.
 *
 * Layout map (y coordinates):
 *   0..12   top instrumentation
 *   14..35  serif nav row
 *   36..40  station ticks
 *   40..64  belt channel
 *   65..80  intake/dispatch
 *   10..80  overall progress spine (x=10, width=3)
 *
 * Integration unchanged:
 *
 *   <AssemblyHeader panelIds={PANEL_IDS} />
 *   <main className="pt-[98px]">...</main>
 *
 * pt-[98px] reserves 90px header + 8px breathing room.
 */

type Stroke = Array<[number, number]>;
type Sketch = { name: string; strokes: Stroke[] };
type Segment = [[number, number], [number, number]];
type PartSegments = Segment[][];

const INK = "hsl(38 50% 58%)";
const INK_BRIGHT = "hsl(38 55% 65%)";
const INK_HOT = "hsl(38 85% 72%)";
const INK_DIM = "hsl(38 35% 52%)";
const INK_BG = "hsl(38 45% 55%)";
const METAL = "hsl(38 45% 50%)";
const BELT_DARK = "hsl(160 22% 10%)";
const BELT_DARKER = "hsl(160 22% 8%)";
const BORDER_DASH = "hsl(38 40% 45%)";

const PRESETS: Sketch[] = [
  {
    name: "drone.v4",
    strokes: [
      [[150, 60], [210, 60], [210, 90], [150, 90], [150, 60]],
      [[150, 60], [90, 30]],
      [[210, 60], [270, 30]],
      [[150, 90], [90, 120]],
      [[210, 90], [270, 120]],
      [[75, 30], [105, 30]],
      [[255, 30], [285, 30]],
      [[75, 120], [105, 120]],
      [[255, 120], [285, 120]],
      [[90, 22], [90, 38]],
      [[270, 22], [270, 38]],
      [[90, 112], [90, 128]],
      [[270, 112], [270, 128]],
      [[165, 90], [165, 110]],
      [[195, 90], [195, 110]],
      [[150, 110], [210, 110]],
    ],
  },
  {
    name: "rocket.v2",
    strokes: [
      [[180, 20], [160, 50], [200, 50], [180, 20]],
      [[160, 50], [160, 120]],
      [[200, 50], [200, 120]],
      [[180, 70], [175, 70], [175, 80], [185, 80], [185, 70], [180, 70]],
      [[160, 95], [200, 95]],
      [[160, 100], [140, 130], [160, 125]],
      [[200, 100], [220, 130], [200, 125]],
      [[165, 120], [170, 135], [190, 135], [195, 120]],
      [[172, 135], [175, 148]],
      [[180, 135], [180, 152]],
      [[188, 135], [185, 148]],
    ],
  },
  {
    name: "plane.v1",
    strokes: [
      [[80, 80], [260, 80], [280, 75], [260, 70], [80, 70], [70, 75], [80, 80]],
      [[250, 72], [270, 75], [250, 78]],
      [[140, 75], [130, 110], [180, 85]],
      [[140, 75], [130, 40], [180, 65]],
      [[90, 75], [75, 55], [95, 65]],
      [[85, 75], [65, 85]],
      [[85, 75], [65, 65]],
      [[160, 73], [240, 73]],
      [[155, 90], [165, 90]],
    ],
  },
  {
    name: "phone.v2",
    strokes: [
      [[140, 20], [220, 20], [225, 25], [225, 115], [220, 120], [140, 120], [135, 115], [135, 25], [140, 20]],
      [[145, 32], [215, 32], [215, 108], [145, 108], [145, 32]],
      [[172, 32], [172, 36], [188, 36], [188, 32]],
      [[176, 34], [184, 34]],
      [[165, 114], [195, 114]],
      [[135, 50], [135, 62]],
      [[225, 45], [225, 55]],
      [[225, 60], [225, 70]],
    ],
  },
  {
    name: "satellite",
    strokes: [
      [[160, 60], [200, 60], [200, 100], [160, 100], [160, 60]],
      [[180, 60], [180, 40]],
      [[165, 40], [195, 40]],
      [[170, 35], [180, 25], [190, 35]],
      [[160, 70], [100, 70], [100, 90], [160, 90]],
      [[110, 70], [110, 90]],
      [[120, 70], [120, 90]],
      [[130, 70], [130, 90]],
      [[140, 70], [140, 90]],
      [[150, 70], [150, 90]],
      [[200, 70], [260, 70], [260, 90], [200, 90]],
      [[210, 70], [210, 90]],
      [[220, 70], [220, 90]],
      [[230, 70], [230, 90]],
      [[240, 70], [240, 90]],
      [[250, 70], [250, 90]],
      [[168, 80], [192, 80]],
    ],
  },
];

const NAV = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "work", label: "Work" },
  { key: "think", label: "Think" },
  { key: "skill", label: "Skill" },
  { key: "path", label: "Path" },
  { key: "write", label: "Write" },
  { key: "send", label: "Send" },
];

function bbox(strokes: Stroke[]) {
  let mx = Infinity, my = Infinity, Mx = -Infinity, My = -Infinity;
  for (const s of strokes)
    for (const p of s) {
      if (p[0] < mx) mx = p[0];
      if (p[0] > Mx) Mx = p[0];
      if (p[1] < my) my = p[1];
      if (p[1] > My) My = p[1];
    }
  return { mx, my, Mx, My, w: Mx - mx, h: My - my };
}

function renderPathsSvg(strokes: Stroke[], scale: number, color: string, sw: number): string {
  if (!strokes.length) return "";
  const bb = bbox(strokes);
  if (!isFinite(bb.mx)) return "";
  const cx = (bb.mx + bb.Mx) / 2;
  const cy = (bb.my + bb.My) / 2;
  const s = scale / Math.max(bb.w, bb.h, 1);
  let h = "";
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    let d = "";
    for (let j = 0; j < stroke.length; j++) {
      d += `${j === 0 ? "M " : "L "}${((stroke[j][0] - cx) * s).toFixed(1)} ${((stroke[j][1] - cy) * s).toFixed(1)} `;
    }
    h += `<path d="${d}" stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return h;
}

function strokesToParts(strokes: Stroke[], scale: number): PartSegments {
  const allSegs: Segment[] = [];
  for (const s of strokes) {
    if (s.length < 2) continue;
    for (let j = 0; j < s.length - 1; j++) {
      allSegs.push([s[j], s[j + 1]]);
    }
  }
  if (allSegs.length === 0) return [];
  const bb = bbox(strokes);
  if (!isFinite(bb.mx)) return [];
  const cx = (bb.mx + bb.Mx) / 2;
  const cy = (bb.my + bb.My) / 2;
  const s = scale / Math.max(bb.w, bb.h, 1);
  const normalized: Segment[] = allSegs.map(
    (seg) =>
      [
        [(seg[0][0] - cx) * s, (seg[0][1] - cy) * s],
        [(seg[1][0] - cx) * s, (seg[1][1] - cy) * s],
      ] as Segment
  );
  const perPart = Math.ceil(normalized.length / 8);
  const parts: PartSegments = [];
  for (let i = 0; i < 8; i++) {
    parts.push(normalized.slice(i * perPart, (i + 1) * perPart));
  }
  return parts;
}

type Props = {
  panelIds: string[];
};

export function AssemblyHeader({ panelIds }: Props) {
  const prodRef = useRef<SVGGElement>(null);
  const previewRef = useRef<SVGGElement>(null);
  
  const rollersRef = useRef<SVGGElement>(null);
  const armsRef = useRef<SVGGElement>(null);
  const sparksRef = useRef<SVGGElement>(null);
  const stationsRef = useRef<SVGGElement>(null);

  const overallFillRef = useRef<SVGRectElement>(null);
  const overallChipRef = useRef<SVGRectElement>(null);
  const overallPctRef = useRef<SVGTextElement>(null);
  const intakeDotRef = useRef<SVGCircleElement>(null);
  const dispatchDotRef = useRef<SVGCircleElement>(null);
  const clockRef = useRef<SVGTSpanElement>(null);
  const etaRef = useRef<SVGTextElement>(null);
  const dispRef = useRef<SVGTSpanElement>(null);
  const srcRef = useRef<SVGTSpanElement>(null);
  const prtRef = useRef<SVGTSpanElement>(null);

  const progressRef = useRef(0);
  const [currentSketch, setCurrentSketch] = useState<Sketch>(PRESETS[0]);
  const partsSmallRef = useRef<PartSegments>(strokesToParts(PRESETS[0].strokes, 18));
  const partsLargeRef = useRef<PartSegments>(strokesToParts(PRESETS[0].strokes, 34));

  const [popoverOpen, setPopoverOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customStrokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  useEffect(() => {
    partsSmallRef.current = strokesToParts(currentSketch.strokes, 18);
    partsLargeRef.current = strokesToParts(currentSketch.strokes, 34);
    if (srcRef.current) {
      srcRef.current.textContent = currentSketch.name.toUpperCase().replace(".", "-");
    }
  }, [currentSketch]);

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
    const preview = previewRef.current;
    const rollers = rollersRef.current;
    const arms = armsRef.current;
    const sparks = sparksRef.current;
    const stations = stationsRef.current;
    if (!prod || !preview || !rollers || !arms || !sparks || !stations) return;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const BS = 30;
    const BE = 1140;
    const BL = BE - BS;
    const Y = 52;

    let rollersHtml = "";
    for (let rx = BS + 14; rx < BE; rx += 12) {
      rollersHtml += `<circle cx="${rx}" cy="${Y}" r="1.6" fill="${BELT_DARKER}" stroke="${METAL}" stroke-width="0.3"/>`;
      rollersHtml += `<circle cx="${rx}" cy="${Y}" r="0.5" fill="none" stroke="hsl(38 40% 48%)" stroke-width="0.25"/>`;
      rollersHtml += `<line class="h7-rm" data-cx="${rx}" x1="${rx}" y1="${Y - 1.2}" x2="${rx}" y2="${Y}" stroke="${INK_BRIGHT}" stroke-width="0.3"/>`;
    }
    rollers.innerHTML = rollersHtml;
    const rMarks = rollers.querySelectorAll<SVGLineElement>(".h7-rm");

    let stationsHtml = "";
    for (let i = 0; i < 8; i++) {
      const x = BS + 45 + (i / 7) * (BL - 90);
      stationsHtml += `<line x1="${x}" y1="36" x2="${x}" y2="40" stroke="${INK_BG}" stroke-width="0.35" opacity="0.6"/>`;
      stationsHtml += `<text class="h7-nv" data-i="${i}" data-jump="${i}" x="${x}" y="32" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="16" letter-spacing="0.3" fill="${INK}" style="cursor:pointer">${NAV[i].label}</text>`;
      stationsHtml += `<line class="h7-nu" data-i="${i}" x1="${x - 16}" y1="35" x2="${x + 16}" y2="35" stroke="${INK_BRIGHT}" stroke-width="0.6" opacity="0"/>`;
    }
    stations.innerHTML = stationsHtml;
    const navEls = stations.querySelectorAll<SVGTextElement>(".h7-nv");
    const navUnderlines = stations.querySelectorAll<SVGLineElement>(".h7-nu");

    const clickHandlers: Array<() => void> = [];
    navEls.forEach((el) => {
      const i = parseInt(el.getAttribute("data-jump") || "0");
      const handler = () => {
        const target = document.getElementById(panelIds[i]);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      el.addEventListener("click", handler);
      clickHandlers.push(handler);
    });

    let armsHtml = "";
    const stationSpacing = (BL - 90) / 7;
    for (let i = 0; i < 7; i++) {
      const x = BS + 45 + (i / 7) * (BL - 90) + stationSpacing / 2;
      armsHtml += `<g class="h7-arm" data-x="${x}">`;
      armsHtml += `<line x1="${x - 3}" y1="18" x2="${x + 3}" y2="18" stroke="${METAL}" stroke-width="0.8" opacity="0.7"/>`;
      armsHtml += `<line x1="${x}" y1="18" x2="${x}" y2="36" stroke="${INK}" stroke-width="0.3" stroke-dasharray="1 1" opacity="0.35"/>`;
      armsHtml += `<line class="h7-s1" x1="${x}" y1="36" x2="${x}" y2="40" stroke="${INK}" stroke-width="1.1"/>`;
      armsHtml += `<circle class="h7-j" cx="${x}" cy="40" r="0.9" fill="${BELT_DARKER}" stroke="${INK_BRIGHT}" stroke-width="0.4"/>`;
      armsHtml += `<line class="h7-s2" x1="${x}" y1="40" x2="${x}" y2="44" stroke="${INK}" stroke-width="0.9"/>`;
      armsHtml += `<circle class="h7-t" cx="${x}" cy="44" r="1.1" fill="none" stroke="${INK_BRIGHT}" stroke-width="0.5"/>`;
      armsHtml += `</g>`;
    }
    arms.innerHTML = armsHtml;
    const armEls = arms.querySelectorAll<SVGGElement>(".h7-arm");

    function renderProduct(stage: number, stageProg: number) {
      const parts = partsSmallRef.current;
      if (!parts || parts.length === 0) return;
      let html = "";
      for (let i = 0; i <= stage && i < parts.length; i++) {
        const op = i < stage ? 1 : Math.min(1, stageProg);
        html += `<g opacity="${op.toFixed(2)}">`;
        for (const seg of parts[i]) {
          html += `<line x1="${seg[0][0].toFixed(1)}" y1="${seg[0][1].toFixed(1)}" x2="${seg[1][0].toFixed(1)}" y2="${seg[1][1].toFixed(1)}" stroke="${INK_BRIGHT}" stroke-width="0.8" stroke-linecap="round"/>`;
        }
        html += `</g>`;
      }
      prod!.innerHTML = html;
    }

    function renderPreview(stage: number, stageProg: number) {
      const parts = partsLargeRef.current;
      if (!parts || parts.length === 0) return;
      let html = "";
      for (let i = 0; i <= stage && i < parts.length; i++) {
        const op = i < stage ? 0.95 : Math.min(0.95, stageProg);
        html += `<g opacity="${op.toFixed(2)}">`;
        for (const seg of parts[i]) {
          html += `<line x1="${seg[0][0].toFixed(1)}" y1="${seg[0][1].toFixed(1)}" x2="${seg[1][0].toFixed(1)}" y2="${seg[1][1].toFixed(1)}" stroke="${INK_BRIGHT}" stroke-width="0.9" stroke-linecap="round"/>`;
        }
        html += `</g>`;
      }
      preview!.innerHTML = html;
    }

    type Spark = { el: SVGCircleElement; x: number; y: number; vx: number; vy: number; life: number };
    const sparkList: Spark[] = [];

    function emitSpark(x: number, y: number) {
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.4 + Math.random() * 0.7;
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("cx", String(x));
        c.setAttribute("cy", String(y));
        c.setAttribute("r", "0.5");
        c.setAttribute("fill", INK_HOT);
        sparks!.appendChild(c);
        sparkList.push({ el: c, x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.15, life: 10 });
      }
    }

    let t = 0;
    let rafId = 0;

    function frame() {
      t++;
      const p = progressRef.current;

      for (let i = 0; i < rMarks.length; i++) {
        const cx = parseFloat(rMarks[i].getAttribute("data-cx") || "0");
        const a = (t * 0.3 + i * 0.4) % (Math.PI * 2);
        rMarks[i].setAttribute("x2", String(cx + Math.sin(a) * 1.2));
        rMarks[i].setAttribute("y2", String(Y + Math.cos(a) * 1.2));
      }

      if (overallFillRef.current) {
        overallFillRef.current.setAttribute("height", String(70 * p));
      }
      if (overallChipRef.current) {
        overallChipRef.current.setAttribute("y", String(12 + 70 * p - 2.5));
      }
      if (overallPctRef.current) {
        overallPctRef.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
        overallPctRef.current.setAttribute("y", String(14 + 70 * p));
      }

      const prodX = BS + 45 + p * (BL - 90);
      prod!.setAttribute("transform", `translate(${prodX.toFixed(1)}, ${Y})`);

      const stage = Math.min(7, Math.floor(p * 8));
      const stageProg = p * 8 - stage;
      renderProduct(stage, stageProg);
      renderPreview(stage, stageProg);

      if (prtRef.current) {
        const partCount = Math.min(8, stage + (stageProg > 0 ? 1 : 0));
        prtRef.current.textContent = String(partCount).padStart(2, "0");
      }

      for (let i = 0; i < navEls.length; i++) {
        if (i === stage) {
          navEls[i].setAttribute("fill", "hsl(38 65% 74%)");
          navEls[i].setAttribute("font-weight", "500");
          navUnderlines[i].setAttribute("opacity", "0.9");
          navUnderlines[i].setAttribute("stroke", "hsl(38 65% 74%)");
        } else if (i < stage) {
          navEls[i].setAttribute("fill", "hsl(38 52% 62%)");
          navEls[i].setAttribute("font-weight", "400");
          navUnderlines[i].setAttribute("opacity", "0.55");
          navUnderlines[i].setAttribute("stroke", "hsl(38 52% 62%)");
        } else {
          navEls[i].setAttribute("fill", INK);
          navEls[i].setAttribute("font-weight", "400");
          navUnderlines[i].setAttribute("opacity", "0");
        }
      }

      for (let i = 0; i < armEls.length; i++) {
        const ax = parseFloat(armEls[i].getAttribute("data-x") || "0");
        const dist = Math.abs(ax - prodX);
        const close = dist < 40;
        const engage = dist < 12;
        const ext = close ? Math.max(0, 1 - dist / 40) : 0;
        const jit = engage ? Math.sin(t * 0.6) * 0.5 : 0;
        const s1 = armEls[i].querySelector(".h7-s1") as SVGLineElement;
        const s2 = armEls[i].querySelector(".h7-s2") as SVGLineElement;
        const j = armEls[i].querySelector(".h7-j") as SVGCircleElement;
        const tp = armEls[i].querySelector(".h7-t") as SVGCircleElement;
        const jY = 40 + ext * 2;
        const tY = 44 + ext * 8 + jit;
        s1.setAttribute("y2", String(jY));
        j.setAttribute("cy", String(jY));
        s2.setAttribute("y1", String(jY));
        s2.setAttribute("y2", String(tY));
        tp.setAttribute("cy", String(tY));
        tp.setAttribute("stroke", engage ? INK_HOT : INK_BRIGHT);
        if (engage && t % 4 === 0) emitSpark(ax, tY);
      }

      for (let i = sparkList.length - 1; i >= 0; i--) {
        const s = sparkList[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.1;
        s.life--;
        s.el.setAttribute("cx", String(s.x));
        s.el.setAttribute("cy", String(s.y));
        s.el.setAttribute("opacity", String(s.life / 10));
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
      if (etaRef.current) etaRef.current.textContent = `ETA ${(3.2 * (1 - p)).toFixed(1)}s`;
      if (intakeDotRef.current) {
        const pulse = 0.4 + Math.abs(Math.sin(t * 0.15)) * 0.6;
        intakeDotRef.current.setAttribute("opacity", String(pulse));
      }
      if (dispatchDotRef.current) {
        if (p >= 0.99) {
          dispatchDotRef.current.setAttribute("fill", "hsl(120 50% 55%)");
          dispatchDotRef.current.setAttribute("opacity", "1");
          dispatchDotRef.current.setAttribute("r", "1.3");
        } else {
          const fillAmount = stage / 8;
          dispatchDotRef.current.setAttribute("fill", INK_BRIGHT);
          dispatchDotRef.current.setAttribute("opacity", String(0.3 + fillAmount * 0.6));
          dispatchDotRef.current.setAttribute("r", String(0.8 + fillAmount * 0.5));
        }
      }
      if (dispRef.current) {
        if (p >= 0.99) {
          dispRef.current.textContent = "ok";
          dispRef.current.setAttribute("fill", "hsl(120 50% 55%)");
        } else {
          dispRef.current.textContent = "--";
          dispRef.current.setAttribute("fill", INK_DIM);
        }
      }

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      navEls.forEach((el, idx) => el.removeEventListener("click", clickHandlers[idx]));
    };
  }, [panelIds, currentSketch]);

  function redrawCanvas() {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = INK_BRIGHT;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of customStrokesRef.current) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s[0][0], s[0][1]);
      for (let j = 1; j < s.length; j++) ctx.lineTo(s[j][0], s[j][1]);
      ctx.stroke();
    }
  }

  useEffect(() => {
    if (!popoverOpen) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    redrawCanvas();

    function getPos(e: PointerEvent): [number, number] {
      const rect = cvs!.getBoundingClientRect();
      const sx = cvs!.width / rect.width;
      const sy = cvs!.height / rect.height;
      return [(e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy];
    }

    function onDown(e: PointerEvent) {
      drawingRef.current = true;
      currentStrokeRef.current = [getPos(e)];
      customStrokesRef.current.push(currentStrokeRef.current);
      cvs!.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
    function onMove(e: PointerEvent) {
      if (!drawingRef.current) return;
      const p = getPos(e);
      const stroke = currentStrokeRef.current!;
      const last = stroke[stroke.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 3) {
        stroke.push(p);
        redrawCanvas();
      }
    }
    function onUp() {
      drawingRef.current = false;
    }

    cvs.addEventListener("pointerdown", onDown);
    cvs.addEventListener("pointermove", onMove);
    cvs.addEventListener("pointerup", onUp);
    cvs.addEventListener("pointercancel", onUp);
    return () => {
      cvs.removeEventListener("pointerdown", onDown);
      cvs.removeEventListener("pointermove", onMove);
      cvs.removeEventListener("pointerup", onUp);
      cvs.removeEventListener("pointercancel", onUp);
    };
  }, [popoverOpen]);

  function handleClearCanvas() {
    customStrokesRef.current = [];
    redrawCanvas();
  }

  function handleBuildCustom() {
    if (customStrokesRef.current.length === 0) return;
    setCurrentSketch({ name: "custom.user", strokes: customStrokesRef.current.slice() });
    setPopoverOpen(false);
  }

  function handlePickPreset(p: Sketch) {
    setCurrentSketch(p);
    setPopoverOpen(false);
  }

  return (
    <div className="pointer-events-none fixed top-0 z-50 left-0 right-0 min-[800px]:left-[calc(var(--margin-col-width,60px)+6px)] min-[800px]:right-[calc(var(--margin-col-width,60px)+6px)]">
      <div className="relative" style={{
        background: 'hsla(220, 15%, 12%, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        maskImage: 'linear-gradient(to bottom, black calc(100% - 4px), transparent 100%), linear-gradient(to right, transparent 0px, black 3px, black calc(100% - 3px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 4px), transparent 100%), linear-gradient(to right, transparent 0px, black 3px, black calc(100% - 3px), transparent 100%)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in' as any,
      }}>
        <svg
          viewBox="0 0 1400 90"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-auto block h-[90px] w-full"
        >
          {/* OVERALL PROGRESS SPINE (left, narrower) */}
          <g>
            <rect x="10" y="10" width="3" height="70" fill="hsl(38 25% 20%)" opacity="0.5" />
            <rect x="10" y="10" width="3" height="70" fill="none" stroke={INK_DIM} strokeWidth="0.3" />
            <rect ref={overallFillRef} x="10" y="10" width="3" height="0" fill={INK_BRIGHT} opacity="0.75" />
            <line x1="8" y1="10" x2="15" y2="10" stroke={INK_DIM} strokeWidth="0.3" />
            <line x1="8" y1="45" x2="15" y2="45" stroke={INK_DIM} strokeWidth="0.3" />
            <line x1="8" y1="80" x2="15" y2="80" stroke={INK_DIM} strokeWidth="0.3" />
            <text x="17" y="13" fontFamily="monospace" fontSize="3.5" fill={INK}>100</text>
            <text x="17" y="82" fontFamily="monospace" fontSize="3.5" fill={INK}>00</text>
            <rect ref={overallChipRef} x="6" y="32" width="11" height="5" fill="hsl(160 20% 14%)" stroke={INK_BRIGHT} strokeWidth="0.4" />
            <text
              ref={overallPctRef}
              x="11.5"
              y="36"
              fontFamily="monospace"
              fontSize="3.8"
              fill="hsl(38 65% 70%)"
              textAnchor="middle"
              fontWeight="500"
            >
              00
            </text>
          </g>

          {/* Top dashed boundary */}
          <line x1="30" y1="12" x2="1140" y2="12" stroke={INK} strokeWidth="0.3" strokeDasharray="1 3" opacity="0.5" />

          {/* Top instrumentation — single strip */}
          <g fontFamily="monospace" fontSize="5" fill={INK} letterSpacing="1" opacity="0.85">
            <text x="30" y="8">GB · BUILD.OS</text>
            <text x="95" y="8" fill={INK_BRIGHT}>● LIVE</text>
            <text x="130" y="8">v4.6.2</text>
            <text x="165" y="8">TRQ·94</text>
            <text x="202" y="8">PWR·100</text>
            <text x="246" y="8">
              SRC·<tspan ref={srcRef} fill={INK_BRIGHT}>DRONE-V1</tspan>
            </text>
            <text x="317" y="8">
              PARTS·<tspan ref={prtRef} fill={INK_BRIGHT}>00</tspan>/08
            </text>
            <text x="1140" y="8" textAnchor="end">
              UTC <tspan ref={clockRef} fill={INK_BRIGHT}>14:23:07</tspan>
            </text>
            <text ref={etaRef} x="1082" y="8" textAnchor="end">ETA 3.2s</text>
            <text x="1035" y="8" textAnchor="end">OP·A7/B3/C1</text>
          </g>

          {/* Station ticks + serif nav */}
          <g ref={stationsRef} />

          {/* BELT STRUCTURE — compact */}
          <g>
            <rect x="30" y="40" width="1110" height="24" fill={BELT_DARK} stroke={METAL} strokeWidth="0.4" opacity="0.9" />
            <line x1="30" y1="44" x2="1140" y2="44" stroke={INK_BG} strokeWidth="0.5" opacity="0.7" />
            <line x1="30" y1="60" x2="1140" y2="60" stroke={INK_BG} strokeWidth="0.5" opacity="0.7" />
            <line x1="30" y1="47" x2="1140" y2="47" stroke="hsl(38 35% 38%)" strokeWidth="0.25" opacity="0.5" strokeDasharray="5 3" />
            <line x1="30" y1="57" x2="1140" y2="57" stroke="hsl(38 35% 38%)" strokeWidth="0.25" opacity="0.5" strokeDasharray="5 3" />

            <g ref={rollersRef} />

            <line x1="30" y1="40" x2="30" y2="64" stroke={INK} strokeWidth="0.6" />
            <line x1="1140" y1="40" x2="1140" y2="64" stroke={INK} strokeWidth="0.6" />

            <g transform="translate(30, 52)">
              <rect x="-3" y="-6" width="6" height="12" fill={BELT_DARKER} stroke={METAL} strokeWidth="0.4" />
              <line x1="-2" y1="-3" x2="2" y2="-3" stroke={METAL} strokeWidth="0.3" />
              <line x1="-2" y1="0" x2="2" y2="0" stroke={METAL} strokeWidth="0.3" />
              <line x1="-2" y1="3" x2="2" y2="3" stroke={METAL} strokeWidth="0.3" />
            </g>
            <g transform="translate(1140, 52)">
              <rect x="-3" y="-6" width="6" height="12" fill={BELT_DARKER} stroke={METAL} strokeWidth="0.4" />
              <line x1="-2" y1="-3" x2="2" y2="-3" stroke={METAL} strokeWidth="0.3" />
              <line x1="-2" y1="0" x2="2" y2="0" stroke={METAL} strokeWidth="0.3" />
              <line x1="-2" y1="3" x2="2" y2="3" stroke={METAL} strokeWidth="0.3" />
            </g>
          </g>

          <g ref={prodRef} transform="translate(300, 52)" />
          <g ref={armsRef} />
          <g ref={sparksRef} />

          {/* Intake / dispatch labels with indicator dots */}
          <g fontFamily="monospace" fontSize="4" fill={INK} letterSpacing="0.5" opacity="0.8">
            <text x="30" y="76">─── INTAKE</text>
            <text x="73" y="76" fill={INK_BRIGHT}>user·sketch</text>
            <circle ref={intakeDotRef} cx="107" cy="74.5" r="1" fill={INK_BRIGHT} opacity="0.4" />
            <circle ref={dispatchDotRef} cx="1063" cy="74.5" r="1" fill={INK_DIM} opacity="0.6" />
            <text x="1140" y="76" textAnchor="end">
              dispatch·<tspan ref={dispRef} fill={INK_DIM}>--</tspan> ───
            </text>
            <text x="1060" y="76" textAnchor="end">field ready</text>
          </g>

          {/* COMPACT DESIGN BOX — 72px tall */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => setPopoverOpen((o) => !o)}
          >
            <rect x="1160" y="10" width="228" height="72" fill="none" stroke={INK_BRIGHT} strokeWidth="0.6" />
            <rect x="1162" y="12" width="224" height="68" fill="none" stroke={BORDER_DASH} strokeWidth="0.3" strokeDasharray="2 2" />

            <text x="1168" y="20" fontFamily="monospace" fontSize="5" fill={INK_BRIGHT} letterSpacing="1">
              ─── YOUR PRODUCT
            </text>

            <g ref={previewRef} transform="translate(1274, 46)" />

            {/* Corner crop marks (shrunk) */}
            <line x1="1238" y1="25" x2="1241" y2="25" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1238" y1="25" x2="1238" y2="28" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1310" y1="25" x2="1307" y2="25" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1310" y1="25" x2="1310" y2="28" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1238" y1="67" x2="1241" y2="67" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1238" y1="67" x2="1238" y2="64" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1310" y1="67" x2="1307" y2="67" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1310" y1="67" x2="1310" y2="64" stroke={INK_DIM} strokeWidth="0.4" />

            <rect x="1168" y="72" width="212" height="7" fill={BELT_DARK} stroke={INK} strokeWidth="0.3" />
            <text
              x="1274"
              y="77.5"
              fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic"
              fontSize="5.5"
              fill="hsl(38 60% 68%)"
              textAnchor="middle"
            >
              click to change → design yours ↗
            </text>
          </g>
        </svg>
      </div>

        {popoverOpen && (
          <div
            className="pointer-events-auto absolute right-4 z-[60] rounded-md p-4"
            style={{
              top: 88,
              width: 640,
              background: "hsl(160 22% 11%)",
              border: `0.5px solid ${BORDER_DASH}`,
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: INK,
                  letterSpacing: "1.5px",
                }}
              >
                ─── DESIGN YOUR PRODUCT ·{" "}
                <span style={{ color: INK_DIM }}>pick a preset or draw your own</span>
              </div>
              <button
                onClick={() => setPopoverOpen(false)}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  padding: "2px 10px",
                  background: "transparent",
                  border: `0.5px solid ${BORDER_DASH}`,
                  color: INK_DIM,
                  cursor: "pointer",
                }}
              >
                close ✕
              </button>
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: INK_DIM,
                letterSpacing: "0.8px",
                marginBottom: 6,
              }}
            >
              QUICK·PICK
            </div>
            <div className="mb-3 grid grid-cols-5 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePickPreset(p)}
                  className="flex flex-col items-center gap-1.5 transition-colors"
                  style={{
                    background: "hsl(160 22% 8%)",
                    border: `0.5px dashed ${currentSketch.name === p.name ? INK_BRIGHT : BORDER_DASH}`,
                    padding: 8,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    viewBox="-25 -25 50 50"
                    width="100%"
                    height={50}
                    dangerouslySetInnerHTML={{
                      __html: renderPathsSvg(p.strokes, 40, INK_BRIGHT, 1.4),
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 9,
                      color: INK,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {p.name}
                  </div>
                </button>
              ))}
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: INK_DIM,
                letterSpacing: "0.8px",
                marginBottom: 6,
              }}
            >
              OR DRAW YOUR OWN
            </div>
            <canvas
              ref={canvasRef}
              width={900}
              height={400}
              style={{
                display: "block",
                width: "100%",
                height: 180,
                background: "hsl(160 22% 8%)",
                border: `0.5px dashed ${BORDER_DASH}`,
                borderRadius: 3,
                cursor: "crosshair",
                touchAction: "none",
              }}
            />

            <div className="mt-2.5 flex gap-2">
              <button
                onClick={handleClearCanvas}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  flex: 1,
                  background: "transparent",
                  border: `0.5px solid ${BORDER_DASH}`,
                  color: INK_DIM,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
              <button
                onClick={handleBuildCustom}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  flex: 2,
                  background: "transparent",
                  border: `0.5px solid ${INK}`,
                  color: INK_BRIGHT,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Build this →
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
