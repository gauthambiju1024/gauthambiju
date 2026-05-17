## Diagnosis

The cream strip you see beside the green spine is the **back face of a folded wing**. Geometry is correct (25/50/25, wings fold to ~178°, packet then flips on Y to reveal the spine), but the wing's back face is painted with `CARD_BG` (cream). So when the whole packet rotates to show its back, you see:

- center back face → green spine (correct)
- wing back faces → cream (wrong — should also be green)

That's why image 2 shows green-on-left + cream-on-right: the right wing's cream back is exposed alongside the spine.

The recent fix that gave the wing **outer wrapper** `background: CARD_BG` to stop transparency made this worse — it locked the wing to cream from any angle, including when the packet is flipped.

## Fix (one file)

**`src/components/HeroIdBadge.tsx`** — wing markup (~lines 550–611)

1. **Outer wrapper of each wing**: keep `backfaceVisibility: hidden`, but change `background: CARD_BG` → `background: 'transparent'`. The opaque surfaces come from the inner front/back face divs, not the wrapper. (The wrapper background was the cause of the cream-strip-on-flip; removing it does NOT bring back the original transparency bug, because each face div is now itself opaque — see step 2.)

2. **Front face inner div** (cream side, faces camera before flip): give it an explicit `background: CARD_BG` and keep `backfaceVisibility: hidden`. This is the surface that must fully cover the green center during the fold.

3. **Back face inner div** (faces camera after flip): change its background from cream to the **spine green** (same token used by the spine center face, e.g. `SPINE_BG` / the green used in `ProjectSpine` for the about spine, ~`hsl(155 25% 22%)` — pull from the existing constant, do not hardcode). Keep `rotateY(180deg)` + inset shadow. Result: after the packet flips, the wings' back faces are green and blend seamlessly into the spine — no cream strip.

4. Sanity: ensure no other layer (e.g. a sibling overlay or the packet container) paints cream on the back. If one exists, it gets the same green-on-back treatment via a second face div.

## What this changes visually

| Stage | Before | After |
|---|---|---|
| Mid-fold, front facing camera | cream wings cover green center | unchanged — still solid cream |
| Mid-flip (image 2 moment) | green spine + cream wing strip | uniform green across spine + wing backs |
| Fully flipped | green spine + faint cream edges | clean solid green spine |

## Out of scope

No changes to fold angles, wing widths (25/50/25 preserved), timing, the bridge file, shelf draw, or spine rise. Only the wing face colors.

## Files

- `src/components/HeroIdBadge.tsx` — wing wrapper background + back-face color
- `.lovable/plan.md` — replace with this plan
