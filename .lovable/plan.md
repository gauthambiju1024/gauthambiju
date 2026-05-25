Goal: Eliminate the white vertical line that flies away during the hero → projects bridge, without removing or visually changing the lanyard/clip in the hero or about sections.

What the white line is:
- The metal clip + plastic strap that hangs from the lanyard onto the ID card. During the bridge, opacity goes to 0 but the clip element keeps being re-positioned every frame to follow the card's slot — its 16–24px width near-vertical reads as a thin white line gliding across the screen.

Fix (surgical, `src/components/HeroIdBadge.tsx` only):

1. Stop tracking the card during the bridge
   - In the per-frame loop, skip the `updateLanyard()` call once `bridge > 0`.
   - This freezes the lanyard SVG paths and the clip transform at their last hero-resting values.

2. Hard-hide the lanyard layer during the bridge
   - When `bridge > 0`, set the lanyard layer to `display: none` (in addition to existing opacity 0 / visibility hidden).
   - `display: none` removes it from compositing entirely, so even a 1px sub-pixel ghost cannot appear.

3. Restore cleanly on scroll back
   - When `bridge === 0`, restore `display: block` and resume `updateLanyard()` so the hero and about sections look and behave exactly as today.

Out of scope (unchanged):
- Hero section visuals, lanyard art, clip art, ribbons, About card content, flip, book close, flying spine, shelf, routes, timings of other components.
- No edits to `AboutToProjectsBridge.tsx`, `HeroAboutFlip.tsx`, or any other file.