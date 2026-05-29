## Problem

`ToolboxToSkillsBridge` currently renders its own miniature library (two shelves with "MORE ABOUT ME", "CLASSY", "VAIDYA" books + an empty slot used as the toolbox start position). This duplicates the real `ProjectsShelf` / `AboutToProjectsBridge` above it and shows a second toolbox during the recede phase.

The user wants:
- No duplicate shelf inside the pinned bridge.
- The flying toolbox originates from the **real** toolbox already sitting on the bottom shelf of `AboutToProjectsBridge`.
- Only one toolbox visible at any moment.

## Plan

### 1. `src/components/ToolboxToSkillsBridge.tsx`
- Delete the `ShelfLine`, `Book`, and the entire `motion.div` block that renders the duplicate shelves (lines ~287–325).
- Remove `slotRef`, `shelvesY`, `shelvesOpacity`, and the inner `Book` helper.
- Replace the slot-based starting position with the live `window.__toolboxRect` published by `AboutToProjectsBridge`:
  - In `useLayoutEffect`, read `(window as any).__toolboxRect` (poll on `scroll` / `resize`, already wired) to compute `pos.x / pos.y / startScale` from that rect instead of `slotRef`.
  - `startScale = rect.width / W`.
- While in flight (smoothProgress > 0 and < ~0.97), set `(window as any).__toolboxInFlight = true` so `AboutToProjectsBridge` hides its own shelf toolbox; clear it otherwise. This already works — `AboutToProjectsBridge` reads the flag and sets opacity to 0.
- Drop the early scroll hint that says "Scroll to explore" since the recede beat is gone (optional — keep if it still reads well at p≈0).
- Adjust scroll keyframes so beat 1 (0 → 0.2) is purely the toolbox lifting + rotating from the shelf rect to center stage (no shelf fade needed). Beats 2/3 (open + land) unchanged.
- Section height can drop from `600vh` to `~450vh` since one beat is removed.

### 2. `src/components/AboutToProjectsBridge.tsx`
No structural changes. It already:
- Renders the realistic `<ToolboxClosed />` on the bottom shelf.
- Publishes `__toolboxRect` every frame.
- Hides itself when `__toolboxInFlight` is true.

Verify the rect is published even when the section is fully scrolled past (so the bridge below can still read a sane start rect). If not, cache the last rect in the bridge instead of reading per-frame.

### 3. No other files touched
`FinalWorkbench`, `ProjectsShelf`, `Index.tsx`, `index.css`, skill data, doodles, AssemblyHeader — unchanged.

## Result

Scrolling past projects: the actual shelf toolbox lifts off the bottom shelf, flies to center, rotates open to reveal skills, then lands on the desk. No second shelf, no second toolbox, no empty frame.
