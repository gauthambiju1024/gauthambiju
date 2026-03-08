

## Plan: Move Globe to Connect Section

### Changes

**1. `src/components/Footer.tsx`** — Remove Globe
- Remove the Globe import and the globe container div
- Keep only the copyright/name footer text

**2. `src/components/ConnectSection.tsx`** — Add Globe as background
- Import Globe component
- Place it as a semi-transparent background element behind the "Let's shape the future" heading and social links
- Position it absolutely on the right side, partially clipped, at ~40% opacity
- Responsive sizing: hidden on mobile, visible from `md` up
- Wrap in `motion.div` with `whileInView` fade-in animation

