## Issues to fix

1. **Card floats above the Assembly Header** during scroll. Root cause: the ID-card stage portals to `document.body` at `z-index: 30`, while the Assembly Header lives inside `.margin-content-wrapper` (a `relative z-[2]` stacking context). Inside that wrapper the header has `z-50`, but it's clamped to its parent's `z-2` — so the body-level card (z-30) wins.
2. **Back of card jitters** during scroll. Root cause: per-frame `getBoundingClientRect()` reads + inline `top/left` writes are subpixel-rounded by the browser, and the rAF loop reading `progressMV` is decoupled from the scroll frame, producing 1-frame mismatches that show up most when the card is scaled large (the back face).
3. **After flip, the card should scroll away with the page** like any other panel — currently the pin still holds the card in viewport for ~10vh of empty scroll after `p2 = 1`.

## Changes (all in two files)

### `src/components/HeroIdBadge.tsx`

- **Stage z-index:** drop `zIndex` from `30` to `1` so the Assembly Header (which is fixed at body-level via the wrapper) sits above the card. Verify Assembly Header still renders above by also raising `z-[2]` on the wrapper to `z-[3]` if needed (only if z=1 isn't enough — to be confirmed live).
- **Smooth tracking:** replace per-frame `top`/`left` writes with `transform: translate3d(x, y, 0)` on the stage element. GPU-composited transforms avoid the subpixel rasterization that causes jitter, and the stage no longer triggers layout each frame. Width/height continue to be set as CSS pixels (or via `scale` if needed; pixel size is fine since they only change on resize).
- **Card transform pipeline:** snap the cardWrap transform values (`tx`, `ty`, `scale`, `rotY`) to a tighter precision — round translate to 0.5px and scale to 0.001 — to eliminate residual jitter.

### `src/components/HeroAboutFlip.tsx`

- **Tighten pin range so card releases right after flip completes.** Two coordinated edits:
  - Change pin section height from `150vh` to `135vh` (less empty post-flip pinning).
  - Move the flip ranges so `p2` reaches 1 at the end of the pin: `heroFade [0.30, 0.55]` stays, but the flip in `HeroIdBadge` (`smoothstep(0.55, 0.80, t)` for p2) shifts to `smoothstep(0.55, 0.95, t)` (and `p1` from `[0.30, 0.55]` → `[0.30, 0.55]` unchanged). The remaining 5% gives a brief settle before pin releases.
- After the pin releases, the stage continues tracking the hero anchor (which now scrolls up out of view), so the flipped card naturally scrolls off-screen with the page — matching how the other panels behave. No portal-detach gymnastics needed.

## Out of scope

- Lanyard math, drag, content of either face — unchanged.
- AssemblyHeader code — unchanged unless z-index test shows it still loses; in that case a one-line z-index bump.
- Trailing panels — unchanged.
