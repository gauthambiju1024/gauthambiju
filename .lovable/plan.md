

## Plan: Fix Design Input Button Position — Anchor Inside Header

### Problem
The `SketchPopover` wrapper `<div className="relative">` sits after the `<svg>` in DOM flow, so its `absolute` positioned button renders below the header instead of inside it.

### Fix

#### `src/components/build-story/AssemblyHeader.tsx` (line ~431)
- Remove `<SketchPopover />` from its current position (after the SVG, inside the inner `relative` div)
- Move it **before** the SVG, still inside the `relative` wrapper div
- Change the `SketchPopover` wrapper from `<div className="relative">` to a simple fragment or remove the extra relative wrapper

#### `src/components/build-story/SketchPopover.tsx` (line ~256-259)
- Change the outer wrapper from `<div className="relative">` to `<div className="absolute right-3 top-[4px] z-50">` — this positions the entire popover component in the top-right corner of the header's `relative` container
- Remove `absolute right-3 top-1` from the button itself; make it `relative` with its current width/height
- Adjust the popover dropdown `top` value from `92` to `62` (or similar) so it opens just below the button

### Files: 2
1. `src/components/build-story/SketchPopover.tsx` — fix positioning to absolute within header container
2. `src/components/build-story/AssemblyHeader.tsx` — no structural change needed (already inside relative div)

