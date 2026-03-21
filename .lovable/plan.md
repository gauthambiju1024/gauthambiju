

## Plan: Slow Down Morphing Animation

Increase `morphDuration` from `500ms` to `800ms` and bump `interval` from `3500ms` to `4000ms` so each word stays visible longer and the character-by-character transition feels more deliberate.

### Changes

**`src/components/MorphingText.tsx`**
- Line 13: Change default `interval` from `3500` to `4000`
- Line 25: Change `morphDuration` from `500` to `800`

