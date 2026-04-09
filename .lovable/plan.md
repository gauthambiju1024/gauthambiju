

## Scroll-Responsive Entropy: Chaos → Order on Scroll

### Concept
The canvas is fixed (viewport-sized), but a scroll listener dynamically updates each particle's `orderStrength` based on the current scroll position. At the top of the page (scroll = 0), all particles are fully chaotic. As the user scrolls down, particles progressively snap to their grid positions. The total scrollable height of the page defines the full chaos→order range.

### Changes — `src/components/ui/entropy.tsx`

1. **Add scroll tracking**: Listen to `window.scroll` events. Compute a global `scrollProgress` value from `0` (top) to `1` (bottom of page) using `scrollY / (document.body.scrollHeight - window.innerHeight)`.

2. **Dynamic orderStrength**: Instead of static `orderStrength = y / h`, update every particle each frame: `orderStrength = scrollProgress`. All particles share the same order level — the entire field transitions together based on scroll position.

3. **Much more subtle visuals**:
   - Particle size: `1px`
   - Particle alpha: `0.06–0.10`
   - Connection line alpha: `0.03`, distance threshold: `30px`
   - These values make it a barely-visible texture behind content

4. **Stronger behavior contrast**:
   - At scroll=0 (chaos): high random velocity (`* 3`), no grid-return force
   - At scroll=1 (order): strong grid-return (`0.12`), zero random velocity
   - This makes the transition unmistakable despite low opacity

### Files: 1
- `src/components/ui/entropy.tsx`

