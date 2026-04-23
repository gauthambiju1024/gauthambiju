import * as THREE from "three";

let _wood: THREE.CanvasTexture | null = null;
let _grid: THREE.CanvasTexture | null = null;
let _cork: THREE.CanvasTexture | null = null;
let _leather: THREE.CanvasTexture | null = null;
let _paper: THREE.CanvasTexture | null = null;
let _alpha: THREE.CanvasTexture | null = null;

const make = (size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) => {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
};

export const woodTexture = () => {
  if (_wood) return _wood;
  _wood = make(512, (ctx, s) => {
    const grad = ctx.createLinearGradient(0, 0, 0, s);
    grad.addColorStop(0, "#3a2618");
    grad.addColorStop(1, "#27170d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 240; i++) {
      const y = Math.random() * s;
      const w = 0.5 + Math.random() * 1.5;
      ctx.strokeStyle = `rgba(${20 + Math.random() * 40},${10 + Math.random() * 20},5,${0.05 + Math.random() * 0.18})`;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= s; x += 16) {
        ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 2);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 4; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      const r = 8 + Math.random() * 14;
      const rg = ctx.createRadialGradient(x, y, 1, x, y, r);
      rg.addColorStop(0, "rgba(20,10,5,0.6)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  });
  _wood.repeat.set(2, 2);
  return _wood;
};

export const gridTexture = () => {
  if (_grid) return _grid;
  _grid = make(256, (ctx, s) => {
    ctx.fillStyle = "#1f3328";
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= s; i += 16) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= s; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
    }
  });
  return _grid;
};

export const corkTexture = () => {
  if (_cork) return _cork;
  _cork = make(256, (ctx, s) => {
    ctx.fillStyle = "#a07040";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = `rgba(${60 + Math.random() * 60},${30 + Math.random() * 40},10,${0.2 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return _cork;
};

export const leatherTexture = () => {
  if (_leather) return _leather;
  _leather = make(256, (ctx, s) => {
    ctx.fillStyle = "#5a2e1a";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(${20 + Math.random() * 30},${10 + Math.random() * 15},5,${0.15 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return _leather;
};

export const paperTexture = () => {
  if (_paper) return _paper;
  _paper = make(256, (ctx, s) => {
    ctx.fillStyle = "#f4ead8";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(120,90,40,${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
    }
  });
  return _paper;
};

/** Radial alpha mask: opaque center → fully transparent edges, for feathering the desk into the page. */
export const deskAlphaMask = () => {
  if (_alpha) return _alpha;
  _alpha = make(512, (ctx, s) => {
    const r = s / 2;
    const g = ctx.createRadialGradient(r, r, r * 0.15, r, r, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.55, "#ffffff");
    g.addColorStop(0.85, "#444444");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  _alpha.wrapS = _alpha.wrapT = THREE.ClampToEdgeWrapping;
  return _alpha;
};
