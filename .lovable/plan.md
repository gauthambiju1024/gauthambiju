## Root cause

When I lowered the portal stage `z-index` from 30 → 1 to put the card under the Assembly Header, I accidentally pushed it under the `.margin-content-wrapper` (which is `z-[2]`). The wrapper contains the entire hero panel, so the ID card and globe are now rendered **behind** the hero blueprint and invisible at all times.

## Fix

`src/components/HeroIdBadge.tsx`
- Set the portal stage `z-index` to **3** (above the `z-[2]` content wrapper, still below the body-level fixed Assembly Header at `z-50`). This restores visibility while keeping the card under the menu when scrolling.

## Verification

After the change:
- Card visible on first paint, stacked above the blueprint hero panel.
- Globe layer becomes visible as the flip progresses (its opacity is driven by `p2`, unchanged).
- Assembly Header still occludes the card during scroll past the hero (header is fixed at body level with `z-50` > stage `z-3`).

If the globe canvas itself still appears empty after the z-fix, follow up with a `Globe.tsx` resize fix: re-run `onResize` after mount and inside a `ResizeObserver` so the cobe canvas picks up the parent's pixel size (currently it reads `offsetWidth` once and the local `width` variable is captured by closure).

## Out of scope

Lanyard, drag, back-of-card content, admin editor, JourneyTimeline.
