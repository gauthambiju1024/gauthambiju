Plan

Fix the two layered-bleed issues during the filing motion so what flies to the shelf is just a clean narrow spine.

1. Hide the front face once the cover starts swinging
- In `src/components/HeroIdBadge.tsx`, attach a ref to the front-face card (the portrait/name/barcode element, currently `cardRef`).
- In the per-frame `applyTransform`, set its opacity to 0 (and visibility hidden) as soon as `revealT > 0` (cover has begun rotating). Restore it when `revealT <= 0`.
- This guarantees the front face cannot bleed through during/after the flip, regardless of backface-culling quirks.

2. Make the closed spine render at narrow spine size, not stretched across the cover
- In `src/components/HeroIdBadge.tsx`, wrap `closedSpineRef`'s `ProjectSpine` in a 28×CARD_HEIGHT box positioned at the same hinge location as `#book-spine` (`left: -BOOK_SPINE_W; top: 0; width: BOOK_SPINE_W; height: CARD_HEIGHT`).
- Keep the same fade-in driven by `fE` so the closed-spine face only becomes visible during the close beat.
- Visually this means the closed-cover face is no longer a stretched 260-wide rectangle — it sits exactly where the perpendicular spine sits, so the spine art reads as the actual book spine.

3. Out of scope
- No changes to easing windows, fly target, archive gating, or shelf About spine width.
- No changes to mobile, hero lanyard, globe, About card back content, or any other section.