## Goal
Rebuild the bridge shelf as a still, multi-row library with category labels, "MORE ABOUT ME" pinned to the top row, and a toolbox on the bottom-right that previews the next station. Also fix the missing green-spine flip.

## 1. Kill the ARCH motion (`AboutToProjectsBridge.tsx`)

Remove the per-frame `translateY((1-k)*135%)` + opacity stagger inside the rAF loop. Spines render in their final position the moment the shelf is visible. The shelf wrap itself still fades in once on `bridge > 0.30`.

Concrete: drop the `for (... spineRefs ...)` block; set spine wrappers to `opacity: 1, transform: none` at mount.

## 2. Fix the green "MORE ABOUT ME" spine flip (`HeroIdBadge.tsx`)

Current bug: when the center strip rotates to 180°, the about-face child is faded out but its `background: CARD_BG` div still paints cream because `backface-visibility: hidden` is being defeated by the cross-fade opacity sitting on the same element. Result: blank cream rectangle (what you screenshotted).

Fix:
- Paint the center strip wrapper itself with the green spine color so the surface behind the cream is already green; cream just fades off to reveal green.
- Keep `backface-visibility: hidden` on both inner faces and remove the opacity ramp on the spine face (`lastElementChild`). Only fade the about face out (`firstElementChild` opacity 1→0 over `tTurn 0..0.6`).
- Ensure the ProjectSpine inside the back face is `width: 100%; height: 100%` and stretched (it already is). Make sure the wrapper passes `transformStyle: preserve-3d`.

## 3. Multi-row shelf grouped by `category` (`AboutToProjectsBridge.tsx`)

Read `projects` from `useProjects()`. Group by `project.category` (DB field exists, default `"General"`). Sort groups by the smallest `sort_order` in each group so the most-prioritized category goes on the **top row**.

Render rows top→bottom:

```text
ROW 1 (topmost):  [P1] [P2] [P3]   ——— CATEGORY ———   [MORE ABOUT ME]
ROW 2:            [P4] [P5] [P6]   ——— CATEGORY ———
ROW 3 (bottom):   [P7] [P8]        ——— CATEGORY ———   [TOOLBOX]
```

Each row = a flex container with its own ledge `<svg>` line below it. Rows stack with `gap: 12px`. Total shelf bottom anchored at `bottom: 18%` and grows upward.

The "MORE ABOUT ME" spine is **always** appended at the end of ROW 1 regardless of category, so the flying card always lands top-right.

A small section heading sits above all rows, centered:

```
              ——— PROJECTS ———
```

mono caps, letter-spacing 0.3em, low-contrast ink color, with thin rules either side.

## 4. Category label treatment (dense + minimalist)

Each row's ledge line is a single `<svg>` with the rule + a centered category badge interrupting the line:

```
————————————   WEB DESIGN · 04   ————————————
```

- mono caps, 9px, letter-spacing 1.6px
- color = same `INK` used by ledge (`hsl(38 60% 52%)`)
- two SVG path segments around the text, width auto from text bbox
- shown centered on each row's ledge

Implementation: drop one absolute-positioned `<span>` above each `<path>` and split the path into left/right segments computed off the span's measured width on layout/resize. This keeps the visual one continuous rule with an inline label.

## 5. Toolbox icon on bottom-right (`AboutToProjectsBridge.tsx`)

Append after the last spine in the BOTTOM row: a small toolbox SVG (~64×52px), sitting on the ledge baseline (`align-self: flex-end`). Inline SVG, single-stroke, matches `INK`. Add a subtle handle highlight.

Scroll-zoom behavior:
- On scroll, when bridge progress > 1 (past flip section), the next pinned scroll section is `#skills`. The toolbox itself does NOT need a click handler; it acts as a visual scroll cue.
- Add a tiny `transform-origin: bottom right` + per-frame `scale(1 + zoom * 0.6)` + slight opacity ramp where `zoom = clamp01((scrollY - end-of-bridge) / (one viewport / 2))`. So as the user scrolls past the shelf, the toolbox grows toward the camera, foreshadowing the SkillsToolbox station.
- Also wrap it in an `<a href="#skills">` so click jumps via the global `scroll-margin-top` already configured.

## 6. Update the About-slot geometry target

The slot rect published to `window.__bridgeSlotRect` must now be the position of the About spine inside **ROW 1**, not the old single-row position. The slot/spine pair I added last turn already lives inline; just keep it on the top row.

## 7. Plan doc

Update `.lovable/plan.md` to record:
- Multi-row, category-grouped shelf
- About pinned top-row right
- Toolbox bottom-row right with scroll-zoom into SkillsToolbox
- ARCH motion removed
- Green spine flip fix (paint wrapper green; fade only about face)

## Files touched

- `src/components/AboutToProjectsBridge.tsx` — multi-row layout, category labels, toolbox, drop ARCH stagger, scroll-zoom on toolbox
- `src/components/HeroIdBadge.tsx` — paint center strip green; remove spine-face opacity ramp
- `.lovable/plan.md` — updated notes

No DB migration needed (category column already exists).
