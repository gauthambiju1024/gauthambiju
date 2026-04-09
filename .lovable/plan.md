

## Gradual Chaos-to-Order with Late Convergence

### Concept
Instead of a hard cutoff or power curve, use a smooth easing that starts reducing chaos immediately from the first scroll pixel, but keeps most of the chaos through the middle of the page and only reaches perfect order at the very bottom. A quadratic ease-in (`sp * sp`) achieves this naturally:

- At 25% scroll → only 6% ordered
- At 50% scroll → 25% ordered  
- At 75% scroll → 56% ordered
- At 100% scroll → 100% ordered

This feels gradual throughout, always progressing, but chaos lingers longer.

### Changes — `src/components/ui/entropy.tsx`

In both `update()` and `draw()`, replace the raw `sp` with `sp * sp`:

```typescript
const sp = scrollProgressRef.current;
const easedSp = sp * sp; // gentle quadratic: chaos lingers, order arrives late
const chaos = 1 - easedSp;
```

Use `easedSp` for grid-return force and `chaos` for velocity, and `easedSp` for alpha calculation.

### Files: 1
- `src/components/ui/entropy.tsx`

