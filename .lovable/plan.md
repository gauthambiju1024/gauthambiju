

## Plan: Split Hero/About and Restyle Hero as Blueprint UI

Separate Hero and About into independent panels and restyle the Hero section to match the reference image — dark green blueprint surface with grid lines, technical annotations, portrait with corner brackets, and navigation at the bottom.

---

### Changes

**1. `src/index.css` — Add blueprint utilities**
- Add `.blueprint-surface` class: dark green background (`hsl(160 20% 16%)`) with 20px minor / 100px major CSS grid lines in white at ~3-5% opacity
- Add `.corner-brackets` utility for portrait frame (using `::before`/`::after` pseudo-elements with border segments)
- Add `.dimension-line` style for the "160 PX" measurement marker below portrait

**2. `src/pages/Index.tsx` — Split Hero and About into separate panels**
- Remove the shared notebook wrapper that contains both Hero and About
- Hero gets its own full-width panel with `blueprint-surface` class, rounded corners, and border
- About gets its own panel keeping the existing notebook/paper styling
- Move `<Navigation />` out of the sticky top wrapper and into the Hero section (rendered at the bottom of Hero, inside the blueprint panel)
- Remove the sticky nav wrapper entirely — nav lives inside hero panel
- Keep About as a separate `.notebook` panel below

**3. `src/components/HeroSection.tsx` — Blueprint redesign matching reference**
- **Top bar**: "GAUTHAM BIJU" (left, tracked mono, cream) and "FIELD NOTES / MAR 2026" (right, mono, cream) — replaces current Field Notes badge
- **Tagline box**: "#" symbol in a small bordered box + "INTERSECTION OF TECHNOLOGY - BUSINESS · DESIGN" in a bordered container below the top bar
- **Headline**: Keep existing structure — "I'm learning to build" / MorphingText / "for problems worth solving" but add:
  - Dashed arrow annotation (`--->`) to the left of "I'm learning to build"
  - Dashed box around the morphing word area with a label tag (e.g., "PRODUCTS") connected by a dashed line to the right
  - Dashed arrow after "I'm learning to build" pointing right
- **Portrait**: Remove the gradient mask fade. Instead, frame with:
  - "- PROFILE -" label centered above
  - Corner bracket marks (thin white lines at corners)
  - Right-side vertical dimension marker with "2E00" text
  - Bottom dimension line with "160 PX" label
  - "BUILDER · THINKER · MAKER" label below
  - White border/frame around the image
- **CTAs**: White/cream solid background with dark text, rounded-sm — "VIEW WORK →" and "RESUME"
- **Remove** location line ("INDIA · GMT + 5:30") from bottom
- **Navigation rendered at bottom**: Include `<Navigation />` component at the bottom of this section, separated by a thin top border line
- All text colors: cream/white tones to contrast with dark green background

**4. `src/components/Navigation.tsx` — Support embedded mode**
- Accept an optional `embedded` prop (boolean)
- When `embedded=true`: no sticky behavior, no compact mode, no backdrop blur — just a flat horizontal bar with cream text on transparent background
- When `embedded=false` (default): current behavior (for fallback/future use)
- In Index.tsx, render `<Navigation embedded />` inside the hero panel

---

### What stays the same
- All content text, data fetching (`useSiteContent`), MorphingText component
- About section content and internal styling (just gets its own wrapper)
- All other section panels unchanged
- Color CSS variables in `:root` unchanged
- All routing, hooks, and Supabase integration

### Files modified (4)
1. `src/index.css`
2. `src/pages/Index.tsx`
3. `src/components/HeroSection.tsx`
4. `src/components/Navigation.tsx`

