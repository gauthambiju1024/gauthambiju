import { MotionValue } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import BuildStatus from "./BuildStatus";
import ActionDock from "./ActionDock";
import ArtifactPreview from "./ArtifactPreview";

interface Section {
  id: FrameId;
  label: string;
}

interface Props {
  activeId: FrameId;
  activeIdx: number;
  sections: Section[];
  progress: MotionValue<number>;
  onJump: (i: number) => void;
}

const ConsoleRail = ({ activeId, activeIdx, sections, progress, onJump }: Props) => {
  const label = sections[activeIdx]?.label ?? "";
  return (
    <div className="console-rail relative w-full h-full" aria-label="Section console">
      {/* brass top hairline */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(38 60% 52% / 0.7) 18%, hsl(38 60% 52% / 0.7) 82%, transparent)" }} />
      {/* shadow bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/60" />

      {/* corner machining marks */}
      <svg className="absolute top-1.5 left-2 w-3 h-3 opacity-60" viewBox="0 0 12 12"><path d="M0 0 H8 M0 0 V8" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute top-1.5 right-2 w-3 h-3 opacity-60" viewBox="0 0 12 12"><path d="M12 0 H4 M12 0 V8" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute bottom-1.5 left-2 w-3 h-3 opacity-60" viewBox="0 0 12 12"><path d="M0 12 H8 M0 12 V4" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute bottom-1.5 right-2 w-3 h-3 opacity-60" viewBox="0 0 12 12"><path d="M12 12 H4 M12 12 V4" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>

      <div className="relative h-full w-full grid items-center" style={{ gridTemplateColumns: "minmax(180px, 22%) 1fr minmax(160px, 24%)" }}>
        {/* zone 1 */}
        <div className="h-full border-r border-white/[0.06]">
          <BuildStatus
            activeId={activeId}
            activeIdx={activeIdx}
            total={sections.length}
            label={label}
            progress={progress}
            onJump={onJump}
          />
        </div>
        {/* zone 2 */}
        <div className="h-full border-r border-white/[0.06] relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, hsl(43 74% 55% / 0.06), transparent 70%)" }} />
          <ActionDock activeId={activeId} />
        </div>
        {/* zone 3 */}
        <div className="h-full relative hidden min-[700px]:block">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 80% at 70% 100%, hsl(220 60% 60% / 0.05), transparent 70%)" }} />
          <ArtifactPreview activeId={activeId} />
        </div>
      </div>
    </div>
  );
};

export default ConsoleRail;
