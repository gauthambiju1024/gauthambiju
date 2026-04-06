

## Plan: Skeuomorphic Polish — Builder's Desk Theme

Add tactile, physically grounded textures to the existing design without changing any section content, layout, or structure. The "builder" identity stays — we just make the materials feel real.

### What changes

**1. `src/index.css` — Texture & material upgrades (CSS only)**

- **Desk surface** (`.desk-pattern`): Add a subtle wood-grain texture using layered CSS repeating gradients in warm dark brown tones, plus a noise SVG overlay for grain
- **Notebook** (`.notebook`): Deepen the shadow to feel like a real journal sitting on wood; add a faint leather-brown border tint and inner glow
- **Notebook spine**: Widen slightly, add a leather-like darker gradient with a subtle gold accent line (embossed feel)
- **Hole punches** → **Brass rivets**: Change from hollow circles to gold-filled circles with a metallic radial gradient
- **Page fold**: Slightly larger with a more realistic paper curl shadow
- **Section panels** (`.section-panel`): Add a subtle top-edge highlight (`inset 0 1px 0 rgba(255,255,255,0.06)`) for material depth
- **Bookmark tabs**: Add a fabric-like gradient instead of flat color
- **Shelf background** (`.shelf-bg`): Add faint horizontal wood-grain lines
- **Cork board** (`.whiteboard-bg`): Shift to a warmer cork-like tone with noise texture
- **Toolbox** (`.toolbox-bg`): Add brushed-metal diagonal hatching
- **New utility `.embossed-text`**: Subtle text-shadow for stamped/debossed heading effect

**2. `src/pages/Index.tsx` — Minimal structural touches**

- Add a subtle warm radial gradient in the top-right corner of the page (simulating a desk lamp casting light on the journal) — purely decorative, absolutely positioned div
- Swap `.notebook-hole` class for a new `.brass-rivet` class on the 4 rivet divs

**3. `src/components/Navigation.tsx` — Subtle material treatment**

- Add a faint bottom border when compact that looks like a brass strip (1px gold/amber gradient border)
- "GB." logo: add a subtle embossed text-shadow (gold highlight + dark shadow)

**4. `src/components/HeroSection.tsx` — Minor polish**

- "Field Notes" badge border: swap to a warm brown tone matching the notebook border
- CTA "View Work" button: add a subtle inset shadow for a pressed/beveled feel

### What does NOT change
- All section components (content, layout, order, structure)
- Typography families and sizing
- Color variable system (HSL structure stays, values shift slightly warmer)
- Routing, data fetching, animations
- Responsive behavior

All textures are pure CSS — no image files needed.

