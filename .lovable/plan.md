

## Plan: Remove Panel Animations, Add Background Systems

### What changes

**Remove** all scroll-triggered panel animations (AnimatedPanel wrapper, entrance springs, dynamic shadows, parallax, panel-entrance-glow). Panels render statically with simple CSS shadows.

**Add** three layered background systems behind the panels:

### 1. Continuous Thread Line (new `src/components/ScrollThread.tsx`)
A single SVG `<path>` that runs the full page height behind all panels. It uses `stroke-dashoffset` driven by scroll progress to draw itself as you scroll down. The path weaves left-right in an organic S-curve. Rendered as a fixed/absolute SVG behind the content with `z-index: 1`. Stroke color matches `--primary` at low opacity (~0.15). Uses `useScroll` + `useTransform` to animate dashoffset.

### 2. Ambient Particle Field (new `src/components/ParticleField.tsx`)
A canvas element fixed behind all content rendering ~40-60 small dots/circles that drift slowly. On each animation frame:
- Particles move with slight sine-wave drift (no mouse interaction needed)
- Scroll position shifts particle Y positions slightly (parallax feel)
- Particles are drawn at very low opacity (0.05-0.12) in primary/accent colors
- Canvas covers full viewport, `position: fixed`, `z-index: 0`

Uses `requestAnimationFrame` loop with cleanup on unmount. Respects `prefers-reduced-motion`.

### 3. Gradient Light Sweep (CSS in `src/index.css`)
A radial gradient "spotlight" that follows scroll position. Implemented as a `::before` pseudo-element on the page container, using a CSS custom property `--scroll-y` updated by a small scroll listener in Index.tsx. The gradient is a soft warm circle (~400px radius) at low opacity that translates vertically with scroll.

### Changes to `src/pages/Index.tsx`
- Remove `AnimatedPanel` component entirely
- Remove `useRef`, `useTransform` for shadows/parallax
- Keep `useScroll`/`useSpring` only for the top progress bar
- Remove `motion.div` wrappers from About section (keep static)
- Remove `whileInView`/`initial` from hero and about wrappers — use plain `<div>`
- Render panels as plain `<div>` wrappers (no animation)
- Add `<ScrollThread />`, `<ParticleField />` components
- Add scroll listener to set `--scroll-y` CSS variable on the container

### Changes to `src/index.css`
- Remove `.panel-entrance-glow` and its `::before` + `@keyframes glowFadeIn`
- Add `.page-spotlight` — the gradient light sweep pseudo-element
- Restore static `box-shadow` on `.section-panel`

### Files: 4
1. `src/components/ScrollThread.tsx` (new, ~60 lines)
2. `src/components/ParticleField.tsx` (new, ~80 lines)
3. `src/pages/Index.tsx` (simplified, ~50 lines)
4. `src/index.css` (remove glow, add spotlight)

