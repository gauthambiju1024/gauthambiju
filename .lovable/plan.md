## Why there's currently a crossfade

The "book-spine" you see inside the closing book and the "flying spine" that lands on the shelf are two separate DOM elements in `HeroIdBadge.tsx`:

- **In-book spine** (`spineSkinRef`, line 695) — lives inside `cardWrap`, rendered as `<ProjectSpine data={ABOUT_SPINE_DATA} fullHeight />`.
- **Flying spine** (`flyingSpineRef`, line 481) — a separate portal-mounted element, also rendered as `<ProjectSpine data={ABOUT_SPINE_DATA} fullHeight />`.

Both render the **exact same component with the exact same data**, so they are pixel-identical. The "crossfade" you see is purely an opacity blend during the handoff window:

- `cardWrap.style.opacity = 1 - handoffT` (in-book spine fades out)
- `flyingSpine.style.opacity = fadeIn * fadeOut` where `fadeIn = seg(0, 0.2, handoffT)` (flying spine fades in)

Both elements are visible together for ~20% of the handoff, which reads as a ghost/double-spine moment.

## Can they be the SAME spine? Yes — visually.

They already render identical markup, and the flying spine is positioned by measuring `spineSkinRef.getBoundingClientRect()` at the handoff frame — so it starts at the exact same on-screen position and size. No DOM unification is needed; we just need to remove the opacity blend so the swap is invisible.

## Changes in `src/components/HeroIdBadge.tsx`

1. **Instant swap, no fade.** Replace the crossfade with a hard handoff at a single frame:
   - Line 286: `cardWrap.style.opacity = handoffT > 0 ? 0 : 1;` (binary, not gradient).
   - Line 345–347: remove `fadeIn`; set `flyingSpineRef.current.style.opacity = String(fadeOut);` so the flying spine appears at full opacity the instant it takes over.
   - Since both elements are pixel-identical and sit at the same rect, the swap is invisible — it looks like one continuous spine.

2. **Tighten handoff to the exact close-end frame.** Move `handoffStart` from `0.70` to `1.0` so the flying spine takes over the instant the book finishes shrinking, not partway through. Pair this with widening `flyT` from `seg(0.70, 1.0, bridge)` to `seg(0.75, 1.0, bridge)` so the flight still has room to play out after the swap.
   - Net effect: book shrinks fully → at the very last frame of `closeT`, the in-book spine vanishes and the flying spine appears at the identical rect → flight begins. One spine, no ghost.

## Preserved

- `closeT = seg(0.30, 0.90, bridge)` — slow elegant shrink, unchanged.
- Bezier flight path, lean, settle, landing — unchanged.
- `ProjectSpine` markup, colors, and `ABOUT_SPINE_DATA` — unchanged on both sides.

## Result

The book closes, shrinks to the spine, and that spine flies to the shelf as a single continuous object. No crossfade, no double-spine ghost frame.
