## 1. Fix About-spine flicker

**Root cause.** The flying spine (in `HeroIdBadge.tsx`) fades out between `bridge 0.985 → 1.0` via `shelfHandoff`. The shelf spine (in `AboutToProjectsBridge.tsx`) only snaps to `opacity: 1` at the exact instant `bridge >= 1.0`. That leaves a ~15ms window where the flying spine is already mostly transparent but the shelf spine is still hidden — a one‑frame "nothing" gap that reads as flicker, plus the snap pops in on top.

Previous direction tried a *hard* handoff. That made the gap shorter but didn't remove it: any rounding between two RAF samples can still drop one frame.

**Fix — symmetric crossfade in the same window, both directions:**

- `AboutToProjectsBridge.tsx`, inside the RAF:
  ```ts
  const shelfFade = clamp01((bridge - 0.985) / 0.015);
  aboutSpineRef.current.style.opacity = String(shelfFade);
  aboutSpineRef.current.style.pointerEvents = shelfFade >= 1 ? "auto" : "none";
  ```
  No `landedRef` (already removed). Purely reactive, so scrolling back up the spine fades out as `bridge` drops back below 1.0.
- `HeroIdBadge.tsx`, keep `shelfHandoff = clamp((bridge - 0.985) / 0.015)` and `spineOpacity = 1 - shelfHandoff` (already there). The two opacities now sum to 1.0 across the whole handoff window → no visual gap and no overlap pop.
- Lock the flying-spine end rect to the shelf slot rect at `bridge = 1.0` so the crossfade happens with both spines at the *same* position. The existing lerp already uses `flyT = seg(0.55, 1.0, bridge)` which reaches 1.0 at `bridge = 1.0`, so positions align — keep as-is.

This satisfies the prior rule "shelf spine is purely scroll-reactive, reverses cleanly on scroll-up" while removing the gap.

## 2. Shelf toolbox is the same toolbox used in the transition

Today `ToolboxToSkillsBridge.tsx` renders a separate, simplified `ToolboxLid` SVG. Visually it isn't the shelf toolbox — so the user sees one toolbox on the shelf and a different one in the flip.

**Refactor to share one source of truth:**

- Extract the existing shelf toolbox SVG (`AboutToProjectsBridge.tsx` lines ~466–522) into a new `src/components/skills/ToolboxSvg.tsx` that exports:
  - `<ToolboxClosed width height />` — the full closed-toolbox artwork.
  - `<ToolboxLidOnly />` — only the `<defs>` + handle + lid `<rect>` + latches, sized to its own viewBox so it can hinge separately.
  - `<ToolboxBodyOnly />` — body + brushed-metal lines + label plate + feet, viewBox sized to the body region.
  All three reuse the same gradients (`tbBody`, `tbLid`, `tbHandle`) so colours/finish match exactly. (Use unique gradient IDs scoped to each component to avoid SVG id collisions.)
- `AboutToProjectsBridge.tsx`: replace the inline `<svg>` with `<ToolboxClosed width={220} height={174} />`.
- `ToolboxToSkillsBridge.tsx`: 
  - Replace `ToolboxLid` with `<ToolboxLidOnly />` so the swinging lid is visually identical to the shelf one.
  - Add `<ToolboxBodyOnly />` as the *back wall* behind the tray interior, so as the lid opens the user sees the same body silhouette they saw on the shelf, now hosting the skills compartments inside.
  - Keep the existing flip/scale choreography and `ToolboxInterior` content overlay.

No DB/admin changes. No new dependencies. Pure visual unification.

## Files changed

- `src/components/AboutToProjectsBridge.tsx` — crossfade About spine using `(bridge - 0.985)/0.015`; swap inline toolbox SVG for `<ToolboxClosed />`.
- `src/components/skills/ToolboxSvg.tsx` — **new**, exports `ToolboxClosed`, `ToolboxLidOnly`, `ToolboxBodyOnly` with shared gradients.
- `src/components/ToolboxToSkillsBridge.tsx` — use `ToolboxLidOnly` for the hinged lid and `ToolboxBodyOnly` behind the tray.
- `src/components/HeroIdBadge.tsx` — no change required; existing `shelfHandoff` already matches the new shelf-fade window symmetrically. (If during testing the seam still shows, widen both windows from `0.015` to `0.025`.)

## Notes / non-goals

- No changes to the archive ease/window, header plank, toolbox size, or admin Skills tab (all already approved & implemented).
- Reduced-motion path unaffected.
