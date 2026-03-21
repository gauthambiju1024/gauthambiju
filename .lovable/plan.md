
## Plan: Fix Rotating Word Visibility and Keep Accent Styling Consistent

### Problem
The rotating word still has two issues:
- letters disappear or get cropped because the current effect slices the text while the word row is too tight
- the first loaded word looks brighter/bolder than later states because the morphing state changes its visual treatment

### Changes

**`src/components/MorphingText.tsx`**
- Keep a single consistent accent style for all words: same bold weight and same highlighted color from the initial “products” state
- Remove the temporary dimming during morph so the word never looks weaker mid-transition
- Reserve width for the longest word so nothing gets cut off and the layout does not shift
- Adjust the transition logic so each cycle clearly finishes on the full next word before changing again
- Keep the animation simple and smooth, but not at the cost of readability

**`src/components/HeroSection.tsx`**
- Increase the word row’s vertical space slightly so bold letters are never clipped
- Make the rotating-word wrapper allow full visibility instead of feeling tightly boxed
- Preserve the current hero hierarchy while keeping the highlighted word visually steady and consistent

### Technical detail
- Use a hidden sizing reference based on the longest rotating word to lock the required width
- Move the accent color/weight into the base rotating-word styling instead of applying it only on first render
- Remove the opacity drop tied to the morphing state
- Slightly loosen the word line-height / container height to prevent top or bottom clipping

### Files to Modify

| File | Change |
|---|---|
| `src/components/MorphingText.tsx` | Fix truncation/clipping, stabilize timing, keep accent color/weight consistent |
| `src/components/HeroSection.tsx` | Add enough space for the rotating word and prevent visual clipping |
