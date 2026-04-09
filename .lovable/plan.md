

## Plan: Fixed Header + Rounded Scroll Container

### Layout Concept

```text
┌─────────────────────────────────────────────┐
│  Assembly Header (fixed, transparent bg)     │  ← locked at top, never moves
├─────────────────────────────────────────────┤
│  ~8px gap                                    │
├─────────────────────────────────────────────┤
│ ╭─────────────────────────────────────────╮ │
│ │  Scrollable content container           │ │  ← rounded corners, own scroll
│ │  (Hero, About, Projects, etc.)          │ │     fills remaining viewport
│ │  ...                                    │ │
│ ╰─────────────────────────────────────────╯ │
│                                             │
│  ◄── margin doodles untouched ──►           │  ← sit behind everything as before
└─────────────────────────────────────────────┘
```

### Changes

#### 1. `src/pages/Index.tsx`
- Make the outermost div a full-viewport flex column (`h-screen flex flex-col overflow-hidden`)
- Keep `MarginDoodles` as-is (fixed, z-1, untouched)
- Move `AssemblyHeader` **outside** the `margin-content-wrapper`, as a direct flex child (non-scrolling, shrink-0)
- Add an 8px spacer below the header
- Wrap all content (hero + about + panels) in a new scrollable container: `flex-1 overflow-y-auto` with `rounded-2xl` top corners, the page background color, and the `margin-content-wrapper` side padding
- Remove the old `pt-[13vw]` top padding (no longer needed)

#### 2. `src/components/AssemblyHeader.tsx` (line 531)
- Change from `fixed top-0 left-0 right-0 z-50` to `relative z-50` (it no longer needs fixed positioning since it's a flex child that never scrolls)
- Keep `margin-content-wrapper` class for gutter alignment
- Keep `background: 'transparent'`

### Key Details
- The scroll container gets `rounded-t-2xl` (rounded top corners only) and a subtle border/shadow to look like an integrated panel
- Margin doodles remain `position: fixed` at z-1 — completely unaffected since we're not changing their markup or CSS
- The scroll container uses `overflow-y-auto` so only content inside it scrolls; the header stays put naturally

### Files: 2
1. `src/components/AssemblyHeader.tsx` — remove fixed positioning, use relative
2. `src/pages/Index.tsx` — flex column layout with rounded scroll container

