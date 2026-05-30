## Replicate reference plant + occlusion with toolbox

Scope: `src/components/DeskSceneStage.tsx` only. Toolbox, laptop, mug, screen content, table, wall, field notes, and animations stay untouched. The toolbox actor is owned by `ToolboxToSkillsBridge` and lands on `.dsk-toolbox-slot` — we only adjust the plant SVG and the plant's position relative to the existing toolbox slot. No edits to the bridge or any other file.

### 1. Redraw the plant SVG to match the reference
Inside the existing `.dsk-plant` wrapper, replace only the SVG with a botanical line-art plant:
- viewBox `0 0 140 240`
- A single tall central stem curving slightly, rising from the pot rim (~y=140) up to ~y=15
- 5 pairs of opposing oval leaves along the stem, plus one terminal leaf at the tip:
  - Bottom pair (y≈125): largest, drooping outward/down
  - y≈100: large, near-horizontal
  - y≈75: medium, angled up
  - y≈50: small, angled up
  - y≈25: smallest, near-vertical
  - Terminal leaf at the tip (y≈12)
- Each leaf: filled `rgba(127,177,138,0.16)` with stroke `#7fb18a`, strokeWidth `1.1`, plus one thin center vein line
- Pot: trapezoid `M 38 140 L 102 140 L 96 215 L 44 215 Z`, fill `rgba(20,16,12,0.85)`, stroke `#b8924a`, strokeWidth `1.4`
- Pot rim band: rectangle y=140→y=152, slightly wider than the body opening, stroke `#b8924a`
- Subtle elliptical ground shadow at y=218

### 2. Relative position so the toolbox occludes the lower-right of the plant (3D depth)
Move the plant so its right edge overlaps the toolbox's left edge, with the plant rendered BEHIND the toolbox actor:
- Keep `.dsk-plant` wrapper at `zIndex: 5` (already below the toolbox bridge actor's `zIndex: 10` — toolbox naturally covers the plant where they overlap)
- Reposition wrapper: `left: "3%"`, `bottom: "12%"`, `width: "150px"` (slightly larger so it reads as standing on the same table; bottom lowered so the pot base aligns with the toolbox base and the pot's right side tucks behind the toolbox)
- Toolbox slot stays at `left: "10%"`, `bottom: "14%"`, `width: "200px"` — unchanged
- With the new plant box (left ≈3% of a max-1400px container ≈ 42px, width 150px → right edge ≈192px) and the toolbox left edge at ≈140px, the toolbox covers ~50px of the plant's right side (pot corner + a few lower leaves), producing the exact occlusion in the reference image

### Out of scope
- No changes to toolbox graphics, position, or scale
- No changes to laptop, mug, screen content, table line, wall gradient, field notes, plant reveal timing, or any other component
- No edits to `ToolboxToSkillsBridge.tsx`, `Index.tsx`, or any other file
