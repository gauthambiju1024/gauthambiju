

## Plan: Match Shelf Color to Border & Compact the Projects Section

### 1. Answer: Border Color
The notebook border is `hsl(var(--notebook-border))` = `hsl(16, 21%, 42%)` — a warm medium brown. The projects section panel border is `border-[hsl(var(--shelf-wood-light)/0.3)]` and the shelf background inside is a dark `hsl(25 12% 14%)`.

### 2. Changes

**File: `src/components/ProjectsShelf.tsx`**

**A. Match shelf color to the notebook border color**
- Change the shelf background gradient (line 101) from `hsl(25 12% 14%)` / `hsl(24 10% 12%)` to `hsl(16 21% 42%)` / `hsl(16 21% 36%)` — matching the notebook border brown.
- Update the shelf ledge gradient (line 190) to a slightly lighter/darker variant of the same border brown.

**B. Make the section more compact**
- Reduce outer section padding from `py-10 md:py-14` → `py-6 md:py-8`
- Reduce header margin from `mb-8` → `mb-4`
- Reduce title block margin from `mb-6` → `mb-3`
- Reduce category block margin from `mb-4` → `mb-2`
- Reduce shelf padding from `p-4 md:p-5` → `p-3 md:p-4`
- Reduce book container `min-h` from `260px` → `240px` and book height from `260px` → `240px`
- Reduce detail card margin-top from `mt-2` → `mt-1`
- Reduce bottom "Curated Work" margin from `mt-4` → `mt-2`

**File: `src/pages/Index.tsx`**
- Reduce the vertical gap between section panels from `my-8 md:my-12` → `my-6 md:my-8` (affects all panels but mostly benefits projects)

### Technical details
- The notebook border CSS variable is `--notebook-border: 16 21% 42%`, so the shelf will use this exact hue/saturation for visual consistency
- No structural/functional changes — only spacing and color values

