import { useEffect, useRef, useCallback } from 'react';

// ================================================================
// DENSE HAND-DRAWN ENGINEERING DOODLE BORDER ENGINE
// Ported from standalone HTML — exact same animation logic
// ================================================================

// Seeded RNG
function sRng(s: number) {
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ── HAND-DRAWN PRIMITIVES ──

function wLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, w = 1.2) {
  const d = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.max(3, Math.floor(d / 5));
  ctx.beginPath(); ctx.moveTo(x1, y1);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    ctx.lineTo(x1 + (x2 - x1) * t + (Math.random() - 0.5) * w, y1 + (y2 - y1) * t + (Math.random() - 0.5) * w);
  }
  ctx.stroke();
}

function wRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wb = 1.2) {
  wLine(ctx, x, y, x + w, y, wb); wLine(ctx, x + w, y, x + w, y + h, wb);
  wLine(ctx, x + w, y + h, x, y + h, wb); wLine(ctx, x, y + h, x, y, wb);
}

function wCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, wb = 0.8) {
  const pts = Math.max(12, Math.floor(r * 3));
  ctx.beginPath();
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const rr = r + (Math.random() - 0.5) * wb;
    const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.stroke();
}

function wArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, startA: number, endA: number, wb = 0.6) {
  const pts = Math.max(6, Math.floor(Math.abs(endA - startA) * r));
  ctx.beginPath();
  for (let i = 0; i <= pts; i++) {
    const a = startA + (endA - startA) * (i / pts);
    const rr = r + (Math.random() - 0.5) * wb;
    const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function wTriangle(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, wb = 1) {
  wLine(ctx, x1, y1, x2, y2, wb); wLine(ctx, x2, y2, x3, y3, wb); wLine(ctx, x3, y3, x1, y1, wb);
}

function dashed(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, dl = 3, gl = 3) {
  ctx.setLineDash([dl, gl]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
}

// ── DOODLE DRAWING FUNCTIONS ──

function drawGear(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, time: number) {
  const teeth = 7;
  const rot = time / 3000;
  ctx.strokeStyle = 'rgba(201,168,76,0.5)';
  ctx.lineWidth = 1;
  wCircle(ctx, x, y, r * 0.5, 0.4);
  wCircle(ctx, x, y, r * 0.15, 0.2);
  for (let t = 0; t < teeth; t++) {
    const a = (t / teeth) * Math.PI * 2 + rot;
    const ix = x + Math.cos(a) * r * 0.45, iy = y + Math.sin(a) * r * 0.45;
    const ox = x + Math.cos(a) * r * 0.85, oy = y + Math.sin(a) * r * 0.85;
    wLine(ctx, ix, iy, ox, oy, 0.4);
    const a1 = a - 0.15, a2 = a + 0.15;
    wLine(ctx, x + Math.cos(a1) * r * 0.85, y + Math.sin(a1) * r * 0.85, x + Math.cos(a2) * r * 0.85, y + Math.sin(a2) * r * 0.85, 0.3);
  }
}

function drawLightbulb(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.55)';
  ctx.lineWidth = 1;
  wArc(ctx, x, y - s * 0.3, s * 0.4, -Math.PI * 0.8, -Math.PI * 0.2, 0.5);
  wArc(ctx, x, y - s * 0.3, s * 0.4, -Math.PI * 0.2, Math.PI * 0.1, 0.5);
  wArc(ctx, x, y - s * 0.3, s * 0.4, -Math.PI * 0.8, -Math.PI * 1.1, 0.5);
  wLine(ctx, x - s * 0.15, y + s * 0.1, x + s * 0.15, y + s * 0.1, 0.3);
  wLine(ctx, x - s * 0.12, y + s * 0.18, x + s * 0.12, y + s * 0.18, 0.3);
  wLine(ctx, x - s * 0.08, y + s * 0.25, x + s * 0.08, y + s * 0.25, 0.3);
  ctx.strokeStyle = 'rgba(201,168,76,0.25)';
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.4;
    const ix = x + Math.cos(a) * s * 0.55, iy = y - s * 0.3 + Math.sin(a) * s * 0.55;
    const ox = x + Math.cos(a) * s * 0.75, oy = y - s * 0.3 + Math.sin(a) * s * 0.75;
    wLine(ctx, ix, iy, ox, oy, 0.3);
  }
}

function drawRocket(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(239,100,97,0.5)';
  ctx.lineWidth = 1;
  wLine(ctx, x, y - s * 0.6, x - s * 0.15, y + s * 0.2, 0.5);
  wLine(ctx, x, y - s * 0.6, x + s * 0.15, y + s * 0.2, 0.5);
  wArc(ctx, x, y - s * 0.45, s * 0.15, -Math.PI * 0.8, -Math.PI * 0.2, 0.4);
  wLine(ctx, x - s * 0.15, y + s * 0.2, x + s * 0.15, y + s * 0.2, 0.4);
  wLine(ctx, x - s * 0.15, y + s * 0.1, x - s * 0.25, y + s * 0.3, 0.4);
  wLine(ctx, x + s * 0.15, y + s * 0.1, x + s * 0.25, y + s * 0.3, 0.4);
  wCircle(ctx, x, y - s * 0.2, s * 0.06, 0.3);
  ctx.strokeStyle = 'rgba(201,168,76,0.3)';
  wLine(ctx, x - s * 0.05, y + s * 0.2, x - s * 0.08, y + s * 0.4, 0.5);
  wLine(ctx, x, y + s * 0.2, x, y + s * 0.45, 0.5);
  wLine(ctx, x + s * 0.05, y + s * 0.2, x + s * 0.08, y + s * 0.4, 0.5);
}

function drawCoffeeCup(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.45)';
  ctx.lineWidth = 1;
  wLine(ctx, x - s * 0.2, y - s * 0.1, x - s * 0.15, y + s * 0.25, 0.5);
  wLine(ctx, x + s * 0.2, y - s * 0.1, x + s * 0.15, y + s * 0.25, 0.5);
  wLine(ctx, x - s * 0.15, y + s * 0.25, x + s * 0.15, y + s * 0.25, 0.4);
  wLine(ctx, x - s * 0.2, y - s * 0.1, x + s * 0.2, y - s * 0.1, 0.4);
  wArc(ctx, x + s * 0.25, y + s * 0.05, s * 0.1, -Math.PI / 2, Math.PI / 2, 0.4);
  ctx.strokeStyle = 'rgba(201,168,76,0.2)';
  for (let i = 0; i < 3; i++) {
    const sx = x - s * 0.08 + i * s * 0.08;
    const base = y - s * 0.15;
    ctx.beginPath(); ctx.moveTo(sx, base);
    ctx.quadraticCurveTo(sx + (i % 2 ? 3 : -3), base - s * 0.15, sx, base - s * 0.3);
    ctx.stroke();
  }
}

