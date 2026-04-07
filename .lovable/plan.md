

## Plan: Remove All Background Effects

Remove the three background systems (particle field, scroll thread, gradient spotlight) and clean up related code.

### Changes

1. **`src/pages/Index.tsx`**
   - Remove imports for `ParticleField`, `ScrollThread`
   - Remove `<ParticleField />` and `<ScrollThread />` from JSX
   - Remove the `useScroll`/`useSpring` progress bar and its `motion.div`
   - Remove the scroll listener that sets `--scroll-y`
   - Remove `page-spotlight` class from container
   - Simplify to a plain container with static panels

2. **`src/index.css`**
   - Remove `.page-spotlight::before` block (gradient sweep)
   - Remove `.desk-pattern` if no longer needed

3. **Delete files**
   - `src/components/ParticleField.tsx`
   - `src/components/ScrollThread.tsx`

### Result
Clean static layout — dark background with panels, no animated background layers.

