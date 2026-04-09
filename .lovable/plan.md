
## Restore Popover to Match `AssemblyHeader-3-3.tsx`

### What’s different now
The current popover in `src/components/AssemblyHeader.tsx` is using a newer simplified layout that does not match your uploaded reference:
- current version has a compact title bar: `▸ PRODUCT DESIGN BOX`
- preset choices are plain text pills
- body uses a split layout with a small canvas + separate preview pane
- extra `previewSmallRef` logic was added for that preview pane

In `AssemblyHeader-3-3.tsx`, the popover design is different:
- headline is `─── DESIGN YOUR PRODUCT · pick a preset or draw your own`
- it has a `QUICK·PICK` label
- presets are 5 visual cards with SVG thumbnails
- it uses one large full-width drawing canvas
- action row is `Clear` + `Build this →`
- there is no side preview panel

### Plan
#### 1. Replace the current popover JSX with the uploaded version’s markup
In `src/components/AssemblyHeader.tsx`, restore the popover content block to match the uploaded file’s structure and styling exactly:
- same header text + close button styling
- same `QUICK·PICK` label
- same 5-column preset card grid with SVG previews via `renderPathsSvg(...)`
- same full-width drawing canvas sizing and dashed border
- same bottom action buttons and spacing

#### 2. Keep the visibility fix, but only outside the masked header container
Do not move the popover back inside the masked frosted container.
Keep it where it is now structurally:
- header SVG stays inside the masked frosted div
- popover stays outside that masked div
- popover keeps `absolute`, `top: 88`, and right alignment so it remains visible

This preserves the fix while restoring the old visual design.

#### 3. Remove the non-reference preview-pane logic
Clean up the current additions that do not exist in the uploaded file:
- remove `previewSmallRef`
- remove the `useEffect` that manually fills `previewSmallRef.innerHTML`
- remove the split right-side preview SVG block from the popover
- keep only the original preset thumbnails and full drawing canvas flow from the uploaded file

#### 4. Keep existing drawing/preset behavior unless it conflicts with the reference
Retain the working interaction logic already in place where compatible:
- `popoverOpen`
- `handlePickPreset`
- `handleClearCanvas`
- `handleBuildCustom`
- canvas pointer event setup

Only revert styling/layout-related parts that changed the look.

### Technical notes
- Primary file: `src/components/AssemblyHeader.tsx`
- Best implementation approach: treat `user-uploads://AssemblyHeader-3-3.tsx` as the source of truth for the popover subtree, and transplant that subtree into the current component while preserving the newer outer header wrapper/mask structure.
- This should restore the original appearance without reintroducing the clipping bug.

### Files
- `src/components/AssemblyHeader.tsx`
