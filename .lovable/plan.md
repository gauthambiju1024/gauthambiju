## Goal

Make scrolling visibly smoother end-to-end. No visual or transition changes — only performance and feel.

## Why it jitters today (from audit)

Six unconditional `requestAnimationFrame` loops run at the same time, each one calling `getBoundingClientRect()` and then immediately writing styles in the same frame. That forces a synchronous layout on every tick. Heavy offenders:

- `HeroIdBadge` (two loops)
- `AboutToProjectsBridge`
- `ToolboxToSkillsBridge` (also sets string-typed deg MotionValues per frame)
- `DeskSceneStage` (also rewrites `strokeDasharray` every frame)
- `AssemblyHeader` (30+ `setAttribute` calls per frame plus DOM create/remove for sparks)
- `ui/entropy.tsx` canvas redraws every frame even when scroll hasn't moved

No `will-change` on most animated elements. No smooth-scroll layer, so native momentum is abrupt and the rAF loops surface as jitter at scroll start/stop.

## Phase 1 — Foundation (biggest single win)

1. **Add Lenis inertial smooth scroll** (`@studio-freight/lenis`)
   - Mount once at the app root, wired to `window`.
   - Disable automatically when `prefers-reduced-motion: reduce`.
   - Make `scrollIntoView` / `window.scrollTo` calls in `Navigation.tsx` and `AssemblyHeader.tsx` go through `lenis.scrollTo(target, { offset: -100 })` so the assembly-header offset is handled centrally.

2. **Shared scroll engine** (`src/lib/scrollEngine.ts`)
   - One `requestAnimationFrame` dispatcher that ticks while the document is visible.
   - Two phases per frame: `read` (all `getBoundingClientRect` calls), then `write` (all style mutations). Eliminates forced reflow.
   - Hooks: `useScrollRead(fn)` and `useScrollWrite(fn)`; components register/unregister on mount.

## Phase 2 — Convert the six rAF loops

Each component below is changed to:
- register one read fn + one write fn with the shared engine (no own rAF),
- cache the last progress value and skip writes when delta < 0.0005,
- run nothing when the section is not intersecting (IntersectionObserver on the pin element),
- short-circuit to the final state when `prefers-reduced-motion: reduce`.

3. **`ToolboxToSkillsBridge.tsx`**
   - Replace string deg `MotionValue<string>` (`rotX`, `rotY`, `lidRot`) with numeric `MotionValue<number>` + `useTransform(n, v => \`${v}deg\`)` so Framer can batch them.
   - Read scroll progress from `framer-motion useScroll` instead of `pin.getBoundingClientRect()` per tick (matches `HeroAboutFlip`).

4. **`HeroIdBadge.tsx`**
   - Merge the two rAF loops.
   - Replace the anchor-position loop with a `ResizeObserver` (anchor only changes on resize, not on scroll).
   - Add `will-change: transform, opacity` to `cardWrapRef`, `flyingSpineRef`, `lanyardLayerRef`.

5. **`AboutToProjectsBridge.tsx`**
   - Move into shared engine; skip per-frame writes to every shelf-rule path when `bridge` hasn't changed.
   - Cache spine element list and write only the entries whose values actually changed.

6. **`DeskSceneStage.tsx`**
   - Stop rewriting `strokeDasharray` every frame — set it once after `getTotalLength()` and only mutate `strokeDashoffset` in tick.
   - Add `will-change: transform, opacity` to `.dsk-plant`, `.dsk-laptop`, `.dsk-mug`, `.dsk-notes`.
   - Cache the `.dsk-toolbox-slot` rect; only refresh on `ResizeObserver` / scroll-delta beyond a threshold rather than every frame.

7. **`AssemblyHeader.tsx`**
   - Throttle the inner `frame()` loop to 30fps (the SVG animation doesn't need 60).
   - Skip `setAttribute` when the next value rounds to the same value as the previous.
   - Pre-pool the spark `<circle>` elements (hide/show instead of `appendChild` / `removeChild`).

8. **`ui/entropy.tsx`**
   - Add a dirty flag: skip the canvas redraw when `scrollProgress` hasn't changed since the last tick.
   - Pause via IntersectionObserver when the canvas is off-screen.

9. **`MarginDoodles.tsx`**
   - Gate the scroll listener with IntersectionObserver on the doodle columns.
   - Add `will-change: stroke-dashoffset` to the animated paths.

## Phase 3 — Polish

10. Add `html { scroll-padding-top: 100px }` and remove the per-call offset hacks.
11. Add a small `useReducedMotion()` hook (single source of truth) and consume it in every animated component to skip rAF work entirely in reduced-motion mode.
12. Add `content-visibility: auto` and `contain: layout paint` to large below-the-fold sections (`ProjectsShelf`, `ThinkingWall`, `BlogSection`, `JourneyTimeline`) so off-screen content doesn't participate in layout during scroll.

## What does NOT change

- No visual redesign, no transition timing changes, no removed effects.
- The toolbox → desk handoff, hero flip, assembly header animation, and conveyor connectors all keep their current choreography exactly.
- No backend / data changes.

## Out of scope (would need a separate ask)

- Replacing Framer Motion with another animation library.
- Rewriting the Three.js desk scene (already correctly on `frameloop="demand"`).

## Expected outcome

After Phase 1 + 2 the scroll loop runs one rAF instead of six, with batched read/write, dirty-checked writes, off-screen gating, and Lenis-smoothed momentum. Scroll should feel buttery on mid-range laptops and stop the visible micro-jitter on the toolbox, hero, and desk sections.
