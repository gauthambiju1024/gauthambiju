import { useEffect, useRef, useState } from "react";

type Stroke = Array<[number, number]>;
type Sketch = { name: string; strokes: Stroke[] };
type Segment = [[number, number], [number, number]];
type PartSegments = Segment[][];

const INK = "hsl(38 50% 58%)";
const INK_BRIGHT = "hsl(38 55% 65%)";
const INK_HOT = "hsl(38 85% 72%)";
const INK_DIM = "hsl(38 35% 52%)";
const INK_BG = "hsl(38 45% 55%)";
const INK_FAINT = "hsl(38 30% 35%)";
const METAL = "hsl(38 45% 50%)";
const BELT_DARK = "hsl(160 22% 11%)";
const BELT_DARKER = "hsl(160 22% 9%)";
const BORDER_DASH = "hsl(38 40% 45%)";

const PRESETS: Sketch[] = [
  {
    name: "drone.v1",
    strokes: [
      [[100, 40], [140, 30], [180, 30], [220, 40]],
      [[100, 40], [80, 55], [80, 75]],
      [[220, 40], [240, 55], [240, 75]],
      [[140, 55], [180, 55]],
    ],
  },
  {
    name: "lamp.v3",
    strokes: [
      [[160, 20], [180, 20], [180, 40], [140, 40], [140, 20], [160, 20]],
      [[160, 40], [160, 80]],
      [[120, 80], [200, 80]],
    ],
  },
  {
    name: "phone.v2",
    strokes: [
      [[120, 20], [200, 20], [200, 90], [120, 90], [120, 20]],
      [[140, 30], [180, 30]],
      [[155, 82], [165, 82]],
    ],
  },
  {
    name: "chair.v1",
    strokes: [
      [[120, 30], [200, 30]],
      [[120, 30], [120, 60]],
      [[200, 30], [200, 60]],
      [[110, 60], [210, 60]],
      [[125, 60], [125, 90]],
      [[195, 60], [195, 90]],
    ],
  },
  {
    name: "rocket",
    strokes: [
      [[160, 15], [180, 40], [180, 75], [140, 75], [140, 40], [160, 15]],
      [[140, 75], [120, 90]],
      [[180, 75], [200, 90]],
    ],
  },
];

