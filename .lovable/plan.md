## Goal

Replace the current ID card back face with the About-section content imported from project "Remix of My Webpage (06)", keeping the same physical card size (260px) and the existing front face untouched.

## Source content (from `@project:b957ca15` → `src/components/AboutSection.tsx`)

- Narrative paragraphs (condensed) about being a product-minded builder operating at the intersection of tech, business, design — wanting to understand "why" before "how".
- Philosophy quote: *"Build with intent. Document deeply. Ship what matters."*
- **Traits**: Systems Thinking · Fast Learning · Structured Problem Solving
- **Focus**: Product Thinking · AI-Enabled Workflows · Business × UX Intersection
- **Quick Facts**: Based in India · IIM Indore · Product · Strategy · Building

## Changes

### `src/components/HeroIdBadge.tsx`

1. **Remove `back` data plumbing** — drop `HeroBack` type and the `back.*` defaults (`statement`, `focus`, `basedIn`, `workingOn`, `contact`). The new back is static, sourced from the imported About section.
2. **Rewrite the back face JSX** (lines 352–402) to a single 260px-wide card with:
   - Header row: `· ABOUT` (left) and `02 / 08` (right) in mono micro-type.
   - Tight serif-italic intro line: "Product-minded builder. Tech × Business × Design."
   - One-line condensed narrative referencing *why* before *how* (border-bottom emphasis on those two words to mirror the source's `<em>` styling).
   - **TRAITS** block: 3 rows, each `0N` + title (no expanded descriptions — card is too small).
   - **FOCUS** block: 3 small mono pill chips (Product Thinking · AI Workflows · Business × UX).
   - **QUICK FACTS** block: 2-col mini grid (India · IIM Indore · Product/Strategy · Building).
   - Dashed separator + handwritten-italic footer quote: *"Build with intent. Ship what matters."*
3. Tune font sizes (7–10px), line-heights, and `gap` so everything fits the existing 260×~360px card without overflow. Keep the existing card chassis (background, slot at top, shadow, `rotateY(180deg)` transform, backface-visibility).

### `src/components/HeroAboutFlip.tsx`

No changes — flip behavior, hero-fade, and pin geometry already work.

## Out of scope

- No admin/CMS field for the back (it becomes static, derived from the imported About content).
- No edits to the front face of the card.
- No changes to lanyard, scroll-flip math, or hero panel.
