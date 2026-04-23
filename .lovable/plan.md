

## Seamless Panel Transitions — Slide L/R, No Fade, Restore Original Frame Designs

Replace the current crossfade + scale + opacity transitions between sections with **clean horizontal slide transitions** (incoming from one side, outgoing to the other), no opacity fade, no scale dip. Also restore each frame's **original detailed visual design** (the richer paper/cork/blueprint/etc. aesthetics) which were stripped down during recent iterations.

### 1. Transition Mechanics — `src/components/DeskStage.tsx`

Replace the current `AnimatePresence mode="wait"` + opacity/y motion with a **direction-aware sliding panel** approach:

- Track previous active index → derive `direction` (+1 if scrolling forward, -1 if backward).
- Use `AnimatePresence mode="popLayout"` (allows incoming + outgoing to coexist for seamless overlap, no gap frame).
- Each panel:
  - `initial`: `{ x: direction * 100% }` (off-screen on the side it enters from)
  - `animate`: `{ x: 0 }`
  - `exit`: `{ x: -direction * 100% }` (slides out the opposite side)
  - **`opacity` stays at 1 the entire time** — no fade.
  - Transition: `duration: 0.7, ease: [0.7, 0, 0.3, 1]` (smooth in/out cubic, matches a paper-being-pulled-across feel).
- Remove the `stageOpacity` and `stageY` `useTransform` values — they cause the current "fading on scroll edges" look the user dislikes.
- Keep the panel container `overflow-hidden` so off-screen panels are clipped cleanly.
- Add a thin paper-shadow drop on the leading edge of the incoming panel for depth (`box-shadow: -20px 0 40px -20px rgba(0,0,0,0.6)` mirrored by direction) — sells the "sliding in over" feel.

### 2. Remove faded scroll states

In `DeskStage.tsx`, drop the opacity falloff at section edges. Panels stay at full opacity through the entire scroll segment; only the slide handles entry/exit.

### 3. Restore Original Frame Designs

Each `Frame` component currently has minimal motion + minimal visual chrome. Restore the rich originals:

- **`BlueprintFrame`** — full dark drafting-green surface, blueprint grid lines (CSS), title-block corner cartouche, technical corner brackets at all 4 corners, scale ruler along bottom edge.
- **`CorkboardFrame`** — full cork texture background, wooden frame border, 4 pushpins (one each corner), subtle paper-note shadows inside.
- **`BookshelfFrame`** — wooden shelf top/bottom planks, dark gallery back-wall, picture-light gradient at top.
- **`BusinessCardFrame`** — embossed off-white card surface, gold foil corner accent, subtle inner stroke, soft drop shadow inside frame.
- **`NotebookFrame`** — lined-paper texture, center spine binding, page-curl shadow near spine, top spiral-ring perforations.
- **`ToolboxFrame`** — metal lid bar with rivets, two clasps, compartment dividers as faint inset lines.
- **`ScrollFrame`** — wooden rod top + bottom (3D-ish gradient), parchment background with deckled edge, faint wax-stain marks.
- **`LetterFrame`** — paper letter background, opened envelope flap silhouette behind, red wax seal in corner, faint folded crease lines.

Each frame keeps its **own subtle entry flourish** (e.g. blueprint's left-edge unroll, notebook's spine-flip) but the flourish is now **layered on top of the global slide**, not replacing it. The frame's own motion runs only on its inner `frame-*` chrome elements (curl, foil, spine, seal) for ~0.5s after slide-in completes — gives each section a signature beat without interfering with the seamless slide.

### 4. CSS additions — `src/index.css`

Add/restore the styled classes referenced by the frames (these likely got minimized):

- `.frame-blueprint` — dark green base + blueprint grid + corner brackets + title cartouche.
- `.frame-cork` — cork SVG/noise background + wood border.
- `.frame-shelf` — wood gradient planks + back wall.
- `.frame-card` — embossed paper + gold foil corner.
- `.frame-notebook` — lined paper + spine + ring perforations.
- `.frame-toolbox` — brushed metal lid + rivets + clasps.
- `.frame-scroll` — wood rods + parchment + deckle.
- `.frame-letter` — letter paper + envelope flap + wax seal.

All use CSS gradients, SVG data-URIs, and `box-shadow` — no new image assets.

### 5. Direction Inference

```text
useEffect(scrollYProgress) → newIndex
direction = newIndex > prevIndex ? 1 : -1
prevIndex = newIndex
```

Pass `direction` into the motion variants via `custom` prop on `motion.div` + `AnimatePresence custom={direction}`.

### 6. Visual Result

```text
Scroll forward:
  [Outgoing panel ──► slides left out]
  [Incoming panel ◄── slides in from right]
  Both at full opacity. Edges meet seamlessly.
  Desk prop below lifts as usual.

Scroll backward: mirrored.
```

No fade, no shrink, no opacity dip. Every panel arrives fully formed and leaves fully formed — like flipping cards in a Rolodex, or sliding drawings across a drafting table.

### Files Touched

- `src/components/DeskStage.tsx` — direction tracking, slide variants, remove fade/scale.
- `src/components/desk/frames/BlueprintFrame.tsx`
- `src/components/desk/frames/CorkboardFrame.tsx`
- `src/components/desk/frames/BookshelfFrame.tsx`
- `src/components/desk/frames/BusinessCardFrame.tsx`
- `src/components/desk/frames/NotebookFrame.tsx`
- `src/components/desk/frames/ToolboxFrame.tsx`
- `src/components/desk/frames/ScrollFrame.tsx`
- `src/components/desk/frames/LetterFrame.tsx`
- `src/index.css` — restore/expand `.frame-*` styling classes.

### Out of Scope

- 3D desk strip, props, decor, lighting, layout split (82/18) — untouched.
- Section content, header, doodles, entropy, routing, backend — untouched.
- No new dependencies or assets.

