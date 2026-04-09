

## Plan: Header Fixed at Top, Content Scrolls Independently Below

### Problem
Content currently scrolls behind/through the transparent header. The user wants a clear separation: the header is locked at the top, and the scrollable content area lives entirely **below** it — never overlapping.

### Approach
Use a flex column layout: the header takes its natural height at the top, the remaining viewport is a scrollable content area. No fixed/sticky positioning needed — the header simply never scrolls because it's outside the scroll container.

### Changes

#### 1. `src/pages/Index.tsx`
- Wrap the page in a `flex flex-col h-screen overflow-hidden` container
- Place `AssemblyHeader` as a non-scrolling flex child at the top (outside `margin-content-wrapper`)
- Wrap all content (hero, about, panels) in a `flex-1 overflow-y-auto` scrollable div
- Remove the `pt-[13vw] md:pt-[10vw]` top padding (no longer needed since content starts below the header naturally)

#### 2. `src/components/AssemblyHeader.tsx` (line 531)
- Remove `fixed top-0 left-0 right-0 z-50` — the header no longer needs fixed positioning
- Keep `margin-content-wrapper` for gutter alignment and `background: 'transparent'`
- Change to a simple `relative z-50` div

### Result
The header sits at the very top of the viewport and never moves. All page content scrolls within the remaining space below the header, never overlapping or appearing behind it.

### Files: 2
1. `src/components/AssemblyHeader.tsx` — remove fixed positioning
2. `src/pages/Index.tsx` — flex layout with separate scroll container

