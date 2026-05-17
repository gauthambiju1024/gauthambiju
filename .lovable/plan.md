# Fold/Drop choreography (canonical)

The ID card itself (not the blueprint slab) plays the bookmarked
`AboutToProjectsBridge` choreography, scoped to its own 260×380 dimensions
and driven by the parent pin's `progressMV`.

Local bridge progress `b = ease(0.72, 1.0, parentProgress)`.

```
A 0.00–0.15  Settle    AboutCardBack content fades out
B 0.15–0.45  Tri-fold  left/right flaps rotateY ±88°, slab scaleX 1 → 0.30
                       (and scaleY 1 → 0.526 so the folded shape matches the spine);
                       center crease shadow darkens 0.18 → 0.46
C 0.45–0.70  Rotate    backFace background HSL-lerps cream → walnut/teal
                       (hsl(40 25% 92%) → hsl(170 25% 28%));
                       vertical spine label fades in over ease(0.55, 0.80, b)
D 0.70–1.00  Land      smoothstepped drop into the shelf's About slot;
                       ledge sweeps L→R via strokeDashoffset over ease(0.74, 1.0, b);
                       tick marks + dimension brackets + "SPINE_01 · W:78mm" /
                       "REV: A · 2026" fade in over ease(0.82, 1.0, b);
                       bottom caption "Selected work — pull a spine." fades up
                       over ease(0.86, 1.0, b); shelf About-slot placeholder
                       reveals only at ease(0.998, 1.0, b)
```

Owners:
- `src/components/HeroIdBadge.tsx` — phases A/B/C/D math + flap transforms + color lerp + spine label
- `src/components/AboutToProjectsBridge.tsx` — captions, drawn ledge with ticks, dimension marks, live shelf row, slot placeholder
- `src/components/HeroAboutFlip.tsx` — pinned 340vh stage that owns `progressMV` for both
