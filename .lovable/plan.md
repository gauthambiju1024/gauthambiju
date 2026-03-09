

## Plan: Add Drag-and-Drop Section Reordering

### Current State
The `AdminSections.tsx` page uses arrow buttons for reordering. The database, hooks, and dynamic rendering on `Index.tsx` all work correctly with the `homepage_sections` table.

### Changes

**1. Replace arrow buttons with HTML5 drag-and-drop in `AdminSections.tsx`**

No new dependencies needed — use native HTML5 drag-and-drop API (`draggable`, `onDragStart`, `onDragOver`, `onDrop`):

- Add `draggable` attribute to each section `Card`
- Track `dragIndex` state for the item being dragged and `overIndex` for drop target
- On `onDragStart`: store the dragged index
- On `onDragOver`: prevent default, highlight drop target
- On `onDrop`: reorder the array, update `sort_order` values
- Add visual feedback: drag handle icon (GripVertical from lucide), opacity change on dragged item, border highlight on drop target
- Keep the arrow buttons as fallback for accessibility, but make the drag handle the primary interaction
- Keep the existing `saveAll` function and visibility toggle unchanged

**2. Visual polish**
- Add a `GripVertical` drag handle icon replacing or alongside the arrow buttons
- Add `cursor-grab` / `cursor-grabbing` styles
- Highlight drop zone with a border/line indicator

### Files to modify
- `src/pages/admin/AdminSections.tsx` — replace arrow-based reordering with drag-and-drop

