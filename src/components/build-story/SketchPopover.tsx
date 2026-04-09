import { useEffect, useRef, useState } from "react";

/**
 * SketchPopover
 * -------------
 * A compact button that lives in the right side of the assembly header. When
 * clicked, it opens a popover with:
 *
 *   1. Five preset sketches as quick-pick chips (drone, lamp, phone, chair, rocket)
 *   2. A custom drawing canvas below
 *   3. Clear / Build action buttons
 *
 * The button itself displays a live thumbnail preview of whatever sketch is
 * currently loaded, plus the sketch name. So even when the popover is
 * collapsed, the visitor can see "their thing" being assembled.
 *
 * Lifts state up via `onChange` — the parent owns the partsData and passes
 * it to the AssemblyHeader.
 *
 * Usage (inside AssemblyHeader):
 *
 *   <SketchPopover onChange={setUserParts} initialPreset="drone.v1" />
 */

export type Stroke = Array<[number, number]>;
export type Sketch = { name: string; strokes: Stroke[] };
export type Segment = [[number, number], [number, number]];
export type PartSegments = Segment[][];

const INK = "hsl(38 55% 66%)";
const INK_DIM = "hsl(38 48% 58%)";
const MUTED = "hsl(220 10% 42%)";
const MUTED_DIM = "hsl(220 10% 32%)";
const BORDER = "hsl(220 10% 22%)";
const BORDER_HOT = "hsl(38 50% 55%)";
const BG_DARK = "hsl(220 15% 9%)";
const BG_DARKER = "hsl(220 15% 7%)";

export const PRESETS: Sketch[] = [
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
      [[140, 80], [180, 80]],
    ],
  },
  {
    name: "phone.v2",
    strokes: [
      [[120, 20], [200, 20], [200, 90], [120, 90], [120, 20]],
      [[140, 30], [180, 30]],
      [[140, 80], [180, 80]],
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
      [[160, 40], [160, 55]],
      [[150, 75], [170, 75]],
    ],
  },
];

