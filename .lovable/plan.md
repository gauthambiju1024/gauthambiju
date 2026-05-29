## Final plan — one toolbox, physical choreography, zero fades

### Core principle
There is exactly ONE toolbox in the DOM. It is owned by `ToolboxToSkillsBridge` and rendered as a single fixed-position SVG node. The shelf only reserves an empty slot whose rect is published to `window.__toolboxRect`. At rest, the flying toolbox sits exactly in that rect, so it visually IS the toolbox on the shelf. No second copy ever exists. No opacity crossfades anywhere in the handoff.

### The choreography (single scroll timeline, 0 → 1)

Phase 1 — LIFT (0.00 → 0.18)
The toolbox lifts straight up off the shelf with a small back-ease. Position interpolates from the shelf rect to a "hover" rect (same size, raised ~80px, slight forward tilt of 4°). The handle SVG path also stretches upward by ~2px as if grabbed. No scale change, no fade.

Phase 2 — CARRY (0.18 → 0.42)
The toolbox glides along a quadratic-bezier arc to center stage. Width/height rect-lerp to `min(56vw, 480px)` keeping aspect ratio. A subtle rotation cycle (−3° → +2° → 0°) gives a hand-carry sway. The shelf row beneath (already empty) does not need to change because spines remain in their slots.

Phase 3 — SET DOWN (0.42 → 0.50)
Toolbox settles. Rotation returns to 0, handle path contracts back to its rest curve. Tiny vertical overshoot (+4px → 0px) gives weight. Drop shadow under the toolbox grows (driven by the same `p` value via SVG filter `stdDeviation`).

Phase 4 — UNLATCH (0.50 → 0.56)
The two latch rects rotate 90° around their own pivots (click-open). The handle path stays still. Lid does not move yet — this is the mechanical "click" beat that earns the lid swing.

Phase 5 — HINGE OPEN (0.56 → 0.78)
The `<g class="lid">` group (handle + lid rect + latches) rotates around the hinge line (`transform-origin: 50% 36px`) from 0° to −118°. Easing is `easeOutQuart` so the lid decelerates as it reaches the open pose, like real metal hitting its stop. Body stays put.

Phase 6 — TRAY INTERIOR (0.78 → 1.00)
The body rect's inner content reveals via SVG `clipPath` whose height grows from 0 → full. Skill tiles inside the tray slide up one by one from the bottom edge of the clip (translateY 12px → 0, staggered ~40ms each). No opacity fades — they emerge by being uncovered by the clip mask. This is the same "construction reveal" pattern memory references.

### Reverse scroll
Every value is driven by `p` directly. Scrolling up plays Phases 6→1 in reverse perfectly: tiles tuck back under the clip, lid closes onto the latches, latches re-snap, toolbox lifts, sways back along the arc, settles into the shelf rect. No state machine, no one-shot snaps, no `landedRef`.

### Why no fades are needed
- Handoff at p=0: flying toolbox is geometrically at the shelf rect → identical pixels → nothing to fade.
- Lid open: rotation reveals tray; no opacity used.
- Interior reveal: clipPath unmasks geometry; no opacity used.
- Shelf slot: never renders a toolbox; just an invisible rect publisher. No fade required because there is nothing to hide.

The ONE place opacity is unavoidable: `window.__toolboxRect.visible` is false until the shelf is fully assembled (existing logic). Before that, the flying toolbox is also hidden — single boolean, no animation, no flash, because the shelf assembly already gates this upstream.

### Shelf slot behavior
`AboutToProjectsBridge`'s `<a ref={toolboxRef}>` becomes a pure layout box (same width/height 220×174) containing no SVG. It publishes its rect every frame as today. Click handler stays on this element so the shelf toolbox area remains clickable when at rest.

### Click → flight start
When the user clicks the shelf toolbox or scrolls into the Skills bridge, the same scroll timeline drives flight. Click triggers a smooth scroll into the section; the rest is scroll-driven.

### Implementation surface

`src/components/skills/ToolboxSvg.tsx`
- Replace exports with a single `<Toolbox>` component that takes props: `lidRotateDeg`, `latchRotateDeg`, `handleStretch`, `interiorClipPct`, `children` (interior).
- Internally renders one `<svg viewBox="0 0 96 76">` with three groups: `body`, `lid` (rotated via `transform`), `latches` (each rotated around its own pivot). Interior is rendered inside a `<foreignObject>` clipped by a `<clipPath>` whose height = `interiorClipPct * bodyHeight`.
- Geometry at all-zero props is pixel-identical to today's `ToolboxClosed`.

`src/components/AboutToProjectsBridge.tsx`
- Remove `<ToolboxClosed>` from the slot. The `<a>` stays as an empty positioned box, same dimensions, still publishes `__toolboxRect`.
- Keep its archive entrance animation (the slot itself rises into place); since nothing is rendered inside until the flying toolbox arrives at the rect, the archive ARRIVAL of the toolbox is what the flying toolbox visualizes by docking into the rect at p=0 of the Skills bridge.
- To make the archive entrance also use the same single toolbox: expose the slot's transformed rect (not just final rect) via `__toolboxRect`. The flying toolbox follows it in real-time, so during the projects-shelf archive the toolbox is seen flying in with the spines. No second toolbox needed.

`src/components/ToolboxToSkillsBridge.tsx`
- One RAF loop, direct DOM mutation (no React re-renders), matching the project's perf rule.
- Reads `window.__toolboxRect` + own `scrollYProgress` and writes transforms/props on the single `<Toolbox>` node.
- Computes center-stage rect from viewport.
- Drives all six phases from one `p` value via segmented smoothstep helpers already used in `AboutToProjectsBridge`.

### Files
- edit `src/components/skills/ToolboxSvg.tsx`
- edit `src/components/AboutToProjectsBridge.tsx`
- edit `src/components/ToolboxToSkillsBridge.tsx`

No DB, no admin, no new dependencies.