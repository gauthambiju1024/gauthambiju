

## Replicate Reference Desk: Bottom 18% Strip

Same plan as before but the desk strip is compressed to **18vh** (panel takes 82vh). All other refinements (camera, premium props, reference-style layout, lighting) stay.

### 1. Layout — slim bottom strip

`src/components/DeskStage.tsx`:
- 3D `<DeskScene>` → `absolute inset-x-0 bottom-0`, `height: 18vh`.
- Stage/panel area → `top: 0`, `height: 82vh`.
- Remove the previous full-viewport overlay + top-fade gradient.
- Thin 1.5vh blend strip just above the desk: `linear-gradient(to bottom, transparent, hsl(var(--background)))` to soften the panel→desk seam.

### 2. Camera tuned for a slim strip

`src/components/desk3d/DeskScene.tsx`:
- Camera: `position: [0, 0.42, 1.6], fov: 48` — low and wide so the 18vh strip still reads as a full desk.
- Parallax base Y: `0.42`, X: `mouse.x * 0.12`.
- Floor: rectangular walnut plank `planeGeometry(8, 2.4)` with horizontal alpha fade (opaque middle 70%, fades to 0 at left/right edges) so it dissolves at screen edges, not a hard cut. New helper `deskHorizontalAlpha()` in `textures.ts`.
- Transparent canvas (no bg, no fog).

### 3. Prop arrangement — reference layout

`src/pages/Index.tsx` — props arranged left→right across the front edge (compressed Z range since strip is shallow):

```text
book   mat   notebook   compass   card   envelope   toolbox
 -1.5  -0.95   -0.05      0.55    0.85     1.15      1.55
```

- `book`: `[-1.5, 0, 0.4]`, rot `[0, 0.15, 0]`
- `mat`: `[-0.95, 0, 0.45]`, rot `[0, 0.05, 0]`
- `notebook`: `[-0.05, 0, 0.45]`, rot `[0, -0.02, 0]` — center-stage open book
- `compass`: `[0.55, 0, 0.5]`, rot `[0, 0.1, 0]`
- `card`: `[0.85, 0, 0.3]`, rot `[0, -0.2, 0]`
- `envelope`: `[1.15, 0, 0.35]`, rot `[0, -0.15, 0]`
- `toolbox`: `[1.55, 0, 0.1]`, rot `[0, -0.25, 0]`
- `cork`: `[0.0, 0, -0.2]`, rot `[0, 0, 0]` (back row, half-hidden — ambient)

### 4. Decor repositioned (matches reference)

`src/components/desk3d/decor/index.tsx`:
- `Plant`: far-left `[-2.0, 0, 0.0]`
- `Mug`: `[-1.4, 0, 0.5]`
- `Lamp`: far-right hero `[2.0, 0, -0.05]`
- `PenHolder`: `[1.8, 0, 0.4]`
- `ClosedJournal`: `[2.2, 0, 0.45]`
- New `PolaroidStack` decor: `[1.3, 0, 0.55]`
- New `Paperclips` decor (3 small brass torus shapes) scattered front-left + front-right.

### 5. Premium props — keep + open-book variant

Already-upgraded materials (brass compass with glass dome, leather book with gold band + silk bookmark, brushed steel toolbox, embossed letterpress card, ceramic mug, fountain pen) stay. Refine:

- **NotebookProp** → open book variant: two slightly-tented `RoundedBox` pages forming a spread, plus a small fountain pen lying diagonally across (matches reference's centerpiece open notebook).

### 6. Lighting tuned to reference

`DeskScene.tsx`:
- `ambient` 0.25
- Warm key from upper-right (lamp side): `position: [2, 1.8, 0.5], intensity: 0.7, color: #ffd9a0`
- Soft fill from upper-left: `intensity: 0.35, color: #fff4dd`
- Cool rim from behind: `intensity: 0.3, color: #9ec0ff`
- Lamp's own `pointLight` (already in decor, warm 1.6) acts as practical hero light.
- `ContactShadows`: `opacity: 0.55, blur: 2.6, scale: 5`.

### Files Changed
- `src/components/DeskStage.tsx` — bottom 18vh strip, panel 82vh, thin seam blend.
- `src/components/desk3d/DeskScene.tsx` — new camera, rectangular feathered plank floor, lighting rig.
- `src/components/desk3d/textures.ts` — add `deskHorizontalAlpha()`.
- `src/components/desk3d/props/index.tsx` — open-book `NotebookProp` with pen.
- `src/components/desk3d/decor/index.tsx` — reposition decor + add `PolaroidStack`, `Paperclips`.
- `src/pages/Index.tsx` — updated prop world coordinates.

### Out of Scope
Frames, scroll, header, sections, routing, backend — untouched. No new assets or dependencies.

