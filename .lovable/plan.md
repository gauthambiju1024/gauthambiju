
Fix the delay by changing the doodle animation model, not the layering.

1. Update `src/components/MarginDoodles.tsx`
- Keep the doodles exactly as they are visually.
- Replace the current whole-page linear progress mapping with a seeded/rebased progress model:
  - compute a raw page scroll progress
  - add a built-in starting reveal so the first 1–2 doodles are already partially drawn at page load
  - remap the rest of the page scroll across the remaining doodles so the full column still completes by the bottom
- Base the seed on doodle count instead of a magic viewport offset, so it stays consistent across screen sizes.

2. Refine the draw distribution
- Right now each doodle gets an equal slice of total page progress, which makes the first slice too small to notice.
- Front-load the first doodles slightly so they become visible immediately, while later doodles still animate normally.
- Keep the existing stroke-dash drawing behavior and fade-in completion logic.

3. Do not change unrelated parts
- Do not remove Margin Doodles.
- Do not change the blueprint flash or dimension annotation behavior.
- Do not change z-index unless inspection shows a real overlap issue; the fact that doodles appear by section 2 means this is primarily a progress-timing problem.

Technical details
- Current issue: `progress` is normalized against the entire document height, so at the top of a long page the value is too close to 0.
- Better fix:
  - calculate `baseReveal = 1.5 / doodles.length` (or similar)
  - use `adjustedProgress = baseReveal + rawProgress * (1 - baseReveal)`
  - feed `adjustedProgress` into the existing per-doodle `start/end` logic
- This guarantees visible left/right doodles from the first panel without making the whole column look pre-completed.

Files
- `src/components/MarginDoodles.tsx` — revise progress mapping so doodles start visibly from panel 1
