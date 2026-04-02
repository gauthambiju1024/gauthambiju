

## Plan: Seamless Top Edge

The top recessed shadow (`from-black/40`) creates a visible dark band at the top of the shelf. Remove it and also remove the horizontal margins on the shelf container so it sits flush within the section.

### Change — `src/components/ProjectsShelf.tsx`

1. **Line 99**: Remove `mx-4 md:mx-8` from the shelf container (keep `p-3 md:p-4 relative overflow-hidden`)
2. **Line 109**: Remove the top recessed shadow div entirely (`from-black/40`)
3. Keep the bottom shadow (line 110) as-is for the shelf ledge effect

