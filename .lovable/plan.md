## Plan

1. **Center and shrink the ribbon text**
   - Reduce the SVG ribbon text size and tracking.
   - Set each `<textPath>` to start from the center of its ribbon path using `startOffset="50%"` and `textAnchor="middle"` so the label sits centered between the ribbon edges instead of repeating from one end.

2. **Let the ID card render beyond the panel edge**
   - Remove the remaining clipping chain around the hero panel by changing the relevant desk-stage/blueprint wrappers from hidden overflow to visible overflow only where needed for the first panel overlay.
   - Keep normal panel sizing intact so other sections do not visually spill unexpectedly.

3. **Make the ID card shadow move with the card**
   - Replace the separate stationary mat shadow with a shadow element inside the draggable card wrapper, or move the existing shadow via the same transform updates as the card.
   - Preserve the card’s own depth while ensuring the ground shadow follows the dragged position.

4. **Verify interaction**
   - Check the hero at the current desktop viewport and confirm: ribbon text is centered/smaller, the card stays visible outside the panel boundary, and the shadow moves with the card.