

## Replace AssemblyHeader with Uploaded v7 (Compact)

### What Changes
Replace the current `src/components/AssemblyHeader.tsx` with the uploaded file. This is a compact version (90px tall instead of ~180px) that removes bottom metadata, per-station sub-labels, and per-station progress bars while keeping the belt, nav, progress spine, and design box.

### Adjustments Needed

#### `src/components/AssemblyHeader.tsx`
- Replace entire file contents with the uploaded `AssemblyHeader-3.tsx`
- Add `export default AssemblyHeader;` at the end (the uploaded file only has a named export)
- Remove the frosted-glass background styles and mask styles from the previous version (the new version uses `pointer-events-none fixed inset-x-0 top-0 z-50` with a transparent background — no frosted glass needed)

#### `src/pages/Index.tsx`
- Update top padding on the content area to account for the new 90px header height (the file comments suggest `pt-[98px]`)

#### `src/index.css`
- Update `scroll-margin-top` from `180px` to ~`100px` to match the new compact header height

### Files: 3
- `src/components/AssemblyHeader.tsx` — full replacement
- `src/pages/Index.tsx` — adjust content padding
- `src/index.css` — adjust scroll-margin-top

