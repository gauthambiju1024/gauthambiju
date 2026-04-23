export type Stroke = Array<[number, number]>;
export type Sketch = { name: string; strokes: Stroke[] };
export type Segment = [[number, number], [number, number]];
export type PartSegments = Segment[][];

export const DEFAULT_SKETCH: Sketch = {
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
};

export function bbox(strokes: Stroke[]) {
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

export function strokesToParts(strokes: Stroke[], scale: number): PartSegments {
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
