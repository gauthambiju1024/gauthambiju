

## Plan: Strategy Wall with Scrollable Case Study Cards + Dedicated Case Study Pages

### Overview
Transform ThinkingWall into a horizontally scrollable area of sticky-note/file cards, each backed by database data. Clicking a card navigates to a dedicated case study page at `/case-studies/:slug` with a unique UI distinct from the project pages.

### 1. Database: Create `case_studies` table

```sql
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'Analysis',
  card_type text NOT NULL DEFAULT 'sticky',
  summary text,
  content text,
  cover_image text,
  color text DEFAULT 'hsl(48 80% 88%)',
  tags text[],
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.case_studies FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON public.case_studies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON public.case_studies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON public.case_studies FOR DELETE TO authenticated USING (true);
```

### 2. `src/hooks/useSiteData.ts` — Add `useCaseStudies` and `useCaseStudy` hooks
- `useCaseStudies()` — fetches all published case studies ordered by `sort_order`
- `useCaseStudy(slug)` — fetches single case study by slug

### 3. `src/components/ThinkingWall.tsx` — Redesign

- Replace hardcoded `cards` array with data from `useCaseStudies()`
- Horizontally scrollable container (like a pinboard/corkboard) with grab-to-scroll
- Each card is a sticky note / file card with:
  - Category label, title, summary
  - Pin/tape decoration based on `card_type`
  - Subtle rotation for organic feel
  - Clicking navigates to `/case-studies/:slug` via `Link`
- Consistent section header (`page 04 ─── Thinking`)
- Fallback to current hardcoded cards if no DB data exists yet

### 4. `src/pages/CaseStudyPage.tsx` — New page, unique UI

Different from ProjectPage — a "whiteboard/document" aesthetic:
- White/cream paper background with subtle grid pattern (matching the wall)
- Large title with colored category pill
- Cover image (if present)
- Markdown content rendered with `ReactMarkdown`
- Tags displayed as small labels
- Back link to homepage `#thinking` section
- No spine/shelf metaphor — instead a clean editorial "case file" layout with a left-side colored border accent

### 5. `src/App.tsx` — Add route
- `/case-studies/:slug` → `CaseStudyPage`

### 6. `src/pages/admin/AdminCaseStudies.tsx` — Admin CRUD
- Table listing all case studies
- Dialog form with: title, slug, category, card_type (sticky/framework/diagram), summary, content (textarea for markdown), cover image upload, color picker (reuse presets), tags, sort_order, is_published toggle

### 7. `src/components/admin/AdminLayout.tsx` — Add nav item
- Add "Case Studies" link to sidebar nav

### Summary
- 1 migration (new `case_studies` table)
- 4 files modified: `ThinkingWall.tsx`, `useSiteData.ts`, `App.tsx`, `AdminLayout.tsx`
- 2 files created: `CaseStudyPage.tsx`, `AdminCaseStudies.tsx`

