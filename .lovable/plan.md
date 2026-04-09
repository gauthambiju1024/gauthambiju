

## Plan: Improve Header Menu Visibility & Fix Design Input Position

### Issues
1. **DESIGN.INPUT popover button** is positioned `absolute right-3 top-7` inside the header but may be clipped or hard to find — needs to be clearly visible on the right side of the header.
2. **Station labels** currently show abbreviated codes (`HERO`, `ABOUT`, `WORK`, `THINK`, `SKILL`, `PATH`, `WRITE`, `SEND`) — user wants full readable names: `Home`, `About`, `Projects`, `Thinking`, `Skills`, `Journey`, `Writing`, `Contact`. They should also be more visually prominent and obviously clickable.

### Changes

#### 1. `src/components/build-story/AssemblyHeader.tsx`
- Update `STATION_NAMES` from `["HERO","ABOUT","WORK",...]` to `["HOME","ABOUT","PROJECTS","THINKING","SKILLS","JOURNEY","WRITING","CONTACT"]`
- Increase station label font size from `5.5` to `7` for better readability
- Add hover styling: change cursor to pointer (already done), add underline or brighter fill on hover via mouseover/mouseout event listeners in the setup effect
- Increase the clickable hit area by adding invisible rects behind each label
- Remove the small index numbers and PRT codes flanking the labels to reduce clutter and let the names breathe

#### 2. `src/components/build-story/SketchPopover.tsx`
- Adjust positioning: ensure the button sits within the visible header area at `right-3 top-1` (or similar) so it doesn't overflow on smaller viewports
- Ensure the popover dropdown (`top: 92`) clears the header properly

### Files: 2
1. `src/components/build-story/AssemblyHeader.tsx` — update station names, enlarge labels, add hover effects, clean up label clutter
2. `src/components/build-story/SketchPopover.tsx` — adjust button positioning for visibility

