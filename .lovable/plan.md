# Bridge fix — reference shelf ANIMATION + same fold physics

Reference HTML is used **only for the shelf-build animation**. Visual style of spines and rows stays as-is (the current bridge styling). Fold/flip physics stays as planned in the previous turn.

## 1. Shelf build animation (from `dossier-fold-transition-3.html`)

Two new behaviors on `AboutToProjectsBridge.tsx`, driven by the existing `bridge = seg(0.72, 1.0, t)` progress and tied to the same rAF loop:

### a. Rule "draw-in" stroke
Each row's horizontal ledge becomes an SVG `<path>` with `stroke-dasharray = L; stroke-dashoffset = L`, where `L` is the path length. As the shelf phase fires, each row's rule strokes outward from the center, staggered per row:

```text
draw  = seg(bridge, 0.10, 0.55)
for each row i:
    d = seg(draw, i*0.15, 0.55 + i*0.15)
    path.style.strokeDashoffset = L * (1 - easeInOut(d))
```

### b. Spines rise from under the rule (clip-masked)
Each row is wrapped in a `.rowClip` div with `overflow: hidden` whose top edge sits on the rule. Spines are positioned with `bottom: 0` inside the clip and start at `translateY(135%)` (fully hidden below the clip). As the archive phase fires, each spine rises into place with a back-overshoot ease, staggered by row+col:

```text
arch = seg(bridge, 0.55, 1.00)
for each spine at (row, col):
    order = row * 0.16 + col * 0.03
    e     = easeBack(seg(arch, order, order + 0.40))
    spine.style.transform = `translateY(${lerp(135, 0, e)}%)`
```

`easeBack(t) = t*t*((s+1)*t - s)` with `s = 1.4` (standard back-out, matches ref).

Notes:
- All updates happen inside the existing rAF block — no React re-renders, consistent with the project's animation core rule.
- The About slot at row 1's right end is also a `.rowClip` child; the landed packet's vertical position is `0` so it visually merges with the staggered rise.
- Toolbox stays bottom-right; it also rises from under the bottom rule with the same `eBack` stagger, slotted at the highest order so it lands last.

### c. Remove the prior "spines rise on bridge>0.3" translateY ramp
The simple staggered translateY fade that's currently in `AboutToProjectsBridge.tsx` is replaced by the clip-mask rise above so the motion matches the reference exactly.

## 2. Fold + flip physics (`HeroIdBadge.tsx`) — same as previously planned

No change from the last plan version:

```text
Card width = 260
  ┌──── 25% ────┬──── 50% ────┬──── 25% ────┐
  │   LEFT wing │   CENTER     │  RIGHT wing │
  └─────────────┴──────────────┴─────────────┘
```

- LEFT: `left:0; width:25%`, `aboutSurface(0)`
- CENTER: `left:25%; width:50%`, `aboutSurface(-CARD_WIDTH*0.25)`
- RIGHT: `left:75%; width:25%`, `aboutSurface(-CARD_WIDTH*0.75)`
- Shared timing so fold and flip happen together:
  - `tFold = seg(bridge, 0.00, 0.50)` — wings rotate `0 → 90°`
  - `tTurn = seg(bridge, 0.00, 0.50)` — center `rotateY 0 → 180°`
- Remove the about-face opacity cross-fade. Both faces keep `backface-visibility:hidden`; the green spine becomes visible naturally past 90°.
- Shrink the fold layer to spine footprint before flight:
  - `tShrink = seg(bridge, 0.50, 0.70)`
  - `scaleX = lerp(1, SPINE_WIDTH/(CARD_WIDTH*0.5), tShrink)`
  - `scaleY = lerp(1, SPINE_HEIGHT/CARD_HEIGHT, tShrink)`
- Translate-to-slot gated until `tShrink >= 1`, so the packet flies as a spine-sized green spine.

Sequence:

```text
bridge 0.00 → 0.50 : wings fold + center flips (green spine appears via backface)
bridge 0.50 → 0.70 : packet shrinks to spine footprint
bridge 0.70 → 1.00 : spine flies to __bridgeSlotRect AND shelf rules draw + spines rise
bridge ≈ 1.0       : everything settled; ghost slot's About spine fades in
```

## Files

- `src/components/AboutToProjectsBridge.tsx`
  - Wrap each row in `.rowClip` (`overflow:hidden`).
  - Replace plain horizontal rule with an SVG path; cache `pathLength` per row in refs.
  - Inside the existing rAF, drive `strokeDashoffset` (draw) and per-spine `translateY%` (archive) using the formulas above.
  - Add refs array for all spines + the toolbox so the rAF can mutate them directly.
  - Remove the old per-spine staggered translateY/opacity ramp.
- `src/components/HeroIdBadge.tsx` — 25/50/25 wings, shared `tFold`/`tTurn`, drop face opacity ramp, add `tShrink` scaleX/scaleY, gate translate.
- `.lovable/plan.md` — append shelf-animation + fold-physics notes.

## Notes

- No DB/RLS changes.
- No new dependencies.
- Spine and row **visual styling stays unchanged** — only motion is updated.
