

## Plan: Hero Image Sizing and Alignment

### Current State
- Portrait image is `w-[340px] lg:w-[420px]` inside a flex container
- Section has `pt-8 md:pt-12` padding, preventing top alignment
- Image is positioned relatively within the flex layout

### Changes

**HeroSection.tsx**

1. **Make image bigger**: Increase width to `w-[400px] lg:w-[520px]`

2. **Align with paper top corner**: 
   - Position the image absolutely to the section
   - Use `absolute top-0 right-0` to pin to top-right corner of the section
   - Remove padding constraints by setting negative top margin or absolute positioning

3. **Adjust section layout**:
   - Add `relative` to the section container (already has it)
   - The image will break out of the flex flow and align with the notebook edge

### Technical Implementation
```
Portrait container changes:
- From: className="hidden md:block flex-shrink-0 w-[340px] lg:w-[420px] relative z-0"
- To: className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[520px] z-0"
```

This positions the image at the top-right corner of the hero section, aligned with the notebook paper edge, and makes it larger.

