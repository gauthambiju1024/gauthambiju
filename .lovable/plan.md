

## Fix: Make Particles and Gradient Spotlight Visible

### Root Causes

1. **Particles** are drawn at opacity 0.05–0.12 with blue hues (220/214) at 50% lightness on a dark background (`hsl(220 15% 12%)`). This is essentially invisible — blue-on-near-black at 5-12% opacity.

2. **Gradient spotlight** uses `hsl(var(--primary) / 0.06)` — only 6% opacity. On the dark background, this produces zero perceptible glow.

### Fixes

#### `src/components/ParticleField.tsx`
- Increase particle opacity range from `0.05–0.12` to `0.15–0.45`
- Increase particle radius from `0.5–2.5` to `1.5–4`
- Increase particle count from 50 to 70
- Shift lightness from 50% to 70% so particles are lighter against the dark bg
- Add a mix of warm hues (gold ~38) alongside the blue for variety

#### `src/index.css` — `.page-spotlight::before`
- Increase gradient opacity from `0.06` to `0.15–0.2`
- Increase radius from 800px to 1000px for a broader, more noticeable glow
- Add a second gradient layer with a warm tone (gold/amber) for richer color

### Files: 2
1. `src/components/ParticleField.tsx` — boost opacity, size, lightness, count
2. `src/index.css` — boost spotlight gradient opacity and radius

