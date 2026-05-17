# About → Projects Bridge: Revised v2

The bridge now visually continues **from the existing about card** (the flipped ID-badge back rendered by `HeroIdBadge`) — no separate slab spawns in the middle of the screen, no captions.

## Choreography (scroll-pinned)

```
0.00–0.15  Globe fade   AboutGlobe fades to 0 and gently translates aside.
                        About card stays put at its current position/scale.
0.15–0.45  Tri-fold     Card's left + right thirds rotateY ±88° inward.
                        Card scaleX → 0.12. Card content fades out by 0.30.
                        Crease shading deepens. Position unchanged.
0.45–0.70  Rotate       Folded slab rotateY 0→90°. Cream paper edge lerps
                        to walnut spine color (hsl 170 25% 22%).
0.70–1.00  Shelve       Spine translates from its origin down to a drawn
                        shelf ledge near the bottom of the pinned panel.
                        Ledge draws L→R as a single warm wood line, and a
                        short walnut plank fades in beneath it so the
                        ProjectsShelf below reads as the same library.
```

`prefers-reduced-motion` → 200ms cross-fade.

## What changes

- `AboutToProjectsBridge.tsx` is rewritten to:
  - **Anchor the folding object at the same on-screen rect as the about card** (back of `HeroIdBadge`), not at the viewport center. The bridge measures that rect on mount + resize and positions its 3 flap panels there.
  - **Replace the blueprint skin with the cream card skin** (`hsl(40 25% 92%)` paper, ink border, subtle shadow, faint notebook grid) so the folding object is visually identical to the about card the user just left.
  - **Fade the globe** by dispatching a scroll-driven CSS variable (`--about-globe-opacity`) that `HeroIdBadge`'s globe layer already reads, OR — simpler — by toggling a body-level class that the existing globe wrapper subscribes to via a 1-line opacity binding. Implementation will use whichever hook already exists; if neither does, add a minimal `data-bridge-progress` attribute on `<html>` and a single CSS rule on the globe wrapper.
  - **Remove all captions, brackets, dimension lines, tick marks, and labels.**
  - **Keep**: tri-fold → 90° rotate → drop choreography, walnut spine color target, single drawn ledge line, walnut plank handoff, performance pattern (window scroll + rAF + ref mutation, zero React re-renders).

- `HeroIdBadge.tsx`: add a single opacity binding on the existing globe wrapper to a CSS variable the bridge writes. No layout changes. The flipped card itself fades out at 0.15 so the bridge's clone takes over seamlessly (eye sees one continuous object).

- No changes to `Index.tsx`, `HeroAboutFlip.tsx`, `AboutSection.tsx`, `AboutCardBack.tsx`, `ProjectsShelf.tsx`, `AssemblyHeader.tsx`, or the front of the ID card.

## Notes

- The fold originates from the card's current rect, not a new center stage — this is the key visual fix.
- Globe fade and card-fold are driven by the same scroll progress so they read as one continuous gesture.
- Shelf ledge is positioned to sit flush with the top of `ProjectsShelf` so the bookcase below feels like the same physical shelf the spine just landed on.
