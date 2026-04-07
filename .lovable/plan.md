

## Plan: Reduce Top/Bottom Padding in Margin Doodle Layout

### Problem
The `layoutDoodles` function uses `topPad = 28` and `bottomPad = 28`, creating excessive empty space above and below the doodle stack in each margin.

### Changes

**`src/components/MarginDoodles.tsx`**
- Reduce `topPad` from `28` to `6` and `bottomPad` from `28` to `6` in the `layoutDoodles` function (lines 50-52)
- This brings the doodle stack (including the top/bottom hand-drawn lines) much closer to the viewport edges

### Files: 1

