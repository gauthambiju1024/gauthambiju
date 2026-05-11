# Plan: Use the real hero ID card for the flip

Replace the duplicate "morph card" with the actual hero ID card so the same lanyard-hung badge slides to center and grows toward the viewer.

## Refactor

1. **Extract** the lanyard SVG + draggable ID card markup from `src/components/HeroSection.tsx` into a new component `src/components/HeroIdBadge.tsx`. It keeps all current behavior: lanyard path math, drag-to-move, portrait, ribbon text, drop shadow.
   - Props: `stageRef` (the hero panel rect to anchor the lanyard to) and an optional `motionStyle` (framer-motion style object) applied to the outer stage element.
2. **Remove** the badge JSX and the `createPortal` overlay from `HeroSection.tsx`. Hero keeps only its text/CTA content.
3. **Mount** `<HeroIdBadge>` inside `HeroAboutFlip` so it lives in the same DOM subtree as the flip stage. Pass it the hero panel ref so the lanyard still anchors to the top of the hero.
4. **Drive transforms with scroll progress** (no replica card, no body data attribute):
   - 0.00–0.30 — badge sits at its current resting spot (top:90, right:32), lanyard visible, drag enabled.
   - 0.30–0.55 — badge translates to viewport center (compute target relative to stage), `scale` 1 → ~3.6, `rotate` 8° → 0°, lanyard `opacity` 1 → 0, drag disabled. Use `transform: translateZ()` feel by combining scale + slight Y lift so it reads as "coming toward the viewer".
   - 0.55–0.80 — `rotateY` 0° → 180°.
   - Past 0.55 — About panel (already rendered behind) fades in via existing `backOpacity`; badge front face uses `backface-visibility: hidden` so the back of the card is invisible and About shows through.
5. Delete the placeholder back-face div and the front-face replica card markup added in the previous iteration.
6. Remove the `body[data-hero-card-hidden]` CSS rule and the `useMotionValueEvent` toggle — no longer needed.

## Technical notes

- The card transforms must be applied to its outermost wrapper (the one currently positioned `right: 32; top: 90` with `rotate(8deg)`). Convert that wrapper into a `motion.div` whose `top/right/rotate/scale/rotateY/x/y` come from `useTransform(scrollYProgress, ...)`.
- The lanyard anchors itself by reading the slot rect inside the card; once we transform the card, the existing `updateLanyard()` recomputes paths every animation frame, so the lanyard naturally stretches as the card moves — then fades out.
- Drag handler should early-return when `scrollYProgress.get() > 0.25` to avoid fighting the scroll-driven transform.
- Keep the badge `hidden md:block` (no flip on mobile, matches existing behavior).
- Anchor IDs `#home` and `#about` remain on their respective panel wrappers in `HeroAboutFlip`.

## Files

- `src/components/HeroIdBadge.tsx` — new, owns lanyard + card.
- `src/components/HeroSection.tsx` — strip out badge/portal/lanyard.
- `src/components/HeroAboutFlip.tsx` — mount `<HeroIdBadge>`, drive its transforms from `scrollYProgress`; remove the replica morph card and the back-face placeholder.
- `src/index.css` — remove the `body[data-hero-card-hidden="1"]` rule.

## Acceptance

- The same lanyard-hung ID card visible in the hero is the one that moves; no second card pops in.
- Scrolling smoothly slides it to the center while it grows (reads as moving toward the viewer), then it flips on Y to reveal the About panel.
- Reverse scroll plays the animation in reverse, returning the card to its draggable resting state.
- Mobile keeps the simple stacked layout.
