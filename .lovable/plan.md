

## Plan: Fix Margin Doodles Not Drawing Until Panel 2

### Root Cause

The progress formula `(scrollY + 72) / (docH + 72)` produces only ~0.009 at `scrollY = 0` on a typical page. With ~20 doodles per column, each doodle occupies a 1/20 = 0.05 progress band. The first doodle only reaches ~18% drawn at load — which on a 60px-wide column is barely a few pixels of stroke. Doodles don't become visually apparent until enough scroll has happened to push progress past ~0.05–0.10, which corresponds roughly to scrolling past the hero into panel 2.

### Fix

**File: `src/components/MarginDoodles.tsx`** (line 92)

Increase the offset from `72` to `window.innerHeight * 0.4` (~290px on a 725px viewport). This gives progress ≈ 0.035 at `scrollY = 0`, which means the first doodle starts at ~70% drawn and the second at ~20% drawn — immediately visible.

```typescript
// Before
const progress = docH > 0 ? Math.max(0, Math.min(1, (window.scrollY + 72) / (docH + 72))) : 0;

// After
const offset = window.innerHeight * 0.4;
const progress = docH > 0 ? Math.max(0, Math.min(1, (window.scrollY + offset) / (docH + offset))) : 0;
```

This is the only change needed. The `0.4` factor ensures the first 1–2 doodles are visibly drawn on page load, with the rest drawing smoothly as you scroll.

### Files: 1
1. `src/components/MarginDoodles.tsx` — increase scroll offset so doodles draw from the start

