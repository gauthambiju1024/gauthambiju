

## Plan: Break Sections Out of the Notebook Frame

### What's changing

Right now, all 8 sections live inside a single notebook container that scrolls internally. The user wants:

1. **Notebook only wraps Hero + About** (sections 1–2) — the "journal" metaphor stays for these two
2. **Remove "Page 1", "Page 2" labels** from AboutSection
3. **Sections 3–8 become independent floating cards/panels** on the dark desk background, each with its own distinct visual container matching its metaphor (shelf, wall, toolbox, etc.)

### Architecture Change

```text
BEFORE:
┌─ desk background ─────────────────┐
│  ┌─ notebook (all sections) ────┐ │
│  │  Hero                        │ │
│  │  About                       │ │
│  │  Projects                    │ │
│  │  Thinking                    │ │
│  │  ...                         │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘

AFTER:
┌─ desk background (full-page scroll) ──┐
│  ┌─ notebook ────────────────────┐    │
│  │  Hero                         │    │
│  │  About                        │    │
│  └───────────────────────────────┘    │
│                                        │
│  ┌─ shelf panel (projects) ──────┐    │
│  │  ProjectsShelf                │    │
│  └───────────────────────────────┘    │
│                                        │
│  ┌─ whiteboard panel (thinking) ─┐    │
│  │  ThinkingWall                 │    │
│  └───────────────────────────────┘    │
│  ...each section in its own frame...  │
└────────────────────────────────────────┘
```

### File Changes

**1. `src/pages/Index.tsx`** — Major restructure
- Switch from internal notebook scroll to **full-page scroll** (`overflow-y-auto` on the outer div)
- Render Hero + About inside the notebook frame (keep spine, holes, page-fold)
- Render sections 3–8 as independent `<section>` elements outside the notebook, each wrapped in a styled floating card with rounded corners, subtle shadow, and its section-specific background class
- Remove `scrollRef` container-based scroll; use window scroll instead
- Add vertical spacing (gap) between floating section panels

**2. `src/components/AboutSection.tsx`** — Remove "Page 1" / "Page 2" labels
- Delete any page number text/badges from the component

**3. `src/index.css`** — Add a `.section-panel` utility class
- Shared styles for the floating section containers: `max-w-7xl`, centered, rounded corners, border, shadow, background
- Each section applies its own bg class (`.shelf-bg`, `.whiteboard-bg`, `.toolbox-bg`, etc.)

**4. `src/components/Navigation.tsx`** — Update scroll targeting
- Since scroll moves to full-page scroll instead of container scroll, update the `IntersectionObserver` root and `scrollToSection` to use `document` / `window` instead of `scrollContainer.current`

### Section Panel Styling

| Section | Background | Border accent |
|---|---|---|
| Projects | `.shelf-bg` (dark wood) | warm brown |
| Thinking | `.whiteboard-bg` (frosted white) | light gray |
| Skills | `.toolbox-bg` (dark metal) | steel gray |
| Journey | transparent / desk bg | primary blue line |
| Writing | `.editorial-bg` (warm cream) | muted gold |
| Contact | transparent | none (minimal closing) |

Each panel gets: `rounded-xl`, `border`, `shadow-2xl`, `mx-auto max-w-7xl`, `my-8 md:my-12` vertical rhythm.

### Summary
- 5 files modified: `Index.tsx`, `AboutSection.tsx`, `index.css`, `Navigation.tsx`, and minor cleanup
- No database changes needed
- Preserves all existing section component internals — only the outer layout wrapper changes

