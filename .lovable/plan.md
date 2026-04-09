

## Plan: Replace Hero Navigation with Assembly Header

The uploaded `AssemblyHeader` component (918 lines) replaces the current `Navigation` embedded in the hero section. It renders a fixed SVG conveyor-belt header with scroll-driven progress, robotic arm animations, station navigation, and a compact design box with popover.

### Key Adaptations

The uploaded component uses `panelIds = ["home","about","work","think","skill","path","write","send"]` but the actual section IDs are `["home","about","projects","thinking","skills","journey","writing","contact"]`. The NAV labels and keys must be updated to match.

The header is currently `position: fixed; inset-x-0; top-0` which spans the full viewport width. Per your request, it should instead sit **inside** the `margin-content-wrapper` so it aligns with the panels (after the margin doodles), not edge-to-edge.

### Changes

#### 1. Create `src/components/AssemblyHeader.tsx`
- Copy the uploaded file with these modifications:
  - Update `NAV` array keys/labels to match actual section IDs: `home`, `about`, `projects`, `thinking`, `skills`, `journey`, `writing`, `contact`
  - Change from `fixed inset-x-0 top-0` positioning to `sticky top-0` so it sticks within the margin-content-wrapper flow and respects the margin gutters
  - Add the `blueprint-surface` background styling or a matching dark background so it blends with the header aesthetic

#### 2. Update `src/components/HeroSection.tsx`
- Remove the `<Navigation embedded />` block at the bottom (lines 153-156)
- Remove the `Navigation` import

#### 3. Update `src/pages/Index.tsx`
- Import `AssemblyHeader`
- Place `<AssemblyHeader panelIds={[...]} />` as the first element inside `margin-content-wrapper`, above the hero section — making it a sticky header that scrolls with content but stays pinned at the top of the viewport
- Pass the correct panel IDs: `["home","about","projects","thinking","skills","journey","writing","contact"]`

#### 4. Update `src/components/Navigation.tsx`
- No changes needed — the standalone (non-embedded) Navigation is not used on the index page currently, and the embedded variant is being removed from HeroSection

### Technical Details

- The AssemblyHeader SVG viewBox is `0 0 1400 180` with `preserveAspectRatio="xMidYMid meet"` — it scales responsively to fit container width
- Scroll progress drives: overall progress spine, per-station bars, product assembly on belt, robotic arm engagement, spark particles
- The popover (design box) uses `position: absolute` anchored to the header container — since we're moving from fixed to sticky positioning, we need to ensure the popover isn't clipped by `overflow: hidden` on parent elements
- The component has no external dependencies beyond React

### Files: 3
1. `src/components/AssemblyHeader.tsx` — new file (adapted from upload)
2. `src/components/HeroSection.tsx` — remove embedded Navigation
3. `src/pages/Index.tsx` — add AssemblyHeader as sticky header inside content wrapper

