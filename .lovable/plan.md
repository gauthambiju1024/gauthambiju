
## Scroll-Driven Panel Transitions + Inner Scroll for Library & Cases

Two tightly scoped changes:

### 1. Replace alternating L/R slide with scroll-driven crossfade

Currently `DeskStage` swaps panels instantly when `scrollYProgress` crosses a section boundary, then plays a 0.55s L/R slide animation (`AnimatePresence` + `slideVariants`). The animation is decoupled from scroll velocity.

New behavior:
- Each section occupies its own `100vh` slice of the scroll track (already true).
- Within each slice, derive a local progress `p ∈ [0,1]` from `scrollYProgress`.
- Render **two panels at a time** during the transition window (last 15% of the outgoing slice + first 15% of the incoming slice). Outside that window, only the active panel renders.
- Transition is a **pure opacity crossfade tied directly to scroll position** — no horizontal motion, no scale. Scrolling slowly = transition plays slowly; scrolling fast = transition plays fast; scrolling backward reverses it. No `AnimatePresence`, no time-based easing.
- Remove the `direction` / parity logic and `slideVariants` entirely.

Implementation in `src/components/DeskStage.tsx`:
- Subscribe to `scrollYProgress` and compute `floatIndex = v * sections.length` (no rounding).
- `activeIndex = floor(floatIndex)`, `localP = floatIndex - activeIndex`.
- Define transition zone, e.g. `localP > 0.85` → start fading in `activeIndex+1`, fading out `activeIndex`. Map `localP ∈ [0.85, 1.0]` linearly to opacity `[0,1]` for incoming and `[1,0]` for outgoing.
- Render up to two absolutely-positioned layers inside the stage container, each wrapping its `Frame` + `Section`. Use plain inline `style={{ opacity }}` updated via state (throttled) or `motion.div` with `style={{ opacity: motionValue }}` driven by `useTransform` for smoothness without re-renders.
- Preferred: use `useTransform(scrollYProgress, ...)` to derive two `MotionValue<number>` opacities — zero re-render cost.
- Keep `prefers-reduced-motion` fallback (just renders all sections stacked, as today).
- Keep header jump (`handleJump`) untouched — smooth scroll naturally drives the same crossfade.

### 2. Add inner scroll for Projects (Library) and Thinking (Case Studies)

The user wants vertical scrolling **inside** these two panels only. All other panels remain non-scrolling.

- `src/components/desk/frames/BookshelfFrame.tsx` (Projects/Library): change inner wrapper from `overflow-hidden` to `overflow-y-auto` with custom thin scrollbar styling. Keep the outer panel `overflow-hidden` so the rounded frame still clips.
- `src/components/desk/frames/CorkboardFrame.tsx` (Thinking/Cases): same treatment.
- Add a small CSS utility `.panel-inner-scroll` in `src/index.css` with: `overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: hsl(var(--border)) transparent;` plus `::-webkit-scrollbar` styling (6px, subtle thumb).
- `overscroll-behavior: contain` ensures inner scroll doesn't bubble up and trigger the outer page scroll / panel transition while reading.
- Revert the earlier "cap to 3 projects" compaction in `ProjectsShelf.tsx` (now that scrolling is allowed inside the panel) — restore showing all projects in their natural layout. No font/size compaction needed for these two panels.

### Files Modified

- `src/components/DeskStage.tsx` — replace slide variants with scroll-driven dual-layer crossfade using `useTransform`.
- `src/components/desk/frames/BookshelfFrame.tsx` — enable inner vertical scroll.
- `src/components/desk/frames/CorkboardFrame.tsx` — enable inner vertical scroll.
- `src/index.css` — add `.panel-inner-scroll` utility with thin custom scrollbar.
- `src/components/ProjectsShelf.tsx` — remove the 3-item cap and overflow-clipping tweaks added in the prior pass; allow natural shelf height.

### Out of Scope

- Other panels (Home, About, Skills, Journey, Writing, Contact) stay non-scrolling.
- Section ordering, header, 3D desk strip, routing, backend — untouched.
- No new dependencies.
