

## Plan: Scrollable Notebook Interior with Fixed Outer Shell

The goal is to make the notebook look like a real diary — the outer notebook border, spine, holes, and ribbons stay fixed on screen, while only the content inside scrolls. Like looking down at an open book on a desk.

### Architecture

```text
┌─── viewport (desk background, no scroll) ────────────┐
│                                                        │
│  ┌─── notebook (fixed frame) ──────────────────────┐  │
│  │ spine │ holes │ margin │ ribbon │ page-fold      │  │
│  │       │       │        │        │                │  │
│  │  ┌─── scrollable inner ──────────────────────┐  │  │
│  │  │  Navigation (sticky inside scroll)        │  │  │
│  │  │  Hero                                     │  │  │
│  │  │  Marquee                                  │  │  │
│  │  │  Beliefs                                  │  │  │
│  │  │  ...                                      │  │  │
│  │  │  Footer                                   │  │  │
│  │  └───────────────────────────────────────────┘  │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Changes

**`src/pages/Index.tsx`**:
- Make the outer wrapper `h-screen overflow-hidden` (no page-level scroll)
- The `.notebook` container becomes `h-[calc(100vh-3rem)]` (or similar) with fixed positioning characteristics
- Move all section content into an inner `div` with `overflow-y-auto` that scrolls independently
- Navigation moves inside the scrollable area (sticky within it)
- Scroll progress bar tracks the inner scroll container instead of `window`
- Use `useScroll({ container: scrollRef })` targeting the inner scrollable div
- IntersectionObserver `root` in Navigation also targets this container

**`src/components/Navigation.tsx`**:
- Accept an optional `scrollContainer` ref prop
- Use that container for `scrollIntoView` calls and `IntersectionObserver` root
- Sticky within the scroll container (already works with `sticky top-0`)

**`src/index.css`**:
- Add a utility class for the inner scroll area with custom scrollbar styling (thin, paper-colored) so it blends with the diary aesthetic
- Notebook holes get `position: fixed` relative to the notebook frame (they already are absolute to notebook)

### Files to Modify

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Outer `h-screen overflow-hidden`, inner scroll container with ref, pass ref to `useScroll` |
| `src/components/Navigation.tsx` | Accept scroll container ref, use as IntersectionObserver root and scroll target |
| `src/index.css` | Custom scrollbar styles for the notebook interior |

