# Plan: Keep About info compact on the actual back of the card

The back of the ID card stays card-sized (no panel-sized blowup, no separate About section). It just shows the small bit of "about" info that fits on a real business card. The card still flips toward the viewer; the user reads the back at the enlarged on-screen size produced by the existing scale animation.

## Changes

### `src/components/HeroIdBadge.tsx`

1. Remove the back-face counter-scale logic (the per-frame width/height/scale assignment to `backRef`).
2. Remove the `backChildren` prop (or keep it but unused — cleaner to remove).
3. Replace the back face with an inline, card-sized layout that mirrors the front card's dimensions (`width: 200`, same padding, same paper background, `backfaceVisibility: hidden`, `transform: rotateY(180deg)`, `position: absolute; inset: 0`). It contains a compact "about" block:

   - Small label row: `ABOUT` / `· 02`
   - Name (smaller serif/handwritten accent line)
   - 2–3 short lines of bio (≈25 words total) pulled from `useSiteContent('about', 'card_back')` with a sensible default fallback.
   - Focus tags row: 3 short chips (e.g., `Product`, `AI Workflows`, `Business × UX`).
   - Footer: `gauthambiju.com` / `Calicut, IN` (or similar) + a tiny mono `· END` mark mirroring the front's barcode.

4. Keep transform-style `preserve-3d` on the wrapper. Keep front face `backfaceVisibility: hidden`. The card simply has two sides at the same size.

### `src/components/HeroAboutFlip.tsx`

1. Stop passing `backChildren`.
2. Remove the paper backdrop fade — once the back of the card is just a small card (not a panel takeover), the dark blueprint behind it is fine; the card reads as a flipped object on the desk.
3. Optionally shorten the pin section (e.g., `150vh` instead of `200vh`) since there's less narrative payload after the flip; the user lands faster on the next station (Projects).
4. Keep `id="home"` and `id="about"` anchors so nav links still work.

### Files

- `src/components/HeroIdBadge.tsx` — replace back face with compact card-back content; drop counter-scale code.
- `src/components/HeroAboutFlip.tsx` — drop `backChildren`, drop paper backdrop, optionally shorten pin.

### Acceptance

- Card flips and the back stays the same size as the front (no growing About panel).
- The back contains a short "about me" blurb that fits naturally on a business-card back.
- Scale-up animation still makes it feel like the card is coming toward the viewer; the back is fully readable when the card is at its largest mid-flip.
