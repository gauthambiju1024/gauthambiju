
# Let the library breathe + real 3D toolbox

## Part 1 — Let projects fully appear and settle before transition

Today the takeover ramps over the very last 12% of the projects pin (`HeroAboutFlip` height 340vh, takeover 0.88→1.0 ≈ 41vh). That leaves no "settled" dwell — the shelf finishes archiving and immediately starts fading.

Restructure the timeline of `HeroAboutFlip` (pin height) + `AboutToProjectsBridge` (segment windows):

```
t = 0.00 ─ 0.30   Hero & ID-card (unchanged)
t = 0.30 ─ 0.55   Card flies + scales (unchanged)
t = 0.55 ─ 0.70   Card flips Y (unchanged)
t = 0.70 ─ 0.86   Shelf draws + spines archive  (was 0.72–1.0, now compressed earlier)
t = 0.86 ─ 0.94   DWELL — shelf fully settled, fully opaque, fully interactive
t = 0.94 ─ 1.00   Takeover — shelf fades, toolbox lifts to center
```

Concrete edits:

- `HeroAboutFlip.tsx`: bump pin height from `340vh` → `460vh`. This gives ~37vh of pure dwell where the user can stop scrolling and look at the shelf without anything moving, plus a smooth ~28vh takeover.
- `AboutToProjectsBridge.tsx`:
  - Move `bridge = seg(0.70, 0.86, t)` (was 0.72–1.0) so the archive completes earlier.
  - Move takeover window to `seg(0.94, 1.0, t)` (was 0.88–1.0). Stays at 0 through the dwell phase, then ramps cleanly.
  - Adjust the per-row draw/archive sub-windows proportionally (they're relative to `bridge`, so no change needed beyond the window shift).
  - During dwell (bridge ≥ 1.0, takeover === 0): shelf is fully interactive — spines and toolbox clickable.

## Part 2 — Real 3D toolbox (CSS 3D faces, no R3F)

Today the "rotation" is a single flat SVG with `rotateX`, which foreshortens the front face but never shows an actual top. Replace the SVG with a true 3D cube built from CSS-3D faces. Lightweight, no new deps, fits the project's "DOM direct mutation, no re-renders" pattern.

### New component `src/components/skills/Toolbox3D.tsx`

A reusable 3D box that renders six face divs plus a hinged lid:

```text
       ┌──── lid (hinged at back-top edge) ────┐
       │                                       │
       │      ┌── TOP (foam tray) ──┐         │
       │      │ [P] [T] [B] columns │         │
       │      └─────────────────────┘         │
   ┌───┤  FRONT face (same look as today)     ├───┐
   │ L │                                        │ R │
   │   │   ┌─── BACK ───┐                       │   │
   └───┤   └────────────┘                       ├───┘
       └────── BOTTOM ────────┘
```

Faces (each is an absolutely-positioned `<div>` styled to match the current SVG palette):
- **Front** — same metallic gradient as today, with the "TOOLS" panel + corner studs (rendered with nested divs/SVG paths).
- **Back** — slightly darker version of front.
- **Top** — narrow rim (closed lid sits on it). Becomes the visible opening once the lid swings back.
- **Bottom** — flat dark.
- **Left / Right** — short side panels, ~28px deep at center-stage size, scaled proportionally.
- **Lid** — separate flat plane hinged along the back-top edge. Closed = sits flush over top. Open = `rotateX(-140°)` swings up & back, exposing the top opening.
- **Interior tray** — sits inside the box at the top face's z-plane. Holds the foam-compartment skills layout from `ToolboxInterior` variant="top". Always present; only visible when the box is tilted forward enough to see down into it.

Imperative handle (`Toolbox3DHandle`):
- `setView(rotX: number, rotY: number)` — overall box rotation in degrees.
- `setLid(deg: number)` — lid rotation around its hinge.
- `setLatches(deg: number)` — both side latches.
- `setInteriorReveal(pct: number)` — clip-path inset on the interior tray.

All setters write directly to refs (style attribute / setAttribute), zero React re-renders during scroll.

### Choreography in `ToolboxToSkillsBridge.tsx`

Section pin height stays 260vh. The flying box uses `Toolbox3D` instead of `Toolbox`. Per-phase progress on this section's own `scrollYProgress`:

| Phase             | Range      | Action                                                                 |
|-------------------|-----------|------------------------------------------------------------------------|
| Carry in         | (driven by takeover from Phase 1) | Box arrives at center, rotX = 0, lid closed. |
| **Tilt to top view** | 0.05–0.40 | `rotateX: 0° → −62°` (front face tips away, top opening rotates toward camera). |
| **Latches click**    | 0.30–0.38 | Both latches snap 90° to "unlocked". |
| **Lid swings open**  | 0.38–0.62 | Lid rotates `0 → −140°` around back-top hinge — folds back and out of view. |
| **Interior reveal**  | 0.60–0.92 | Foam tray inside the box becomes visible via clip-path inset (top-down, tools rise into their compartments). |
| **Header**           | 0.85–1.00 | "Skills · The Toolbox" caption fades up below the box. |

Final view at p ≈ 0.95: camera looks down into a real 3-compartment tray with skill-tools resting in foam. Hover/click on a tool pops its context card (existing behavior).

### Shelf rendering

`AboutToProjectsBridge.tsx` continues to render the shelf toolbox in its slot. Replace the inline `<ToolboxClosed>` with `<Toolbox3D static />` (a no-tilt rest pose). At rest it's pixel-equivalent to the current closed look (front face dominant, lid flush). The flying `Toolbox3D` in the bridge takes over rect-perfectly, same as today.

## Technical notes (engineer)

- Pure CSS 3D: `transform-style: preserve-3d`, `backface-visibility: hidden`, `perspective: 1400px` on the wrapper.
- All face dimensions derive from container width × `(76/96)` aspect ratio to match current viewBox proportions.
- Lid hinge: `transform-origin: 50% 0%` on the lid plane, which sits at `translateZ(depth/2)` and `translateY(0)` aligned with the top face's back edge.
- No new dependencies. No R3F (would require WebGL canvas + lifecycle and is overkill for one box).
- `Toolbox3D` exports a `ClosedRest` named export so `AboutToProjectsBridge` can use it without managing refs.
- Delete `ToolboxSvg.tsx` once `Toolbox3D` is wired in both places (or keep as fallback). Plan keeps the file for one commit so rollback is easy, then removes it.

## Files touched

- **NEW** `src/components/skills/Toolbox3D.tsx` — CSS-3D box component + imperative handle.
- `src/components/HeroAboutFlip.tsx` — pin height 340 → 460vh.
- `src/components/AboutToProjectsBridge.tsx` — shift segment windows (draw/archive earlier, takeover later), swap `ToolboxClosed` → `Toolbox3D` rest pose.
- `src/components/ToolboxToSkillsBridge.tsx` — swap `Toolbox` → `Toolbox3D`, replace tilt math (single rotateX on inner) with the new view/lid/interior calls; tighter phase windows.
- `src/components/skills/ToolboxInterior.tsx` — no logic change; top-down variant already exists, used by the interior tray inside the 3D box.

## Out of scope
- Hero ID-card flip, projects shelf row draw/archive (only window shifts), assembly header, margin doodles, entropy background — untouched.
