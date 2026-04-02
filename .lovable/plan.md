

## Fix: Hero Portrait Image Flash on Load

### Problem
When the page loads, the local bundled portrait (`hero-portrait.png`) shows immediately. Then, once the database query resolves, `portraitSrc` switches to the database URL, causing a visible flash/swap.

### Solution
Hide the portrait image until the `useSiteContent` hook has finished loading. This prevents the local fallback from briefly appearing before the database image replaces it.

### Change
**`src/components/HeroSection.tsx`**:
1. Destructure the `loading` state from `useSiteContent('hero', 'main')`
2. Add `opacity-0` to the portrait container while `loading` is true, with a CSS transition so it fades in smoothly once resolved
3. This way only the final resolved image is ever shown to the user

