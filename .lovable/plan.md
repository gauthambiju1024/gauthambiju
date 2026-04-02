

## Plan: Dark Shelf with Warm Under-Lighting

Redesign the shelf to match the reference image — a dark, near-black shelf with subtle warm amber glow underneath each ledge.

### Changes

**File: `src/components/ProjectsShelf.tsx`**

**A. Dark shelf background** (lines 100-106)
- Change shelf background from warm brown `hsl(16 21% 42%)` to dark charcoal: `hsl(220 10% 12%)` → `hsl(220 10% 10%)`
- Add a subtle radial vignette overlay for depth

**B. Warm under-shelf lighting** (lines 186-193)
- Change the shelf ledge color to dark: `hsl(220 8% 18%)` → `hsl(220 8% 14%)`
- Add a warm amber glow below the ledge using box-shadow: `0 8px 30px rgba(180, 130, 70, 0.15), 0 4px 15px rgba(180, 130, 70, 0.1)`
- This replicates the warm downlight effect from the reference

**C. Recessed shadows** (lines 108-110)
- Increase top shadow intensity for the deeper, darker look

**D. Section outer wrapper** 
- Darken the overall section background context so the shelf sits against a dark wall (add a dark wrapper around the shelf area)

### Visual result
Dark matte shelves against a dark background, with warm amber light pooling underneath each shelf ledge — matching the reference image's moody gallery aesthetic.

