

## Plan: World-Class Panel Transitions & Connections

### Concept
Each panel on the desk is a different physical object. As you scroll, the experience should feel like your eyes are traveling across a real desk — objects catch light, cast shadows, have depth, and small items lie between them. Four systems working together:

### System 1: Scroll-Triggered Entrances (Index.tsx)
Each panel enters with a staggered reveal:
- Scale from 0.96 → 1.0
- Opacity 0 → 1
- Slight Y translation (30px → 0)
- Each panel uses `whileInView` with `viewport={{ once: true, amount: 0.15 }}`
- Transition uses a spring with `stiffness: 80, damping: 20` for a natural deceleration

The Hero and About panels get a slightly different entrance — Hero fades in immediately on load, About slides up with a notebook "placed down" feel (tiny rotateX perspective tilt, 2deg → 0).

### System 2: Dynamic Shadow & Glow (index.css + Index.tsx)
As each panel scrolls through the viewport, its shadow shifts based on scroll position:
- When entering from below: shadow casts upward (as if light is from above)
- When centered in viewport: maximum shadow depth and spread
- When exiting above: shadow softens and fades

Implemented via `useTransform` on each panel's `scrollYProgress`, mapping to a `boxShadow` motion value. This creates the "desk lamp sweeping" effect.

Additionally, panels get a subtle border-glow on their top edge as they enter — a thin 1px gradient highlight that fades after the entrance animation completes.

### System 3: Contextual Desk Connectors (new DeskConnectors.tsx)
SVG objects placed in the gaps between panels, each contextually relevant to the two surfaces they bridge:

| Gap | Connector | Why |
|-----|-----------|-----|
| Blueprint → Notebook | Technical pencil + faint sketch lines | Drafting to notes |
| Notebook → Shelf | Paperclip holding a small note | Clipping research to projects |
| Shelf → Whiteboard | Dry-erase marker lying across | From archives to brainstorming |
| Whiteboard → Toolbox | Small wrench/gear icon | From ideas to building |
| Toolbox → Journey | Compass rose | From tools to navigation |
| Journey → Writing | Fountain pen with ink dot | From experience to reflection |
| Writing → Contact | Paper airplane, slightly tilted | From writing to sending |

Each connector:
- Has subtle parallax (moves at 0.5x scroll speed via `useTransform`)
- Fades in as the gap enters viewport
- Is rendered as a simple SVG with the handwritten Caveat font for any labels
- Positioned centrally in the gap, ~40px tall

### System 4: Depth & Parallax Layering (Index.tsx)
Panels move at very slightly different scroll speeds to create a parallax stacking feel:
- Odd panels: translateY moves at 1.0x (normal)
- Even panels: translateY has a tiny parallax offset (~5-10px range) via `useTransform`
- This is extremely subtle — just enough to feel like stacked objects at different heights on a desk

### Files

1. **`src/components/DeskConnectors.tsx`** (new, ~120 lines)
   - Array of connector configs (SVG element, parallax speed, label)
   - Each connector is a small component with `useParallax` for scroll-linked motion
   - Simple, hand-drawn-style SVGs (stroke-based, matching margin doodle aesthetic)

2. **`src/pages/Index.tsx`** (~40 lines changed)
   - Wrap each panel in `motion.div` with `whileInView` entrance animations
   - Insert `<DeskConnector>` components between panels
   - Add per-panel `useScroll`/`useTransform` for dynamic shadow values
   - Add subtle parallax offset to alternating panels

3. **`src/index.css`** (~30 lines added)
   - `.desk-connector` styles (centered, pointer-events-none, z-index between panels)
   - `.panel-entrance-glow` keyframe for the border highlight on entry
   - Remove the static `box-shadow` from `.section-panel` (replaced by dynamic motion shadow)

### Performance
- All animations use `transform` and `opacity` only (GPU-composited)
- `will-change: transform` on animated panels
- `viewport={{ once: true }}` on entrances so they don't re-trigger
- Connectors are lightweight SVGs with no JS animation loops