function bbox(strokes: Stroke[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of strokes) {
    for (const p of s) {
      if (p[0] < minX) minX = p[0];
      if (p[0] > maxX) maxX = p[0];
      if (p[1] < minY) minY = p[1];
      if (p[1] > maxY) maxY = p[1];
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function strokesToSvgPaths(strokes: Stroke[], scale: number, color: string, sw: number): string {
  if (!strokes.length) return "";
  const bb = bbox(strokes);
  if (!isFinite(bb.minX)) return "";
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;
  const s = scale / Math.max(bb.w, bb.h, 1);
  let html = "";
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    let d = "";
    for (let j = 0; j < stroke.length; j++) {
      const nx = (stroke[j][0] - cx) * s;
      const ny = (stroke[j][1] - cy) * s;
      d += `${j === 0 ? "M " : "L "}${nx.toFixed(1)} ${ny.toFixed(1)} `;
    }
    html += `<path d="${d}" stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return html;
}

export function strokesToParts(strokes: Stroke[], scale = 22): PartSegments {
  const allSegs: Segment[] = [];
  for (const s of strokes) {
    if (s.length < 2) continue;
    for (let j = 0; j < s.length - 1; j++) {
      allSegs.push([s[j], s[j + 1]]);
    }
  }
  if (allSegs.length === 0) return [];
  const bb = bbox(strokes);
  if (!isFinite(bb.minX)) return [];
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;
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
  onChange: (parts: PartSegments | null, sketchName: string) => void;
  initialPreset?: string;
};

export function SketchPopover({ onChange, initialPreset = "drone.v1" }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Sketch>(
    () => PRESETS.find((p) => p.name === initialPreset) ?? PRESETS[0]
  );
  const [status, setStatus] = useState("READY");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  useEffect(() => {
    onChange(strokesToParts(current.strokes), current.name);
  }, [current, onChange]);

  function redrawCanvas() {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of strokesRef.current) {
      if (s.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s[0][0], s[0][1]);
      for (let j = 1; j < s.length; j++) ctx.lineTo(s[j][0], s[j][1]);
      ctx.stroke();
    }
  }

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs || !open) return;
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
      strokesRef.current.push(currentStrokeRef.current);
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
  }, [open]);

  function handleClear() {
    strokesRef.current = [];
    redrawCanvas();
    setStatus("CLEARED");
  }

  function handleBuild() {
    if (strokesRef.current.length === 0) {
      setStatus("NO INPUT");
      return;
    }
    setCurrent({ name: "custom.user", strokes: strokesRef.current.slice() });
    setStatus("BUILT");
  }

  const totalVtx = current.strokes.reduce((acc, s) => acc + s.length, 0);
  const thumbHtml = strokesToSvgPaths(current.strokes, 16, INK_DIM, 0.5);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute right-3 top-7 flex flex-col items-stretch overflow-hidden rounded-sm transition-colors"
        style={{
          background: "hsl(220 15% 11%)",
          border: `0.5px solid ${BORDER_HOT}`,
          width: 200,
          height: 56,
          padding: 0,
        }}
      >
        <div style={{ padding: "6px 8px 0 8px", textAlign: "left" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "hsl(38 50% 62%)",
              letterSpacing: "1.2px",
            }}
          >
            ▸ DESIGN.INPUT
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: MUTED,
              marginTop: 1,
            }}
          >
            click to define product
          </div>
        </div>
        <div
          style={{
            margin: "2px 8px 4px 8px",
            background: BG_DARKER,
            border: `0.5px solid ${BORDER}`,
            borderRadius: 1,
            height: 22,
            position: "relative",
          }}
        >
          <svg
            viewBox="-25 -12 50 24"
            width="100%"
            height="22"
            style={{ display: "block" }}
            dangerouslySetInnerHTML={{ __html: thumbHtml }}
          />
          <div
            style={{
              position: "absolute",
              left: 4,
              bottom: 2,
              fontFamily: "monospace",
              fontSize: 7,
              color: MUTED_DIM,
            }}
          >
            {current.name}
          </div>
          <div
            style={{
              position: "absolute",
              right: 4,
              bottom: 2,
              fontFamily: "monospace",
              fontSize: 7,
              color: MUTED_DIM,
            }}
          >
            {totalVtx}vtx · {current.strokes.length}str
          </div>
        </div>
      </button>

      {open && (
        <div
          className="absolute right-3 z-[60] rounded-md p-3"
          style={{
            top: 92,
            width: 460,
            background: BG_DARK,
            border: `0.5px solid hsl(220 10% 28%)`,
          }}
        >
          <div className="mb-2.5 flex items-center justify-between">
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: "hsl(220 10% 50%)",
                letterSpacing: "1.5px",
              }}
            >
              DESIGN.INPUT · what should I build?
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                padding: "2px 8px",
                background: "transparent",
                border: `0.5px solid ${BORDER}`,
                color: MUTED,
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
              color: MUTED_DIM,
              marginBottom: 6,
              letterSpacing: "0.8px",
            }}
          >
            QUICK·PICK · 5 presets
          </div>
          <div className="mb-3 grid grid-cols-5 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setCurrent(p);
                  setStatus("LOADED");
                }}
                className="flex flex-col items-center gap-1 rounded-sm transition-colors"
                style={{
                  background: BG_DARKER,
                  border: `0.5px solid ${current.name === p.name ? BORDER_HOT : BORDER}`,
                  padding: 6,
                  cursor: "pointer",
                }}
              >
                <svg
                  viewBox="-25 -25 50 50"
                  width="100%"
                  height={40}
                  dangerouslySetInnerHTML={{
                    __html: strokesToSvgPaths(p.strokes, 36, "hsl(38 50% 60%)", 1.2),
                  }}
                />
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "hsl(220 10% 48%)",
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
              color: MUTED_DIM,
              marginBottom: 6,
              letterSpacing: "0.8px",
            }}
          >
            CUSTOM · draw your own
          </div>
          <canvas
            ref={canvasRef}
            width={436}
            height={120}
            className="block w-full"
            style={{
              height: 120,
              background: BG_DARKER,
              border: `0.5px dashed ${BORDER}`,
              borderRadius: 3,
              cursor: "crosshair",
              touchAction: "none",
            }}
          />

          <div className="mt-2 flex gap-1.5">
            <button
              onClick={handleClear}
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                flex: 1,
                background: "transparent",
                border: `0.5px solid ${BORDER}`,
                color: MUTED,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
            <button
              onClick={handleBuild}
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                flex: 2,
                background: "transparent",
                border: `0.5px solid ${BORDER_HOT}`,
                color: INK_DIM,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Build →
            </button>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: INK_DIM,
                padding: "4px 10px",
                background: BG_DARKER,
                border: `0.5px solid ${BORDER}`,
                borderRadius: 3,
                minWidth: 80,
                textAlign: "center",
              }}
            >
              {status}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
