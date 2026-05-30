## Desk scene layout & fade fixes

All changes scoped to `src/components/DeskSceneStage.tsx` (the toolbox actor in `ToolboxToSkillsBridge.tsx` already lands on `.dsk-toolbox-slot`, so moving the slot relocates the toolbox automatically — no bridge edits needed).

### 1. Toolbox position — fully visible, left of laptop
Move `.dsk-toolbox-slot` further left and slightly down so the toolbox sits cleanly to the **left** of the laptop with full clearance.
- `left: "10%"` → toolbox left edge near 10% viewport
- `bottom: "14%"` (lowered so the lid clears the field-notes board)
- `width: "200px"`, `height: "130px"` (same on-shelf scale)

### 2. Plant — behind & left of toolbox
Reposition `.dsk-plant` so the pot is partially occluded by the toolbox.
- `left: "6%"`, `bottom: "22%"` (pot bottom hidden behind toolbox top edge)
- Keep width 120px; lower z-order via DOM order (render before toolbox slot → already true; plant has no z-index, toolbox actor sits at zIndex 10 of bridge, so plant naturally goes behind)

### 3. Table — single horizon + wall/table tone separation
Replace the three converging perspective lines + double edge with:
- One crisp gold horizon line at y=720 (the "table edge")
- A subtle background gradient div behind everything: top 60% slightly cooler/darker (wall) → bottom 40% warmer/darker (table surface), separated by a soft shadow band at the horizon
- Remove `.dsk-persp-1/2/3` paths entirely

### 4. Field notes — raise and shift so all 3 cards visible
- Change from `top: "4%"` to `top: "2%"` and tighten height
- Reduce width to `min(40%, 520px)` and shift `right: "4%"` so only the left corner overlaps the laptop's top-right
- Ensure the 3-card grid + "VIEW ALL WRITING" link all fit above the laptop screen top

### 5. Laptop screen + keyboard fade as one unit
Current bug: `.dsk-screen` has its own `opacity: 0` and a separate `seg(0.45, 0.65)` reveal, so it fades in **after** the base.
Fix: remove the inner `.dsk-screen` opacity track and its inline `opacity: 0`. The whole `.dsk-laptop` wrapper already animates via `seg(0.3, 0.55)` — screen + base will fade in together as one object being placed on the table.

### Technical notes
- No changes to `ToolboxToSkillsBridge.tsx`, `Index.tsx`, or the toolbox actor — the bridge already reads `__deskToolboxSlot` rect each frame, so the new slot coordinates take effect automatically.
- Z-stack inside the desk scene (top-down): field-notes → laptop → toolbox actor (in bridge, zIndex 10, rendered after DeskSceneStage which is zIndex 20 — wait: bridge has the actor at zIndex 10 while DeskSceneStage is zIndex 20, meaning laptop currently sits **above** the toolbox, which matches user instruction "laptop in front of toolbox"). Keep as-is.
- Plant is inside DeskSceneStage (zIndex 20) so it will visually overlap the toolbox actor (zIndex 10). To put plant **behind** toolbox, wrap plant in its own absolutely-positioned layer with `zIndex: 5` (below the bridge's actor zIndex 10).
