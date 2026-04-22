import { FrameId } from "./frames/FrameTypes";

export interface DeskSlotConfig {
  id: FrameId;
  label: string;
  top: string;
  left: string;
  width: number;
  height: number;
  rotate: number;
  zone: "back" | "mid" | "front";
  shape: "blueprint" | "card" | "shelf" | "cork" | "toolbox" | "scroll" | "notebook" | "letter";
}

interface DeskProps {
  slots: DeskSlotConfig[];
  activeId: FrameId;
  onSlotClick: (id: FrameId) => void;
}

// per-shape 3D depth (px)
const PROP_DEPTH: Record<DeskSlotConfig["shape"], number> = {
  blueprint: 2,
  card: 1.5,
  letter: 2,
  notebook: 6,
  shelf: 8,
  cork: 5,
  toolbox: 7,
  scroll: 5,
};

const SlotShape = ({ shape, active }: { shape: DeskSlotConfig["shape"]; active: boolean }) => {
  const base = "absolute inset-0 transition-all duration-300";
  const dim = active ? "opacity-30 grayscale" : "opacity-100";
  switch (shape) {
    case "blueprint":
      // tiny green cutting mat
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden`} style={{ background: "radial-gradient(ellipse at 50% 40%, hsl(160 22% 19%), hsl(160 25% 13%))", boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.6), inset 0 0 0 2px hsl(160 30% 30% / 0.6)" }}>
          <div className="absolute inset-1 opacity-50" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100% / 0.18) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.18) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
        </div>
      );
    case "card":
      return (
        <div className={`${base} ${dim} rounded`} style={{ background: "linear-gradient(180deg, hsl(36 30% 94%), hsl(36 25% 88%))", boxShadow: "0 1px 0 hsl(0 0% 100% / 0.5) inset" }}>
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-sm bg-[hsl(var(--primary))]" />
          <div className="absolute bottom-2 left-2 right-2 h-px bg-[hsl(var(--primary)/0.4)]" />
        </div>
      );
    case "shelf":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden flex items-end gap-0.5 p-1`} style={{ background: "hsl(25 30% 18%)" }}>
          {["hsl(15 40% 35%)","hsl(200 30% 30%)","hsl(40 30% 50%)","hsl(0 30% 30%)","hsl(180 20% 35%)"].map((c,i) => (
            <span key={i} className="flex-1" style={{ background: c, height: `${50 + (i*7)%40}%` }} />
          ))}
        </div>
      );
    case "cork":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden`} style={{ background: "hsl(30 40% 38%)", backgroundImage: "radial-gradient(hsl(30 30% 28%) 1px, transparent 1.5px)", backgroundSize: "5px 5px" }}>
          <span className="absolute top-1 left-1.5 w-3 h-3 rounded-sm" style={{ background: "hsl(50 80% 70%)", transform: "rotate(-6deg)" }} />
          <span className="absolute top-2 right-2 w-3 h-3 rounded-sm" style={{ background: "hsl(330 60% 75%)", transform: "rotate(8deg)" }} />
          <span className="absolute bottom-1 left-3 w-3 h-3 rounded-sm" style={{ background: "hsl(180 40% 70%)", transform: "rotate(-3deg)" }} />
        </div>
      );
    case "toolbox":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden`} style={{ background: "linear-gradient(180deg, hsl(0 50% 35%), hsl(0 55% 28%))" }}>
          <div className="absolute top-1/3 inset-x-0 h-px bg-[hsl(0 0% 0% / 0.4)]" />
          <span className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-1 bg-[hsl(40 60% 60%)] rounded-sm" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full" style={{ background: "hsl(0 0% 20%)" }} />
        </div>
      );
    case "scroll":
      return (
        <div className={`${base} ${dim} rounded-full overflow-hidden`} style={{ background: "linear-gradient(90deg, hsl(36 35% 75%), hsl(36 30% 60%), hsl(36 35% 75%))" }}>
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[hsl(36 30% 50%)]" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-[hsl(36 30% 50%)]" />
        </div>
      );
    case "notebook":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden flex`} style={{ background: "hsl(36 30% 92%)" }}>
          <div className="flex-1 border-r border-[hsl(0 0% 0% / 0.15)]">
            <div className="m-1 space-y-0.5">
              <div className="h-px bg-[hsl(218 30% 21% / 0.3)]" />
              <div className="h-px bg-[hsl(218 30% 21% / 0.3)]" />
              <div className="h-px bg-[hsl(218 30% 21% / 0.3)]" />
            </div>
          </div>
          <div className="flex-1">
            <div className="m-1 space-y-0.5">
              <div className="h-px bg-[hsl(218 30% 21% / 0.3)]" />
              <div className="h-px bg-[hsl(218 30% 21% / 0.3)]" />
            </div>
          </div>
        </div>
      );
    case "letter":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden`} style={{ background: "hsl(36 25% 90%)" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 48%, hsl(0 0% 0% / 0.08) 50%, transparent 52%), linear-gradient(-135deg, transparent 48%, hsl(0 0% 0% / 0.08) 50%, transparent 52%)" }} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[hsl(0 60% 35%)]" />
        </div>
      );
  }
};

