
# Toolbox takeover — continuous, no empty frames, top-down reveal

## Problem
Today the lift-to-center happens **inside** `ToolboxToSkillsBridge`, which only activates once its own pinned section is in view. By then the projects shelf has already scrolled away, leaving an empty viewport between the two pins. The toolbox also stays in side view the whole time, so "skills inside the toolbox" never reads as inside.

## Fix (one continuous timeline across both sections)

### Phase A — Library hand-off (lives inside `HeroAboutFlip`, driven by its own `progressMV` 0.88 → 1.0)
Happens **while the projects shelf is still on screen** — no scroll jump, no blank frame.

1. The shelf (`shelfWrapRef`) fades + scales down (opacity 1→0, scale 1→0.92, slight blur 0→4px).
2. The shelf toolbox slot publishes its rect (already done). A new shared flag `window.__toolboxTakeoverProgress` (0→1) is published.
3. The **same** flying toolbox node (still owned by `ToolboxToSkillsBridge`, rendered as `position: fixed`) reads `__toolboxTakeoverProgress` in addition to its own scroll progress, so it can begin lifting while the previous section is still pinned. From rest on the shelf it lifts straight up (~80px) and starts arcing toward viewport center.
4. By the end of `HeroAboutFlip` the toolbox is sitting dead-center, large (`min(56vw, 480px)`), still in front view, latches closed, lid closed. Shelf is fully faded.

### Phase B — Rotate to top-down (inside `ToolboxToSkillsBridge`, p 0.00 → 0.30)
Now the next pinned section takes over. Toolbox is already centered (no jump).

1. **Tilt** — `transform: perspective(1200px) rotateX(0deg → 72deg)`, easing `easeInOutQuart`. The handle catches light and rolls back.
2. **Latches click open** — both latch rects rotate 90° around their pivots (0.18 → 0.24).
3. **Lid opens AWAY from camera** — because we're now looking top-down, the lid's hinge runs along the back edge; it rotates `−110°` away from the viewer (0.24 → 0.30). At the end, the lid is flush against the back, out of sight.

### Phase C — Top-down interior reveal (p 0.30 → 0.85)
The toolbox body is now a tray seen from above. Replace the current side-view interior with a new top-down layout:

1. **Tool tray graphic** — the existing SVG body is replaced (only in the top-view state) with a 3-compartment foam-insert tray:
   ```
   ┌──────────┬──────────┬──────────┐
   │ PRODUCT  │ TECHNICAL│ BUSINESS │
   │  ▭▭ ▭▭   │  ⚙  ⚙  ⚙ │  ▭ ▭ ▭   │
   │  ▭▭ ▭▭   │  ⚙  ⚙  ⚙ │  ▭ ▭ ▭   │
   └──────────┴──────────┴──────────┘
   ```
   Each compartment has a milled foam recess (inset shadow) and the skill chips are styled as **actual tools resting in the foam** — wrench-shaped for technical, square plates for product, calipers for business. Chip text is laser-etched on the tool surface.
2. Tools rise into their slots one by one (staggered ~50ms) via `clip-path: inset(...)` reveal — geometry only, no opacity fade.
3. Section header ("Skills · The Toolbox") fades up below the tray.

### Phase D — Skill interaction (p ≥ 0.85)
Tools are interactive (hover lifts ~3px out of foam, click pops the context tooltip). Same data source as today (`useSiteContent("skills", "groups")`).

## Files to change

- `src/components/AboutToProjectsBridge.tsx`
  - Add `phaseA` segment 0.88 → 1.0: drive shelf opacity/scale/blur and publish `window.__toolboxTakeoverProgress`. Keep all existing shelf draw/archive logic untouched.
  - At the end of phase A, set `__toolboxRect` to the **center-stage rect** (not the slot rect) so the bridge knows where the toolbox should be by the time scroll enters the next section.

- `src/components/ToolboxToSkillsBridge.tsx`
  - Remove the current lift/carry phases. Read both `scrollYProgress` (for B/C/D) and `window.__toolboxTakeoverProgress` (for A). When takeover > 0 and own progress = 0, drive lift/carry from the takeover value. When own progress > 0, use it.
  - Add **rotateX tilt** (Phase B) on the fly node wrapper: `perspective(1200px) rotateX(…)`.
  - Swap to top-view interior at `rotateX > 35°` — body SVG fades to dark (inside-of-box color) and the foam-tray HTML overlay takes the full body area instead of the current side-view chip overlay.
  - Keep the single-toolbox principle (one SVG, parts mutated by ref).

- `src/components/skills/ToolboxInterior.tsx`
  - Add a new `variant: "top-view"` prop. When set, render the 3-compartment foam tray with tool-shaped chips (each compartment a CSS recess; tools as flex children with custom clip-paths / SVG silhouettes). Existing side-view variant kept for fallback.
  - Reuse existing skill data + tooltip code; only the chip styling changes.

- `src/components/skills/ToolboxSvg.tsx`
  - Add a `lidAway` prop (or expose via the existing handle) so the lid rotation pivots around the **back edge** (y=22, top of viewBox) when top-view is engaged, instead of around the front hinge. Implemented by switching the lid group's `transform-origin` based on a `setLidPivot('front' | 'back')` imperative call.

## Technical notes (for the engineer)

- No new dependencies. All RAF, direct DOM mutation, no React re-renders during scroll.
- Z-index: the flying toolbox sits at `z-30` (already set). The shelf fade happens on `shelfWrapRef` which is below the fixed toolbox node — they coexist visually during Phase A.
- `__toolboxTakeoverProgress` lifecycle: set to 0 on mount, ramps 0→1 across HeroAboutFlip 0.88→1.0, then stays at 1 while the next section is active, reset to 0 on scroll back.
- All Phase A↔B handoff math uses the **same** end rect (center stage), so the toolbox is pixel-identical at the boundary — no jump.
- No opacity fades on the toolbox itself anywhere; the shelf fade is the only opacity animation in the sequence.

## What stays untouched
- Hero ID-card flip
- Projects shelf draw/archive choreography
- Skills data model and tooltips
- Margin doodles, header, entropy background
