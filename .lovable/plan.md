## Plan

The portaled hero overlay starts with a 0×0 fixed wrapper and only acquires its real size on the next animation frame. The lanyard's path math runs once on mount before the wrapper has dimensions, so on refresh the ribbon is invisible. On viewport changes the wrapper resizes but the lanyard isn't told to recompute, so the ribbon detaches from the badge.

1. **Recompute the lanyard whenever the overlay actually resizes**
   - In the rect-tracking effect, after writing the new top/left/width/height onto the portaled stage, trigger the lanyard update routine.
   - Hold the update routine in a ref so the rect-tracking effect can call it without recreating it on every render.

2. **Guarantee a valid first paint**
   - Skip lanyard updates until the stage has a non-zero width/height, then run the update once dimensions are known.
   - Add a `ResizeObserver` on the portaled stage itself (not just the section) so any wrapper resize — including the initial 0 → real-size jump — triggers a fresh lanyard computation.

3. **Keep the card visually anchored across viewports**
   - Replace the viewport-relative offset on the ID card (`right: clamp(20px, 3.5vw, 56px)`) with a panel-relative offset so the card stays the same distance from the panel edge regardless of window width. The lanyard already measures the slot's real position, so once the card stays put relative to the panel, the ribbon stays attached.

4. **Verify**
   - Hard refresh: ribbons should appear immediately, attached to the clip and badge.
   - Resize the window between narrow and wide widths: card and ribbon should stay connected without drift.