
## Plan: Make Top and Right Edges Hard on Hero Portrait

### What I understood
You want the portrait to sit flush with the notebook border on desktop:
- Top edge: hard
- Right edge: hard
- Left and lower area: blended/faded

That means the current mask is wrong because it fades all four sides, including the top and right.

### Implementation
Update `src/components/HeroSection.tsx` only.

#### Change the portrait mask
Replace the current two-way intersecting mask with one that:
- stays fully opaque at the top
- stays fully opaque at the right
- fades in from the left
- fades out toward the bottom

Use a mask shaped like this:

```text
top:    hard
right:  hard
left:   soft fade in
bottom: soft fade out
```

#### Proposed mask logic
Use:
- a horizontal gradient that fades from transparent on the left to solid, then remains solid through the right edge
- a vertical gradient that stays solid through most of the height, then fades near the bottom

Example target shape:

```css
maskImage:
  linear-gradient(to right, transparent 0%, black 28%, black 100%),
  linear-gradient(to bottom, black 0%, black 62%, transparent 100%)
```

with the two masks intersected, so:
- no fade on top
- no fade on right
- gentle fade on left
- gentle fade on bottom

### Why this will look more natural
Because the portrait is anchored in the top-right corner of the notebook, fading those same edges makes it look detached from the page border. Keeping top/right hard will make it feel intentionally placed against the notebook frame, while the left/bottom fade keeps it integrated into the paper.

### File affected
- `src/components/HeroSection.tsx`

### Technical details
- Keep the existing absolute positioning and desktop-only behavior
- Keep current image source behavior (`hero?.portrait || heroPortrait`)
- Keep blend mode/opacity unless a second pass is needed after visual review
- Only adjust the `maskImage` values and preserve the current mask composite setup

### Expected result
On desktop, the portrait should:
- align crisply with the top-right notebook border
- dissolve softly into the page toward the left and lower edge
- feel cleaner and more intentional than the current all-sides fade
