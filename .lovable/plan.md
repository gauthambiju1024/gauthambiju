## Plan

Restore the interaction to match your intent: the ID card becomes the About panel in the hero viewport, then that exact visible About panel folds in place into a project-style spine before it moves to the shelf.

### What will change

1. **Use the same viewport for the whole handoff**
   - Extend the existing `HeroAboutFlip` pinned section so the About panel remains sticky and visible after the ID card has merged into it.
   - Remove the big empty bridge feeling caused by the separate `AboutToProjectsBridge` pin taking over too late.

2. **Bring back the trifold animation on the actual About panel**
   - Replace the current simple “crossfade + shrink” with a true three-panel fold.
   - The center panel becomes the book spine; left and right panels rotate inward like the earlier trifold.
   - This happens from the same final About-card viewport, not from a reappeared/new section.

3. **Make the folded result match shelf spines**
   - At the end of the trifold, the visible center spine uses the same `ProjectSpine` visual as the database project shelf.
   - The folded About spine lands in the shelf as one of the spines.

4. **Keep the shelf database-linked**
   - Continue using `useProjects()` for real project spines.
   - The shelf line and project spines will reveal inside the same pinned handoff viewport, so the About spine parks directly into the live projects shelf.

### Technical notes

- `HeroIdBadge.tsx` will regain a real trifold layer instead of only `spineSkinRef` opacity and `scaleX/scaleY` shrink.
- `HeroAboutFlip.tsx` will own the combined scroll sequence: hero → card flip/about → trifold → shelf park.
- `AboutToProjectsBridge.tsx` will be simplified to provide shelf slot coordinates and shelf reveal, not a separate empty-feeling scroll stage.
- `Index.tsx` will keep the section order, but the projects handoff will visually start immediately from the About viewport.