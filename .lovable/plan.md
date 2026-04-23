

## Fix: Menu Navigation Off-Center Bug

### Root Cause

The anchor `<span>` math in `DeskStage.tsx` is correct, but a global CSS rule in `src/index.css` is silently breaking it:

```css
[id] {
  scroll-margin-top: 100px;
}
```

This rule applies to **every element with an `id`** — including the invisible anchor spans we use for navigation. When the header calls `target.scrollIntoView({ behavior: "smooth", block: "start" })`, the browser subtracts that 100px scroll-margin from the landing position.

Result: scroll lands ~100px **short** of each panel's center. Because horizontal `x` is linear in `scrollYProgress`, that vertical offset translates directly to a small horizontal misalignment — every menu jump leaves the panel slightly to the right of true center, and the opacity crossfade isn't fully resolved either.

### The Fix

Make the navigation use the same math-based jump that already exists in `DeskStage.handleJump`, instead of relying on `scrollIntoView` (which is at the mercy of CSS scroll-margin/scroll-padding).

**Two small changes, one file: `src/components/AssemblyHeader.tsx`**

1. **Replace `scrollIntoView` with explicit scroll math** in the nav-click handler (around line 309–312). The container is `[data-stage-root]` (we'll add this attribute) — but simpler: compute the same target locally using the panel index.

   ```ts
   const handler = () => {
     const total = panelIds.length;
     const targetEl = document.getElementById(panelIds[i]);
     if (!targetEl) return;
     // Find the scroll container (the DeskStage root). Walk up until we hit
     // the element whose height = total * 100vh, or just use the span's own
     // offsetTop — which already encodes the correct scroll target.
     const top = targetEl.getBoundingClientRect().top + window.scrollY;
     window.scrollTo({ top, behavior: "smooth" });
   };
   ```

   `getBoundingClientRect().top + window.scrollY` gives the span's true document-Y, ignoring any `scroll-margin-top`. This lands the viewport top exactly at the span's top → progress hits `(i + 0.5) / N` → panel renders perfectly centered (`x: 0%`, `opacity: 1`).

2. **No changes** to the anchor span positions, `handleJump`, the `x` transform, opacity, or the `GAP` — those are all correct. The `scroll-margin-top: 100px` CSS rule stays (it's needed for browser-native hash-link behavior elsewhere in the app, e.g. blog pages).

### Why not just remove the CSS rule?

The 100px scroll-margin is doing real work for direct anchor links (e.g. `/blog#section`) on pages where the fixed header would otherwise cover the heading. Removing it would break those. Bypassing it only for the homepage nav is the surgical fix.

### What stays the same

- `src/components/DeskStage.tsx` — untouched.
- `src/index.css` — untouched.
- All x / opacity / GAP behavior, reduced-motion fallback, desk strip, 3D scene — untouched.

### Files Modified

- `src/components/AssemblyHeader.tsx` — replace the `scrollIntoView` call inside the per-station click handler (around line 309–312) with an explicit `window.scrollTo` based on the anchor's true document position.

