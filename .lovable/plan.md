# Bridge polish — fold-then-flip, shelf isolation, visible spines, toolbox

## 1. Fold THEN flip (sequential) — `HeroIdBadge.tsx`

Previous turn ran fold + flip in the same window. User wants them sequential: wings fully fold onto the center first, THEN the packet flips to reveal the spine.

New ramps (relative to `bridge = smoothstep(0.72, 1.0, p)`):
- `tFold   = seg(0.00, 0.40, bridge)` — wings rotate 0 → 178°, settling flush behind the center
- `tTurn   = seg(0.42, 0.70, bridge)` — center `rotateY 0 → 180°` (begins only after fold settles, with a small 0.02 hand-off pause)
- `tShrink = seg(0.70, 0.85, bridge)` — packet scales down to spine footprint
- `tFile   = seg(0.85, 1.00, bridge)` — flies to `__bridgeSlotRect`

Wing widths stay 25 / 50 / 25 so the two wings cover 100% of the center once folded. About-face opacity ramp stays removed (backface-visibility handles the reveal cleanly during tTurn).

## 2. Shelf must not appear in the About section — `AboutToProjectsBridge.tsx`

Bug: I removed the wrap opacity ramp last turn, so the shelf is visible all the way through About.

Fix: gate `shelfWrap.style.opacity` on bridge progress, but fade it in BEFORE the rule-draw animation so spines have a stage to rise onto:
- `shelfWrap.style.opacity = seg(0.00, 0.10, bridge)`
- `pointerEvents = bridge > 0.95 ? "auto" : "none"`

This keeps the shelf hidden during About (bridge=0) and revealed throughout the Projects pin.

## 3. Projects not visible — same file

Two root causes:
- Spines initially sit at `translateY(135%)` AND the row uses `overflow:hidden`. If `archT` never reaches > `order` for a spine, it stays hidden. Today `archT = seg(0.40, 1.0, bridge)`, but with the staggered `order` formula a row-2 col-2 spine needs `archT > 0.22 + span` to land. When `bridge < 0.62` mid-row spines are still below the clip.
- The `__bridgeProgress` published is `seg(0.72, 1.0, t)` smoothed; during the Projects pin segment `t` is at 1.0 so `bridge` is 1.0 and all spines should land. So the real-world bug is most likely the parent `<section style="position:absolute; inset:0">` being mounted inside the About stage container — projects render but at About's coordinates.

Fixes:
- Add the opacity gate above so the shelf cleanly fades in.
- Compress `archT` so even with bridge ≈ 0.6 most spines are visible: `archT = seg(0.10, 0.80, bridge)`. This starts the rise the moment the shelf fades in and finishes well before scroll-end.
- Drop the `overflow:hidden` ONLY on the spine row's outer flex if it's truncating projects horizontally on narrow viewports; instead set `overflow: hidden` on a fixed-height inner wrapper so the clip is only vertical (rises from "under the rule") and never clips horizontally.

## 4. About spine right after the project spines (not pushed to right edge) — same file

Remove the `<div style={{ flex: "1 1 auto" }} />` spacer before the About-spine slot in the top row. Result: spine sits immediately to the right of the last project spine, with a normal `gap: 14` between them.

The slot rect publication still works — `aboutSlotRef.current.getBoundingClientRect()` already returns the correct landing target wherever it is.

## 5. Realistic SVG toolbox at bottom-right — same file

Replace the line-drawing SVG with a richer 3D-ish illustration that still matches the warm-amber ink palette. Pieces:
- Bottom box: rounded amber-tone body with a darker base shadow, light top edge highlight, two latches, brass clasps, and faint wood-grain stripes
- Lid: separate flap with a hinge highlight
- Curved metallic handle with two screw mounts
- Foot shadow under the box
- ~96 × 76 footprint so it reads at viewport scale

Implementation: a single inline `<svg viewBox="0 0 96 76">` with multiple `<rect>`, `<path>`, gradient `<defs>`, and 1 thin highlight line. Uses the existing `INK` and a derived darker amber for shadow. Still wrapped in `<a href="#skills">` and still bottom-row last col so it rises with the shelf and zooms toward the Skills station.

## Files

- `src/components/HeroIdBadge.tsx` — retime `tFold` / `tTurn` / `tShrink` / `tFile` to sequential windows.
- `src/components/AboutToProjectsBridge.tsx` — restore opacity gate on `shelfWrap`, compress `archT`, remove right-edge spacer before About spine, swap toolbox SVG for the realistic version, switch the row clip so it only hides vertical overflow (not horizontal).
- `.lovable/plan.md` — append the sequential fold-then-flip and shelf-isolation notes.

## Notes

- No DB/RLS changes.
- No new dependencies.
- All transitions remain in the existing rAF loop — no React re-renders during the animation.
