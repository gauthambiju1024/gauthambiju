

## Plan: Markdown Rendering, Image Upload, and Dynamic Section Management

### 1. Markdown Rendering

**Install**: `react-markdown` and `remark-gfm` for GitHub-flavored markdown support.

**Changes**:
- **`BlogPostPage.tsx`**: Replace the plain `whitespace-pre-wrap` content div with a `<ReactMarkdown>` component, styled with Tailwind typography classes (using `@tailwindcss/typography` plugin already in devDeps).
- **`AdminBlog.tsx`**: Add a live markdown preview panel next to the textarea editor using a split view (side-by-side or tabbed write/preview).

### 2. Image Upload via Storage

**Database migration**: Create a public storage bucket `uploads` with RLS policies allowing admin insert and public read.

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
-- RLS: anyone can read, admins can upload/delete
```

**New component**: `ImageUpload.tsx` — a reusable file input that uploads to the `uploads` bucket via Supabase Storage SDK, returns the public URL on success.

**Integration points**:
- **`AdminBlog.tsx`**: Add image upload button for cover image (replaces manual URL input). Also add an "Insert Image" button in the markdown editor that uploads and inserts `![alt](url)` at cursor.
- **`AdminProjects.tsx`**: Add optional project thumbnail/image upload field.
- **`AdminContent.tsx`**: Add hero portrait image upload in the Hero tab.

### 3. Dynamic Section Management

**Database migration**: Create a `homepage_sections` table to control which sections appear and in what order:

```text
homepage_sections
├── id (uuid, PK)
├── section_key (text, UNIQUE) — e.g. "hero", "marquee", "beliefs", "work", "story", "connect"
├── label (text) — display name
├── is_visible (boolean, default true)
├── sort_order (integer, default 0)
├── page_group (text) — which notebook page it belongs to ("about", "work", "connect")
└── created_at (timestamp)
```

RLS: public read, admin write.

**New admin page**: `AdminSections.tsx` at `/admin/sections`
- Lists all homepage sections with toggle visibility and drag/reorder (or sort_order input)
- Add to AdminLayout nav

**Update `Index.tsx`**: 
- New hook `useHomepageSections()` fetches from `homepage_sections` ordered by `sort_order` where `is_visible = true`
- Render sections dynamically using a section key → component map:
  ```ts
  const sectionMap = { hero: HeroSection, marquee: MarqueeText, beliefs: BeliefsSection, ... }
  ```
- Group by `page_group` to maintain NotebookPage structure
- Seed default sections on first migration

### Implementation Order

1. Storage bucket migration + `ImageUpload` component
2. Install `react-markdown` + `remark-gfm`, update `BlogPostPage` and `AdminBlog`
3. Add image upload to blog, projects, and content admin pages
4. `homepage_sections` table migration + seed data
5. `AdminSections` page + routing
6. Update `Index.tsx` to render sections dynamically

