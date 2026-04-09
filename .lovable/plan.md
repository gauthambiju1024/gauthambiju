

## Plan: Embed DESIGN.INPUT Inside the SVG Header

### Problem
The DESIGN.INPUT button is an HTML element (`absolute` positioned div) floating on top of the SVG header. It doesn't feel integrated — it sits outside the SVG coordinate system and can misalign or overlap awkwardly.

### Solution
Render the DESIGN.INPUT button area as part of the SVG itself (right side of the viewBox), then use a `foreignObject` only for the popover dropdown when opened. This makes the button visually integrated with the header's grid/lines/aesthetic.

### Changes

#### `src/components/build-story/AssemblyHeader.tsx`
- Add an SVG group in the right portion of the viewBox (around x=1200–1386) that renders:
  - A bordered rect matching the header style (`hsl(220 15% 11%)` fill, `BORDER_HOT` stroke)
  - `▸ DESIGN.INPUT` text label
  - `click to define product` subtext
  - A small thumbnail preview area with the current sketch rendered as SVG paths (using the existing `strokesToSvgPaths` helper or inline path rendering)
  - Sketch name and vtx/str stats text
- Add a click handler on this SVG group to toggle the popover open state
- Add refs for the sketch thumbnail and name so they update when `handleSketchChange` fires

#### `src/components/build-story/SketchPopover.tsx`
- Remove the button portion entirely — the button is now rendered by AssemblyHeader's SVG
- Export only the popover panel (presets grid + canvas + buttons) as a controlled component
- Accept `open` and `onToggle` props instead of managing open state internally
- The popover panel remains HTML (needs canvas for drawing), positioned absolutely below the header

#### Integration
- AssemblyHeader owns the `open` state for the popover
- AssemblyHeader renders the SVG button + calls `<SketchPopover open={open} onToggle={setOpen} onChange={handleSketchChange} />` for just the dropdown panel
- The dropdown panel uses `absolute right-0 top-[100px]` to appear directly below the header

### Files: 2
1. `src/components/build-story/AssemblyHeader.tsx` — add SVG button group, own popover open state, pass to SketchPopover
2. `src/components/build-story/SketchPopover.tsx` — convert to controlled popover panel only (no button)

