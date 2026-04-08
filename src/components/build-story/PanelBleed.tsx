/**
 * PanelBleed
 * ----------
 * Static SVG decorations that sit just below a panel's bottom edge, making it
 * look like the panel is "shedding material" into the dark gap below.
 *
 * Eight variants, one per panel. Each is absolutely positioned relative to
 * the panel above, and has a low-opacity fill so it reads as residue.
 *
 * Usage:
 *   Wrap each panel in a relatively-positioned container and drop a
 *   <PanelBleed variant="blueprint" /> as the last child:
 *
 *     <div className="relative">
 *       <HeroPanel />
 *       <PanelBleed variant="blueprint" />
 *     </div>
 *
 * The bleed is `aria-hidden` and sits below the panel so it never affects
 * layout of the next panel — give each panel a bit of bottom margin to let
 * it breathe.
 */

type Variant =
  | "blueprint"
  | "notebook"
  | "shelf"
  | "whiteboard"
  | "toolbox"
  | "journey"
  | "editorial"
  | "contact";

export function PanelBleed({ variant }: { variant: Variant }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -bottom-6 flex justify-center"
    >
      <svg width="320" height="28" viewBox="0 0 320 28" fill="none">
        {variant === "blueprint" && (
          // Pencil marks and a stray dimension arrow extending downward.
          <g stroke="hsl(160 20% 40%)" strokeWidth="1" opacity="0.55">
            <path d="M40 0 L40 18" strokeDasharray="2 3" />
            <path d="M36 14 L40 18 L44 14" />
            <path d="M80 0 L80 8" />
            <path d="M120 0 L120 22" strokeDasharray="2 3" />
            <text
              x="130"
              y="18"
              fontSize="8"
              fontFamily="monospace"
              fill="hsl(160 20% 45%)"
            >
              42.0
            </text>
            <path d="M200 0 L200 12" strokeDasharray="1 2" />
            <path d="M240 0 L240 6" />
            <circle cx="280" cy="10" r="2" fill="hsl(160 20% 40%)" />
          </g>
        )}
        {variant === "notebook" && (
          // Ink bleeding through from paper into the void.
          <g fill="hsl(218 30% 21%)" opacity="0.35">
            <ellipse cx="60" cy="4" rx="30" ry="1.5" />
            <ellipse cx="140" cy="6" rx="40" ry="1" />
            <ellipse cx="220" cy="4" rx="25" ry="2" />
            <circle cx="90" cy="10" r="1" />
            <circle cx="170" cy="14" r="0.8" />
            <circle cx="260" cy="11" r="1.2" />
          </g>
        )}
        {variant === "shelf" && (
          // Sawdust and a fallen nail.
          <g opacity="0.5">
            <circle cx="60" cy="6" r="0.8" fill="hsl(38 50% 55%)" />
            <circle cx="80" cy="10" r="0.6" fill="hsl(38 50% 55%)" />
            <circle cx="110" cy="8" r="1" fill="hsl(38 50% 55%)" />
            <circle cx="150" cy="12" r="0.7" fill="hsl(38 50% 55%)" />
            <circle cx="200" cy="6" r="0.9" fill="hsl(38 50% 55%)" />
            <circle cx="240" cy="11" r="0.6" fill="hsl(38 50% 55%)" />
            <path
              d="M170 4 L172 16 L174 4 Z"
              fill="hsl(220 10% 50%)"
              opacity="0.7"
            />
          </g>
        )}
        {variant === "whiteboard" && (
          // Marker drips.
          <g stroke="hsl(220 60% 50%)" strokeWidth="1.5" opacity="0.5">
            <path d="M80 0 L80 14" strokeLinecap="round" />
            <path d="M140 0 L140 8" strokeLinecap="round" />
            <path d="M200 0 L200 18" strokeLinecap="round" />
            <path d="M260 0 L260 6" strokeLinecap="round" />
          </g>
        )}
        {variant === "toolbox" && (
          // Loose screws and a bolt.
          <g opacity="0.55">
            <circle
              cx="100"
              cy="8"
              r="2"
              fill="none"
              stroke="hsl(220 10% 60%)"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="6"
              x2="100"
              y2="10"
              stroke="hsl(220 10% 60%)"
              strokeWidth="1"
            />
            <circle
              cx="160"
              cy="12"
              r="1.5"
              fill="none"
              stroke="hsl(220 10% 60%)"
              strokeWidth="1"
            />
            <rect
              x="210"
              y="6"
              width="6"
              height="4"
              fill="none"
              stroke="hsl(220 10% 60%)"
              strokeWidth="1"
            />
          </g>
        )}
        {variant === "journey" && (
          // Footprints fading into the distance.
          <g fill="hsl(38 60% 52%)" opacity="0.4">
            <ellipse cx="90" cy="10" rx="3" ry="5" />
            <ellipse cx="140" cy="14" rx="2.5" ry="4" opacity="0.7" />
            <ellipse cx="190" cy="10" rx="2" ry="3.5" opacity="0.5" />
            <ellipse cx="230" cy="14" rx="1.5" ry="3" opacity="0.35" />
          </g>
        )}
        {variant === "editorial" && (
          // Paper scraps and a fallen comma.
          <g opacity="0.5">
            <rect
              x="80"
              y="2"
              width="20"
              height="4"
              fill="hsl(40 30% 90%)"
              transform="rotate(-4 90 4)"
            />
            <rect
              x="180"
              y="6"
              width="28"
              height="3"
              fill="hsl(40 30% 90%)"
              transform="rotate(3 194 7)"
            />
            <path
              d="M140 6 Q 142 8 140 12"
              stroke="hsl(218 30% 21%)"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        )}
        {variant === "contact" && (
          // A wax seal drip.
          <g opacity="0.6">
            <circle cx="160" cy="6" r="3" fill="hsl(0 50% 40%)" />
            <path
              d="M158 8 Q 160 16 162 8"
              fill="hsl(0 50% 40%)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
