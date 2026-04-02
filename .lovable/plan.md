

## Plan: Unify Shelf to Single Dark Color

The section currently uses two slightly different dark shades — the outer section wrapper (`hsl(220 10% 8%)`) and the inner shelf (`hsl(220 10% 12%)` → `hsl(220 10% 10%)`). The user wants one uniform color throughout.

### Changes — `src/components/ProjectsShelf.tsx`

1. **Remove the inner shelf's separate background** (line 98-107) — remove `rounded-lg mx-4 md:mx-8` wrapper styling so the shelf blends into the section. Set the shelf background to match the section: `hsl(220 10% 8%)` flat (no gradient). Keep the subtle radial amber vignette and vertical line texture.

2. **Shelf ledge** (line 191) — change ledge gradient to use `hsl(220 10% 8%)` / `hsl(220 10% 10%)` so it blends with the uniform background instead of standing out.

3. **Section wrapper** (line 58) — keep as `hsl(220 10% 8%)`. Everything matches this single color.

Result: one seamless dark surface with no visible color split between outer wrapper and inner shelf.

