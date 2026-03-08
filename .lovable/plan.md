

## Plan: Notebook Responsiveness, Globe Tilt, and Handwritten Fonts

### 1. Make notebook bigger and responsive

**File: `src/components/NotebookLayout.tsx`**
- Replace `max-w-5xl` with `max-w-7xl` and reduce outer padding so the notebook fills more of the screen
- Use responsive padding: `py-4 md:py-6 px-2 md:px-4 lg:px-8`
- The notebook will scale naturally with screen size since it uses `max-w-*` and `mx-auto`

### 2. Tilt globe to show Kerala and shift it down

**File: `src/components/Globe.tsx`**
- Change `theta` from `0.15` to `-0.3` — this tilts the globe's vertical axis so southern India (Kerala at ~9.7N) comes into the visible hemisphere
- Keep `phi` at `1.2` which already centers on the India/Middle East region

**File: `src/components/HeroSection.tsx`**
- Change globe positioning from `top-1/2 -translate-y-1/2` (vertically centered) to `bottom-[-80px]` so it sits lower in the hero
- Keep the right offset for the partial-clipping effect

### 3. All fonts handwritten (Caveat)

**File: `src/index.css`**
- In the `body` rule, change `font-family` from `var(--font-body)` to `var(--font-handwritten)`
- In the `h1-h6` rule, change from `var(--font-display)` to `var(--font-handwritten)`
- This makes the entire site use Caveat by default

**File: `src/components/HeroSection.tsx`**
- Replace `font-display` and `font-serif-i` and `font-mono` classes with `font-handwritten` throughout
- Adjust sizes slightly since Caveat renders larger than the geometric fonts

**Files: other section components**
- Replace `font-display`, `font-mono`, `font-serif-i` references with `font-handwritten` across `WorkSection`, `BeliefsSection`, `StorySection`, `ConnectSection`, `Footer`, `MarqueeText`