const Desk = ({ slots, activeId, onSlotClick }: DeskProps) => {
  return (
    <div className="desk-surface relative w-full h-full select-none">
      {/* lamp glow */}
      <div className="desk-lamp absolute inset-0 pointer-events-none" />
      {/* ruler along back */}
      <div className="desk-prop-ruler absolute top-1 left-[8%] right-[8%] h-1.5 hidden md:block" />
      {/* coffee ring */}
      <div className="desk-prop-ring absolute hidden md:block" style={{ top: "55%", left: "5%", width: 44, height: 44 }} />
      {/* pencil */}
      <svg className="absolute hidden md:block" style={{ bottom: "12%", left: "44%", transform: "rotate(-18deg)" }} width="68" height="9" viewBox="0 0 80 10" fill="none">
        <rect x="10" y="2" width="55" height="6" fill="hsl(45 80% 55%)" />
        <polygon points="65,2 75,5 65,8" fill="hsl(36 35% 75%)" />
        <polygon points="75,3 80,5 75,7" fill="hsl(218 30% 21%)" />
        <rect x="2" y="2" width="8" height="6" fill="hsl(0 0% 90%)" />
      </svg>

      {/* SLOTS — each is a 3D prop */}
      {slots.map((slot) => {
        const active = slot.id === activeId;
        const depth = PROP_DEPTH[slot.shape];
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSlotClick(slot.id)}
            aria-label={slot.label}
            className="desk-slot group absolute"
            style={{
              top: slot.top,
              left: slot.left,
              width: slot.width,
              height: slot.height,
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="prop-3d"
              style={{ ["--prop-depth" as any]: `${depth}px` }}
            >
              <span className="prop-side-bottom" aria-hidden="true" />
              <span className="prop-side-top" aria-hidden="true" />
              <span className="prop-side-left" aria-hidden="true" />
              <span className="prop-side-right" aria-hidden="true" />
              <div className="prop-face">
                <SlotShape shape={slot.shape} active={active} />
              </div>
              {active && (
                <div className="absolute -inset-1 rounded-md pointer-events-none" style={{ boxShadow: "0 0 0 1px hsl(var(--primary) / 0.5), 0 0 18px hsl(var(--primary) / 0.35)", transform: `translateZ(${depth + 0.5}px)` }} />
              )}
            </div>
            {/* contact shadow on the desk plane */}
            <div className="absolute -bottom-2 left-1 right-1 h-2 rounded-full opacity-70" style={{ background: "radial-gradient(ellipse at center, hsl(0 0% 0% / 0.55), transparent 70%)", filter: "blur(3px)" }} />
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-7 text-[9px] tracking-[0.2em] uppercase font-mono whitespace-nowrap opacity-0 group-hover:opacity-90 transition-opacity" style={{ color: "hsl(40 30% 85%)" }}>
              {slot.label}
            </span>
          </button>
        );
      })}

      {/* bevel front */}
      <div className="desk-bevel absolute inset-x-0 bottom-0 pointer-events-none" />
    </div>
  );
};

export default Desk;
