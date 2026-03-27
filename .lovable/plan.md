

## Plan: Redesign Projects Section + Dedicated Project Pages

### Requirements Recap

1. Each project gets its own dedicated page (`/projects/:slug`)
2. Keep the bookshelf visual metaphor on the homepage
3. Clicking a book shows a quick-view overlay with a "View Full Case Study" link to the dedicated page
4. Support multiple shelf rows (groupable by category/year) via a `category` field
5. Database needs new fields for the detailed project page content

### Architecture

```text
Homepage Section (ProjectsShelf)
┌─────────────────────────────────────────────┐
│  Selected Work                              │
│                                             │
│  ── Product ──────────────────────────────  │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │Book1│ │Book2│ │Book3│  ← shelf row       │
│  └─────┘ └─────┘ └─────┘                   │
│  ═══════════════════════  ← ledge           │
│                                             │
│  ── Research ─────────────────────────────  │
│  ┌─────┐ ┌─────┐                            │
│  │Book4│ │Book5│          ← shelf row       │
│  └─────┘ └─────┘                            │
│  ═══════════════════════  ← ledge           │
└─────────────────────────────────────────────┘

Click book → inline overlay (problem, role, tags, impact)
           → "Full Case Study →" link to /projects/:slug

/projects/:slug → dedicated page
┌─────────────────────────────────────────────┐
│  ← Back to Home                             │
│  Project Title                              │
│  subtitle · year · tags                     │
│                                             │
│  Problem ─────────────────────────────────  │
│  Role · Stack                               │
│  Contribution ────────────────────────────  │
│  Impact ──────────────────────────────────  │
│  Long description (rich text / markdown)    │
│  [Visit Project →]                          │
└─────────────────────────────────────────────┘
```

### Database Changes

Add columns to `projects` table:

| Column | Type | Purpose |
|---|---|---|
| `slug` | text, unique, not null | URL-friendly identifier |
| `category` | text, default 'General' | Groups projects into shelf rows |
| `problem` | text | Problem statement |
| `role` | text | Your role |
| `contribution` | text | What you did |
| `stack` | text | Tech stack |
| `impact` | text | Outcome/metrics |
| `description` | text | Long-form content for the dedicated page |
| `color` | text, default 'hsl(215 20% 30%)' | Book spine color |
| `thumbnail_url` | text | Optional cover image for project page |

### File Changes

**1. Database migration** — Add new columns to `projects`

**2. `src/components/ProjectsShelf.tsx`** — Redesign
- Group projects by `category`, render each group as a labeled shelf row with its own ledge
- Wider book spines (65px) with title + year, muted jewel-tone colors from DB `color` field
- Click opens an inline detail card (not full-screen modal) — slides down from the book using `AnimatePresence`
- Detail card shows: title, subtitle, problem, role/stack grid, impact, tags, and a "Full Case Study" link to `/projects/${slug}`
- Remove "page 03" label and Archive slot
- Remove hardcoded fallback project details (problem/role/etc) — these come from DB now

**3. `src/pages/ProjectPage.tsx`** — New dedicated project page
- Route: `/projects/:slug`
- Fetches project by slug from DB
- Full case study layout: hero with title/subtitle/year/tags, then sections for Problem, Role, Stack, Contribution, Impact, and a long-form Description
- Styled consistently with the notebook/editorial aesthetic (serif titles, mono labels, body text)
- "Back to Home" link at top, "Visit Project" external link if URL exists
- Navigation bar visible

**4. `src/hooks/useSiteData.ts`** — Add `useProject(slug)` hook for single project fetch by slug

**5. `src/App.tsx`** — Add route `/projects/:slug` pointing to `ProjectPage`

**6. `src/pages/admin/AdminProjects.tsx`** — Add form fields for the new columns (slug, category, problem, role, contribution, stack, impact, description, color)

### Shelf Row Grouping Logic

Projects are grouped by `category` field. Each unique category becomes a labeled shelf row. Categories are rendered in the order of the first project's `sort_order` within that category. Admin can control grouping by setting the category field (e.g., "Product", "Research", "Design").

### Visual Refinements to Shelf

- Each row: category label left-aligned above the books, subtle shelf ledge below
- Books: 65px wide, 240px tall, uniform sizing, color from DB
- Spine: vertical title (font-display), year at top (font-mono), first tag at bottom
- Hover: lift `y: -10`, slight `rotateY: -5`, deeper shadow
- Selected: book stays lifted, detail card animates open below the shelf row
- Detail card: compact, max-width matching the shelf, same styling as current modal content but inline

### Summary

- 1 migration (add columns to projects)
- 5 files modified/created
- No breaking changes to existing data — all new columns are nullable or have defaults

