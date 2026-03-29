

## Plan: Cache-Bust & Smooth Image Loading for Hero Portrait

### Problem
1. Browser may serve a stale cached portrait when updated via admin
2. Image appears abruptly — no fade-in transition

### Changes

**`src/components/HeroSection.tsx`**:

1. **Cache busting** — Append a timestamp query param to the portrait URL when it comes from the CMS (not the static import):
   ```ts
   const portraitSrc = hero?.portrait
     ? `${hero.portrait}?t=${Date.now()}`
     : heroPortrait;
   ```

2. **Smooth fade-in on load** — Add `useState` to track image loaded state. Start the `<img>` at `opacity-0` with a CSS transition, then set loaded → true `onLoad` to fade to the target opacity (`opacity-50`):
   ```tsx
   const [imageLoaded, setImageLoaded] = useState(false);
   
   <img
     src={portraitSrc}
     onLoad={() => setImageLoaded(true)}
     className={`w-full h-auto blur-[0.5px] transition-opacity duration-700 ease-in-out ${imageLoaded ? 'opacity-50' : 'opacity-0'}`}
     style={{ filter: '...', mixBlendMode: 'multiply' }}
   />
   ```

3. **Reset on source change** — Add a `useEffect` watching `portraitSrc` to reset `imageLoaded` to `false`, so when the admin updates the portrait it fades in fresh rather than swapping abruptly.

### Files modified
- `src/components/HeroSection.tsx`