function drawBarChart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rand: () => number) {
  ctx.strokeStyle = 'rgba(74,158,255,0.45)';
  ctx.lineWidth = 0.8;
  wLine(ctx, x - s * 0.35, y - s * 0.4, x - s * 0.35, y + s * 0.3, 0.4);
  wLine(ctx, x - s * 0.35, y + s * 0.3, x + s * 0.35, y + s * 0.3, 0.4);
  const bars = 4;
  const bw = (s * 0.6) / (bars * 1.5);
  for (let b = 0; b < bars; b++) {
    const bx = x - s * 0.3 + b * (bw * 1.5);
    const bh = (0.3 + rand() * 0.6) * s * 0.6;
    const colors = ['rgba(201,168,76,0.3)', 'rgba(74,158,255,0.25)', 'rgba(52,211,153,0.25)', 'rgba(239,100,97,0.25)'];
    ctx.fillStyle = colors[b % 4];
    ctx.fillRect(bx, y + s * 0.3 - bh, bw, bh);
    ctx.strokeRect(bx, y + s * 0.3 - bh, bw, bh);
  }
  ctx.strokeStyle = 'rgba(52,211,153,0.4)';
  wLine(ctx, x - s * 0.25, y + s * 0.1, x + s * 0.2, y - s * 0.25, 0.4);
  wLine(ctx, x + s * 0.2, y - s * 0.25, x + s * 0.12, y - s * 0.2, 0.3);
  wLine(ctx, x + s * 0.2, y - s * 0.25, x + s * 0.18, y - s * 0.15, 0.3);
}

function drawPieChart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.lineWidth = 1;
  const slices = [0.35, 0.25, 0.22, 0.18];
  const colors = ['rgba(201,168,76,0.25)', 'rgba(74,158,255,0.2)', 'rgba(52,211,153,0.2)', 'rgba(239,100,97,0.15)'];
  let startA = -Math.PI / 2;
  slices.forEach((sl, i) => {
    const endA = startA + sl * Math.PI * 2;
    ctx.fillStyle = colors[i];
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, startA, endA); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(201,168,76,0.4)';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(startA) * r, y + Math.sin(startA) * r); ctx.stroke();
    startA = endA;
  });
  wCircle(ctx, x, y, r, 0.5);
}

