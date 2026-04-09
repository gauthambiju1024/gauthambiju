

## Plan: Replace Hero Navigation with Assembly Header

### Summary
Replace the current embedded navigation in the hero section with the uploaded AssemblyHeader — a fixed 100px SVG header with a conveyor-belt assembly line, scroll-driven progress, station labels for each section, robotic arms with sparks, and a SketchPopover for interactive sketch input.

### What Changes

#### 1. Add new components (2 files)
- **`src/components/build-story/SketchPopover.tsx`** — copy from uploaded file as-is
- **`src/components/build-story/AssemblyHeader.tsx`** — copy from uploaded file as-is

#### 2. Update `src/pages/Index.tsx`
- Import and render `AssemblyHeader` at the top with panel IDs matching section IDs
- Add `pt-[108px]` to the main content wrapper so it clears the fixed header
- Update section IDs to match the 8 station names the header expects: `hero`, `about`, `projects`→`work`, `thinking`→`think`, `skills`→`skill`, `journey`→`path`, `writing`→`write`, `contact`→`send`
- The `panelSections` keys will be updated accordingly

#### 3. Update `src/components/HeroSection.tsx`
- Remove the embedded `<Navigation />` component and its bottom border container (the assembly header replaces it)
- Keep all other hero content (headline, morphing text, portrait, CTAs)

#### 4. Remove old navigation from hero
- The `Navigation` component import and usage in HeroSection will be removed
- The standalone `Navigation` component file stays (used on other pages like blog)

### Section ID Mapping
```text
Station    Section ID    Component
──────────────────────────────────
HERO       hero          HeroSection
ABOUT      about         AboutSection
WORK       work          ProjectsShelf
THINK      think         ThinkingWall
SKILL      skill         SkillsToolbox
PATH       path          JourneyTimeline
WRITE      write         WritingDesk
SEND       send          ContactClosing
```

### Files: 4
1. `src/components/build-story/SketchPopover.tsx` — new file (uploaded code)
2. `src/components/build-story/AssemblyHeader.tsx` — new file (uploaded code)
3. `src/pages/Index.tsx` — add AssemblyHeader, update section IDs, add top padding
4. `src/components/HeroSection.tsx` — remove embedded Navigation

