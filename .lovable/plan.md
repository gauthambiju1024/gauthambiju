# Plan: Render About content on the back face of the ID card

Drop the separate About panel layer; put the About content inside the card so the flip literally reveals it.

## Changes

### `src/components/HeroIdBadge.tsx`

1. Wrap the existing card body in a "front face" div with `backfaceVisibility: hidden`.
2. Add a sibling "back face" div inside the same `cardWrapRef`, with:
   - `position: absolute; inset: 0;`
   - `transform: rotateY(180deg);`
   - `backfaceVisibility: hidden;`
   - The back face renders `<BusinessCardFrame><AboutSection /></BusinessCardFrame>` (or just `<AboutSection />` styled as a card back — see "Sizing" below).
3. The card wrapper already has `transformStyle: preserve-3d`, which is what makes the two faces work.

### Sizing trick (so About is readable when flipped)

The card is 200px wide and is scaled up via CSS transform during flip. If we put `AboutSection` directly inside, its text would render at 200px-card scale and only become visible-sized after the scale animation — but pixel-perfect-wise it would be re-rasterized fine. To keep the About layout legible and laid out at panel proportions:

- Render the back face at **panel-target dimensions** (e.g., width = 1000px, height = 620px), positioned centered on the card (`left:50%; top:50%; translate(-50%,-50%)`).
- Pre-scale the back face down by `1 / maxScale` so at the resting state (scale=1) the back is the same on-screen footprint as the card front (200px). As the card scales up to `maxScale` during the flip, the back face naturally arrives at its design size — exactly filling the panel area.
- This means `AboutSection` is laid out at full size from the start; only its on-screen footprint changes with the parent's scale.

Implementation detail: `maxScale` is computed in the per-frame transform code. Mirror that calc into a CSS variable on the card wrapper (e.g., `--card-max-scale`) set once per resize, and apply `transform: translate(-50%,-50%) rotateY(180deg) scale(calc(1 / var(--card-max-scale)))` to the back face. The back face stays correctly sized regardless of viewport.

### `src/components/HeroAboutFlip.tsx`

1. Remove the separate `<motion.div id="about">` panel layer (with `BusinessCardFrame + AboutSection` and `backOpacity` fade). It's no longer needed because the back of the card is the about.
2. Keep `id="about"` somewhere so the Assembly Header anchor still scrolls here. Place `id="about"` on a small spacer div near the bottom of the pin section (e.g., absolute, top:50%) — that way clicking "About" in the nav scrolls the user into the flip range where the card is mid-flip / flipped.
3. Hero panel still fades via `heroFade` so the dark blueprint background recedes as the about content takes over.
4. Background behind the card while flipped: add a soft cream/paper backdrop on the sticky stage (matches BusinessCardFrame's notebook tone) that fades in 0.55→0.80 so the flipped card sits on a coherent surface, not the dark blueprint.

### Acceptance

- The same lanyard ID card flips on Y; its back face shows the About section content directly (no separate panel fade).
- About text is laid out at full panel size (no cramped text shrunk inside a 200px card).
- The Assembly Header's "About" link still scrolls to the flipped state.
- Mobile (no flip) still shows About as a normal section — needs a separate stacked About panel after the pin section for `< 800px` viewports only.

### Files

- `src/components/HeroIdBadge.tsx` — add back face + sizing trick.
- `src/components/HeroAboutFlip.tsx` — remove the separate About layer; add anchor spacer; add backdrop fade; render mobile-only fallback About panel after the pin.
