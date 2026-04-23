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
  _cork = make(512, (ctx, s) => {
    const bg = ctx.createLinearGradient(0, 0, s, s);
    bg.addColorStop(0, "#a87648");
    bg.addColorStop(1, "#8a5a32");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 4000; i++) {
      const r = Math.random() * 2.2;
      ctx.fillStyle = `rgba(${40 + Math.random() * 70},${20 + Math.random() * 45},8,${0.18 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(255,230,180,${0.04 + Math.random() * 0.06})`;
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, 3 + Math.random() * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return _cork;
};

let _paperLined: THREE.CanvasTexture | null = null;
export const paperLinedTexture = () => {
  if (_paperLined) return _paperLined;
  _paperLined = make(512, (ctx, s) => {
    ctx.fillStyle = "#f4ead8";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(120,90,40,${Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
    }
    ctx.strokeStyle = "rgba(90,120,170,0.35)";
    ctx.lineWidth = 1;
    for (let y = 40; y < s; y += 28) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(s - 20, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(180,60,60,0.4)";
    ctx.beginPath();
    ctx.moveTo(48, 0); ctx.lineTo(48, s); ctx.stroke();
  });
  _paperLined.wrapS = _paperLined.wrapT = THREE.ClampToEdgeWrapping;
  return _paperLined;
};

let _coffee: THREE.CanvasTexture | null = null;
export const coffeeTexture = () => {
  if (_coffee) return _coffee;
  _coffee = make(256, (ctx, s) => {
    const r = s / 2;
    const g = ctx.createRadialGradient(r, r, 4, r, r, r);
    g.addColorStop(0, "#4a2a14");
    g.addColorStop(0.7, "#2e1808");
    g.addColorStop(1, "#1a0d04");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = "rgba(220,180,120,0.18)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(r, r, 20 + i * 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  _coffee.wrapS = _coffee.wrapT = THREE.ClampToEdgeWrapping;
  return _coffee;
};

let _woodNormal: THREE.CanvasTexture | null = null;
export const woodNormalTexture = () => {
  if (_woodNormal) return _woodNormal;
  _woodNormal = make(512, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 200; i++) {
      const y = Math.random() * s;
      const r = 100 + Math.floor(Math.random() * 50);
      const gch = 100 + Math.floor(Math.random() * 50);
      ctx.strokeStyle = `rgba(${r},${gch},255,0.5)`;
      ctx.lineWidth = 0.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= s; x += 8) ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 2);
      ctx.stroke();
    }
  });
  _woodNormal.repeat.set(2, 2);
  return _woodNormal;
};

let _leatherNormal: THREE.CanvasTexture | null = null;
export const leatherNormalTexture = () => {
  if (_leatherNormal) return _leatherNormal;
  _leatherNormal = make(256, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * s, y = Math.random() * s;
      const dx = Math.floor(120 + Math.random() * 16);
      const dy = Math.floor(120 + Math.random() * 16);
      ctx.fillStyle = `rgba(${dx},${dy},255,0.7)`;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return _leatherNormal;
};

let _brassRough: THREE.CanvasTexture | null = null;
export const brassRoughnessTexture = () => {
  if (_brassRough) return _brassRough;
  _brassRough = make(256, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, "#3a3a3a");
    g.addColorStop(0.5, "#2a2a2a");
    g.addColorStop(1, "#3a3a3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 600; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
      ctx.lineWidth = 0.5;
      const y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
  });
  return _brassRough;
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

let _hAlpha: THREE.CanvasTexture | null = null;
/** Horizontal alpha fade: opaque middle ~70%, fades to transparent at left/right edges. */
export const deskHorizontalAlpha = () => {
  if (_hAlpha) return _hAlpha;
  _hAlpha = make(512, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, "#000000");
    g.addColorStop(0.18, "#ffffff");
    g.addColorStop(0.82, "#ffffff");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  _hAlpha.wrapS = _hAlpha.wrapT = THREE.ClampToEdgeWrapping;
  return _hAlpha;
};
