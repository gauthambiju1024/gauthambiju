

## Center Panels on Menu Navigation + Add Inter-Panel Spacing

Two small but impactful fixes to `src/components/DeskStage.tsx`.

### Problem 1 — Menu jumps land off-center

`scrollYProgress` is normalized over the container's scrollable range, which is `(N-1) * 100vh` (not `N * 100vh`). Panel `i` is centered visually when `progress = (i + 0.5) / N`. Today both the menu's `handleJump` and the anchor `<span>` markers (used by `Navigation.scrollIntoView`) target `i * 100vh`, which corresponds to `progress = i / (N-1)` — the **start** of a panel's slice, where the panel is entering from the right and only partly visible.

**Fix:** compute the scroll offset that lands `progress` exactly at the panel's center.

```ts
// In handleJump (and mirrored on the anchor spans)
const total = sections.length;
const targetProgress = (idx + 0.5) / total;       // panel center
const scrollable = (total - 1) * window.innerHeight;
const top = el.offsetTop + targetProgress * scrollable;
window.scrollTo({ top, behavior: "smooth" });
```

Anchor `<span>` markers (used by header nav `scrollIntoView`) get repositioned the same way:

```tsx
style={{ top: `calc(${((i + 0.5) / total) * (total - 1) * 100}vh - 50vh)`, height: "100vh" }}
```

(The `- 50vh` keeps the span itself a viewport tall and aligned so `scrollIntoView({block: 'start'})` lands the viewport top at the right place.)

After this change, clicking any header item lands the panel perfectly centered (`x: 0%`, `opacity: 1`).

### Problem 2 — No breathing room between panels

Right now the outgoing panel reaches `x: -100%` exactly when the incoming panel reaches `x: 0%` — they kiss at the seam. Adding a small gap (per UI/UX best practice for slide transitions: ~8–12% of viewport width) gives a perceptible "panel break" without feeling sluggish.

**Fix:** push exit/enter offsets slightly past 100%. Update `PanelLayer`'s `x` transform:

```ts
const GAP = 0.10;  // 10% viewport-width gap between adjacent panels
// ...
isFirst
  ? ["0%", "0%", `-${100 + GAP * 100}%`]
  : isLast
  ? [`${100 + GAP * 100}%`, "0%", "0%"]
  : [`${100 + GAP * 100}%`, "0%", `-${100 + GAP * 100}%`]
```

Combined with the existing edge-only opacity crossfade (25% of a slice), the result reads as: outgoing panel slides off-stage → brief negative-space beat → incoming panel slides in. Smoothness and 1:1 scroll mapping are preserved (`x` is still linear in `scrollYProgress`).

### What stays the same

- 1:1 vertical→horizontal scroll mapping, no hijacking.
- Page height `N * 100vh`, sticky stage, edge-fade opacity.
- Reduced-motion fallback, desk strip, 3D scene, full-width panels.
- No new dependencies, no CSS changes, no other files touched.

### Files Modified

- `src/components/DeskStage.tsx` — `handleJump`, anchor span `top`, and `PanelLayer` `x` output range.

