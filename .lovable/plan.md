
Goal: eliminate the remaining side gap in wide/full-width viewports so the panels sit consistently close to the fixed doodle margins.

What’s causing it
- The current `margin-content-wrapper` padding is no longer the main problem.
- The bigger issue is the extra `max-w-7xl mx-auto` wrapper on every home-page panel in `src/pages/Index.tsx`.
- On large screens, that hard max width keeps the panels centered in a narrower column, which leaves unused space between the fixed margin doodles and the panels.

Plan

1. Remove the homepage’s hard max-width bottleneck
- In `src/pages/Index.tsx`, replace the outer panel wrappers (`max-w-7xl mx-auto ...`) with full-width wrappers so each panel can expand to the width already reserved by `.margin-content-wrapper`.
- Apply this to:
  - Hero wrapper
  - About wrapper
  - Repeated section wrappers in `panelSections.map(...)`

2. Keep a tiny, consistent inset from the doodle columns
- Keep the `margin-content-wrapper` approach in `src/index.css`, but tune it for a very small fixed gap so panels never overlap and never float too far away.
- Use the wrapper as the single source of horizontal spacing instead of combining it with a large centered max-width container.

3. Preserve internal readability inside sections
- Let the panel shells span wide, but keep existing inner content constraints inside components where they already exist (`max-w-2xl`, etc.), so text blocks don’t become too wide.
- This gives you wide panel edges near the margins while still keeping readable content layout.

Expected result
- Full-width/large viewports: panels extend outward and sit much closer to the doodle margins.
- Medium/smaller desktop viewports: no overlap, and spacing remains consistent.
- The layout will match the tighter “second image” feel more reliably across viewport sizes.

Files to update
1. `src/pages/Index.tsx` — remove `max-w-7xl mx-auto` from homepage panel wrappers
2. `src/index.css` — keep/refine `.margin-content-wrapper` as the only horizontal gutter control

Technical note
- The previous padding fixes solved overlap behavior.
- This next fix addresses the separate wide-screen constraint issue: `max-w-7xl` is what still creates the visible gap in full-width viewports.
