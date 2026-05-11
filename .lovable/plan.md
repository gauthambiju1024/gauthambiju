## Goal

After the ID-card flip, the hero stage transitions into a real `#about` panel that:
- behaves like every other panel (scrolls under the Assembly Header, same width/spacing rhythm)
- shows the **back of the card on the right** (now an interactive Journey card)
- shows the **interactive Globe on the left**, markers wired to specific Journey entries

## 1. Pin release & "About" becomes a real panel

`src/components/HeroAboutFlip.tsx`
- Tighten pin: end the sticky pin right after the flip completes (~135vh) so the card is no longer locked to the viewport once it has flipped.
- After pin release, the hero anchor scrolls away and the portal stage follows it (existing behavior), so the card naturally exits with the page.

`src/components/HeroIdBadge.tsx`
- Lower the portal stage `z-index` from 30 → `1` so the Assembly Header (fixed, body-level) sits above the card while it scrolls past.
- Keep `position: fixed` tracking, but use `transform: translate3d(...)` instead of writing `top/left` each frame, and snap `tx/ty` to 0.5 px and `scale` to 0.001 to remove jitter.

## 2. Right side after flip — Tabbed Journey card (back of ID)

Restructure the back face so it looks like a "mini journey panel" living inside the card:

- **Header row:** small `· ABOUT` label + page count (kept).
- **Tabs (segmented control, mono text):** `OVERVIEW · EDUCATION · EXPERIENCE`
  - **Overview:** the existing About blurb + traits + focus pills + quick facts (current content, condensed).
  - **Education:** entries from `JourneyTimeline` (IIT GN, IIM Indore, schooling).
  - **Experience:** internships + work entries (Accenture + new ones the admin adds).
- **Entry list:** each row = title, subtitle, period; click expands inline (Airbnb-style) — content morphs **inside the card bounds** (no overflow). Only one expanded at a time; smooth height/crossfade animation; close button to return to list.
- **Common content** persists across tabs: the small "Build with intent" footer note stays pinned to the bottom of the card.

Backing data:
- New Supabase content key under `site_content`: `about.journey` with shape `{ education: Entry[], experience: Entry[] }`, where `Entry = { id, title, org, period, location, summary, details, link?, markerId? }`.
- Read via existing `useSiteContent("about", "journey")` pattern; fall back to current `JourneyTimeline.milestones` array if empty.
- Admin: extend `src/pages/admin/AdminContent.tsx` with an editor for `about.journey` (CRUD entries, optional external link, optional `markerId` to link a globe marker).

Card sizing:
- Bump the card width on flip (handled in `HeroIdBadge` via target scale) so the tabbed content is readable; back face uses `flex` column with a scrollable inner region clipped to card bounds (`overflow: hidden` + inner `max-height`).

## 3. Left side after flip — Globe linked to entries

`src/components/HeroIdBadge.tsx` (new sibling layer inside the stage)
- Add a left-side slot that fades in as `p2` (flip progress) goes 0 → 1, mirroring the card's slide. Holds `<Globe>` at ~`min(40vh, 380px)` square.
- Pass a custom `markers` config so each marker carries `markerId` matching a Journey entry (Dubai, Ahmedabad, Kerala, Indore, etc.).
- Click handler on canvas → hit-test marker → set selected entry id in a shared store (lightweight: lift state to `HeroAboutFlip` or use a small Zustand/`useState` + context). On selection: switch the back-of-card to the right tab and expand that entry inline.

`src/components/Globe.tsx`
- Extend props: `markers: { id, location, size, label }[]`, `onMarkerClick?(id)`.
- Add a transparent overlay `<div>` matching marker screen positions (computed from cobe phi/theta) for accessible clickable hit areas (cobe canvas alone can't dispatch per-marker clicks reliably).

## 4. Journey panel cleanup

- `JourneyTimeline.tsx`: remove the embedded `<Globe>` background (it's moving to the hero/about composition). Keep the timeline list as the standalone `#journey` station.
- Source `JourneyTimeline` from the same `about.journey` data so admin edits flow to both card-back and the journey station.

## 5. Out of scope

- BlueprintFrame, MarginDoodles, Entropy, AssemblyHeader styling.
- Any other panels (projects, thinking, skills, writing, contact).
- Lanyard math, drag behavior, front-of-card layout.

## Technical notes

- Z-index map after change: AssemblyHeader (fixed, body) `z-50` > card stage `z-1` > Entropy/grid backgrounds.
- Smoothness: replace per-frame `top/left` writes with `translate3d`; snap subpixels.
- New file: `src/components/about/AboutCardBack.tsx` to host the tabbed UI (keeps `HeroIdBadge` focused on transform/lanyard).
- New file: `src/components/about/AboutGlobe.tsx` wrapping `Globe` + click overlay.
- Shared selection: small context `AboutSelectionContext` (selected entry id + active tab) consumed by both `AboutCardBack` and `AboutGlobe`.
- DB migration: add seed row `site_content (section='about', key='journey', value=jsonb)` with current milestones merged into education/experience.
