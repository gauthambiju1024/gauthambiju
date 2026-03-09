

## Plan: Dynamic Admin Panel with Lovable Cloud

This is a large multi-step implementation. I recommend we break it into phases. Here's the full plan — we'll start with **Phase 1** (database + auth + admin layout) in this session.

---

### Phase 1: Foundation (Database + Auth + Admin Shell)

**1. Enable Lovable Cloud**
- Set up Supabase via Lovable Cloud for database, auth, and storage

**2. Database Tables**

```text
┌─────────────────────┐   ┌─────────────────────┐
│ site_content         │   │ projects             │
├─────────────────────┤   ├─────────────────────┤
│ id (uuid, PK)       │   │ id (uuid, PK)        │
│ section (text)       │   │ title (text)          │
│ key (text)           │   │ subtitle (text)       │
│ value (jsonb)        │   │ tags (text[])         │
│ updated_at           │   │ year (text)           │
│ UNIQUE(section, key) │   │ url (text)            │
└─────────────────────┘   │ sort_order (int)      │
                          │ is_active (bool)      │
┌─────────────────────┐   │ created_at            │
│ blog_posts           │   └─────────────────────┘
├─────────────────────┤
│ id (uuid, PK)        │   ┌─────────────────────┐
│ title (text)         │   │ social_links         │
│ slug (text, UNIQUE)  │   ├─────────────────────┤
│ content (text)       │   │ id (uuid, PK)        │
│ excerpt (text)       │   │ name (text)           │
│ cover_image (text)   │   │ url (text)            │
│ tags (text[])        │   │ icon (text)           │
│ is_published (bool)  │   │ label (text)          │
│ published_at         │   │ sort_order (int)      │
│ created_at           │   └─────────────────────┘
│ updated_at           │
└─────────────────────┘   ┌─────────────────────┐
                          │ user_roles            │
                          ├─────────────────────┤
                          │ id (uuid, PK)         │
                          │ user_id (uuid, FK)    │
                          │ role (app_role enum)  │
                          └─────────────────────┘
```

- `site_content`: Key-value store for editable text (hero name, tagline, rotating words, beliefs, story text, stats, marquee items)
- `projects`: Work section items
- `blog_posts`: Blog articles with markdown content
- `social_links`: Connect section links
- `user_roles`: Admin authentication (following security best practices)
- RLS on all tables: public read, admin-only write

**3. Auth + Admin Hook**
- `useAdminAuth` hook (same pattern as homeofarm): Supabase auth + `user_roles` table check
- `has_role` security definer function to avoid RLS recursion

**4. Admin Layout & Routing**
- `/admin/login` — Login page
- `/admin` — Dashboard with overview
- `/admin/projects` — CRUD for work/projects
- `/admin/blog` — CRUD for blog posts
- `/admin/content` — Edit hero, beliefs, story, marquee sections
- `/admin/links` — Edit social links
- `AdminLayout` component with nav tabs (same pattern as homeofarm)

---

### Phase 2: Content Management Pages

**5. Admin Projects Page**
- List all projects with search
- Add/Edit dialog with title, subtitle, tags, year, URL, active toggle
- Drag-to-reorder or sort_order field
- Delete with confirmation

**6. Admin Blog Page**
- Rich text/markdown editor for blog posts
- Title, slug (auto-generate), excerpt, cover image, tags
- Publish/unpublish toggle
- List existing posts with edit/delete

**7. Admin Content Page**
- Editable fields grouped by section:
  - **Hero**: Name, tagline, rotating words array, location text
  - **Beliefs**: Title + body for each belief (add/remove)
  - **Story**: Heading, body text, stats (value + label pairs)
  - **Marquee**: List of items
- Save per-section

**8. Admin Social Links Page**
- Add/edit/delete social links (name, URL, icon, label)
- Reorder

---

### Phase 3: Frontend Dynamic Rendering

**9. Data Hooks**
- `useProjects`, `useBlogPosts`, `useSiteContent`, `useSocialLinks` hooks
- Replace hardcoded arrays in components with Supabase queries
- Fallback to current hardcoded values if DB is empty

**10. Blog Public Pages**
- `/blog` — Blog listing page
- `/blog/:slug` — Individual blog post page
- Add "Blog" to navigation

---

### Implementation Order

Since this is a large feature, I'll implement it in steps:
1. Enable Lovable Cloud + create database schema
2. Auth system + admin layout + login page
3. Admin projects CRUD
4. Admin blog CRUD + public blog pages
5. Admin content editor (hero, beliefs, story, marquee)
6. Admin social links editor
7. Update frontend components to use dynamic data

Shall I proceed with this plan?

