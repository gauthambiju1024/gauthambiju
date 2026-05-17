
## Problem

After removing the `__bridgeActive` stage pinning, `HeroIdBadge`'s stage tracks `#home`. By the time the user scrolls into `AboutToProjectsBridge`, `#home` is above the viewport, so the card has already scrolled off screen. The user sees empty space and then the shelf, with no fold.

The earlier complaint ("globe and about reappears") was about the **globe** fading back in during the bridge, not about a card position jump. The stage-pinning itself was fine.

## Change (single file: `src/components/HeroIdBadge.tsx`)

Restore the bridge-active branch inside the stage `update()`:

```ts
const bridgeActive = !!(window as any).__bridgeActive;
let r: { left: number; top: number; width: number; height: number };
if (bridgeActive) {
  r = { left: 0, top: 100, width: window.innerWidth, height: window.innerHeight - 100 };
} else {
  r = anchor.getBoundingClientRect();
}
```

Keep the opacity calculation skipping the parent walk when `bridgeActive` (otherwise the faded blueprint frame would dim the pinned card).

Leave everything else as-is:
- `applyTransform` already holds `t = 1` when `bridgeActive`, so the card stays at center+flipped.
- `__bridgeProgress` already drives spine-skin cross-fade, shrink, and drop to `__bridgeSlotRect`.
- Globe stays hidden throughout the bridge (`globeLayerRef.opacity = p2 * (1 - tSkin)`).

## Why no visible jump this time

At the instant `bridgeActive` becomes true (top of the bridge section), `#home` inside the still-sticky `HeroAboutFlip` is at `{left:0, top:0, width:vw, height:vh}` with the inner content offset by `pt-[100px]` — which renders the card stage at the same coordinates as the pinned `{0, 100, vw, vh-100}`. The hand-off is seamless.

## Out of scope

The shelf, spine component, bridge content, and `Index.tsx` are correct and untouched.
