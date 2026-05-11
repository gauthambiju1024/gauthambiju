## Globe → Desk Hub transition with interactive hotspots

A new pinned scroll section between the existing About panel and the rest of the workspace. It zooms from the cobe globe (outer space) → India → Pune → rooftops → desk render. The desk image then becomes a clickable hub where each object jumps to its existing section.

### Scroll choreography (single pinned section, ~400vh tall)

```
0.00 — 0.18   Outer space: existing cobe globe centered, dark backdrop
0.18 — 0.36   Zoom to India: globe scales up + crossfades to AI-generated India satellite tile
0.36 — 0.54   Zoom to Pune: crossfade to AI-generated Pune district tile
0.54 — 0.72   Zoom to rooftops: crossfade to AI-generated rooftop/aerial tile
0.72 — 1.00   Desk reveal: crossfade to uploaded builders-desk image, hotspots fade in
```

Each tier is a layered `<img>` (or canvas for the globe) inside a stage that scales/translates via `framer-motion` `useTransform` driven by the section's `scrollYProgress`. Crossfades use opacity transforms with overlapping ranges so it feels like one continuous push-in. `prefers-reduced-motion` collapses the whole sequence to an instant cut to the desk view.

### Desk hub interaction (after zoom completes)

The desk image (uploaded `image-47.png`) sits full-bleed inside an aspect-locked stage. Transparent `<button>` hotspots are absolutely positioned in **percentages** of the stage, so they scale perfectly across viewports.

Hotspots → existing sections only:

| Object on desk | Section anchor |
|---|---|
| Bookshelf (top-center) | `#projects` |
| Corkboard (top-right) | `#thinking` |
| Notepad ("Ideas in progress") | `#writing` |
| Toolbox (right) | `#skills` |
| Contact tray (far right) | `#contact` |
| ID badge (center-right) | `#about` (scrolls back up) |

(Globe, laptop, build queue notebook, lamp, mug, books, polaroids — decorative, not clickable. Per your selection, only existing sections are wired.)

Hover state: a soft warm glow rectangle (`box-shadow: 0 0 24px hsl(40 60% 60% / 0.4)`) plus a small label tag fading in above the object. Click → smooth scroll to the target `#id` (relies on the existing global `scroll-margin-top: 100px`). After visiting a section and scrolling back up, the desk view is exactly as before — no state lost.

### Responsive behavior

- **Aspect-locked stage**: `aspect-ratio: 3/2`, `width: 100%`, `max-height: 100vh`, image set as `background-size: contain`. Hotspots are positioned with `left/top/width/height` in `%` of the stage, so they always stay aligned to the rendered image regardless of letterboxing.
- **Desktop / laptop (≥1024px)**: full zoom sequence + interactive desk.
- **Tablet (800–1023px)**: same desk image but hotspot hit areas have a `min(44px)` fallback overlay so taps are reliable.
- **Mobile (<800px)**: per your choice — skip the zoom intro and the desk scene entirely. Show a stacked card hub with the 6 sections (Projects, Thinking, Skills, Writing, Contact, About) rendered as simple cards. The pinned section collapses to natural height.

### Files to touch

**New**
- `src/components/desk-hub/DeskHubScene.tsx` — the pinned scroll section, manages zoom layers + hotspot overlay
- `src/components/desk-hub/DeskHotspot.tsx` — single transparent button with hover glow + label
- `src/components/desk-hub/MobileHubCards.tsx` — mobile fallback stacked cards
- `src/assets/builders-desk.png` — copied from `user-uploads://image-47.png`
- `src/assets/zoom-india.jpg` — AI-generated (Gemini image) satellite-style India view
- `src/assets/zoom-pune.jpg` — AI-generated Pune district aerial
- `src/assets/zoom-rooftops.jpg` — AI-generated rooftop aerial near sunset, matching the desk's warm palette

**Edited**
- `src/pages/Index.tsx` — insert `<DeskHubScene />` between `HeroAboutFlip` and the `trailingStations.map(...)`, keep existing section IDs intact so hotspots link works
- No changes to `Globe.tsx`, `HeroIdBadge.tsx`, `AssemblyHeader.tsx`, individual section components, or Supabase

### Technical details

- Zoom layers use `transform: scale()` + `opacity` driven by `useTransform(scrollYProgress, [in, mid, out], [0, 1, 0])` per layer. All layers stacked with `position: absolute; inset: 0`. GPU compositing only — no React re-renders during scroll (matches existing animation policy).
- Globe layer reuses `<Globe>` component with the existing markers config; it's the bottom layer (z-0).
- Desk image layer is the top layer (z-4) and stays opaque after `progress > 0.85`.
- Hotspot coordinates are calibrated against the uploaded image's actual aspect (~3:2). I'll measure each object's bounding box on the image and store as `{left, top, width, height}` in percentages in a `hotspots.ts` constants file.
- Mobile detection via `useIsMobile()` hook (already exists at `src/hooks/use-mobile.tsx`); switch component at `<800px`.

### Out of scope
- No new sections (Build Queue, Experience, Cases/Strategy plates from the image are not wired — only existing sections per your answer).
- No edits to the cobe globe rotation or marker logic.
- No backend / DB changes.
- No changes to Assembly Header navigation.