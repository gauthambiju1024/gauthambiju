

## Plan: Remove "Page XX" Labels from All Sections

Remove the "page 03", "page 04", etc. labels from all section headers while keeping the horizontal line and the right-side heading text.

### Files to edit (7 files)

1. **`src/components/ProjectsShelf.tsx`** (~line 61-63) — Remove the `page 03` span
2. **`src/components/ThinkingWall.tsx`** (~line 48) — Remove the `page 04` span
3. **`src/components/SkillsToolbox.tsx`** (~line 60) — Remove the `page 05` span
4. **`src/components/JourneyTimeline.tsx`** (~line 54) — Remove the `page 06` span
5. **`src/components/WritingDesk.tsx`** (~line 56) — Remove the `page 07` span
6. **`src/components/ContactClosing.tsx`** (~line 25) — Remove the `page 08` span
7. **`src/components/WorkSection.tsx`** (~line 18-20) — Remove the `page 02` tape strip

In each case, the "page XX" `<span>` element is removed. The `<div>` with the horizontal line (`h-px`) and the right-side heading span (e.g., "Projects", "Thinking", "Skills") remain unchanged.

