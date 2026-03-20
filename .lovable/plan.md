

## Suggested Improvements

Based on the screenshot reference and current codebase, here are production-grade improvements grouped by priority:

### 1. Hero Portrait — Larger & Edge-Blended

The screenshot shows the portrait much larger, extending to the notebook edges with soft gradient fading. Currently it's a `w-[400px] lg:w-[520px]` box with `mix-blend-multiply`.

- Make portrait fill the right ~50% of the hero section height
- Add CSS `mask-image` with radial/linear gradients for soft edge blending (fade into paper on left and bottom)
- Pin to `top: 0; right: 0; bottom: 0` for full-height coverage
- Reduce opacity slightly for a watermark/sketch feel

### 2. Hero Typography — Larger, More Elegant

The screenshot shows much larger text than current `clamp(2.2rem,5.5vw,4rem)`.

- Increase "I'm learning to build" and "for problems worth solving" to `clamp(3rem,7vw,5.5rem)` 
- Increase rotating word to `clamp(3.5rem,8vw,6.5rem)`
- Use `font-serif-i` (Instrument Serif italic) for the handwritten lines instead of Caveat — matches the elegant serif look in the screenshot
- The rotating word stays bold sans-serif

### 3. Navigation — Add a CTA Button

Currently just text links. Add a subtle "Resume" or "Let's Talk" CTA button on the right side with a bordered pill style.

### 4. Micro-Interactions Throughout

- **Work section project rows**: Add subtle `x` translation on hover (shift right 4px) for a tactile list feel
- **Belief items**: Add a left border accent that fades in on hover
- **Connect links**: Icon rotates slightly on hover
- **Stats**: Add a counting animation (numbers tick up when scrolled into view)

### 5. Scroll Progress — Section Indicators

Replace the thin top progress bar with **section dots** on the right edge of the notebook — small dots that indicate which section you're in (like a book index). Active dot is primary color, others are muted.

### 6. Loading State — Skeleton Screens

Currently shows "Loading…" text. Replace with skeleton pulse animations matching the layout shape of each section for a polished feel.

### 7. Mobile Responsiveness

- Hamburger menu for navigation on mobile (currently all nav items show)
- Portrait image hidden on mobile (already done) but could show a smaller version
- Notebook holes/spine hidden on mobile (already done) — good

### 8. Footer — More Character

Current footer is minimal. Add:
- A handwritten "Thanks for visiting" note
- Small notebook doodle decoration
- "Back to top" button that scrolls the notebook container

### 9. Dark Mode Toggle

The desk background is already dark. Add a toggle that switches the notebook paper to a dark mode (dark paper, light text) — like writing in a dark leather journal.

### 10. Performance

- Add `loading="lazy"` to the hero portrait image
- Use `will-change: transform` only on actively animating elements (remove from static ones)
- Reduce marquee duplications from 4x to 3x

---

These are suggestions for discussion. Let me know which ones you'd like to implement and I'll create a detailed plan.

