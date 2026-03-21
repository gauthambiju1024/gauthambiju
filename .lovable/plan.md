

## Plan: Fix Morphing Text — Cursor, Blue Color, Full Words

### Issues
1. **Missing cursor**: The blinking `|` cursor that appeared during morphing was removed in a previous refactor
2. **Brown color**: `--primary` is sepia `16 21% 42%`. User wants blue like it was before
3. **Truncated words**: `Math.round` with fractional progress can produce a charCount of `currentWord.length - 1`, cutting the last letter

### Changes

**`src/components/MorphingText.tsx`**
- Add a blinking `|` cursor after `displayText` that shows during the morphing phase (when text is being sliced). Use a `isMorphing` state flag toggled on/off around the morph interval
- Fix truncation: in the "morphing in" half, ensure the final step always sets `charCount = nextWord.length` (use `Math.ceil` instead of `Math.round`, or clamp to full length when `step >= steps`)
- The cursor blinks via CSS animation (`animate-pulse` or a custom `@keyframes blink`)

**`src/index.css`**
- Change `--primary` from `16 21% 42%` (sepia brown) to a blue hue, e.g. `220 60% 50%` (medium blue that fits the notebook aesthetic)
- Update `--primary-foreground` to work with the new blue

### Files to Modify

| File | Change |
|---|---|
| `src/components/MorphingText.tsx` | Add blinking cursor, fix charCount to never truncate |
| `src/index.css` | Change `--primary` to blue |

