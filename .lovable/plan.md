## Why it's invisible today

- `HeroIdBadge` positions its fixed stage by tracking the `#home` panel's rect (inside `HeroAboutFlip`, a 135vh pin).
- The bridge section starts *after* that pin ends, so by the time `__bridgeProgress` rises from 0, `#home` has scrolled above the viewport. The original card and the bridge's clone (which mirrors `[data-hero-card-wrap]`) are both positioned far above the screen.
- Result: fold, rotate, drop, ledge draw, and plank all run correctly — just off-screen. Globe fade is invisible for the same reason.

## Fix

Keep the about card visually pinned at its end-of-flip position for the full duration of the bridge, then fold *that* card down onto a shelf inside the bridge's sticky stage.

### 1. `AboutToProjectsBridge.tsx`
- Publish both `window.__bridgeProgress` (0..1) and `window.__bridgeActive` (boolean — true while the sticky stage is on screen, even at progress 0).
- Stop measuring `[data-hero-card-wrap]`. Instead, anchor the folding clone *inside the sticky container* at the same on-screen coordinates the flipped card occupies at end-of-flip (right-of-center, ~74% x, vertically centered, 260×380). This is a fixed layout — no per-frame DOM measurement needed.
- Choreography unchanged:
  - 0.00–0.10: globe + original card fade out (driven by HeroIdBadge reading `__bridgeProgress`); clone fades in at the same anchor so the handoff is seamless.
  - 0.10–0.40: tri-fold.
  - 0.40–0.65: rotateY 0→90°, cream → walnut.
  - 0.65–1.00: drop onto the drawn ledge; plank fades in beneath as the handoff into `ProjectsShelf`.
- Slight bump: increase pin height to `200vh` and give phase A a bit more room (0.00–0.14) so the fade is perceptible.

### 2. `HeroIdBadge.tsx`
- When `window.__bridgeActive` is true, override the stage-tracking transform: instead of following `#home`'s rect, lock the stage to the viewport (`translate3d(0, 0, 0)`, full viewport width/height) so the card and globe stay visible during the bridge.
- Keep the existing `bridgeFade` (already wired) — it fades both the globe layer and the card wrap to 0 across `__bridgeProgress` 0→0.18. By the time the bridge clone starts folding, the originals are invisible and the clone has taken over in the exact same spot.
- Disable pointer events on the card while `__bridgeActive` is true (already partly handled).

### 3. No other files change
- `HeroAboutFlip.tsx`, `AboutSection.tsx`, `AboutCardBack.tsx`, `HeroSection.tsx`, `Index.tsx`, `ProjectsShelf.tsx`, `AssemblyHeader.tsx`: untouched.
- ID card front and its flip transition: untouched.

### Performance
Single window scroll listener + rAF in the bridge; HeroIdBadge keeps its existing per-frame loop and just adds a branch on `__bridgeActive`. Zero React re-renders during scroll.
