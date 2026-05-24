import { forwardRef, CSSProperties, MouseEventHandler } from "react";

export const SPINE_COLORS = [
  "hsl(170 25% 28%)",
  "hsl(350 28% 30%)",
  "hsl(215 28% 28%)",
  "hsl(85 18% 28%)",
  "hsl(15 30% 30%)",
  "hsl(280 18% 30%)",
  "hsl(200 12% 32%)",
  "hsl(35 25% 30%)",
];

export const SPINE_WIDTH = 78;
export const SPINE_HEIGHT = 200;

export const linenTexture = (base: string) => ({
  backgroundColor: base,
  backgroundImage: `
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)
  `,
});

export const truncateWords = (text: string, max: number) => {
  const words = text.split(" ");
  return words.length <= max ? text : words.slice(0, max).join(" ") + "…";
};

export const ABOUT_SPINE_DATA = {
  title: "MORE ABOUT ME",
  subtitle: "Personal · 2026",
  year: "2026",
  color: "hsl(170 25% 28%)",
};

export interface SpineContent {
  title: string;
  subtitle?: string | null;
  year?: string | null;
  color?: string | null;
}

interface Props {
  data: SpineContent;
  fallbackColor?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  interactive?: boolean;
  style?: CSSProperties;
  selected?: boolean;
  /** When true, the spine fills its parent (width/height: 100%) instead of the native 78×200. */
  fullHeight?: boolean;
}

/**
 * Visual spine used on the ProjectsShelf row.
 * Identical markup is rendered both in <AboutToProjectsBridge /> (real shelf)
 * and as the spine-skin overlay inside <HeroIdBadge /> (the folding card).
 */
const ProjectSpine = forwardRef<HTMLDivElement, Props>(({
  data,
  fallbackColor = SPINE_COLORS[0],
  onClick,
  interactive = false,
  style,
  selected = false,
  fullHeight = false,
}, ref) => {
  const color = data.color || fallbackColor;
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative rounded-sm overflow-hidden ${interactive ? "cursor-pointer" : ""}`}
      style={{
        width: fullHeight ? "100%" : SPINE_WIDTH,
        height: fullHeight ? "100%" : SPINE_HEIGHT,
        ...linenTexture(color),
        boxShadow: selected
          ? `0 0 24px 6px ${color}24, 4px 4px 16px rgba(0,0,0,0.45)`
          : "4px 4px 12px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {/* Left edge highlight */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[4px]"
        style={{ background: "linear-gradient(to right, rgba(255,255,255,0.18), rgba(255,255,255,0.04))" }}
      />
      {/* Right edge shadow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[3px]"
        style={{ background: "linear-gradient(to left, rgba(0,0,0,0.2), transparent)" }}
      />

      {/* Year top */}
      {data.year && (
        <div className="absolute top-3 left-0 right-0 flex justify-center">
          <span className="text-white/30 text-[8px] font-mono tracking-wider" style={{ writingMode: "vertical-lr" }}>
            {data.year}
          </span>
        </div>
      )}

      {/* Vertical title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white/90 font-serif-display font-semibold tracking-[0.2em] uppercase"
          style={{ writingMode: "vertical-lr", textOrientation: "mixed", fontSize: data.title.length > 12 ? 10 : 13 }}
        >
          {data.title}
        </span>
      </div>

      {/* Bottom subtitle */}
      <div
        className="absolute bottom-0 left-0 right-0 px-1.5 pb-2.5 pt-6"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
      >
        <div className="w-full h-px bg-white/15 mb-1.5" />
        <p
          className="text-white/50 text-[8px] font-body leading-tight text-center"
          style={{ lineHeight: "1.3" }}
        >
          {data.subtitle ? truncateWords(data.subtitle, 5) : ""}
        </p>
      </div>
    </div>
  );
});

ProjectSpine.displayName = "ProjectSpine";
export default ProjectSpine;
