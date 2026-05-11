## Goal
Replace the horizontal panel-slide DeskStage with a traditional vertical-scroll page where each station stacks top-to-bottom.

## Changes

### `src/pages/Index.tsx`
- Remove `DeskStage` and frame imports.
- Render each section directly in document order, wrapped by its frame component, as full-viewport sections with `id` for navigation:
  ```tsx
  <section id="home" className="min-h-screen"><BlueprintFrame><HeroSection /></BlueprintFrame></section>
  <section id="about" className="min-h-screen"><BusinessCardFrame><AboutSection /></BusinessCardFrame></section>
  ...
  ```
- Keep `Entropy`, `MarginDoodles`, `AssemblyHeader`, `AssemblyHeaderMobile`, and `.margin-content-wrapper`.

### `src/components/DeskStage.tsx`
- No longer used by Index. Leave the file in place (no deletions in plan mode scope) — it's simply unimported. Optional cleanup later.

### Console rail (bottom dock)
- The `ConsoleRail` lived inside `DeskStage`. Decide whether to keep it:
  - Option A (recommended): drop it — it tracked the horizontal scroll progress, which no longer exists.
  - Option B: re-mount it as a fixed bottom bar driven by `window` scroll, mapping scrollY → active section by IntersectionObserver.

Default to Option A unless the user wants the dock back.

### Navigation
- `AssemblyHeader` already navigates by `#id` anchors, and global `scroll-margin-top: 100px` is set, so vertical anchor jumps work out of the box.

### HeroSection portal/lanyard
- The portaled lanyard overlay was needed because DeskStage clipped/translated panels. With vertical scroll there's no transform parent, so it will still work but is no longer required. No change needed in this pass.

## Out of scope
- Removing `DeskStage.tsx`, `ConsoleRail`, and related console files.
- Re-styling section frames for vertical flow (each frame already fills `w-full h-full` of its wrapper section).
