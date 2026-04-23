

## Fix the Workbench Strip — Straighten, Simplify, Re-skin

The 12vh strip is too short and the camera too far for the current 10 props to read. They look like blurry tilted blobs, in a palette that fights the site (orange terracotta, blue triangle, multicolor photos, brown books vs. dark green blueprint + brass + cream).

Three surgical fixes — no new components, no new interactions.

### 1. Straighten everything

Every prop currently has a "casual" rotation that, at 12vh height, just reads as "broken / falling over". Lock all yaw/roll to 0 (or near-0) so objects sit square to the camera. Tiny, intentional ≤0.05 rad tilts on stickies/notebook only.

In `WorkbenchDecor.tsx` and the decor calls inside `DeskScene.tsx`:
- `LaptopClosable` rotation `[0, 0.1, 0]` → `[0, 0, 0]`
- `BookStack` rotation `[0, -0.3, 0]` → `[0, 0, 0]`, per-book `rot` 0.02/-0.03/0.015 → 0
- `BlueprintTube` rotation `[0, 0.3, 0.25]` → `[0, 0, 0]` (stand it upright in a brass holder, not "leaning")
- `DraftingTools` rotation `[-Math.PI/2, 0, 0.35]` → `[-Math.PI/2, 0, 0]` (lay flat, square)
- `NotebookWithPen` rotation `[0, 0.12, 0]` → `[0, 0, 0]`; pen `[0, 0.7, 0]` → `[0, 0, 0]`
- `PolaroidStack` rotation `[0, -0.35, 0]` → `[0, 0, 0]`, per-card rot → 0
- `StickyNotes` per-note rotations → ≤0.04 rad (keep tiny human imperfection)

### 2. Re-skin to match the site palette

Site palette: dark green blueprint `#1f3328`, walnut `#3a2618`, brass `#c79a45` / `#d4a73a`, cream `#efe4cf`, accent gold `hsl(43 74% 55%)`. Anything outside this gets pulled in.

- **BlueprintTube**: drop the orange/grey tube. New look: cream paper `#efe4cf` rolled tube with a brass cap `#c79a45` and a single gold gilt stripe — same palette as the books.
- **DraftingTools triangle**: change from translucent blue `#3a5a6a` → translucent **brass-tinted amber** `#c79a45` opacity 0.45. Pencil stays gold.
- **PolaroidStack**: replace the rainbow `hsl(30 + i*60, …)` photo tints with three monochrome cream/sepia tones (`#efe4cf`, `#d8c9a6`, `#b89968`). Reads as "old prints" not "kid's craft".
- **BookStack**: keep three books but recolor to the site triad — walnut `#3a2618`, brass `#8a6a2a`, cream `#efe4cf` — instead of brown/tan/cream-with-random-tan.
- **StickyNotes**: replace the three pastel colors with a single warm cream `#f4e38a` for all three (paper memo pad feel), keep tiny scribble.
- **Laptop screen** emissive: change `#1a3328` blueprint glow → soft amber `#3a2a14` so it reads as "warm room light reflection" matching the lamp pool.

### 3. Make them readable at 12vh

The camera is at z=1.6 looking at a 2.4-deep desk; tiny props get crushed. Two cheap moves:

- **Camera**: in `DeskScene.tsx`, move camera in: `position [0, 0.42, 1.6]` → `[0, 0.55, 1.25]`, fov 48 → 42. Closer and tighter framing makes each prop ~30% bigger on screen without re-modeling.
- **Scale the small props up ~25%** by wrapping each in `<group scale={1.25}>`: `BlueprintTube`, `DraftingTools`, `StickyNotes`, `NotebookWithPen`, `BrassPaperweight`. Laptop, books, mug, lamp, polaroids stay current size (already legible).
- **Spread spacing**: with the closer camera, nudge `BookStack` from x=1.55 → 1.7, `PolaroidStack` 1.2 → 1.35, `BrassPaperweight` 1.95 → 2.1 so the right cluster doesn't collide.

### What stays the same

- Status light bar, EOD behavior, lamp, parallax, fog, shadows — untouched.
- `AssemblyHeader`, `DeskStage` layout, "now building" tag — untouched.
- No new files.

### Files modified

- `src/components/desk3d/workbench/WorkbenchDecor.tsx` — rotations zeroed, palette swap, screen tint, default scales/positions.
- `src/components/desk3d/decor/index.tsx` — `PolaroidStack` photo colors recolored to sepia triad; rotations zeroed.
- `src/components/desk3d/DeskScene.tsx` — camera position + fov, position nudges for right cluster, scale wrappers on small props.

