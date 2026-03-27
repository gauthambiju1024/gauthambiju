
Goal: restore sections 3–8 by aligning the homepage’s backend-driven section list with the new 8-section frontend.

What’s broken
- The homepage is not rendering a static section list anymore; it reads visible sections from `homepage_sections`.
- That table still contains the old keys:
```text
hero, marquee, beliefs, work, story, connect, footer, blog
```
- But `src/pages/Index.tsx` only knows the new keys:
```text
hero, about, projects, thinking, skills, journey, writing, contact
```
- Result: only matching keys render. Most sections are skipped because `sectionMap[key]` is `undefined`.

Implementation plan
1. Update the backend section configuration
- Use a database migration to replace the old homepage section records with the new canonical 8-section set:
```text
hero, about, projects, thinking, skills, journey, writing, contact
```
- Set correct `page_group` and `sort_order` so the experience flow stays:
```text
hero/about → projects → thinking → skills → journey → writing → contact
```
- Mark legacy rows (`marquee`, `beliefs`, `work`, `story`, `blog`, `connect`, `footer`) as removed/replaced so they no longer drive the homepage.

2. Add a frontend safety fallback in `Index.tsx`
- Filter fetched sections to only keys present in `sectionMap`.
- If the filtered list is empty or incomplete, fall back to the current `defaultGroups`.
- This prevents the homepage from “disappearing” again if backend content gets out of sync later.

3. Keep navigation and anchors aligned
- Verify `sectionAnchors` still map exactly to the 8 visible nav items.
- Make sure Hero CTA and nav scroll targets continue pointing to:
```text
home, about, projects, thinking, skills, journey, writing, contact
```

4. Update admin section management
- Update `src/pages/admin/AdminSections.tsx` expectations so the admin UI shows the new section names/order instead of old legacy keys.
- This avoids saving outdated section configurations back into the backend.

5. QA after implementation
- Confirm all 8 sections render in sequence inside the notebook scroll area.
- Confirm top nav can scroll to every section.
- Confirm section highlighting works while scrolling.
- Confirm no blank groups/dividers appear from unknown keys.

Technical notes
- No auth/RLS redesign is needed; the issue is content/config mismatch, not permissions.
- Best long-term fix is backend data migration plus frontend guardrails, not just hardcoding the page.
