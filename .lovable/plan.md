## Goal
Make the exact same portal-mounted ID card continue its journey: hero ID card → flipped About card → same card tri-folds 90° into an About spine → drops onto the live Projects shelf. No duplicate About panel, no reappearance, no empty bridge gap.

## What is currently wrong
- The fold is driven by `AboutToProjectsBridge`, a separate section after `HeroAboutFlip`, so the card finishes the About flip, then the page enters another tall sticky section before the shelf becomes visible.
- `__bridgeActive` forces the card stage to a generic viewport rect instead of preserving the exact card/about viewport handoff, which makes it feel like a new/reappearing stage.
- The trifold layer is only attached after the separate bridge begins, so it is not truly the same visual moment as the existing ID-card-to-About-card flip.

## Plan
1. **Merge the scroll choreography into `HeroAboutFlip`**
   - Extend the pinned `HeroAboutFlip` section so it owns the whole sequence in one sticky viewport.
   - Use one scroll progress value for all phases:
     ```text
     0.00–0.35  hero ID card in original position
     0.35–0.55  same card slides/scales to focus
     0.55–0.72  same card flips 180° into About card
     0.72–0.84  same About card holds briefly in that exact viewport
     0.84–0.94  same card tri-folds 90° into spine
     0.94–1.00  spine drops into shelf slot
     ```

2. **Remove the separate visual bridge gap**
   - Stop using `AboutToProjectsBridge` as its own tall empty-feeling scroll stage.
   - Convert it into a shelf layer/component rendered inside the same sticky viewport, or replace it with an inline shelf layer inside `HeroAboutFlip`.
   - The projects shelf appears behind/below the folding card before the drop begins, so the destination is visible.

3. **Use the actual same card DOM**
   - Keep `HeroIdBadge` as the single real card instance.
   - Do not render a replica About card for the fold.
   - The existing front face, back/About face, and trifold panels all stay inside that same `cardWrapRef` transform chain.

4. **Fix the trifold mechanics**
   - During the fold phase, the back face splits visually into three vertical panels.
   - Left panel rotates `rotateY(-90deg)` from its inner seam.
   - Right panel rotates `rotateY(90deg)` from its inner seam.
   - Center panel becomes the `ProjectSpine` skin and compresses to `SPINE_WIDTH × SPINE_HEIGHT`.
   - The card’s global transform should not re-flip or re-anchor unexpectedly during this phase; it should continue from the exact final About-card pose.

5. **Drop into the live database shelf**
   - Keep `useProjects()` for the project spines.
   - Publish the About slot rect from the shelf layer while it is visible in the same sticky viewport.
   - Compute the drop translation from the current card center to that slot, then reveal the static About spine placeholder only after the moving card lands.

6. **Preserve navigation anchors**
   - `#about` should land on the flipped About-card phase.
   - `#projects` should land near the beginning of the shelf/fold phase, not after a blank scroll gap.
   - Keep the Assembly Header IDs intact.

## Files to change
- `src/components/HeroAboutFlip.tsx`
  - Own the full pinned hero/about/fold/shelf sequence.
  - Render or control the shelf layer in the same viewport.
- `src/components/HeroIdBadge.tsx`
  - Replace `__bridgeActive` stage override with same-pinned progress-driven folding.
  - Use one continuous progress source instead of depending on a separate section becoming active.
- `src/components/AboutToProjectsBridge.tsx`
  - Simplify into a shelf layer, or remove its separate tall sticky behavior.
- `src/pages/Index.tsx`
  - Remove the separate bridge section if shelf is now rendered inside `HeroAboutFlip`.
- `src/components/projects/ProjectSpine.tsx`
  - Keep as the shared visual spine component; only adjust if needed for exact shelf matching.

## Validation
- Scroll from hero to projects at the current 1001×769 viewport.
- Confirm the same visible ID card flips into About, then that exact About card folds without disappearing/reappearing.
- Confirm there is no empty gap before the shelf.
- Confirm the About spine lands aligned with the live database project spines.