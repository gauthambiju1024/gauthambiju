

## Plan: Add BuildGap Conveyor Belt Connectors Between Sections

### What It Does
Places 7 animated conveyor-belt strips between the 8 main panels. Each strip has schematic dimension lines, a kinetic belt with spinning rollers and flowing parts, weld sparks on icon parts, and dense mono status labels. The narrative arc (measured → written → shelved → pinned → equipped → travelled → drafted → sent) ties the sections together as a continuous "build" story.

### Color Adaptation
Shift the palette from warm amber (`hsl(38 ...)`) to your site's cool blue-gray system so the gaps feel native:
- `INK` → `hsl(220 15% 45%)` (matches `--muted-foreground`)
- `INK_BRIGHT` → `hsl(220 20% 55%)`
- `ICON_STROKE` → `hsl(220 40% 60%)` (echoes `--primary`)
- `ABSTRACT_STROKE` → `hsl(220 20% 52%)`
- Belt background → `hsl(220 15% 8%)` (near your `--background`)
- Spark fill → `hsl(220 50% 65%)` (blue spark instead of amber)

### Changes

#### 1. `src/components/build-story/BuildGap.tsx` (new file)
- Copy the uploaded component with the color palette adjusted to the cool blue-gray system described above
- SVG marker IDs made unique per instance (append a random suffix) to avoid conflicts when 7 instances share the page

#### 2. `src/pages/Index.tsx`
- Import `BuildGap`
- Insert 7 instances between the 8 panels (hero, about, projects, thinking, skills, journey, writing, contact)
- Each with its narrative `refCode` and `label` pair

### Files: 2
1. `src/components/build-story/BuildGap.tsx` — new component (adapted colors)
2. `src/pages/Index.tsx` — wire up 7 instances between panels

