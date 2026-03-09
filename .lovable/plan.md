

## Plan: Hero Section Refinements

### Changes to HeroSection.tsx

**1. Slower, More Elegant Rotation**
- Increase interval from 2500ms to 3500ms
- Slow down animation duration from 0.4s to 0.6s
- Use smoother easing for more elegant transitions

**2. Rotating Words Styling**
- Add `font-bold` and use `font-sans` (different from handwritten) for rotating words
- Remove permanent underline
- Add hover state with animated underline using Tailwind transition classes
- Add `isHovered` state to track hover and show/hide underline

**3. Hero Image Alignment** (from previous plan)
- Change portrait container from `flex-shrink-0 w-[340px] lg:w-[420px] relative` to `absolute top-0 right-0 w-[400px] lg:w-[520px]`
- Pins image to top-right corner of section

### Technical Implementation

```tsx
// Interval change: 2500 → 3500
setInterval(() => {...}, 3500);

// Animation transition: 0.4s → 0.6s
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}

// Rotating word span styling (hover underline):
className="inline-block font-bold font-sans text-card-foreground 
  relative after:absolute after:bottom-0 after:left-0 after:w-full 
  after:h-[3px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 
  after:transition-transform after:duration-300 after:origin-left"

// Portrait container:
className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0"
```

