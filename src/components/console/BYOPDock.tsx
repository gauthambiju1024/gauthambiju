import { useEffect, useRef, useState } from "react";

/**
 * BYOPDock — "Build Your Own Product" trigger relocated from AssemblyHeader to the
 * console rail's right-bottom zone. Clicking the BUILD ▸ pill opens a popover
 * upward (above the rail) with preset picks + a freehand canvas.
 *
 * The selected sketch is persisted on `window.__byop_sketch` and broadcast via
 * the `byop:sketch` CustomEvent so AssemblyHeader can pick it up and animate it
 * down the belt, just like before.
 */

type Stroke = Array<[number, number]>;
type Sketch = { name: string; strokes: Stroke[] };

const INK = "hsl(38 50% 58%)";
const INK_BRIGHT = "hsl(38 55% 65%)";
const INK_DIM = "hsl(38 35% 52%)";
const BORDER_DASH = "hsl(38 40% 45%)";

const PRESETS: Sketch[] = [
  {
    name: "drone.v4",
    strokes: [
      [[150, 60], [210, 60], [210, 90], [150, 90], [150, 60]],
      [[150, 60], [90, 30]], [[210, 60], [270, 30]],
      [[150, 90], [90, 120]], [[210, 90], [270, 120]],
      [[75, 30], [105, 30]], [[255, 30], [285, 30]],
      [[75, 120], [105, 120]], [[255, 120], [285, 120]],
      [[165, 90], [165, 110]], [[195, 90], [195, 110]],
      [[150, 110], [210, 110]],
    ],
  },
  {
    name: "rocket.v2",
    strokes: [
      [[180, 20], [160, 50], [200, 50], [180, 20]],
      [[160, 50], [160, 120]], [[200, 50], [200, 120]],
      [[160, 95], [200, 95]],
      [[160, 100], [140, 130], [160, 125]],
      [[200, 100], [220, 130], [200, 125]],
    ],
  },
  {
    name: "plane.v1",
    strokes: [
      [[80, 80], [260, 80], [280, 75], [260, 70], [80, 70], [70, 75], [80, 80]],
      [[140, 75], [130, 110], [180, 85]],
      [[140, 75], [130, 40], [180, 65]],
      [[160, 73], [240, 73]],
    ],
  },
  {
    name: "phone.v2",
    strokes: [
      [[140, 20], [220, 20], [225, 25], [225, 115], [220, 120], [140, 120], [135, 115], [135, 25], [140, 20]],
      [[145, 32], [215, 32], [215, 108], [145, 108], [145, 32]],
      [[165, 114], [195, 114]],
    ],
  },
  {
    name: "satellite",
    strokes: [
      [[160, 60], [200, 60], [200, 100], [160, 100], [160, 60]],
      [[180, 60], [180, 40]], [[165, 40], [195, 40]],
      [[160, 70], [100, 70], [100, 90], [160, 90]],
      [[200, 70], [260, 70], [260, 90], [200, 90]],
    ],
  },
];

