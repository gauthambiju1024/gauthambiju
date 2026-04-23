

## Add bottom padding to the panel stage so panels are centered between header and rail

### The issue

```text
┌─────────────────────────────────────┐
│      header (88px)                  │  ← top gap = 88px
├─────────────────────────────────────┤
│                                     │
│         panel content               │
│                                     │
├─────────────────────────────────────┤
│      pb-1 (4px)                     │  ← bottom gap = 4px (asymmetric!)
├─────────────────────────────────────┤
│      console rail (~72–96px)        │
└─────────────────────────────────────┘
```

The panel container in `DeskStage.tsx` uses `pt-[88px] pb-1`, leaving only 4px between the panel and the bottom console rail — while the header takes a full 88px above. Visually the panel sits flush against the rail, so the panel's vertical center is pushed below the visual center of the open space.

### Fix

In `src/components/DeskStage.tsx`, line 150, change the panel inner wrapper's bottom padding to mirror the breathing room above the rail.

**Before:**
```tsx
<div className="absolute inset-0 px-0 pt-[88px] pb-1 overflow-hidden">
```

**After:**
```tsx
<div className="absolute inset-0 px-0 pt-[88px] pb-3 overflow-hidden">
```

`pb-3` = 12px. Combined with the rail's own internal top spacing, this gives a comfortable matching gap above the rail without shrinking panel real estate noticeably.

### Result

- Small consistent gutter both above (between header and panel) and below (between panel and rail).
- Panel content's vertical center lines up with the visual center of the open viewport area.
- No layout/responsive math changes — purely a padding tweak.

### Files

- `src/components/DeskStage.tsx` — change `pb-1` → `pb-3` on the panel wrapper (1 line).

