## Plan

1. **Make the text ride the visible ribbon segment, not its extension**
   - Today the text path (`dTL` / `dTR`) starts 200px above/outside the panel before reaching the visible ribbon, so `startOffset="50%"` lands somewhere on that hidden lead-in instead of the actual ribbon.
   - Drop the lead-in segment for the text path: build the text path from the same start point and curve as the visible ribbon path (`dL` / `dR`). The visual fabric stroke stays unchanged.

2. **Keep relative-on-ribbon positioning while dragging**
   - With the text path now equal to the visible ribbon path, `startOffset="50%"` always resolves to the geometric midpoint of the ribbon between its top anchor and the badge clip.
   - As the card is dragged the ribbon recurves, but the label stays at the same relative position along the ribbon — it travels with the ribbon instead of sliding along it.

3. **Ensure the label sits inside the panel viewport on load**
   - The visible ribbon's top anchor is just above the panel edge and its bottom anchor is at the badge clip well inside the panel, so the midpoint naturally falls inside the panel viewport at rest.
   - Keep the current small font size, letter spacing, and `textAnchor="middle"` so the label is centered on that midpoint and doesn't overflow the ribbon edges.

4. **Verify**
   - On load, both ribbon labels should appear inside the dark green panel, centered on each ribbon.
   - While dragging the ID card, the labels should move and rotate with the ribbon but not visibly slide along its length.