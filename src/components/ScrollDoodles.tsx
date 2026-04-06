import { useEffect, useRef, useCallback } from 'react';

interface ScrollDoodlesProps {
  scrollYProgress: { get: () => number; on: (event: string, cb: (v: number) => void) => () => void };
}

interface Doodle {
  drawStart: number;
  drawEnd: number;
  draw: (ctx: CanvasRenderingContext2D, progress: number) => void;
}

// Helper: draw a path progressively
function tracePath(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  progress: number,
  close = false
) {
  if (points.length < 2 || progress <= 0) return;
  const totalSegs = points.length - 1 + (close ? 1 : 0);
  const drawn = progress * totalSegs;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (let i = 0; i < totalSegs; i++) {
    const nextIdx = (i + 1) % points.length;
    if (i < Math.floor(drawn)) {
      ctx.lineTo(points[nextIdx][0], points[nextIdx][1]);
    } else if (i < drawn) {
      const frac = drawn - i;
      const x = points[i % points.length][0] + (points[nextIdx][0] - points[i % points.length][0]) * frac;
      const y = points[i % points.length][1] + (points[nextIdx][1] - points[i % points.length][1]) * frac;
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function traceCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, progress: number) {
  if (progress <= 0) return;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2 * Math.min(progress, 1));
  ctx.stroke();
}

function traceLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, progress: number) {
  if (progress <= 0) return;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress);
  ctx.stroke();
}

function traceRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, progress: number) {
  tracePath(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], progress, true);
}

