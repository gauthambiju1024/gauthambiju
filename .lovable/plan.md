

## Move the assembly belt's product down to the bottom rail

The user wants the **product being built** (the live sketch that travels along the conveyor belt in the assembly header) to also appear in the bottom rail. Plus the rail should have a transparent background.

---

### What "the object being built" means

In `AssemblyHeader.tsx`, the `prodRef` group renders the user's chosen sketch (drone / rocket / phone / custom) progressively assembling part-by-part as you scroll, riding along the belt. There's also a `previewRef` slot that used to render a larger static "YOUR PRODUCT" preview inside the now-removed design box (currently parked off-screen at `-9999, -9999`).

That progressive sketch is what the user wants visible in the bottom rail.

---

### 1. Transparent rail background

In `src/components/DeskStage.tsx`, replace the rail wrapper's dark gradient + blueprint grid + inset shadow with `background: "transparent"`. Drop the brass top hairline and bottom black hairline in `ConsoleRail.tsx` (they only read against a solid surface). Keep the four corner machining marks at low opacity for ambient grounding. Pills already have their own borders so they remain readable.

### 2. Show the live build in the rail

Add a new component `src/components/console/LiveBuild.tsx` that mirrors the same sketch + same scroll progress as the header belt — but as a static, centered, scaled-up rendering, not a moving conveyor object.

**How it gets the data without coupling to AssemblyHeader internals:**

`AssemblyHeader.tsx` already listens for a `byop:sketch` window CustomEvent (added when we relocated BYOP). We extend the same channel:

- `BYOPDock` already fires `byop:sketch` on pick → both the header AND `LiveBuild` listen.
- Add a tiny scroll listener inside `LiveBuild` (same one-liner the header uses) to compute `progress` 0..1 → `stage = floor(p*8)`, `stageProg = p*8 - stage`.
- Render the sketch's parts using the same `strokesToParts` helper currently inside `AssemblyHeader.tsx`.

**Refactor:** lift `strokesToParts`, `bbox`, `Stroke`/`Sketch` types, and the default `PRESETS[0]` into a shared module `src/components/console/sketchUtils.ts` so both `AssemblyHeader.tsx` and `LiveBuild.tsx` import from one place. No behavior change for the header.

**Visual:**
- Sits in the rail, replacing the current static `<ArtifactPreview>` on the **left zone** (the section-specific blueprint/spines/etc artifact is removed — the live build IS the artifact now, it's the same metaphor and avoids two competing visuals).
- Renders inside an SVG, ~120×56 viewBox like the artifact slot was.
- Each part fades in at `opacity = i < stage ? 1 : stageProg` exactly like the header belt does, so the bottom build assembles in lockstep with the top belt.
- Subtle pulsing dot at top-right of the SVG (small amber LED) when `stage < 8`; turns green at completion. Tiny mono caption below: `parts NN / 08` — this is the only text and it's the build state, not a section counter.

### 3. New rail layout

```text
┌───────────────────────────────────────────────────────────────────┐
│  [live build sketch]      contextual actions          [BUILD ▸]   │
│   parts 03/08                                                     │
└───────────────────────────────────────────────────────────────────┘
```

Three zones unchanged — only the left zone's content swaps from static `ArtifactPreview` to the new `LiveBuild`.

### Files

- `src/components/DeskStage.tsx` — rail wrapper background → `transparent`; remove gradient/grid/shadow; height stays `clamp(72px, 9vh, 96px)`.
- `src/components/console/ConsoleRail.tsx` — drop top brass hairline + bottom black hairline; swap `<ArtifactPreview>` for `<LiveBuild>` in the left zone.
- `src/components/console/sketchUtils.ts` — **new**, exports `Stroke`, `Sketch`, `bbox`, `strokesToParts`, and `DEFAULT_SKETCH` (the drone preset).
- `src/components/console/LiveBuild.tsx` — **new**, the rail-side live build renderer (listens to scroll + `byop:sketch`, renders progressively-assembling SVG sketch).
- `src/components/AssemblyHeader.tsx` — replace local `strokesToParts`/`bbox`/types/PRESETS[0] usage with imports from `sketchUtils.ts`. No visual change in the header.
- `src/components/console/ArtifactPreview.tsx` — kept on disk but no longer mounted (can stay for future use; not deleted to avoid risk).

### What the user sees

- Bottom strip is fully see-through over the page background.
- On the left of the rail: the same drone (or whatever sketch the user picked) that's riding the belt up top, drawn statically and assembling in sync as they scroll. Pick a different sketch from BUILD ▸ and both update together.
- Center pills and right BUILD trigger unchanged.

