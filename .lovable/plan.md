
## Smoother, Slower Horizontal Scroll Mapping

Replace the current "snap-and-fade" horizontal transition with a **continuous 1:1 mapping** from vertical scroll to horizontal panel travel. Result: the active panel glides smoothly across the stage in lock-step with scroll velocity — no static "hold" in the middle, no fast snap at slice boundaries.

### Current behavior (the problem)

In `DeskStage.tsx`, each panel sits centered (`x: 0%`) for ~82% of its slice and only translates during a narrow 18% fade window at the edges. That makes the horizontal motion feel abrupt and disconnected from scroll — most of the scroll does nothing visually, then a quick jump happens.

### New behavior

Each panel travels **continuously** across its full visible range:

```text
scroll position:   prev-center        own-center         next-center
panel x:               +100%   ───→      0%      ───→      -100%
                   (just entering)   (centered)      (just exiting)
```

- Vertical scroll maps **1:1** to horizontal travel — every pixel of scroll moves the panel.
- A panel is centered only at the exact midpoint of its slice; before/after it's continuously sliding.
- Two panels are always partially on stage during the handoff (one exiting left, one entering right), creating a smooth crossfade.
- Opacity fades in/out near the edges (~25% of a slice) so off-stage panels don't bleed through.
- First panel: starts centered, only animates exit. Last panel: only animates enter, ends centered.

### Why this feels slower & smoother

- Motion distance is spread across **2× the scroll range** (full slice × 2 instead of 18% × 2), so the same scroll input produces gentler horizontal velocity.
- No flat "centered hold" means the eye always sees motion proportional to scroll — no perceived stutter.
- Crossfade overlaps continuously with translation, eliminating the snap.

### Implementation

Single file: `src/components/DeskStage.tsx` — rewrite `PanelLayer`'s `opacity` and `x` transforms.

```tsx
const slice    = 1 / total;
const center   = (index + 0.5) * slice;
const enterAt  = Math.max(0, center - slice);  // previous panel's center
const exitAt   = Math.min(1, center + slice);  // next panel's center

// X: continuous travel across the panel's full visible window
const x = useTransform(
  scrollYProgress,
  [enterAt, center, exitAt],
  ["100%", "0%", "-100%"]
);

// Opacity: crossfade near the edges only (25% of a slice)
const opacity = useTransform(
  scrollYProgress,
  [enterAt, enterAt + slice*0.25, exitAt - slice*0.25, exitAt],
  [0, 1, 1, 0]
);
```

First/last panels get edge-case ranges (`[0, center, exitAt]` / `[enterAt, center, 1]`) so they don't slide off when there's no neighbor.

### What stays the same

- Vertical page scroll drives everything (no scroll hijacking).
- Page height (`sections.length * 100vh`), section anchors, header jump-to.
- 3D desk strip, ordering, inner scroll for Library/Thinking, reduced-motion fallback.
- No new dependencies, no CSS changes.

### Files Modified

- `src/components/DeskStage.tsx` — `PanelLayer` transform logic only.