function drawWifi(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, time: number) {
  ctx.strokeStyle = 'rgba(74,158,255,0.4)';
  ctx.lineWidth = 0.8;
  ctx.fillStyle = 'rgba(74,158,255,0.5)';
  ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
  for (let i = 1; i <= 3; i++) {
    const alpha = 0.15 + Math.sin(time / 500 + i) * 0.1;
    ctx.globalAlpha = alpha * 2;
    wArc(ctx, x, y, s * 0.15 * i, -Math.PI * 0.75, -Math.PI * 0.25, 0.4);
  }
  ctx.globalAlpha = 1;
}

function drawBrackets(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(52,211,153,0.4)';
  ctx.lineWidth = 1;
  ctx.font = `${s * 0.35}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = 'rgba(52,211,153,0.35)';
  ctx.fillText('{ }', x - s * 0.25, y + s * 0.1);
}

function drawCodeSnippet(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.font = `${Math.max(4, s * 0.12)}px 'JetBrains Mono', monospace`;
  const lines = ['fn main()', '  let x = 42;', '  loop {', '    build();', '  }'];
  lines.forEach((ln, i) => {
    ctx.fillStyle = i === 0 ? 'rgba(201,168,76,0.3)' : i === 3 ? 'rgba(52,211,153,0.25)' : 'rgba(138,138,138,0.25)';
    ctx.fillText(ln, x - s * 0.3, y - s * 0.2 + i * s * 0.12);
  });
}

function drawFlowchart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.4)';
  ctx.lineWidth = 0.8;
  wCircle(ctx, x, y - s * 0.35, s * 0.08, 0.3);
  wLine(ctx, x, y - s * 0.27, x, y - s * 0.15, 0.3);
  const dy = y - s * 0.05;
  wLine(ctx, x, dy - s * 0.1, x + s * 0.12, dy, 0.4);
  wLine(ctx, x + s * 0.12, dy, x, dy + s * 0.1, 0.4);
  wLine(ctx, x, dy + s * 0.1, x - s * 0.12, dy, 0.4);
  wLine(ctx, x - s * 0.12, dy, x, dy - s * 0.1, 0.4);
  wLine(ctx, x + s * 0.12, dy, x + s * 0.25, dy, 0.3);
  wLine(ctx, x, dy + s * 0.1, x, dy + s * 0.25, 0.3);
  wRect(ctx, x + s * 0.18, dy - s * 0.05, s * 0.15, s * 0.1, 0.3);
  wRect(ctx, x - s * 0.08, dy + s * 0.25, s * 0.16, s * 0.1, 0.3);
  ctx.font = `${Math.max(3, s * 0.06)}px JetBrains Mono, monospace`;
  ctx.fillStyle = 'rgba(201,168,76,0.3)';
  ctx.fillText('Y', x + s * 0.16, dy - 0.5);
  ctx.fillText('N', x + 2, dy + s * 0.23);
}

function drawBattery(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, progress: number) {
  ctx.strokeStyle = 'rgba(52,211,153,0.45)';
  ctx.lineWidth = 1;
  wRect(ctx, x - s * 0.15, y - s * 0.2, s * 0.3, s * 0.5, 0.5);
  wRect(ctx, x - s * 0.06, y - s * 0.25, s * 0.12, s * 0.06, 0.3);
  const fillH = s * 0.42 * progress;
  ctx.fillStyle = progress > 0.6 ? 'rgba(52,211,153,0.2)' : progress > 0.3 ? 'rgba(201,168,76,0.2)' : 'rgba(239,100,97,0.2)';
  ctx.fillRect(x - s * 0.13, y + s * 0.27 - fillH, s * 0.26, fillH);
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.4)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 4;
    wLine(ctx, x - Math.cos(a) * r, y - Math.sin(a) * r, x + Math.cos(a) * r, y + Math.sin(a) * r, 0.3);
  }
}

function drawArrowUp(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(52,211,153,0.4)';
  ctx.lineWidth = 1;
  wLine(ctx, x, y + s * 0.3, x, y - s * 0.3, 0.5);
  wLine(ctx, x, y - s * 0.3, x - s * 0.12, y - s * 0.15, 0.4);
  wLine(ctx, x, y - s * 0.3, x + s * 0.12, y - s * 0.15, 0.4);
}

function drawCheckbox(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, checked: boolean) {
  ctx.strokeStyle = 'rgba(201,168,76,0.4)';
  ctx.lineWidth = 1;
  wRect(ctx, x - s * 0.12, y - s * 0.12, s * 0.24, s * 0.24, 0.5);
  if (checked) {
    ctx.strokeStyle = 'rgba(52,211,153,0.5)';
    wLine(ctx, x - s * 0.06, y, x - s * 0.01, y + s * 0.07, 0.4);
    wLine(ctx, x - s * 0.01, y + s * 0.07, x + s * 0.08, y - s * 0.06, 0.4);
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(74,158,255,0.3)';
  ctx.lineWidth = 0.8;
  wArc(ctx, x, y, s * 0.2, Math.PI, 0, 0.4);
  wArc(ctx, x - s * 0.15, y + s * 0.02, s * 0.12, Math.PI * 0.8, Math.PI * 0.1, 0.3);
  wArc(ctx, x + s * 0.15, y + s * 0.02, s * 0.14, Math.PI * 0.9, Math.PI * 0.15, 0.3);
  wLine(ctx, x - s * 0.25, y + s * 0.08, x + s * 0.27, y + s * 0.08, 0.3);
  ctx.strokeStyle = 'rgba(201,168,76,0.3)';
  wLine(ctx, x, y + s * 0.08, x, y + s * 0.25, 0.3);
  wLine(ctx, x, y + s * 0.08, x - s * 0.06, y + s * 0.14, 0.3);
  wLine(ctx, x, y + s * 0.08, x + s * 0.06, y + s * 0.14, 0.3);
}

function drawMagnifier(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.4)';
  ctx.lineWidth = 1;
  wCircle(ctx, x, y, s * 0.18, 0.4);
  wLine(ctx, x + s * 0.13, y + s * 0.13, x + s * 0.28, y + s * 0.28, 0.5);
}

function drawPaperPlane(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.35)';
  ctx.lineWidth = 0.8;
  wLine(ctx, x - s * 0.25, y + s * 0.05, x + s * 0.25, y - s * 0.15, 0.4);
  wLine(ctx, x + s * 0.25, y - s * 0.15, x - s * 0.05, y + s * 0.1, 0.4);
  wLine(ctx, x - s * 0.05, y + s * 0.1, x - s * 0.25, y + s * 0.05, 0.4);
  wLine(ctx, x - s * 0.05, y + s * 0.1, x + s * 0.05, y, 0.3);
}

function drawFormula(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.font = `italic ${Math.max(5, s * 0.16)}px 'Instrument Serif', serif`;
  ctx.fillStyle = 'rgba(201,168,76,0.3)';
  const formulas = ['E = mc²', 'f(x) = ∫dx', 'Σ aₙxⁿ', '∇·F = ρ', 'λ = h/p'];
  ctx.fillText(formulas[Math.floor(Math.random() * formulas.length)], x - s * 0.25, y);
}

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.3)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.12, y); ctx.quadraticCurveTo(x - s * 0.05, y - s * 0.08, x, y);
  ctx.quadraticCurveTo(x + s * 0.05, y - s * 0.08, x + s * 0.12, y);
  ctx.stroke();
}

function drawTarget(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.strokeStyle = 'rgba(239,100,97,0.35)';
  ctx.lineWidth = 0.8;
  wCircle(ctx, x, y, r, 0.4);
  wCircle(ctx, x, y, r * 0.6, 0.3);
  wCircle(ctx, x, y, r * 0.2, 0.2);
  dashed(ctx, x - r * 1.2, y, x + r * 1.2, y, 2, 3);
  dashed(ctx, x, y - r * 1.2, x, y + r * 1.2, 2, 3);
}

function drawKanban(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.35)';
  ctx.lineWidth = 0.8;
  const cols = 3, cw = s * 0.22, ch = s * 0.5;
  for (let c = 0; c < cols; c++) {
    const cx2 = x - s * 0.35 + c * (cw + 3);
    wRect(ctx, cx2, y - ch / 2, cw, ch, 0.4);
    const cards = 2 - (c === 2 ? 1 : 0);
    for (let ca = 0; ca < cards; ca++) {
      ctx.fillStyle = ['rgba(201,168,76,0.1)', 'rgba(74,158,255,0.08)', 'rgba(52,211,153,0.08)'][c];
      const cy = y - ch / 2 + 4 + ca * 12;
      ctx.fillRect(cx2 + 2, cy, cw - 4, 8);
      wRect(ctx, cx2 + 2, cy, cw - 4, 8, 0.3);
    }
  }
}

function drawServerRack(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.45)';
  ctx.lineWidth = 1;
  wRect(ctx, x - s * 0.2, y - s * 0.4, s * 0.4, s * 0.8, 0.6);
  const slots = 5;
  for (let sl = 0; sl < slots; sl++) {
    const sy = y - s * 0.35 + sl * (s * 0.7 / slots);
    wLine(ctx, x - s * 0.17, sy, x + s * 0.17, sy, 0.3);
    const ledColors = ['rgba(52,211,153,0.6)', 'rgba(74,158,255,0.5)', 'rgba(201,168,76,0.4)'];
    for (let l = 0; l < 3; l++) {
      ctx.fillStyle = ledColors[l];
      ctx.beginPath(); ctx.arc(x - s * 0.12 + l * 5, sy + 3, 1, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// ── BUILDING & SCENE GENERATORS ──

interface Bld {
  x: number; w: number; h: number; groundY: number; floors: number;
  winStyle: number; roofType: number; hasAntenna: boolean; antH: number;
  hasSignal: boolean; hasChimney: boolean; chimX: number; chimH: number;
  hasSmoke: boolean; hasFlag: boolean; hasDoor: boolean;
}

interface DoodleData {
  type: string; x: number; yPct: number; size: number; seed: number; yScreen: number;
}

function genBuildings(seed: number, cw: number, ch: number): Bld[] {
  const r = sRng(seed);
  const blds: Bld[] = [];
  let cx = 2;
  while (cx < cw - 4) {
    const w = 12 + r() * 22;
    if (cx + w > cw - 2) break;
    const h = 50 + r() * 250;
    blds.push({
      x: cx, w, h, groundY: ch, floors: Math.floor(h / 20), winStyle: Math.floor(r() * 3),
      roofType: Math.floor(r() * 4), hasAntenna: r() > 0.5, antH: 6 + r() * 16,
      hasSignal: r() > 0.55, hasChimney: r() > 0.55, chimX: w * 0.2 + r() * w * 0.5,
      chimH: 6 + r() * 10, hasSmoke: r() > 0.6, hasFlag: r() > 0.8, hasDoor: r() > 0.35,
    });
    cx += w + 1 + r() * 4;
  }
  blds.sort((a, b) => a.h - b.h);
  return blds;
}

function genDoodles(seed: number, cw: number, _ch: number): DoodleData[] {
  const r = sRng(seed);
  const doodles: DoodleData[] = [];
  const types = ['gear', 'bulb', 'rocket', 'coffee', 'barChart', 'pie', 'wifi', 'brackets', 'code',
    'flowchart', 'battery', 'star', 'arrow', 'checkbox', 'cloud', 'magnifier',
    'plane', 'formula', 'bird', 'target', 'kanban', 'server'];
  const count = 28 + Math.floor(r() * 12);
  for (let i = 0; i < count; i++) {
    doodles.push({
      type: types[Math.floor(r() * types.length)],
      x: 8 + r() * (cw - 16),
      yPct: i / count,
      size: 20 + r() * 28,
      seed: Math.floor(r() * 9999),
      yScreen: 0,
    });
  }
  doodles.sort((a, b) => a.yPct - b.yPct);
  return doodles;
}

// ── SCENE DRAWING ──

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(201,168,76,0.35)'; ctx.lineWidth = 1.5;
  wLine(ctx, 0, h - 1, w, h - 1, 0.3);
  ctx.strokeStyle = 'rgba(201,168,76,0.12)'; ctx.lineWidth = 0.5;
  for (let tx = 5; tx < w; tx += 8) wLine(ctx, tx, h - 1, tx, h - 4, 0.1);
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  if (p < 0.03) return;
  const gP = Math.min(1, p * 2.5);
  ctx.strokeStyle = `rgba(201,168,76,${0.025 * gP})`;
  ctx.lineWidth = 0.5;
  for (let x = 10; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  const gH = h * gP;
  for (let y = h; y > h - gH; y -= 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
}

function elP(i: number, total: number, sp: number): number {
  const start = (i / total) * 0.82;
  const end = start + (1 / total) * 1.4;
  return Math.max(0, Math.min(1, (sp - start) / (end - start)));
}

function drawBld(ctx: CanvasRenderingContext2D, b: Bld, p: number, time: number) {
  if (p <= 0) return;
  p = Math.min(1, p);
  const baseY = b.groundY;
  const revH = b.h * Math.min(p * 1.25, 1);
  const topY = baseY - revH;

  ctx.strokeStyle = 'rgba(201,168,76,0.4)';
  ctx.lineWidth = 1;
  wRect(ctx, b.x, topY, b.w, revH, 0.6);

  if (p > 0.2) {
    const wP = (p - 0.2) / 0.6;
    const vf = Math.floor(b.floors * Math.min(wP * 1.4, 1));
    const m = 3, ws = 4;
    for (let f = 0; f < vf && f < b.floors; f++) {
      const fy = baseY - (f + 1) * (revH / b.floors) + 3;
      if (fy < topY + 3) continue;
      if (b.winStyle === 0) {
        const cols = Math.max(1, Math.floor((b.w - m * 2) / (ws + 2)));
        for (let c = 0; c < cols; c++) {
          const wx = b.x + m + c * (ws + 2);
          ctx.strokeStyle = 'rgba(201,168,76,0.25)';
          wRect(ctx, wx, fy, ws, ws, 0.3);
          if ((f + c) % 4 === 0) { ctx.fillStyle = 'rgba(201,168,76,0.06)'; ctx.fillRect(wx, fy, ws, ws); }
        }
      } else if (b.winStyle === 1) {
        ctx.strokeStyle = 'rgba(201,168,76,0.2)';
        wRect(ctx, b.x + m, fy, b.w - m * 2, 3, 0.3);
      } else {
        const cols = Math.max(1, Math.floor((b.w - m * 2) / 5));
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = (f + c) % 2 === 0 ? 'rgba(201,168,76,0.25)' : 'rgba(74,158,255,0.2)';
          ctx.beginPath(); ctx.arc(b.x + m + 2 + c * 5, fy + 2, 1.2, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  }

  if (b.hasDoor && p > 0.15) {
    const dw = Math.min(7, b.w * 0.3), dh = 9;
    const dx = b.x + (b.w - dw) / 2;
    ctx.strokeStyle = 'rgba(201,168,76,0.35)';
    wRect(ctx, dx, baseY - dh, dw, dh, 0.4);
    ctx.fillStyle = 'rgba(201,168,76,0.4)';
    ctx.beginPath(); ctx.arc(dx + dw - 2, baseY - dh / 2, 0.8, 0, Math.PI * 2); ctx.fill();
  }

  if (p > 0.7) {
    const rP = (p - 0.7) / 0.3;
    ctx.globalAlpha = rP;
    ctx.strokeStyle = 'rgba(201,168,76,0.4)';
    if (b.roofType === 1) {
      wTriangle(ctx, b.x - 1, topY, b.x + b.w / 2, topY - 10 * rP, b.x + b.w + 1, topY, 0.5);
    } else if (b.roofType === 3) {
      wArc(ctx, b.x + b.w / 2, topY, b.w / 2, Math.PI, 0, 0.5);
    }
    ctx.globalAlpha = 1;
  }

  if (p > 0.82) {
    const dP = (p - 0.82) / 0.18;
    ctx.globalAlpha = dP;

    if (b.hasAntenna) {
      const ax = b.x + b.w / 2;
      ctx.strokeStyle = 'rgba(201,168,76,0.45)';
      wLine(ctx, ax, topY, ax, topY - b.antH * dP, 0.3);
      ctx.fillStyle = 'rgba(239,100,97,0.6)';
      ctx.beginPath(); ctx.arc(ax, topY - b.antH * dP, 1.2, 0, Math.PI * 2); ctx.fill();
      if (b.hasSignal && dP > 0.5) {
        ctx.strokeStyle = 'rgba(74,158,255,0.2)';
        for (let w2 = 0; w2 < 3; w2++) {
          const rr = 3 + w2 * 4 + Math.sin(time / 600 + w2) * 1.5;
          wArc(ctx, ax, topY - b.antH * dP, rr, -Math.PI * 0.75, -Math.PI * 0.25, 0.3);
        }
      }
    }

    if (b.hasChimney) {
      const cx2 = b.x + b.chimX;
      ctx.strokeStyle = 'rgba(201,168,76,0.4)';
      wRect(ctx, cx2, topY - b.chimH * dP, 5, b.chimH * dP, 0.4);
      if (b.hasSmoke && dP > 0.5) {
        ctx.strokeStyle = 'rgba(201,168,76,0.15)';
        const smokeB = topY - b.chimH * dP;
        for (let s2 = 0; s2 < 3; s2++) {
          const sx = cx2 + 2.5 + Math.sin(time / 700 + s2) * 3;
          const sy = smokeB - 4 - s2 * 7;
          wCircle(ctx, sx, sy, 2 + s2 * 0.8, 0.4);
        }
      }
    }

    if (b.hasFlag) {
      const fx = b.x + b.w - 3;
      ctx.strokeStyle = 'rgba(201,168,76,0.4)';
      wLine(ctx, fx, topY, fx, topY - 11 * dP, 0.2);
      ctx.fillStyle = 'rgba(201,168,76,0.3)';
      ctx.beginPath(); ctx.moveTo(fx, topY - 11 * dP); ctx.lineTo(fx + 6, topY - 8 * dP); ctx.lineTo(fx, topY - 5 * dP); ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}

function drawConnections(ctx: CanvasRenderingContext2D, blds: Bld[], _w: number, _h: number, p: number, _time: number) {
  if (p < 0.45) return;
  const cP = (p - 0.45) / 0.55;
  ctx.strokeStyle = `rgba(74,158,255,${0.1 * cP})`;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 4]);
  for (let i = 0; i < blds.length - 1; i++) {
    const a = blds[i], b = blds[i + 1];
    const aP2 = elP(i, blds.length, p), bP2 = elP(i + 1, blds.length, p);
    if (aP2 < 0.4 || bP2 < 0.4) continue;
    const aTop = a.groundY - a.h * Math.min(p * 1.25, 1) + 8;
    const bTop = b.groundY - b.h * Math.min(p * 1.25, 1) + 8;
    ctx.beginPath();
    ctx.moveTo(a.x + a.w / 2, aTop);
    ctx.quadraticCurveTo((a.x + a.w / 2 + b.x + b.w / 2) / 2, Math.min(aTop, bTop) - 12, b.x + b.w / 2, bTop);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, time: number, seed: number) {
  if (p < 0.25) return;
  const pP = (p - 0.25) / 0.75;
  const r = sRng(seed);
  const count = Math.floor(12 * pP);
  for (let i = 0; i < count; i++) {
    const px = r() * w;
    const by = h - r() * h * pP + Math.sin(time / 900 + i * 1.7) * 5;
    const sz = 0.5 + r() * 1.2;
    ctx.fillStyle = i % 3 === 0 ? `rgba(201,168,76,${0.25 * pP})` : i % 3 === 1 ? `rgba(74,158,255,${0.2 * pP})` : `rgba(52,211,153,${0.18 * pP})`;
    ctx.beginPath(); ctx.arc(px, by, sz, 0, Math.PI * 2); ctx.fill();
  }
}

function drawDoodle(ctx: CanvasRenderingContext2D, d: DoodleData, alpha: number, time: number, scrollP: number) {
  ctx.globalAlpha = alpha;
  const r = sRng(d.seed);
  const s = d.size;
  const x = d.x, y = d.yScreen;

  switch (d.type) {
    case 'gear': drawGear(ctx, x, y, s * 0.4, time); break;
    case 'bulb': drawLightbulb(ctx, x, y, s); break;
    case 'rocket': drawRocket(ctx, x, y, s); break;
    case 'coffee': drawCoffeeCup(ctx, x, y, s); break;
    case 'barChart': drawBarChart(ctx, x, y, s, r); break;
    case 'pie': drawPieChart(ctx, x, y, s * 0.3); break;
    case 'wifi': drawWifi(ctx, x, y, s, time); break;
    case 'brackets': drawBrackets(ctx, x, y, s); break;
    case 'code': drawCodeSnippet(ctx, x, y, s); break;
    case 'flowchart': drawFlowchart(ctx, x, y, s); break;
    case 'battery': drawBattery(ctx, x, y, s, scrollP); break;
    case 'star': drawStar(ctx, x, y, s * 0.2); break;
    case 'arrow': drawArrowUp(ctx, x, y, s); break;
    case 'checkbox': drawCheckbox(ctx, x, y, s, scrollP > 0.7); break;
    case 'cloud': drawCloud(ctx, x, y, s); break;
    case 'magnifier': drawMagnifier(ctx, x, y, s); break;
    case 'plane': drawPaperPlane(ctx, x, y, s); break;
    case 'formula': drawFormula(ctx, x, y, s); break;
    case 'bird': drawBird(ctx, x, y, s); break;
    case 'target': drawTarget(ctx, x, y, s * 0.25); break;
    case 'kanban': drawKanban(ctx, x, y, s); break;
    case 'server': drawServerRack(ctx, x, y, s); break;
  }
  ctx.globalAlpha = 1;
}

function drawSide(ctx: CanvasRenderingContext2D, blds: Bld[], doodles: DoodleData[], w: number, h: number, sp: number, time: number) {
  const total = blds.length;
  blds.forEach((b, i) => {
    const bp = elP(i, total, sp);
    drawBld(ctx, b, bp, time);
  });

  const dTotal = doodles.length;
  doodles.forEach((d, i) => {
    const dStart = (i / dTotal) * 0.9;
    const dEnd = dStart + (1 / dTotal) * 1.6;
    const dP = Math.max(0, Math.min(1, (sp - dStart) / (dEnd - dStart)));
    if (dP <= 0) return;

    const yRange = h * 0.85;
    d.yScreen = h - 10 - d.yPct * yRange;

    const alpha = Math.min(1, dP * 1.5) * 0.85;
    drawDoodle(ctx, d, alpha, time, sp);
  });

  drawConnections(ctx, blds, w, h, sp, time);
}

// ── RESPONSIVE BORDER WIDTH ──

function getBorderWidth(): number {
  const vw = window.innerWidth;
  if (vw < 768) return 50;
  if (vw < 1280) return 80;
  if (vw < 1536) return 100;
  return 110;
}

// ── MAIN COMPONENT ──

const ScrollDoodles = () => {
  const canvasLRef = useRef<HTMLCanvasElement>(null);
  const canvasRRef = useRef<HTMLCanvasElement>(null);
  const borderWRef = useRef(getBorderWidth());
  const dataRef = useRef<{
    lBlds: Bld[]; rBlds: Bld[]; lDoodles: DoodleData[]; rDoodles: DoodleData[];
  } | null>(null);
  const rafRef = useRef<number>(0);

  const initData = useCallback((w: number, h: number) => {
    dataRef.current = {
      lBlds: genBuildings(42, w, h),
      rBlds: genBuildings(137, w, h),
      lDoodles: genDoodles(303, w, h),
      rDoodles: genDoodles(707, w, h),
    };
  }, []);

  useEffect(() => {
    const cL = canvasLRef.current;
    const cR = canvasRRef.current;
    if (!cL || !cR) return;

    const DPR = window.devicePixelRatio || 1;

    function resize() {
      if (!cL || !cR) return;
      borderWRef.current = getBorderWidth();
      const bw = borderWRef.current;
      cL.style.width = `${bw}px`;
      cR.style.width = `${bw}px`;
      cL.width = bw * DPR;
      cL.height = window.innerHeight * DPR;
      cR.width = bw * DPR;
      cR.height = window.innerHeight * DPR;
      cL.getContext('2d')!.setTransform(DPR, 0, 0, DPR, 0, 0);
      cR.getContext('2d')!.setTransform(DPR, 0, 0, DPR, 0, 0);
      initData(bw, window.innerHeight);
    }

    resize();

    const xL = cL.getContext('2d')!;
    const xR = cR.getContext('2d')!;

    function getSP() {
      return Math.min(1, Math.max(0, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)));
    }

    function render() {
      const sp = getSP();
      const time = Date.now();
      const w = borderWRef.current;
      const h = window.innerHeight;
      const data = dataRef.current;
      if (!data) return;

      xL.clearRect(0, 0, w, h);
      xR.clearRect(0, 0, w, h);

      drawGrid(xL, w, h, sp);
      drawGrid(xR, w, h, sp);

      drawGround(xL, w, h);
      drawGround(xR, w, h);

      drawSide(xL, data.lBlds, data.lDoodles, w, h, sp, time);
      drawSide(xR, data.rBlds, data.rDoodles, w, h, sp, time);

      drawParticles(xL, w, h, sp, time, 99);
      drawParticles(xR, w, h, sp, time, 202);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initData]);

  const bw = getBorderWidth();

  // Hide on very small screens
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      <canvas
        ref={canvasLRef}
        className="fixed top-0 left-0 z-10 pointer-events-none"
        style={{ width: bw, height: '100vh' }}
      />
      {/* Left fade overlay */}
      <div
        className="fixed top-0 left-0 z-10 pointer-events-none h-screen"
        style={{
          width: bw,
          background: 'linear-gradient(to right, transparent 50%, hsl(var(--background)) 100%)',
        }}
      />
      <canvas
        ref={canvasRRef}
        className="fixed top-0 right-0 z-10 pointer-events-none"
        style={{ width: bw, height: '100vh' }}
      />
      {/* Right fade overlay */}
      <div
        className="fixed top-0 right-0 z-10 pointer-events-none h-screen"
        style={{
          width: bw,
          background: 'linear-gradient(to left, transparent 50%, hsl(var(--background)) 100%)',
        }}
      />
    </>
  );
};

export default ScrollDoodles;
