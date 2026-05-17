## Goal
Restore the behavior you mean: the exact same ID/About card must visibly fold like the earlier preview, keep its border/frame during the fold, rotate naturally into a spine, then physically fall onto the shelf. It must not disappear and then reveal a shelf spine placeholder.

## What is wrong now
- The moving card is being faded out at the end while the static shelf placeholder fades in, so it reads as “disappears and appears.”
- The card border/frame is intentionally faded before the fold (`backFace` background/boxShadow are reduced), which removes the physical paper/card edge too early.
- The trifold is currently a flat overlay: left/right panels rotate, but the center does not behave like a rigid folded object with persistent seams, thickness, shadow, and edge continuity.
- The drop math moves the full card wrapper while also scaling it, but the visible spine is only the center third, so the perceived landing target can feel like a swap instead of a continuous fall.

## Plan
1. **Keep the card physically visible throughout the fold**
   - Do not fade out the moving card during the drop.
   - Do not fade in the static About shelf placeholder until after the moving spine has already landed and fully overlaps it.
   - Keep the moving spine visible at the shelf position for a short final hold so there is no visual pop.

2. **Restore the border before and during folding**
   - Keep the About card’s outer border/shadow visible through the start of the trifold.
   - Convert the border into spine edge highlights only after the panels are mostly folded, instead of removing it early.
   - Preserve seam lines as physical fold creases, not just a temporary overlay.

3. **Make the trifold natural**
   - Split the back face into three rigid panels that each carry matching paper texture, edge shadows, and crease highlights.
   - Left panel rotates inward to about `-88deg`; right panel rotates inward to about `88deg`.
   - Center panel stays as the hinge/spine and only becomes the bookshelf spine after the side panels have mostly closed.
   - Add small depth cues: side-panel shadows darken as they rotate, center seam thickens, and the folded object narrows before it falls.

4. **Fix the drop as one continuous object**
   - Compute the moving object center from the visible folded spine center, not from the original full card center.
   - After fold completes, use a single transform path: folded card/spine center → shelf slot center.
   - Add a slight gravity curve: small lift/tilt first, then downward fall/settle, instead of a linear diagonal translation.

5. **Prevent placeholder swap artifacts**
   - The shelf About slot should remain invisible while the moving card is arriving.
   - Once the moving spine is exactly on top of the slot, reveal the static spine underneath and fade out the moving card over only the final 1–2% of scroll, when they are perfectly aligned.

6. **Verify at the current preview size**
   - Test at `1001×769`.
   - Check three moments: About card before fold, mid-fold with border still visible, final landing on shelf.
   - Confirm there is no blank frame, no early border removal, no disappearing/reappearing swap, and the fold reads as one continuous physical card.