function bbox(strokes: Stroke[]) {
  let mx = Infinity, my = Infinity, Mx = -Infinity, My = -Infinity;
  for (const s of strokes) for (const p of s) {
    if (p[0] < mx) mx = p[0]; if (p[0] > Mx) Mx = p[0];
    if (p[1] < my) my = p[1]; if (p[1] > My) My = p[1];
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

const BYOPDock = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Sketch>(PRESETS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customStrokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  function emit(s: Sketch) {
    setCurrent(s);
    (window as any).__byop_sketch = s;
    window.dispatchEvent(new CustomEvent("byop:sketch", { detail: s }));
  }

  function redrawCanvas() {
    const cvs = canvasRef.current; if (!cvs) return;
    const ctx = cvs.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = INK_BRIGHT; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const s of customStrokesRef.current) {
      if (s.length < 2) continue;
      ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]);
      for (let j = 1; j < s.length; j++) ctx.lineTo(s[j][0], s[j][1]);
      ctx.stroke();
    }
  }

  useEffect(() => {
    if (!open) return;
    const cvs = canvasRef.current; if (!cvs) return;
    redrawCanvas();
    function getPos(e: PointerEvent): [number, number] {
      const rect = cvs!.getBoundingClientRect();
      return [(e.clientX - rect.left) * (cvs!.width / rect.width), (e.clientY - rect.top) * (cvs!.height / rect.height)];
    }
    function onDown(e: PointerEvent) {
      drawingRef.current = true;
      currentStrokeRef.current = [getPos(e)];
      customStrokesRef.current.push(currentStrokeRef.current);
      cvs!.setPointerCapture(e.pointerId); e.preventDefault();
    }
    function onMove(e: PointerEvent) {
      if (!drawingRef.current) return;
      const p = getPos(e);
      const stroke = currentStrokeRef.current!;
      const last = stroke[stroke.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 3) { stroke.push(p); redrawCanvas(); }
    }
    function onUp() { drawingRef.current = false; }
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
  }, [open]);

  return (
    <div className="h-full flex items-center justify-end pr-3 pl-2 relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-2 h-9 px-3.5 rounded-[3px] border border-amber-400/60 bg-amber-400/[0.06] hover:-translate-y-[2px] hover:border-amber-400/90 transition-all duration-150"
        style={{ fontFamily: "var(--font-display)" }}
        title="Design your product"
        aria-label="Design your product"
      >
        <span className="w-1 h-1 rounded-full" style={{ background: "hsl(43 74% 55%)", boxShadow: "0 0 4px hsl(43 74% 55%)" }} />
        <span className="text-[12.5px] tracking-wide text-stone-100 hidden min-[820px]:inline">BUILD</span>
        <span className="text-[12.5px] text-amber-300/90">▸</span>
        <span className="text-[10px] text-stone-400 hidden min-[920px]:inline" style={{ fontFamily: "var(--font-mono)" }}>
          {current.name}
        </span>
      </button>

      {open && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-[59]" onClick={() => setOpen(false)} />
          <div
            className="absolute z-[60] rounded-md p-4"
            style={{
              bottom: "calc(100% + 8px)",
              right: 8,
              width: 560,
              maxWidth: "calc(100vw - 32px)",
              background: "hsl(160 22% 11%)",
              border: `0.5px solid ${BORDER_DASH}`,
              boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div style={{ fontFamily: "monospace", fontSize: 10, color: INK, letterSpacing: "1.5px" }}>
                ─── DESIGN YOUR PRODUCT · <span style={{ color: INK_DIM }}>pick or draw</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ fontFamily: "monospace", fontSize: 10, padding: "2px 10px", background: "transparent", border: `0.5px solid ${BORDER_DASH}`, color: INK_DIM, cursor: "pointer" }}
              >
                close ✕
              </button>
            </div>

            <div style={{ fontFamily: "monospace", fontSize: 8, color: INK_DIM, letterSpacing: "0.8px", marginBottom: 6 }}>
              QUICK·PICK
            </div>
            <div className="mb-3 grid grid-cols-5 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => { emit(p); setOpen(false); }}
                  className="flex flex-col items-center gap-1.5 transition-colors"
                  style={{
                    background: "hsl(160 22% 8%)",
                    border: `0.5px dashed ${current.name === p.name ? INK_BRIGHT : BORDER_DASH}`,
                    padding: 8, cursor: "pointer",
                  }}
                >
                  <svg viewBox="-25 -25 50 50" width="100%" height={50}
                    dangerouslySetInnerHTML={{ __html: renderPathsSvg(p.strokes, 40, INK_BRIGHT, 1.4) }} />
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: INK, letterSpacing: "0.5px" }}>{p.name}</div>
                </button>
              ))}
            </div>

            <div style={{ fontFamily: "monospace", fontSize: 8, color: INK_DIM, letterSpacing: "0.8px", marginBottom: 6 }}>
              OR DRAW YOUR OWN
            </div>
            <canvas
              ref={canvasRef} width={900} height={400}
              style={{ display: "block", width: "100%", height: 160, background: "hsl(160 22% 8%)", border: `0.5px dashed ${BORDER_DASH}`, borderRadius: 3, cursor: "crosshair", touchAction: "none" }}
            />
            <div className="mt-2.5 flex gap-2">
              <button
                onClick={() => { customStrokesRef.current = []; redrawCanvas(); }}
                style={{ fontFamily: "monospace", fontSize: 10, flex: 1, background: "transparent", border: `0.5px solid ${BORDER_DASH}`, color: INK_DIM, padding: "6px 12px", cursor: "pointer" }}
              >
                Clear
              </button>
              <button
                onClick={() => {
                  if (customStrokesRef.current.length === 0) return;
                  emit({ name: "custom.user", strokes: customStrokesRef.current.slice() });
                  setOpen(false);
                }}
                style={{ fontFamily: "monospace", fontSize: 10, flex: 2, background: "transparent", border: `0.5px solid ${INK}`, color: INK_BRIGHT, padding: "6px 12px", cursor: "pointer" }}
              >
                Build this →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BYOPDock;