// --- LEFT DOODLES ---
function createLeftDoodles(baseY: number): Doodle[] {
  const doodles: Doodle[] = [];
  let y = baseY;
  const spacing = 90;

  // 1. Ruler
  doodles.push({
    drawStart: 0.0, drawEnd: 0.12,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(20, y);
      traceRect(ctx, 0, 0, 50, 16, p);
      traceLine(ctx, 10, 0, 10, 6, p);
      traceLine(ctx, 20, 0, 20, 10, p);
      traceLine(ctx, 30, 0, 30, 6, p);
      traceLine(ctx, 40, 0, 40, 10, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 2. Circuit board traces
  doodles.push({
    drawStart: 0.04, drawEnd: 0.18,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      tracePath(ctx, [[0, 0], [20, 0], [20, 15], [40, 15]], p);
      tracePath(ctx, [[0, 20], [15, 20], [15, 35], [50, 35]], p);
      tracePath(ctx, [[10, 40], [10, 50], [35, 50]], p);
      traceCircle(ctx, 40, 15, 3, p);
      traceCircle(ctx, 50, 35, 3, p);
      traceCircle(ctx, 35, 50, 3, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 3. Measurement grid
  doodles.push({
    drawStart: 0.08, drawEnd: 0.22,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(10, y);
      traceRect(ctx, 0, 0, 50, 50, p);
      for (let i = 1; i < 5; i++) {
        traceLine(ctx, i * 10, 0, i * 10, 50, p);
        traceLine(ctx, 0, i * 10, 50, i * 10, p);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 4. Server rack
  doodles.push({
    drawStart: 0.12, drawEnd: 0.28,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      traceRect(ctx, 0, 0, 40, 55, p);
      for (let i = 0; i < 4; i++) {
        traceRect(ctx, 4, 4 + i * 13, 32, 10, p);
        traceCircle(ctx, 30, 9 + i * 13, 2, p);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 5. Protractor
  doodles.push({
    drawStart: 0.16, drawEnd: 0.32,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(20, y);
      traceLine(ctx, 25, 40, 25, 10, p);
      if (p > 0) {
        ctx.beginPath();
        ctx.arc(25, 40, 30, Math.PI, Math.PI * 2 * Math.min(p, 1) + Math.PI);
        ctx.stroke();
      }
      traceLine(ctx, 10, 15, 25, 40, p);
      traceLine(ctx, 40, 15, 25, 40, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 6. Bar chart
  doodles.push({
    drawStart: 0.22, drawEnd: 0.38,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(12, y);
      traceLine(ctx, 0, 50, 55, 50, p);
      traceLine(ctx, 0, 0, 0, 50, p);
      const bars = [35, 20, 45, 15, 40];
      bars.forEach((h, i) => {
        const bx = 5 + i * 10;
        const by = 50 - h * p;
        tracePath(ctx, [[bx, 50], [bx, by], [bx + 7, by], [bx + 7, 50]], p);
      });
      ctx.restore();
    }
  });
  y += spacing;

  // 7. Curly braces / code
  doodles.push({
    drawStart: 0.28, drawEnd: 0.42,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      tracePath(ctx, [[20, 0], [12, 5], [12, 18], [5, 25], [12, 32], [12, 45], [20, 50]], p);
      tracePath(ctx, [[35, 0], [43, 5], [43, 18], [50, 25], [43, 32], [43, 45], [35, 50]], p);
      traceLine(ctx, 22, 15, 33, 15, p);
      traceLine(ctx, 22, 25, 30, 25, p);
      traceLine(ctx, 22, 35, 36, 35, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 8. Coffee cup
  doodles.push({
    drawStart: 0.34, drawEnd: 0.48,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(18, y);
      tracePath(ctx, [[5, 10], [5, 40], [10, 45], [30, 45], [35, 40], [35, 10]], p);
      if (p > 0.3) {
        ctx.beginPath();
        ctx.arc(40, 22, 8, -Math.PI / 2, Math.PI / 2 * Math.min((p - 0.3) / 0.7, 1));
        ctx.stroke();
      }
      // Steam
      if (p > 0.6) {
        const sp = (p - 0.6) / 0.4;
        tracePath(ctx, [[15, 10], [13, 3], [15, -2]], sp);
        tracePath(ctx, [[25, 10], [27, 2], [25, -4]], sp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 9. Lightbulb
  doodles.push({
    drawStart: 0.40, drawEnd: 0.55,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(20, y);
      traceCircle(ctx, 20, 18, 16, p);
      tracePath(ctx, [[12, 32], [12, 42], [28, 42], [28, 32]], p);
      traceLine(ctx, 14, 46, 26, 46, p);
      traceLine(ctx, 16, 50, 24, 50, p);
      // Rays
      if (p > 0.5) {
        const rp = (p - 0.5) / 0.5;
        traceLine(ctx, 20, -2, 20, -8, rp);
        traceLine(ctx, 38, 18, 44, 18, rp);
        traceLine(ctx, 2, 18, -4, 18, rp);
        traceLine(ctx, 34, 6, 38, 2, rp);
        traceLine(ctx, 6, 6, 2, 2, rp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 10. Pencil
  doodles.push({
    drawStart: 0.46, drawEnd: 0.60,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(25, y); ctx.rotate(-0.3);
      tracePath(ctx, [[0, 0], [8, 0], [8, 40], [4, 48], [0, 40]], p, true);
      traceLine(ctx, 0, 40, 8, 40, p);
      traceLine(ctx, 0, 6, 8, 6, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 11. Satellite
  doodles.push({
    drawStart: 0.52, drawEnd: 0.66,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      traceRect(ctx, 15, 15, 20, 15, p);
      traceLine(ctx, 15, 22, 0, 22, p);
      traceLine(ctx, 35, 22, 50, 22, p);
      traceRect(ctx, -5, 16, 10, 14, p);
      traceRect(ctx, 45, 16, 10, 14, p);
      traceLine(ctx, 25, 15, 25, 5, p);
      traceCircle(ctx, 25, 3, 3, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 12. Paper plane
  doodles.push({
    drawStart: 0.58, drawEnd: 0.72,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y); ctx.rotate(-0.2);
      tracePath(ctx, [[0, 20], [50, 0], [20, 25]], p, true);
      traceLine(ctx, 20, 25, 50, 0, p);
      traceLine(ctx, 20, 25, 18, 40, p);
      traceLine(ctx, 18, 40, 30, 28, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 13. Growth arrow
  doodles.push({
    drawStart: 0.64, drawEnd: 0.78,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      traceLine(ctx, 0, 45, 50, 45, p);
      traceLine(ctx, 0, 0, 0, 45, p);
      tracePath(ctx, [[5, 40], [15, 30], [25, 35], [35, 15], [48, 5]], p);
      if (p > 0.7) {
        const ap = (p - 0.7) / 0.3;
        traceLine(ctx, 48, 5, 40, 5, ap);
        traceLine(ctx, 48, 5, 48, 13, ap);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 14. Pi / equation
  doodles.push({
    drawStart: 0.70, drawEnd: 0.84,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(10, y);
      traceLine(ctx, 5, 8, 45, 8, p);
      tracePath(ctx, [[15, 8], [14, 20], [12, 35], [8, 42]], p);
      tracePath(ctx, [[35, 8], [35, 20], [35, 35], [35, 42]], p);
      // E=mc²
      if (p > 0.5) {
        const tp = (p - 0.5) / 0.5;
        tracePath(ctx, [[5, 52], [15, 52], [5, 52], [5, 58], [15, 58]], tp);
        traceLine(ctx, 18, 55, 22, 55, tp);
        tracePath(ctx, [[28, 52], [24, 52], [24, 58], [28, 58]], tp);
      }
      ctx.restore();
    }
  });

  return doodles;
}

// --- RIGHT DOODLES ---
function createRightDoodles(baseY: number): Doodle[] {
  const doodles: Doodle[] = [];
  let y = baseY;
  const spacing = 90;

  // 1. Crane
  doodles.push({
    drawStart: 0.0, drawEnd: 0.14,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(10, y);
      traceLine(ctx, 10, 55, 10, 0, p);
      traceLine(ctx, 10, 0, 50, 0, p);
      traceLine(ctx, 50, 0, 50, 10, p);
      traceLine(ctx, 50, 10, 45, 10, p);
      traceLine(ctx, 45, 10, 45, 30, p);
      traceLine(ctx, 5, 55, 15, 55, p);
      tracePath(ctx, [[0, 55], [10, 45], [20, 55]], p);
      // Cable
      if (p > 0.5) {
        const cp = (p - 0.5) / 0.5;
        traceLine(ctx, 45, 30, 45, 40, cp);
        traceRect(ctx, 40, 40, 10, 8, cp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 2. Building
  doodles.push({
    drawStart: 0.05, drawEnd: 0.20,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(8, y);
      traceRect(ctx, 5, 10, 35, 45, p);
      tracePath(ctx, [[5, 10], [22, 0], [40, 10]], p);
      // Windows
      if (p > 0.4) {
        const wp = (p - 0.4) / 0.6;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            traceRect(ctx, 9 + c * 11, 15 + r * 12, 6, 8, wp);
          }
        }
      }
      // Door
      if (p > 0.7) {
        const dp = (p - 0.7) / 0.3;
        traceRect(ctx, 16, 43, 12, 12, dp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 3. Gear
  doodles.push({
    drawStart: 0.10, drawEnd: 0.26,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      traceCircle(ctx, 22, 22, 10, p);
      traceCircle(ctx, 22, 22, 4, p);
      if (p > 0.3) {
        const tp = (p - 0.3) / 0.7;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 22 + Math.cos(angle) * 10;
          const y1 = 22 + Math.sin(angle) * 10;
          const x2 = 22 + Math.cos(angle) * 16;
          const y2 = 22 + Math.sin(angle) * 16;
          traceLine(ctx, x1, y1, x2, y2, tp);
        }
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 4. Hammer
  doodles.push({
    drawStart: 0.15, drawEnd: 0.30,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(18, y); ctx.rotate(0.15);
      traceLine(ctx, 15, 10, 15, 50, p);
      traceRect(ctx, 5, 0, 25, 12, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 5. Pie chart
  doodles.push({
    drawStart: 0.22, drawEnd: 0.38,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(12, y);
      traceCircle(ctx, 25, 25, 22, p);
      if (p > 0.3) {
        const sp = (p - 0.3) / 0.7;
        traceLine(ctx, 25, 25, 25, 3, sp);
        traceLine(ctx, 25, 25, 44, 15, sp);
        traceLine(ctx, 25, 25, 10, 42, sp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 6. Terminal window
  doodles.push({
    drawStart: 0.30, drawEnd: 0.44,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(5, y);
      traceRect(ctx, 0, 0, 55, 40, p);
      traceLine(ctx, 0, 10, 55, 10, p);
      traceCircle(ctx, 8, 5, 2, p);
      traceCircle(ctx, 16, 5, 2, p);
      traceCircle(ctx, 24, 5, 2, p);
      if (p > 0.5) {
        const tp = (p - 0.5) / 0.5;
        tracePath(ctx, [[8, 18], [16, 24], [8, 30]], tp);
        traceLine(ctx, 20, 30, 40, 30, tp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 7. Wrench
  doodles.push({
    drawStart: 0.36, drawEnd: 0.50,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y); ctx.rotate(-0.4);
      traceLine(ctx, 20, 8, 20, 45, p);
      if (p > 0.2) {
        const hp = (p - 0.2) / 0.8;
        traceCircle(ctx, 20, 8, 10, hp);
        tracePath(ctx, [[14, 2], [14, 14]], hp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 8. Rocket
  doodles.push({
    drawStart: 0.42, drawEnd: 0.58,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      tracePath(ctx, [[20, 0], [30, 15], [30, 40], [20, 50], [10, 40], [10, 15]], p, true);
      traceCircle(ctx, 20, 20, 5, p);
      if (p > 0.5) {
        const fp = (p - 0.5) / 0.5;
        tracePath(ctx, [[10, 35], [2, 42]], fp);
        tracePath(ctx, [[30, 35], [38, 42]], fp);
        tracePath(ctx, [[15, 50], [13, 58], [20, 54], [27, 58], [25, 50]], fp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 9. WiFi / antenna
  doodles.push({
    drawStart: 0.50, drawEnd: 0.64,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      traceLine(ctx, 22, 45, 22, 20, p);
      traceLine(ctx, 15, 45, 29, 45, p);
      if (p > 0.3) {
        const wp = (p - 0.3) / 0.7;
        ctx.beginPath(); ctx.arc(22, 20, 10, Math.PI * 1.2, Math.PI * 1.8, false);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(22, 20, 18, Math.PI * 1.25, Math.PI * 1.75, false);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(22, 20, 26, Math.PI * 1.3, Math.PI * 1.7, false);
        ctx.stroke();
      }
      traceCircle(ctx, 22, 20, 3, p);
      ctx.restore();
    }
  });
  y += spacing;

  // 10. Star
  doodles.push({
    drawStart: 0.56, drawEnd: 0.70,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(15, y);
      const pts: [number, number][] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 22 : 10;
        pts.push([22 + Math.cos(angle) * r, 22 + Math.sin(angle) * r]);
      }
      tracePath(ctx, pts, p, true);
      ctx.restore();
    }
  });
  y += spacing;

  // 11. Flowchart
  doodles.push({
    drawStart: 0.62, drawEnd: 0.78,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(8, y);
      traceRect(ctx, 12, 0, 26, 14, p);
      traceLine(ctx, 25, 14, 25, 22, p);
      // Diamond
      if (p > 0.3) {
        const dp = (p - 0.3) / 0.7;
        tracePath(ctx, [[25, 22], [40, 32], [25, 42], [10, 32]], dp, true);
        traceLine(ctx, 25, 42, 25, 50, dp);
        traceRect(ctx, 12, 50, 26, 14, dp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 12. Blueprint roll
  doodles.push({
    drawStart: 0.68, drawEnd: 0.82,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(10, y);
      traceRect(ctx, 0, 5, 45, 35, p);
      if (p > 0.2) {
        const rp = (p - 0.2) / 0.8;
        traceCircle(ctx, 48, 22, 8, rp);
        traceLine(ctx, 45, 5, 48, 14, rp);
        traceLine(ctx, 45, 40, 48, 30, rp);
      }
      // Detail lines
      if (p > 0.5) {
        const dp = (p - 0.5) / 0.5;
        traceLine(ctx, 5, 15, 35, 15, dp);
        traceLine(ctx, 5, 25, 30, 25, dp);
        traceLine(ctx, 5, 32, 20, 32, dp);
      }
      ctx.restore();
    }
  });
  y += spacing;

  // 13. Battery
  doodles.push({
    drawStart: 0.74, drawEnd: 0.88,
    draw: (ctx, p) => {
      ctx.save(); ctx.translate(18, y);
      traceRect(ctx, 5, 6, 30, 44, p);
      traceRect(ctx, 14, 0, 12, 6, p);
      // Charge bars
      if (p > 0.4) {
        const bp = (p - 0.4) / 0.6;
        for (let i = 0; i < 4; i++) {
          if (bp > i * 0.25) {
            const lp = Math.min((bp - i * 0.25) / 0.25, 1);
            traceRect(ctx, 9, 40 - i * 10, 22, 7, lp);
          }
        }
      }
      ctx.restore();
    }
  });

  return doodles;
}

const ScrollDoodles = ({ scrollYProgress }: ScrollDoodlesProps) => {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const getColors = useCallback(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const primaryRaw = style.getPropertyValue('--primary').trim();
    const goldRaw = style.getPropertyValue('--gold').trim();
    return {
      primary: `hsla(${primaryRaw}, 0.18)`,
      gold: `hsla(${goldRaw}, 0.14)`,
    };
  }, []);

  const render = useCallback((progress: number) => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!leftCanvas || !rightCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const colors = getColors();

    [leftCanvas, rightCanvas].forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const leftCtx = leftCanvas.getContext('2d');
    const rightCtx = rightCanvas.getContext('2d');
    if (!leftCtx || !rightCtx) return;

    // Parallax offsets
    const leftOffset = -progress * 400;
    const rightOffset = 50 - progress * 350;

    const leftDoodles = createLeftDoodles(40);
    const rightDoodles = createRightDoodles(80);

    // Draw left
    leftCtx.save();
    leftCtx.scale(dpr, dpr);
    leftCtx.translate(0, leftOffset);
    leftCtx.lineWidth = 1.2;
    leftCtx.lineCap = 'round';
    leftCtx.lineJoin = 'round';

    leftDoodles.forEach((d, i) => {
      if (progress < d.drawStart) return;
      const p = Math.min((progress - d.drawStart) / (d.drawEnd - d.drawStart), 1);
      leftCtx.strokeStyle = (i === 5 || i === 7) ? colors.gold : colors.primary;
      leftCtx.globalAlpha = p * 0.9;
      d.draw(leftCtx, p);
    });
    leftCtx.restore();

    // Draw right
    rightCtx.save();
    rightCtx.scale(dpr, dpr);
    rightCtx.translate(0, rightOffset);
    rightCtx.lineWidth = 1.2;
    rightCtx.lineCap = 'round';
    rightCtx.lineJoin = 'round';

    rightDoodles.forEach((d, i) => {
      if (progress < d.drawStart) return;
      const p = Math.min((progress - d.drawStart) / (d.drawEnd - d.drawStart), 1);
      rightCtx.strokeStyle = (i === 4 || i === 9) ? colors.gold : colors.primary;
      rightCtx.globalAlpha = p * 0.9;
      d.draw(rightCtx, p);
    });
    rightCtx.restore();
  }, [getColors]);

  useEffect(() => {
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      [leftCanvasRef.current, rightCanvasRef.current].forEach((canvas) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      });
      render(scrollYProgress.get());
    };

    resize();
    window.addEventListener('resize', resize);

    const unsub = scrollYProgress.on('change', (v: number) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => render(v));
    });

    return () => {
      window.removeEventListener('resize', resize);
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, render]);

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-10">
      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 w-[110px] h-full pointer-events-none z-[11]"
        style={{
          background: 'linear-gradient(to right, transparent 40%, hsl(var(--background)) 100%)',
        }}
      />
      {/* Right fade overlay */}
      <div className="absolute right-0 top-0 w-[110px] h-full pointer-events-none z-[11]"
        style={{
          background: 'linear-gradient(to left, transparent 40%, hsl(var(--background)) 100%)',
        }}
      />

      <canvas
        ref={leftCanvasRef}
        className="doodle-column absolute left-0 top-0 w-[90px] xl:w-[110px] h-full"
      />
      <canvas
        ref={rightCanvasRef}
        className="doodle-column absolute right-0 top-0 w-[90px] xl:w-[110px] h-full"
      />
    </div>
  );
};

export default ScrollDoodles;
