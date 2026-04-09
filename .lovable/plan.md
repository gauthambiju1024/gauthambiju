

## Remove All Hard Edges by Extending Header Beyond Viewport

### Problem
The header's left and right edges are visible as hard boundaries, obscuring the margin doodles. The current mask-based fade approach shrinks the visible header area inward.

### Approach
Extend the header element physically beyond the viewport on the left, right, and bottom using negative margins, then compensate with equal padding so internal content stays unchanged. The left/right edges go off-screen (invisible), and only the bottom gets a gentle gradient fade.

### Changes

#### `src/components/AssemblyHeader.tsx` (line 531)
Replace the current style object on the sticky header `<div>`:
- Remove all `maskImage`, `maskComposite`, `WebkitMaskImage`, `WebkitMaskComposite` properties
- Add:
  ```
  marginLeft: '-60px',
  marginRight: '-60px',
  paddingLeft: '60px',
  paddingRight: '60px',
  marginBottom: '-40px',
  paddingBottom: '40px',
  maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
  ```
- The 60px extension matches the margin doodle column width, pushing the frosted-glass edges behind the doodle columns so doodles remain fully visible
- Only the bottom edge needs a gradient fade; left/right are simply off-screen

### Files: 1
- `src/components/AssemblyHeader.tsx`

