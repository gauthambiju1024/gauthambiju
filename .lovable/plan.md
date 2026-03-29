

## Plan: Organic Ink-Wash Portrait Blending

### Problem
The current linear gradient masks create geometric, artificial-looking edges. The user wants a natural "droplet" or ink-wash effect — as if the portrait was painted onto the notebook page with watercolors.

### Approach
Use an **SVG feTurbulence filter** as a mask to create organic, irregular edges that look like ink bleeding into paper. This produces a natural, hand-made quality impossible with CSS gradients alone.

### Changes

**`src/components/HeroSection.tsx`**

1. Add an inline SVG with a turbulence-based displacement filter that creates irregular, organic edges
2. Apply this SVG filter to the portrait container alongside a radial gradient mask for the overall fade
3. Add sepia/desaturate CSS filter to tone the image warmly so it feels like a sketch on paper
4. Use `mix-blend-mode: multiply` + low opacity for paper integration

The SVG filter chain:
- `feTurbulence` generates organic noise (like ink blots)
- `feDisplacementMap` distorts the edges using that noise
- Combined with a radial gradient mask for the overall vignette

```tsx
{/* Inline SVG filter for organic edges */}
<svg className="absolute w-0 h-0">
  <defs>
    <filter id="ink-wash">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" />
      <feDisplacementMap in="SourceGraphic" scale="25" />
    </filter>
  </defs>
</svg>

<div
  className="hidden md:block absolute -top-4 -right-4 w-[450px] lg:w-[560px] z-0 pointer-events-none"
  style={{
    maskImage: 'radial-gradient(ellipse 75% 70% at 65% 40%, black 20%, transparent 70%)',
    WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 65% 40%, black 20%, transparent 70%)',
    filter: 'url(#ink-wash)',
  }}
>
  <img
    src={portraitSrc}
    className="w-full h-auto opacity-50"
    style={{
      filter: 'sepia(0.2) saturate(0.7) contrast(0.9)',
      mixBlendMode: 'multiply',
    }}
  />
</div>
```

### Result
- Edges dissolve with organic, watercolor-like irregularity — no straight lines
- Radial vignette fades the portrait naturally from center outward
- Sepia toning makes it feel like a sketch drawn on the notebook page
- Low opacity ensures text readability

### Files modified
- `src/components/HeroSection.tsx`

