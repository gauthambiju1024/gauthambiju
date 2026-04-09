

## Restore Original Popover Design

### Problem
When the popover was moved outside the masked container, its internal references were incorrectly changed:
1. `previewSmallRef` was replaced with `previewRef` — but `previewRef` is already used by the header SVG (line 675), so the popover's small preview doesn't work (React can only attach one ref to one DOM node)
2. Canvas pointer handlers (`onPointerDown`, `onPointerMove`, `onPointerUp`) were removed from the `<canvas>` element — the `useEffect` approach may not be attaching them correctly

### Solution

#### `src/components/AssemblyHeader.tsx`
1. **Add back `previewSmallRef`** — create a separate `useRef<SVGGElement>` for the popover's small preview SVG, restoring the original separation
2. **Restore canvas pointer handlers** — add `onPointerDown={handleCanvasPointerDown}`, `onPointerMove={handleCanvasPointerMove}`, `onPointerUp={handleCanvasPointerUp}` back to the `<canvas>` element (verify these handler functions exist; if not, they're managed via `useEffect` and we leave as-is)
3. **Update the popover's preview `<g>` ref** from `previewRef` to `previewSmallRef` (line 774)
4. **Ensure `previewSmallRef` is used** in the animation/update logic wherever the small preview needs updating (check the `useEffect` that draws into the preview)

### Files: 1
- `src/components/AssemblyHeader.tsx`

