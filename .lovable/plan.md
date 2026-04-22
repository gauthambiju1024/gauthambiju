
## Redesign Section 2 (About) as a Business Card on the Desk

Replace the current notebook-style About section with a single tactile **business card resting on the dark walnut desk surface**. Hero stays exactly as-is.

### Concept

One premium business card, slightly rotated at rest, sitting on the desk. Click to flip — front shows identity, back shows how I work. All existing About copy is preserved, just redistributed across the two faces.

```text
   ┌─────────────────────────────────────────────┐
   │  GB                                  · · ·  │
   │                                             │
   │   GAUTHAM BIJU                              │
   │   ───────────── (gold foil rule)            │
   │   PRODUCT  ·  STRATEGY  ·  SYSTEMS          │
   │                                             │
   │   "Build with intent. Ship what matters."   │
   │                                             │
   │   ◉ India   ✉ email   ↗ linkedin            │
   │                              flip ↻         │
   └─────────────────────────────────────────────┘
            (soft shadow on walnut desk)
```

Back face: condensed 2-paragraph narrative · 3 numbered traits (01/02/03) · focus pills · 2×2 quick-facts grid · "↺ flip back".

### Visual Treatment
- Card surface: warm cream `hsl(36 30% 94%)` with subtle paper grain
- Hairline 1px border, inner top highlight, soft layered drop shadow on the desk
- Rest rotation `-1.8deg`; straightens on hover
- Gold-foil accents (`--primary`) for monogram, divider, glyphs
- Section background: dark walnut desk (reuse existing desk tokens) with vignette so the card pops
- No notebook chrome — no spine, no holes, no page-fold

### Interactions
- Idle: gentle 4px Y-float breathing loop
- Hover: rotates to 0°, lifts 6px, shadow deepens
- Click card / flip button: 180° Y-axis flip (Framer Motion spring, stiffness 120 / damping 18)
- Contact chips: hover lift + animated underline
- `prefers-reduced-motion`: disables float + flip; back content stacks below front

### Technical Plan

1. **Rewrite `src/components/AboutSection.tsx`**
   - `flipped` state boolean
   - Outer wrapper: `perspective: 1500px`
   - Inner: `transform-style: preserve-3d`, animates `rotateY` 0 ↔ 180
   - Two absolute faces with `backface-visibility: hidden`
   - Reuses existing strings: strengths, focus areas, quick facts, quote, narrative

2. **Update `src/pages/Index.tsx`**
   - Strip notebook wrapper around `#about` (remove `notebook`, `notebook-grid`, spine, margin, hole punches, page-fold)
   - Replace with `<div id="about" className="desk-card-panel">`

3. **Add CSS in `src/index.css`**
   - `.desk-card-panel` — walnut gradient + vignette + generous padding
   - `.business-card` — paper texture, hairline border, layered shadow, `rounded-md`
   - `.card-foil` — gold gradient for monogram + divider
   - `@keyframes card-float` — 4px Y-loop
   - Reduced-motion overrides

4. **No new dependencies** — Framer Motion, Tailwind, existing CSS tokens and fonts only.

### Files Changed
- `src/components/AboutSection.tsx` (rewrite)
- `src/pages/Index.tsx` (swap notebook wrapper for desk-card panel on `#about`)
- `src/index.css` (business-card + desk-panel styles + keyframes)

### Out of Scope
- Hero section (untouched)
- Header, other sections, routing, backend — all unchanged