const NAV = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "projects", label: "Projects" },
  { key: "thinking", label: "Thinking" },
  { key: "skills", label: "Skills" },
  { key: "journey", label: "Journey" },
  { key: "writing", label: "Writing" },
  { key: "contact", label: "Contact" },
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
  const barsRef = useRef<SVGGElement>(null);

  const overallFillRef = useRef<SVGRectElement>(null);
  const overallPctRef = useRef<SVGTextElement>(null);
  const clockRef = useRef<SVGTSpanElement>(null);
  const etaRef = useRef<SVGTextElement>(null);
  const dutyRef = useRef<SVGTSpanElement>(null);
  const dispRef = useRef<SVGTSpanElement>(null);
  const msgRef = useRef<SVGTextElement>(null);
  const srcRef = useRef<SVGTSpanElement>(null);
  const prtRef = useRef<SVGTSpanElement>(null);
  const previewNameRef = useRef<SVGTextElement>(null);
  const previewCountRef = useRef<SVGTextElement>(null);

  const progressRef = useRef(0);
  const [currentSketch, setCurrentSketch] = useState<Sketch>(PRESETS[0]);
  const partsSmallRef = useRef<PartSegments>(strokesToParts(PRESETS[0].strokes, 26));
  const partsLargeRef = useRef<PartSegments>(strokesToParts(PRESETS[0].strokes, 52));

  const [popoverOpen, setPopoverOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customStrokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  useEffect(() => {
    partsSmallRef.current = strokesToParts(currentSketch.strokes, 26);
    partsLargeRef.current = strokesToParts(currentSketch.strokes, 52);
    if (srcRef.current) {
      srcRef.current.textContent = currentSketch.name.toUpperCase().replace(".", "-");
    }
    if (previewNameRef.current) {
      const totalVtx = currentSketch.strokes.reduce((a, s) => a + s.length, 0);
      previewNameRef.current.textContent = `${currentSketch.name.toUpperCase().replace(".", "-")} · ${totalVtx} vtx`;
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
    const bars = barsRef.current;
    if (!prod || !preview || !rollers || !arms || !sparks || !stations || !bars) return;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const BS = 40;
    const BE = 1140;
    const BL = BE - BS;
    const Y = 80;

    let rollersHtml = "";
    for (let rx = BS + 20; rx < BE; rx += 14) {
      rollersHtml += `<circle cx="${rx}" cy="${Y}" r="2.2" fill="${BELT_DARKER}" stroke="${METAL}" stroke-width="0.4"/>`;
      rollersHtml += `<circle cx="${rx}" cy="${Y}" r="0.8" fill="none" stroke="hsl(38 40% 48%)" stroke-width="0.3"/>`;
      rollersHtml += `<line class="h6-rm" data-cx="${rx}" x1="${rx}" y1="${Y - 1.6}" x2="${rx}" y2="${Y}" stroke="${INK_BRIGHT}" stroke-width="0.4"/>`;
    }
    rollers.innerHTML = rollersHtml;
    const rMarks = rollers.querySelectorAll<SVGLineElement>(".h6-rm");

    let stationsHtml = "";
    let barsHtml = "";
    for (let i = 0; i < 8; i++) {
      const x = BS + 50 + (i / 7) * (BL - 100);
      stationsHtml += `<line x1="${x}" y1="58" x2="${x}" y2="62" stroke="${INK_BG}" stroke-width="0.4" opacity="0.6"/>`;
      stationsHtml += `<line x1="${x}" y1="98" x2="${x}" y2="104" stroke="${INK_BG}" stroke-width="0.4" opacity="0.6"/>`;
      stationsHtml += `<circle class="h6-sd" data-i="${i}" cx="${x}" cy="108" r="1.4" fill="none" stroke="${INK_DIM}" stroke-width="0.5"/>`;
      stationsHtml += `<text class="h6-nv" data-i="${i}" data-jump="${i}" x="${x}" y="52" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="15" fill="${INK}" style="cursor:pointer">${NAV[i].label}</text>`;
      stationsHtml += `<text x="${x}" y="140" text-anchor="middle" font-family="monospace" font-size="5" fill="${INK_FAINT}" letter-spacing="0.8" opacity="0.85">0${i + 1} · ${NAV[i].key.toUpperCase()}</text>`;
      barsHtml += `<rect x="${x - 22}" y="128" width="44" height="1" fill="hsl(38 30% 32%)" opacity="0.6"/>`;
      barsHtml += `<rect class="h6-bar" data-i="${i}" x="${x - 22}" y="128" width="0" height="1" fill="${INK_BRIGHT}"/>`;
    }
    stations.innerHTML = stationsHtml;
    bars.innerHTML = barsHtml;
    const sDots = stations.querySelectorAll<SVGCircleElement>(".h6-sd");
    const navEls = stations.querySelectorAll<SVGTextElement>(".h6-nv");
    const barEls = bars.querySelectorAll<SVGRectElement>(".h6-bar");

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
    for (let i = 0; i < 8; i++) {
      const x = BS + 50 + (i / 7) * (BL - 100);
      armsHtml += `<g class="h6-arm" data-x="${x}">`;
      armsHtml += `<line x1="${x}" y1="22" x2="${x}" y2="58" stroke="hsl(38 35% 40%)" stroke-width="0.3" opacity="0.35"/>`;
      armsHtml += `<line class="h6-s1" x1="${x}" y1="58" x2="${x}" y2="64" stroke="${INK}" stroke-width="0.8"/>`;
      armsHtml += `<circle class="h6-j" cx="${x}" cy="64" r="0.8" fill="hsl(38 35% 38%)" stroke="${INK_BRIGHT}" stroke-width="0.3"/>`;
      armsHtml += `<line class="h6-s2" x1="${x}" y1="64" x2="${x}" y2="70" stroke="${INK}" stroke-width="0.7"/>`;
      armsHtml += `<circle class="h6-t" cx="${x}" cy="70" r="0.9" fill="none" stroke="${INK_BRIGHT}" stroke-width="0.5"/>`;
      armsHtml += `</g>`;
    }
    arms.innerHTML = armsHtml;
    const armEls = arms.querySelectorAll<SVGGElement>(".h6-arm");

    function renderProduct(stage: number, stageProg: number) {
      const parts = partsSmallRef.current;
      if (!parts || parts.length === 0) return;
      let html = "";
      for (let i = 0; i <= stage && i < parts.length; i++) {
        const op = i < stage ? 1 : Math.min(1, stageProg);
        html += `<g opacity="${op.toFixed(2)}">`;
        for (const seg of parts[i]) {
          html += `<line x1="${seg[0][0].toFixed(1)}" y1="${seg[0][1].toFixed(1)}" x2="${seg[1][0].toFixed(1)}" y2="${seg[1][1].toFixed(1)}" stroke="${INK_BRIGHT}" stroke-width="0.9" stroke-linecap="round"/>`;
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
          html += `<line x1="${seg[0][0].toFixed(1)}" y1="${seg[0][1].toFixed(1)}" x2="${seg[1][0].toFixed(1)}" y2="${seg[1][1].toFixed(1)}" stroke="${INK_BRIGHT}" stroke-width="1.1" stroke-linecap="round"/>`;
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
        const s = 0.5 + Math.random() * 0.8;
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("cx", String(x));
        c.setAttribute("cy", String(y));
        c.setAttribute("r", "0.3");
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
        const a = (t * 0.3 + i * 0.4) % (Math.PI * 2);
        rMarks[i].setAttribute("x2", String(cx + Math.sin(a) * 1.6));
        rMarks[i].setAttribute("y2", String(Y + Math.cos(a) * 1.6));
      }

      if (overallFillRef.current) {
        overallFillRef.current.setAttribute("height", String(140 * p));
      }
      if (overallPctRef.current) {
        overallPctRef.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
      }

      const prodX = BS + 50 + p * (BL - 100);
      prod!.setAttribute("transform", `translate(${prodX.toFixed(1)}, ${Y})`);

      const stage = Math.min(7, Math.floor(p * 8));
      const stageProg = p * 8 - stage;
      renderProduct(stage, stageProg);
      renderPreview(stage, stageProg);

      if (prtRef.current) {
        const partCount = Math.min(8, stage + (stageProg > 0 ? 1 : 0));
        prtRef.current.textContent = String(partCount).padStart(2, "0");
      }
      if (previewCountRef.current) {
        const partCount = Math.min(8, stage + (stageProg > 0 ? 1 : 0));
        previewCountRef.current.textContent = `${partCount} / 8 installed`;
      }

      for (let i = 0; i < sDots.length; i++) {
        const si = parseInt(sDots[i].getAttribute("data-i") || "0");
        if (si < stage) {
          sDots[i].setAttribute("fill", INK_BRIGHT);
          sDots[i].setAttribute("stroke", INK_BRIGHT);
          barEls[si].setAttribute("width", "44");
        } else if (si === stage) {
          sDots[i].setAttribute("fill", INK_BRIGHT);
          sDots[i].setAttribute("stroke", INK_BRIGHT);
          barEls[si].setAttribute("width", String(44 * stageProg));
        } else {
          sDots[i].setAttribute("fill", "none");
          sDots[i].setAttribute("stroke", INK_DIM);
          barEls[si].setAttribute("width", "0");
        }
        if (si === stage) {
          navEls[si].setAttribute("fill", "hsl(38 60% 72%)");
          navEls[si].setAttribute("font-weight", "500");
        } else if (si < stage) {
          navEls[si].setAttribute("fill", "hsl(38 50% 60%)");
          navEls[si].setAttribute("font-weight", "400");
        } else {
          navEls[si].setAttribute("fill", INK);
          navEls[si].setAttribute("font-weight", "400");
        }
      }

      for (let i = 0; i < armEls.length; i++) {
        const ax = parseFloat(armEls[i].getAttribute("data-x") || "0");
        const dist = Math.abs(ax - prodX);
        const close = dist < 30;
        const engage = dist < 6;
        const ext = close ? Math.max(0, 1 - dist / 30) : 0;
        const jit = engage ? Math.sin(t * 0.6) * 0.5 : 0;
        const s1 = armEls[i].querySelector(".h6-s1") as SVGLineElement;
        const s2 = armEls[i].querySelector(".h6-s2") as SVGLineElement;
        const j = armEls[i].querySelector(".h6-j") as SVGCircleElement;
        const tp = armEls[i].querySelector(".h6-t") as SVGCircleElement;
        const jY = 64 + ext * 3;
        const tY = 70 + ext * 4 + jit;
        s1.setAttribute("y2", String(jY));
        j.setAttribute("cy", String(jY));
        s2.setAttribute("y1", String(jY));
        s2.setAttribute("y2", String(tY));
        tp.setAttribute("cy", String(tY));
        tp.setAttribute("stroke", engage ? INK_HOT : INK_BRIGHT);
        if (engage && t % 5 === 0) emitSpark(ax, tY);
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
      if (etaRef.current) etaRef.current.textContent = `ETA ${(3.2 * (1 - p)).toFixed(1)}s`;
      if (dispRef.current) {
        if (p >= 0.99) {
          dispRef.current.textContent = "ok";
          dispRef.current.setAttribute("fill", "hsl(120 50% 55%)");
        } else {
          dispRef.current.textContent = "--";
          dispRef.current.setAttribute("fill", INK_DIM);
        }
      }
      if (msgRef.current) {
        msgRef.current.textContent =
          p >= 0.99
            ? "complete · delivered"
            : `building your ${currentSketch.name.split(".")[0]}`;
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
    <div className="sticky top-0 z-50" style={{ background: 'hsl(160 20% 14%)' }}>
      <div className="relative">
        <svg
          viewBox="0 0 1400 180"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          style={{ height: 'auto' }}
        >
          {/* OVERALL PROGRESS SPINE */}
          <g>
            <rect x="12" y="20" width="4" height="140" fill="none" stroke={INK_DIM} strokeWidth="0.4" />
            <rect x="12" y="20" width="4" height="140" fill="hsl(38 25% 20%)" opacity="0.5" />
            <rect ref={overallFillRef} x="12" y="20" width="4" height="0" fill={INK_BRIGHT} opacity="0.75" />
            <line x1="10" y1="20" x2="18" y2="20" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="10" y1="55" x2="16" y2="55" stroke={INK_DIM} strokeWidth="0.3" opacity="0.6" />
            <line x1="10" y1="90" x2="18" y2="90" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="10" y1="125" x2="16" y2="125" stroke={INK_DIM} strokeWidth="0.3" opacity="0.6" />
            <line x1="10" y1="160" x2="18" y2="160" stroke={INK_DIM} strokeWidth="0.4" />
            <text x="22" y="23" fontFamily="monospace" fontSize="4" fill={INK}>100</text>
            <text x="22" y="92" fontFamily="monospace" fontSize="4" fill={INK}>50</text>
            <text x="22" y="163" fontFamily="monospace" fontSize="4" fill={INK}>00</text>
            <rect x="8" y="67" width="12" height="6" fill="hsl(160 20% 14%)" stroke={INK_BRIGHT} strokeWidth="0.5" />
            <text
              ref={overallPctRef}
              x="14"
              y="72"
              fontFamily="monospace"
              fontSize="4.5"
              fill="hsl(38 65% 70%)"
              textAnchor="middle"
              fontWeight="500"
            >
              00
            </text>
            <text x="14" y="175" fontFamily="monospace" fontSize="3.5" fill={INK_DIM} textAnchor="middle" letterSpacing="0.5">
              OVR
            </text>
          </g>

          {/* Top/bottom dashed boundaries */}
          <line x1="40" y1="20" x2="1140" y2="20" stroke={INK} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.6" />
          <line x1="40" y1="160" x2="1140" y2="160" stroke={INK} strokeWidth="0.4" strokeDasharray="1 3" opacity="0.6" />

          {/* Top instrumentation */}
          <g fontFamily="monospace" fontSize="6" fill={INK_DIM} letterSpacing="1.2" opacity="0.85">
            <text x="40" y="13">GB · BUILD.OS</text>
            <text x="118" y="13" fill={INK_BRIGHT}>● LIVE</text>
            <text x="160" y="13">v4.6.2</text>
            <text x="202" y="13">TRQ·94</text>
            <text x="244" y="13">PWR·100</text>
            <text x="294" y="13">
              SRC·<tspan ref={srcRef} fill={INK_BRIGHT}>DRONE-V1</tspan>
            </text>
            <text x="374" y="13">
              PARTS·<tspan ref={prtRef} fill={INK_BRIGHT}>00</tspan>/08
            </text>
            <text x="1140" y="13" textAnchor="end">
              UTC <tspan ref={clockRef} fill={INK_BRIGHT}>14:23:07</tspan>
            </text>
            <text ref={etaRef} x="1070" y="13" textAnchor="end">ETA 3.2s</text>
            <text x="1014" y="13" textAnchor="end">OP·A7/B3/C1</text>
          </g>

          {/* BELT STRUCTURE */}
          <g>
            <rect x="40" y="62" width="1100" height="36" fill={BELT_DARK} stroke={METAL} strokeWidth="0.5" opacity="0.9" />
            <line x1="40" y1="68" x2="1140" y2="68" stroke={INK_BG} strokeWidth="0.6" opacity="0.7" />
            <line x1="40" y1="92" x2="1140" y2="92" stroke={INK_BG} strokeWidth="0.6" opacity="0.7" />
            <line x1="40" y1="72" x2="1140" y2="72" stroke="hsl(38 35% 38%)" strokeWidth="0.3" opacity="0.5" strokeDasharray="6 4" />
            <line x1="40" y1="88" x2="1140" y2="88" stroke="hsl(38 35% 38%)" strokeWidth="0.3" opacity="0.5" strokeDasharray="6 4" />

            <g ref={rollersRef} />

            {/* End rails */}
            <line x1="40" y1="62" x2="40" y2="98" stroke={INK} strokeWidth="0.7" />
            <line x1="1140" y1="62" x2="1140" y2="98" stroke={INK} strokeWidth="0.7" />

            {/* Roller-bearing housings */}
            <g transform="translate(40, 80)">
              <rect x="-4" y="-8" width="8" height="16" fill={BELT_DARKER} stroke={METAL} strokeWidth="0.5" />
              <line x1="-3" y1="-5" x2="3" y2="-5" stroke={METAL} strokeWidth="0.3" />
              <line x1="-3" y1="0" x2="3" y2="0" stroke={METAL} strokeWidth="0.3" />
              <line x1="-3" y1="5" x2="3" y2="5" stroke={METAL} strokeWidth="0.3" />
            </g>
            <g transform="translate(1140, 80)">
              <rect x="-4" y="-8" width="8" height="16" fill={BELT_DARKER} stroke={METAL} strokeWidth="0.5" />
              <line x1="-3" y1="-5" x2="3" y2="-5" stroke={METAL} strokeWidth="0.3" />
              <line x1="-3" y1="0" x2="3" y2="0" stroke={METAL} strokeWidth="0.3" />
              <line x1="-3" y1="5" x2="3" y2="5" stroke={METAL} strokeWidth="0.3" />
            </g>

            {/* Direction arrows */}
            <g fontFamily="monospace" fontSize="4" fill={INK_BG} opacity="0.6">
              <text x="20" y="80" textAnchor="middle" letterSpacing="0.4">IN</text>
              <text x="20" y="87" textAnchor="middle">◀</text>
            </g>
            <g fontFamily="monospace" fontSize="4" fill={INK_BG} opacity="0.6">
              <text x="1160" y="80" textAnchor="middle" letterSpacing="0.4">OUT</text>
              <text x="1160" y="87" textAnchor="middle">▶</text>
            </g>

            {/* Floor-mount bolts */}
            <g opacity="0.5">
              {[60, 400, 780, 1120].map((bx) => (
                <g key={bx}>
                  <circle cx={bx} cy={102} r={1} fill="none" stroke="hsl(38 35% 42%)" strokeWidth="0.4" />
                  <circle cx={bx} cy={102} r={0.3} fill="hsl(38 35% 42%)" />
                </g>
              ))}
            </g>
          </g>

          <g ref={stationsRef} />
          <g ref={prodRef} transform="translate(300, 80)" />
          <g ref={armsRef} />
          <g ref={sparksRef} />
          <g ref={barsRef} />

          {/* Intake / dispatch labels */}
          <g fontFamily="monospace" fontSize="5" fill={INK_DIM} letterSpacing="0.6" opacity="0.8">
            <text x="40" y="116">─── INTAKE</text>
            <text x="100" y="116" fill={INK_BRIGHT}>user·sketch</text>
            <text x="1140" y="116" textAnchor="end">
              dispatch·<tspan ref={dispRef} fill={INK_DIM}>--</tspan> ───
            </text>
            <text x="1040" y="116" textAnchor="end">field ready</text>
          </g>

          {/* Bottom metadata */}
          <g fontFamily="monospace" fontSize="5" fill={INK_FAINT} letterSpacing="0.5" opacity="0.75">
            <text x="40" y="175">ref GB.001 · rev 03</text>
            <text x="160" y="175">2026.04.09</text>
            <text x="230" y="175">cal·ok</text>
            <text x="270" y="175">
              duty·<tspan ref={dutyRef} fill={INK_BRIGHT}>00</tspan>%
            </text>
            <text ref={msgRef} x="1140" y="175" textAnchor="end">building your drone</text>
          </g>

          {/* COMPACT DESIGN BOX */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => setPopoverOpen((o) => !o)}
          >
            <rect x="1160" y="24" width="228" height="132" fill="none" stroke={INK_BRIGHT} strokeWidth="0.6" />
            <rect x="1162" y="26" width="224" height="128" fill="none" stroke={BORDER_DASH} strokeWidth="0.3" strokeDasharray="2 2" />

            <text x="1170" y="38" fontFamily="monospace" fontSize="6" fill={INK_BRIGHT} letterSpacing="1.2">
              ─── YOUR PRODUCT
            </text>

            <g ref={previewRef} transform="translate(1274, 88)" />

            {/* Corner crop marks */}
            <line x1="1232" y1="58" x2="1236" y2="58" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1232" y1="58" x2="1232" y2="62" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1316" y1="58" x2="1312" y2="58" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1316" y1="58" x2="1316" y2="62" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1232" y1="118" x2="1236" y2="118" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1232" y1="118" x2="1232" y2="114" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1316" y1="118" x2="1312" y2="118" stroke={INK_DIM} strokeWidth="0.4" />
            <line x1="1316" y1="118" x2="1316" y2="114" stroke={INK_DIM} strokeWidth="0.4" />

            <text ref={previewNameRef} x="1170" y="132" fontFamily="monospace" fontSize="4" fill={INK_DIM}>
              DRONE-V1 · 16 vtx
            </text>
            <text ref={previewCountRef} x="1378" y="132" fontFamily="monospace" fontSize="4" fill={INK_DIM} textAnchor="end">
              0 / 8 installed
            </text>

            <rect x="1170" y="138" width="208" height="11" fill={BELT_DARKER} stroke={INK} strokeWidth="0.4" />
            <text
              x="1274"
              y="146"
              fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic"
              fontSize="8"
              fill="hsl(38 60% 68%)"
              textAnchor="middle"
            >
              click to change → design yours ↗
            </text>
          </g>
        </svg>

        {popoverOpen && (
          <div
            className="absolute right-4 z-[60] rounded-md p-4"
            style={{
              top: '100%',
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
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: INK_FAINT,
                marginTop: 8,
                letterSpacing: "0.5px",
              }}
            >
              draw in 1-8 strokes · stroke order defines assembly sequence
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssemblyHeader;
