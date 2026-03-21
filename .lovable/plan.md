

## Plan: Fix Rotating Word Color and Truncation

### Issue 1: Wrong blue
The rotating word uses `text-primary` (`220 60% 50%` — bright blue). The text "Tirelessly pursue clarity" uses `text-card-foreground` (`218 30% 21%` — dark navy). The user wants the dark navy, not the bright blue.

### Issue 2: Word truncation
The `Math.ceil` / `Math.max` character slicing still occasionally drops the last letter. The fix: **always show the complete word** at the end of the morph-in phase by clamping `charCount` to `nextWord.length` explicitly, and removing the fractional ceiling math that causes off-by-one.

### Changes

**`src/components/MorphingText.tsx`**
- Change `text-primary` to `text-card-foreground` on the display span so the rotating word matches the dark navy used elsewhere
- Fix morph-in: replace `Math.ceil(nextWord.length * ((progress - 0.5) * 2))` with `Math.min(nextWord.length, Math.ceil(...))` and ensure the final step explicitly uses `nextWord.length`
- Same fix for morph-out: clamp `charCount` to never exceed `currentWord.length`

### Files

| File | Change |
|---|---|
| `src/components/MorphingText.tsx` | Change color class, clamp charCount |

