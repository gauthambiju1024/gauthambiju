

## Plan: Move Header Outside Notebook, Remove Bookmarks

### 1. Move Navigation Outside the Notebook Frame

Move `<Navigation>` above the `.notebook` container so it sits in the dark desk background area, matching the `--background` color. It becomes a standalone fixed header above the diary.

**`src/pages/Index.tsx`**:
- Move `<Navigation scrollContainer={scrollRef} />` out of the `.notebook` div, place it directly inside the outer `h-screen` wrapper, above the notebook frame div
- Remove the `relative z-[2] flex-shrink-0` wrapper

**`src/components/Navigation.tsx`**:
- Change background from `hsl(var(--notebook-paper))` to `hsl(var(--background))`
- Change text colors from `--ink` to lighter tones that work on the dark background (e.g. `--notebook-paper` for logo, muted paper tones for nav items)
- Update active/inactive colors accordingly

### 2. Remove Bookmark Ribbons

**`src/pages/Index.tsx`**:
- Delete the two `<button className="ribbon-bookmark ...">` elements (lines 82–99)

### Files to Modify

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Move nav outside notebook, remove ribbon buttons |
| `src/components/Navigation.tsx` | Dark background styling |

