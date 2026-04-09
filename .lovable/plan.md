

## Fix: Popover Clipped by Header Mask

### Problem
The popover panel (line 702-845) renders inside the `<div>` that has `maskImage` with a bottom fade (line 555-563). Since the mask fades to transparent at the bottom, the popover — which sits below the header at `top: 88px` — is completely masked out and invisible.

### Solution
Move the popover **outside** the masked div but still inside the outer fixed container. This way the frosted-glass mask only applies to the header SVG, not the popover.

### Change: `src/components/AssemblyHeader.tsx`

Current structure:
```
<div fixed outer>          ← line 554
  <div masked frosted>     ← line 555
    <svg header />         ← line 564
    {popover}              ← line 702  ← PROBLEM: inside mask
  </div>
</div>
```

New structure:
```
<div fixed outer>          ← line 554
  <div masked frosted>     ← line 555
    <svg header />         ← line 564
  </div>                   ← close masked div before popover
  {popover}                ← moved outside mask
</div>
```

Move the `{popoverOpen && (...)}` block (lines 702-845) to after the closing `</div>` of the masked container (after line 700's `</svg>` closing, move the popover after the masked div's closing tag). No other changes needed — positioning stays the same since the popover uses `absolute` relative to the outer fixed container.

### Files: 1
- `src/components/AssemblyHeader.tsx`

