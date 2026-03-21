

## Plan: Smoother Initial Page Load Animation

### Problem

On first load, multiple animations compete simultaneously:
1. `PageTransition` does a 3D rotateY + scale + opacity (0.6s)
2. Inside it, every section has `sectionReveal` (opacity + y + scale via `whileInView`)
3. Hero has its own stagger container (0.3s delay + 0.1s stagger per child)
4. Portrait fades in with 0.5s delay
5. Progress bar spring starts calculating

All fire at once, causing a janky first frame with too many transforms.

### Solution

**Layer the animations sequentially** so the page flip completes first, then content reveals gracefully.

#### `src/components/PageTransition.tsx`
- Reduce rotateY from `-12` to `-6` (subtler flip)
- Reduce duration from `0.6s` to `0.45s`
- Add `onAnimationComplete` callback or use CSS to signal when page flip is done

#### `src/pages/Index.tsx`
- For the **hero section specifically** (first group, first item): skip `sectionReveal` variants — the hero already has its own stagger animation. Wrapping it in another reveal causes double-animation
- Add `delayChildren: 0.3` to `sectionReveal` so non-hero sections wait for the page flip to finish before revealing

#### `src/components/HeroSection.tsx`
- Increase `delayChildren` from `0.3` to `0.5` so hero content waits for page flip
- Change portrait delay from `0.5` to `0.7` so it enters after text
- Add `will-change: transform, opacity` to the stagger container for GPU compositing on first paint

### Files to Modify

| File | Change |
|---|---|
| `src/components/PageTransition.tsx` | Subtler, faster flip animation |
| `src/pages/Index.tsx` | Skip sectionReveal for hero, delay others |
| `src/components/HeroSection.tsx` | Increase initial delay so content enters after page flip |

