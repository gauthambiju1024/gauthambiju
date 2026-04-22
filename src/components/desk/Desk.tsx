import { FrameId } from "./frames/FrameTypes";

export interface DeskSlotConfig {
  id: FrameId;
  label: string;
  // Position on desk (% of desk box). Back row = small top values, front = large.
  top: string;
  left: string;
  width: number; // px at 1280
  height: number; // px at 1280
  rotate: number; // deg
  zone: "back" | "mid" | "front";
  shape: "blueprint" | "card" | "shelf" | "cork" | "toolbox" | "scroll" | "notebook" | "letter";
}

interface DeskProps {
  slots: DeskSlotConfig[];
  activeId: FrameId;
  onSlotClick: (id: FrameId) => void;
}

const SlotShape = ({ shape, active }: { shape: DeskSlotConfig["shape"]; active: boolean }) => {
  // Each shape is a small skeuomorphic SVG/CSS thumbnail
  const base = "absolute inset-0 transition-all duration-300";
  const dim = active ? "opacity-30 grayscale" : "opacity-100";
  switch (shape) {
    case "blueprint":
      return (
        <div className={`${base} ${dim} rounded-sm`} style={{ background: "linear-gradient(135deg, hsl(195 50% 28%), hsl(195 55% 22%))", boxShadow: "inset 0 0 0 1px hsl(40 30% 80% / 0.2)" }}>
          <div className="absolute inset-1 opacity-30" style={{ backgroundImage: "linear-gradient(hsl(40 30% 80%) 1px, transparent 1px), linear-gradient(90deg, hsl(40 30% 80%) 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
          <span className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
          <span className="absolute -top-1 right-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
        </div>
      );
    case "card":
      return (
        <div className={`${base} ${dim} rounded`} style={{ background: "linear-gradient(180deg, hsl(36 30% 94%), hsl(36 25% 88%))", boxShadow: "0 1px 0 hsl(0 0% 100% / 0.5) inset, 0 4px 8px hsl(0 0% 0% / 0.3)" }}>
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-sm bg-[hsl(var(--primary))]" />
          <div className="absolute bottom-2 left-2 right-2 h-px bg-[hsl(var(--primary)/0.4)]" />
        </div>
      );
    case "shelf":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden flex items-end gap-0.5 p-1`} style={{ background: "hsl(25 30% 18%)", boxShadow: "0 4px 10px hsl(0 0% 0% / 0.4)" }}>
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
        <div className={`${base} ${dim} rounded-sm overflow-hidden`} style={{ background: "linear-gradient(180deg, hsl(0 50% 35%), hsl(0 55% 28%))", boxShadow: "0 3px 8px hsl(0 0% 0% / 0.5)" }}>
          <div className="absolute top-1/3 inset-x-0 h-px bg-[hsl(0 0% 0% / 0.4)]" />
          <span className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-1 bg-[hsl(40 60% 60%)] rounded-sm" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full" style={{ background: "hsl(0 0% 20%)" }} />
        </div>
      );
    case "scroll":
      return (
        <div className={`${base} ${dim} rounded-full overflow-hidden`} style={{ background: "linear-gradient(90deg, hsl(36 35% 75%), hsl(36 30% 60%), hsl(36 35% 75%))", boxShadow: "0 3px 6px hsl(0 0% 0% / 0.4)" }}>
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[hsl(36 30% 50%)]" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-[hsl(36 30% 50%)]" />
        </div>
      );
    case "notebook":
      return (
        <div className={`${base} ${dim} rounded-sm overflow-hidden flex`} style={{ background: "hsl(36 30% 92%)", boxShadow: "0 4px 10px hsl(0 0% 0% / 0.4)" }}>
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
        <div className={`${base} ${dim} rounded-sm overflow-hidden`} style={{ background: "hsl(36 25% 90%)", boxShadow: "0 3px 8px hsl(0 0% 0% / 0.4)" }}>
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
      <div className="desk-prop-ring absolute hidden md:block" style={{ top: "55%", left: "6%", width: 56, height: 56 }} />
      {/* paperclip */}
      <svg className="absolute hidden md:block" style={{ top: "35%", left: "3%" }} width="22" height="40" viewBox="0 0 22 40" fill="none">
        <path d="M5 5 L5 30 Q5 36 11 36 Q17 36 17 30 L17 12 Q17 8 13 8 Q9 8 9 12 L9 28" stroke="hsl(220 10% 70%)" strokeWidth="1.5" fill="none" />
      </svg>
      {/* pencil */}
      <svg className="absolute hidden md:block" style={{ bottom: "10%", left: "42%", transform: "rotate(-18deg)" }} width="80" height="10" viewBox="0 0 80 10" fill="none">
        <rect x="10" y="2" width="55" height="6" fill="hsl(45 80% 55%)" />
        <polygon points="65,2 75,5 65,8" fill="hsl(36 35% 75%)" />
        <polygon points="75,3 80,5 75,7" fill="hsl(218 30% 21%)" />
        <rect x="2" y="2" width="8" height="6" fill="hsl(0 0% 90%)" />
      </svg>

      {/* SLOTS */}
      {slots.map((slot) => {
        const active = slot.id === activeId;
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
            }}
          >
            <div className={`relative w-full h-full transition-transform duration-300 ${active ? "" : "group-hover:-translate-y-1"}`}>
              <SlotShape shape={slot.shape} active={active} />
              {active && (
                <div className="absolute -inset-1 rounded-md pointer-events-none" style={{ boxShadow: "0 0 0 1px hsl(var(--primary) / 0.5), 0 0 18px hsl(var(--primary) / 0.35)" }} />
              )}
              {/* contact shadow */}
              <div className="absolute -bottom-1 left-1 right-1 h-1.5 rounded-full opacity-70" style={{ background: "radial-gradient(ellipse at center, hsl(0 0% 0% / 0.5), transparent 70%)", filter: "blur(2px)" }} />
            </div>
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6 text-[9px] tracking-[0.2em] uppercase font-mono whitespace-nowrap opacity-0 group-hover:opacity-90 transition-opacity" style={{ color: "hsl(40 30% 85%)" }}>
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
