## Fix
Slow down the spine's flight to the shelf so the transition feels gentler. Widen the `flyT` segment window so the motion spans more scroll progress at the same easing curve.

## Change
`src/components/HeroIdBadge.tsx` only:
- Widen the `flyT` window from `seg(0.74, 0.96, bridge)` to roughly `seg(0.62, 1.0, bridge)` so the spine takes noticeably longer to travel and land.
- No change to bezier path, lean, settle, fade-in/out, scaleX, or scaleY.

## Out of scope
Shelf, About slot, ProjectSpine, card flip, book close.