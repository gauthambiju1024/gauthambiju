

## Plan: Fix "world" Being Cut Off

### Problem
The text "Technology change the world." is being clipped because:
1. The wrapper div (line 60) has `overflow-hidden`
2. The parent container has `max-w-3xl` limiting width

### Solution
Remove `overflow-hidden` from the wrapper div containing the rotating text line. The `whitespace-nowrap` already keeps it on one line, and without overflow-hidden, "world" will be visible (overlapping the image as intended).

### Change
**HeroSection.tsx** (line 60)
```tsx
// From:
<div className="overflow-hidden mb-8">

// To:
<div className="mb-8">
```

