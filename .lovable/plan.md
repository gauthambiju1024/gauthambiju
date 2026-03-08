## Plan: Add COBE Globe to Hero Section

### Overview

Add a partial (clipped) COBE globe to the hero section with highlighted locations: ras al khaimah( UAE), Gandhinagar (India), Pala/Kerala (India), and Indore (India). The globe will sit on the right side of the hero, partially cropped, rotating slowly, fitting the notebook aesthetic.

### Dependencies

- Install `cobe` package for the globe renderer (lightweight, canvas-based, no heavy 3D libs needed)

### Implementation

**1. Create `src/components/Globe.tsx**`

- COBE-based globe component using canvas
- Dark theme config (`dark: 1`) with warm paper-toned base color to blend with the notebook
- Markers at the 4 specified locations:
  &nbsp;
  - UAE (Dubai): [25.2048, 55.2708]
  - Gandhinagar: [23.2156, 72.6369]
  - Pala, Kerala: [9.7132, 76.6841]
  - Indore: [22.7196, 75.8577]
- Marker color matching the primary coral/red accent
- Auto-rotation with drag interaction
- Initial phi/theta oriented toward India region
- Subtle styling: low diffuse, muted glow, to feel like an ink/sketch on paper

**2. Update `src/components/HeroSection.tsx**`

- Add the globe to the right side of the hero using a flex/grid layout
- Globe shown as a partial circle (overflow hidden, shifted right so only ~60% visible) on desktop
- Hidden or scaled down on mobile for performance
- The text content stays on the left, globe on the right — asymmetric editorial layout
- Wrapped in a motion.div for fade-in animation

### Visual Treatment

- The globe will have a paper-like warm tone (`baseColor` matching notebook ivory) with dot markers in the primary red
- Slightly transparent/blended to feel like it's drawn on the notebook page
- Globe container uses `overflow: hidden` and negative margin to create the "partial globe" effect — only showing the left hemisphere peeking from the right edge