## Final rebuild plan

### 1. Protect the Home → About transition
- Keep `HeroAboutFlip` behavior intact: same pinned section, same scroll timing, same lanyard/card movement, same center flip into the About-card back.
- Remove any fold logic that changes the card before the About flip is fully complete.
- The Home → About card must remain the real `HeroIdBadge` DOM, not a duplicate or replacement.

### 2. Rebuild About → Projects using the same About card
- Use the exact same card wrapper/back face that is visible at the end of About.
- After About is complete, start a separate scroll-driven bridge phase.
- During that bridge:
  - lock the card in its completed About position;
  - fold the card into a narrow book spine from the visible About-card state;
  - preserve the sense that the About card itself is becoming the spine;
  - fly/settle that spine into the Projects library landing slot.
- Fix the current transform composition so the card does not jump, collapse incorrectly, or interfere with the earlier Home → About flip.

### 3. Restore the library-style Projects panel
- Restore the earlier `ProjectsShelf` library feel and functionality as the base instead of the current over-minimized shelf that broke the visual rhythm.
- Add one reserved landing slot/spine at the front of the library for the folded About card.
- Keep all existing project shelf functionality:
  - project grouping;
  - hover lift;
  - click to expand/collapse details;
  - external links;
  - `/projects/:slug` case-study links;
  - admin/data-driven project content.

### 4. Add the toolbox anchor without disrupting the shelf
- Add a restrained toolbox object on the project shelf, visually integrated with the library.
- Give it a stable anchor id for the future Projects → Skills zoom transition.
- Do not implement the toolbox zoom transition yet.

### 5. Implementation details
- `HeroIdBadge.tsx`
  - Separate About progress from fold progress cleanly.
  - Keep the Home → About math untouched until fold progress begins.
  - Rework fold phases so final width/height aligns with the shelf spine target instead of only `scaleX` crushing the card.
  - Hide the moving card only once it is fully seated, then show the shelf’s landed spine placeholder.
- `AboutToProjectsBridge.tsx`
  - Use it only as a scroll driver and subtle construction guide.
  - Ensure it starts after About is complete and has enough runway for a smooth, premium fold.
- `ProjectsShelf.tsx` / `ProjectsShelfMinimal.tsx`
  - Use the original shelf as the visual/functionality base.
  - Integrate the landing spine and toolbox there, then wire `Index.tsx` back to that rebuilt shelf.
- `Index.tsx`
  - Keep page order and nav ids unchanged: `home`, `about`, `projects`, `thinking`, `skills`, `writing`, `contact`.

### 6. Validation
- Check desktop scroll behavior around Home → About → Projects.
- Verify Home → About matches the earlier polished transition.
- Verify the same About card folds into the first library spine slot without jumping.
- Verify Projects shelf interactions still work after the landing spine and toolbox are added.