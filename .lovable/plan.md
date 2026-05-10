## ID badge: free-drag, overflow visible, smaller card

Three small tweaks to the hero ID badge in `src/components/HeroSection.tsx`. No other files.

### 1. Remove spring-back

Currently on pointer-up the card animates back to its rest anchor over 500ms via a `requestAnimationFrame` easing loop. Remove that entirely — the card stays exactly where the user drops it.

- Delete the spring loop in `onPointerUp` (the `fromX/fromY/startTs/duration/ease/tick` block and `springing` flag).
- `onPointerUp` only resets `dragging = false` and restores cursor.
- `offsetX/offsetY` persist across drags so the next pointer-down picks up from the current position.
- Drag clamp (`±140px`) is removed so the card can be flung anywhere on screen.

### 2. Card stays visible past the panel boundary (overflow visible)

The hero `<section>` currently has `overflow-hidden`, which clips the card the moment it crosses the dark-green mat edge. The lanyard SVG already uses `overflow: visible` internally, but it's still clipped by the section.

- Change the hero `<section>` from `overflow-hidden` to `overflow-visible`. The `EntropyBackground`/ghost grid already render outside the section as fixed layers, so removing the clip is safe.
- The full-bleed badge overlay (`stageRef`) keeps `inset-0` + `pointer-events: none`, but its children (card + clip + strands) now render past the mat edges when dragged.
- The ribbon SVG `<path>`s also draw past the mat top, completing the "rope hanging off-canvas" look when the card is pulled down/sideways.
- `z-index` raised on the overlay (`zIndex: 30`) so the dragged card always sits above the next section's content during overlap.

### 3. Smaller card to match panel scale

The card is currently 240px wide with a 160px-tall photo, which competes with the headline. Scale it down ~17% so it reads as a hanging accessory, not a hero element.

- Card width `200px` (was 240).
- Padding `12px 12px 16px` (was 16/16/20).
- Photo height `130px` (was 160).
- Hole slot `38×7` (was 45×8), top `8` (was 10).
- Name font-size `12px`, letter-spacing `1.3px` (was 13/1.5).
- Title font-size `8.5px`, line-height 1.45 (was 9/1.5).
- Divider margin `12px 0 10px` (was 16/12).
- ID label font-size `8.5px`; barcode `38×10` (was 45×12).
- Card rest position adjusts: `top: 90px` (was 110), `right: clamp(20px, 3.5vw, 56px)` so it nests neatly into the upper-right corner.
- Lanyard strand math unchanged — paths re-target the new (smaller, slightly higher) hole-slot rect automatically since `updateLanyard()` reads its `getBoundingClientRect()`.

### Behavior preserved

- Pointer-events drag (mouse + touch), live strand recompute, clip rotation, woven-pattern strands, ribbon `<textPath>`, admin-editable badge fields, mat shadow at original rest position (kept anchored to where the card *was* — not the new live position; reads as a leftover from when the card was hung up).
- Mobile (`< md`) the entire stage stays hidden.

### Files

- `src/components/HeroSection.tsx` — (a) remove spring-back from `onPointerUp` and the `±140` clamps in `onPointerMove`; (b) change `overflow-hidden` → `overflow-visible` on the `<section>` and bump overlay `z-index`; (c) update the inline styles on card, hole slot, photo, name, title, divider, footer/barcode to the smaller values; nudge the rest `top`/`right`. ~25 lines touched.
