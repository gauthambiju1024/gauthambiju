

## Plan: Premium Hero Portrait Blending

### Problem
The portrait has visible hard edges and doesn't feel naturally integrated into the notebook background. Need a premium, editorial-level blend.

### Approach
Combine multiple techniques from the user's reference patterns, adapted to the existing journal/notebook aesthetic:

**`src/components/HeroSection.tsx`** — Rework the portrait container:

1. **Gradient overlay layer** — Add a `div` overlay on top of the image with a gradient matching the notebook background color (`hsl(var(--card))`), fading from left-to-right and bottom-to-top. This is the Apple/Airbnb technique.
2. **Radial glow layer** — Add a subtle radial gradient for depth and soft focus.
3. **Image treatment** — Apply `blur-[0.5px]`, reduce opacity to `0.5`, use `mix-blend-multiply` so it picks up the paper texture. Add CSS `filter: sepia(0.15) saturate(0.7) contrast(0.9)` to tone-match the warm notebook palette.
4. **Remove CSS mask approach** — Replace `maskImage`/`maskComposite` with the overlay gradient method, which produces softer, more natural blending without geometric artifacts.

```tsx
{/* Portrait container */}
<div className="hidden md:block absolute -top-4 right-0 w-[450px] lg:w-[560px] h-full z-0 pointer-events-none overflow-hidden">
  {/* Image */}
  <img
    src={portraitSrc}
    alt="Gautham portrait sketch"
    className="w-full h-auto blur-[0.5px] opacity-50"
    style={{
      filter: 'sepia(0.15) saturate(0.7) contrast(0.9)',
      mixBlendMode: 'multiply',
    }}
  />
  
  {/* Gradient overlay — fades image into notebook bg */}
  <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(to right, hsl(var(--card)) 0%, transparent 40%, transparent 85%, hsl(var(--card)) 100%), linear-gradient(to bottom, hsl(var(--card)) 0%, transparent 20%, transparent 55%, hsl(var(--card)) 100%)',
    }}
  />
  
  {/* Radial glow for depth */}
  <div
    className="absolute inset-0"
    style={{
      background: 'radial-gradient(ellipse at 60% 40%, transparent 30%, hsl(var(--card) / 0.6) 70%)',
    }}
  />
</div>
```

### Why this is better
- **No hard edges anywhere** — gradient overlays using the actual background color create seamless transitions
- **Color-matched** — sepia/desaturation tones the photo to match the warm paper
- **Depth** — radial glow adds the "premium portfolio" polish
- **No mask artifacts** — overlay approach is more forgiving than CSS masks

### Files modified
- `src/components/HeroSection.tsx`

