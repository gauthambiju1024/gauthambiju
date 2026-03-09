

## Plan: Fix Text Wrapping

### Change
**HeroSection.tsx** - Add `whitespace-nowrap` to the rotating words h1 (line 65)

```tsx
className="font-handwritten text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-card-foreground/50 whitespace-nowrap"
```

This forces all sentences to stay on one line, even if they overlap the portrait image.

