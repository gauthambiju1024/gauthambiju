

## Remove All Hard Edges from Header

### Problem
The sticky header has sharp rectangular boundaries on all sides — bottom, left, and right — creating an unnatural box shape against the page content.

### Solution
Apply a radial or combined gradient mask to the header element so the frosted-glass background fades out smoothly on the bottom, left, and right edges. The top edge stays solid (it's at the viewport top).

### Changes

#### `src/components/AssemblyHeader.tsx`
On the sticky header container:
- Remove `borderBottom`
- Apply a mask that fades all edges except the top:
  ```
  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%),
              linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
  maskComposite: 'intersect'
  ```
  This creates a soft vignette: left/right edges fade in the outer 5%, bottom fades in the last 40%.

### Files: 1
- `src/components/AssemblyHeader.tsx`

