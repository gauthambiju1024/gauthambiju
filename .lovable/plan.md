

## Alternative: Remove Mask, Use Scroll Margin Instead

### Problem
The fixed background-colored mask behind the header looks unnatural — it creates a visible dark band that doesn't blend well. Meanwhile the header itself is barely visible.

### Better Approach: No Mask Needed
Instead of trying to hide content behind a transparent header, **make the header blend naturally with scrolling content** by:

1. **Remove the fixed mask div entirely** — no more artificial background band
2. **Give the header a proper frosted-glass effect** — a subtle semi-transparent background with strong backdrop blur so content behind it is obscured naturally by the blur, not by an opaque mask
3. **Add `scroll-margin-top`** to each section so when navigating via header links, content lands below the header (not behind it)

### Changes

#### `src/pages/Index.tsx`
- **Delete** the fixed mask div (line 27) completely
- Add a CSS class or inline `scroll-margin-top` to each section (`#home`, `#about`, panel sections) so they scroll to the right position when navigated to

#### `src/components/AssemblyHeader.tsx` (line 531)
- Update the sticky header background to use a stronger frosted-glass effect:
  - `background: 'hsla(220, 15%, 12%, 0.92)'` — more opaque so content is mostly hidden
  - `backdropFilter: 'blur(20px)'` — strong blur to obscure anything behind
  - Keep the subtle border bottom
- This makes scrolling content behind the header appear as a soft blur rather than being sharply visible or masked

#### `src/index.css`
- Add a utility class for scroll-margin-top on sections (e.g. `[id] { scroll-margin-top: 180px; }`) to handle anchor navigation

### Why This Is Better
- No artificial mask element cluttering the DOM
- The header itself handles content occlusion via backdrop-blur — this is the standard modern approach (like macOS menu bars, iOS nav bars)
- Content naturally fades/blurs as it passes behind the header rather than being abruptly cut off
- Margin doodles are completely unaffected

### Files: 3
- `src/pages/Index.tsx` — remove mask div
- `src/components/AssemblyHeader.tsx` — stronger frosted-glass background
- `src/index.css` — add scroll-margin-top for sections

