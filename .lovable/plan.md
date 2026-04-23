
## Convert Panel Transitions to Horizontal Scroll

Replace the current vertical-scroll-driven crossfade with a **horizontal-scroll-driven crossfade**. The page still scrolls vertically (natural mouse/trackpad behavior), but the visual metaphor of progressing through panels becomes horizontal: each panel slides in from the right and out to the left, in sync with scroll position. The Library and Thinking inner scrolls are preserved.

### Behavior

- Page height stays `sections.length * 100vh` so vertical scroll drives progress.
- As `scrollYProgress` advances, the **active panel translates horizontally across the stage** while crossfading with the next panel.
- During each section's slice, panel sits centered (`x: 0%`).
- During the fade window between section N and N+1:
  - Panel N slides from `0%` → `-100%` (exits left) and fades out.
  - Panel N+1 slides from `100%` → `0%` (enters right) and fades in.
- Result: feels like a horizontal carousel, but driven smoothly by vertical scroll velocity.

### Implementation (single file: `src/components/DeskStage.tsx`)

Update `PanelLayer` to compute both `opacity` and `x` from `scrollYProgress`:

```text
slice       = 1 / total
start       = index * slice
end         = (index + 1) * slice
fadeWindow  = slice * 0.18
fadeInStart = start - fadeWindow   (entering from right)
fadeOutEnd  = end + fadeWindow     (exiting to left, into next slice)

x:        [fadeInStart → start]  : "100%"  → "0%"
          [start → end - fadeWindow] : "0%"
          [end - fadeWindow → end] : "0%" → "-100%"

opacity:  same keyframes, 0 → 1 → 1 → 0
```

Edge cases:
- First panel (`index === 0`): no enter animation — starts at `x: 0%, opacity: 1`, only animates exit.
- Last panel (`index === total - 1`): no exit animation — only enter, then stays at `x: 0%, opacity: 1`.

Apply via `motion.div` style:
```tsx
<motion.div style={{ opacity, x }} className="absolute inset-0">
```

Keep the existing `pointer-events` toggle (interactive when `opacity > 0.5`) so only the foreground panel receives input. Keep `overflow-hidden` on the stage container so off-screen panels don't leak into the layout.

### What stays the same

- Vertical scroll drives everything (no scroll hijacking, no horizontal page scroll).
- Section anchors, header jump-to behavior, desk strip highlighting — unchanged.
- Inner panel scroll for Library (`BookshelfFrame`) and Thinking (`CorkboardFrame`) — unchanged. Inner scroll still works because the panel is centered (`x: 0%`) for the bulk of its slice.
- Reduced-motion fallback — unchanged (linear stack, no animation).
- 3D desk, header, ordering, routing, backend — untouched.

### Files Modified

- `src/components/DeskStage.tsx` — add `x` transform alongside existing `opacity` transform in `PanelLayer`.

### Out of Scope

- No changes to individual frames or sections.
- No new dependencies.
- No CSS changes.
