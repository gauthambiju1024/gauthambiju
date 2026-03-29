

## Plan: Hero Portrait — Background Blending + Admin Upload Support

### Problem
The hero portrait image doesn't blend into the page background like it should. Also, the admin panel already has a portrait upload field but HeroSection doesn't use it — it only uses the static asset.

### Changes

**`src/components/HeroSection.tsx`**
- Read `hero.portrait` from the database content; fall back to the static `heroPortrait` asset import
- Add a CSS gradient mask to fade the image edges into the background (using `mask-image` with a radial or linear gradient)
- Keep `mix-blend-multiply` and reduce opacity slightly
- Add bottom/right fade so the portrait dissolves into the page background naturally

```tsx
// Image source: prefer DB portrait, fall back to static asset
const portraitSrc = (hero as any)?.portrait || heroPortrait;

// Image container with fade-out mask
<div className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0"
     style={{
       maskImage: 'linear-gradient(to left, transparent 0%, black 15%, black 70%, transparent 100%), linear-gradient(to top, transparent 0%, black 20%, black 100%)',
       maskComposite: 'intersect',
       WebkitMaskComposite: 'source-in',
     }}>
  <img src={portraitSrc} className="w-full h-auto mix-blend-multiply opacity-80" />
</div>
```

### Files modified
- `src/components/HeroSection.tsx` — add gradient mask for blending + use DB portrait URL

### Result
- Portrait fades seamlessly into the notebook background
- Admin can upload a new portrait via the existing Hero Portrait field in the admin panel, and it takes effect immediately

