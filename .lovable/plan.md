

## Plan: Redesign Hero Section Text

### What the user wants

Replace the current hero text with this structure:
- **Main heading**: "I'm learning to build"
- **Rotating word** (bold, highlighted): products / systems / platforms / experiences
- **Continuation**: "for problems worth solving."
- **Subtext**: "At the intersection of Technology · Business · Design"
- Remove "Ideas are easy." and "change the world."

### Changes

**`src/components/HeroSection.tsx`**:

Remove the two `<h1>` blocks ("Ideas are easy." and "[word] change the world."). Replace with:

```
I'm learning to build
[rotating word]        ← bold, primary underline, clipPath reveal
for problems worth solving.
```

- Line 1: `"I'm learning to build"` — large handwritten font, muted color
- Line 2: Rotating word (products/systems/platforms/experiences) — bold, `font-sans`, primary accent underline, same smooth clipPath animation
- Line 3: `"for problems worth solving."` — same size as line 1, muted
- Below: subtext `"At the intersection of Technology · Business · Design"` — small, uppercase, tracked, very muted

Update `defaultWords` to `["products", "systems", "platforms", "experiences"]`.

Keep: name, portrait parallax, location line, stagger animation. Remove tagline line (merged into subtext).

### Files
| File | Change |
|---|---|
| `src/components/HeroSection.tsx` | Replace hero text structure, update default words |

