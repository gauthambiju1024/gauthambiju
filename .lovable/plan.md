

## Plan: Strip All Animations Except Word Rotation

Remove all Framer Motion animations across the site. The only animation that remains is the rotating word in the hero section, simplified to a clean opacity crossfade.

### Changes

**`src/components/HeroSection.tsx`**
- Remove stagger container/item variants — render all elements as plain `div`/`p`/`h1`
- Remove portrait parallax (`useScroll`, `useTransform`, `portraitY`, `portraitScale`) — portrait becomes a static `img`
- Keep `AnimatePresence` + `motion.h1` for the rotating word only, simplify to pure `opacity` fade (no `clipPath`), duration `0.5s`, ease `easeInOut`
- Remove `will-change` properties

**`src/pages/Index.tsx`**
- Remove `PageTransition` wrapper — render content directly
- Remove progress bar (`motion.div` with `scaleX`)
- Remove `sectionReveal` variants — all sections render as plain `div` instead of `motion.div`
- Remove section divider `motion.div` animation — use plain `div`
- Remove `useScroll`, `useSpring` imports (no longer needed)

**`src/components/PageTransition.tsx`**
- Can be left as-is (unused) or simplified, since it's no longer imported

**`src/components/BeliefsSection.tsx`**
- Remove all `motion` usage (`useScroll`, `useTransform`, scroll-driven opacity/y on each belief item and header)
- Render as plain divs

**`src/components/WorkSection.tsx`**
- Remove scroll-driven `motion` transforms on project rows and header
- Render as plain divs

**`src/components/StorySection.tsx`**
- Remove scroll-driven parallax, sticky header transforms, animated stats
- Render as plain divs

**`src/components/BlogSection.tsx`**
- Remove scroll-driven transforms on post rows and header
- Render as plain divs

**`src/components/ConnectSection.tsx`**
- Remove scroll-driven transforms on link rows, header, and globe
- Render as plain divs

**`src/components/MarqueeText.tsx`**
- Keep the CSS marquee (it's a CSS animation, not framer motion) — this is decorative scrolling text, not a transition animation. If user considers it an animation, remove it too. Will keep it since it's functional UI.

### Files to Modify

| File | Change |
|---|---|
| `src/components/HeroSection.tsx` | Strip all motion except word rotation (simple opacity fade) |
| `src/pages/Index.tsx` | Remove PageTransition, progress bar, section reveal animations |
| `src/components/BeliefsSection.tsx` | Remove all framer-motion |
| `src/components/WorkSection.tsx` | Remove all framer-motion |
| `src/components/StorySection.tsx` | Remove all framer-motion |
| `src/components/BlogSection.tsx` | Remove all framer-motion |
| `src/components/ConnectSection.tsx` | Remove all framer-motion |

