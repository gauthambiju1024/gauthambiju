

## Plan: Simplify Morphing to Per-Character Stepping (No Math)

### Problem
The progress-based `Math.round` / `Math.min` / `Math.max` calculations cause uneven pacing — some ticks show no change (stall), then multiple characters appear at once (rush).

### Fix

**`src/components/MorphingText.tsx`**

Replace the entire morph logic with dead-simple character stepping:

- **Phase 1 (morph out)**: Start from full `currentWord`. Each tick removes one character from the end. So `currentWord.length` ticks total.
- **Phase 2 (morph in)**: Build up `nextWord` one character at a time. So `nextWord.length` ticks total.
- **Total ticks** = `currentWord.length + nextWord.length` (for "products" → "systems" that's 8 + 7 = 15 ticks)
- **Tick interval** = `morphDuration / totalTicks` (800ms / 15 ≈ 53ms per tick)
- No `Math.round`, no `Math.ceil`, no `Math.min`, no `Math.max`, no `progress` float. Just a counter and two `if` branches with direct `.slice()`.

```
tick 0:  "products"
tick 1:  "product"
tick 2:  "produc"
...
tick 7:  "p"
tick 8:  "s"
tick 9:  "sy"
...
tick 14: "systems"  → done, clear interval
```

Everything else stays the same: blinking cursor, longest-word sizing, interval timing.

### Files

| File | Change |
|---|---|
| `src/components/MorphingText.tsx` | Replace progress math with simple counter + slice |

