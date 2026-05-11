## Goal

Make the trailing 6 panels (Projects, Thinking, Skills, Journey, Writing, Contact) match the reference project's compact, content-driven layout: a `max-w-7xl` centered wrapper with `my-6 md:my-8` spacing, and the panel itself sized by its content (no forced 100vh). Hero/About flip stays untouched.

## Changes

### 1. `src/pages/Index.tsx`

Replace the trailing-station `<section>` block:

```tsx
<section key={id} id={id} className="w-full" style={{ height: "calc(100vh - 100px)" }}>
  <div className="relative w-full h-full">
    <Frame t={tDummy} active={true}><Section /></Frame>
  </div>
</section>
```

with the reference pattern:

```tsx
<div key={id} className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 my-6 md:my-8">
  <section id={id} className="relative w-full">
    <Frame t={tDummy} active={true}><Section /></Frame>
  </section>
</div>
```

This drops the forced `100vh - 100px` height; each panel will grow to its content.

### 2. `src/components/desk/frames/*Frame.tsx` (6 files)

The frames currently rely on `w-full h-full` + `absolute inset-0` (a fixed-height pattern). Switch each to a flow-layout, content-driven shell so they collapse to their content:

For `BookshelfFrame`, `CorkboardFrame`:
```tsx
<div className="section-panel <bg> <border> relative w-full overflow-hidden">
  <div className="panel-inner-scroll-flow">{children}</div>
</div>
```

For `ToolboxFrame`, `NotebookFrame`, `ScrollFrame`, `LetterFrame` (which use `stage-fit`):
```tsx
<div className="section-panel <bg> <border> relative w-full overflow-hidden">
  <div className="w-full">{children}</div>
</div>
```

Remove `h-full` from the outer and remove the `absolute inset-0` wrapper. Drop `stage-fit` (it forces aspect-ratio fitting for fixed-height stages — incompatible with content-driven sizing).

### 3. `src/index.css`

Add a flow variant of the scroll wrapper so existing scroll styling can still apply if children opt-in (no fixed height):
```css
.panel-inner-scroll-flow { width: 100%; }
```

Leave `.panel-inner-scroll` and `.stage-fit` in place — other places may still use them (Hero blueprint frame still does, and that stays untouched).

### 4. Section components — internal padding sanity

Reference `.section-panel` is just a bordered box; the inner sections in the reference (e.g. `AboutSection`) provide their own `px-6 md:px-16 py-16 md:py-24` spacing. Each of `ProjectsShelf`, `ThinkingWall`, `SkillsToolbox`, `JourneyTimeline`, `WritingDesk`, `ContactClosing` will be **spot-checked** to ensure they have inherent padding and don't assume an absolute-positioned parent. If any section was previously sized via `h-full`/`absolute` assumptions inherited from the frame, swap to natural block layout with `py-12 md:py-20` padding to match reference rhythm. (Edits made surgically per component, not a sweep.)

## Out of scope

- HeroAboutFlip, BlueprintFrame, ID card — unchanged.
- Assembly Header, MarginDoodles, Entropy background — unchanged.
- Navigation behavior and `scroll-margin-top` — unchanged (still works since each section keeps its `id`).
- Admin/CMS, Supabase — unchanged.

## Risks / verification

- Any section that depended on `position: absolute` ancestor will reflow. Will check each in preview after edits and apply minimal padding fixes per component.
- `panel-inner-scroll` previously enabled internal scrolling within a fixed-height frame; with content-driven panels, scrolling becomes the page itself — this is the desired reference behavior.
