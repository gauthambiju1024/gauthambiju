import { MotionValue } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import ActionDock from "./ActionDock";
import ArtifactPreview from "./ArtifactPreview";
import BYOPDock from "./BYOPDock";

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

const ConsoleRail = ({ activeId }: Props) => {
  return (
    <div className="console-rail relative w-full h-full" aria-label="Section dock">
      {/* brass top hairline */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(38 60% 52% / 0.7) 18%, hsl(38 60% 52% / 0.7) 82%, transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/60" />

      {/* corner machining marks (ambiance only) */}
      <svg className="absolute top-1.5 left-2 w-3 h-3 opacity-50" viewBox="0 0 12 12"><path d="M0 0 H8 M0 0 V8" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute top-1.5 right-2 w-3 h-3 opacity-50" viewBox="0 0 12 12"><path d="M12 0 H4 M12 0 V8" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute bottom-1.5 left-2 w-3 h-3 opacity-50" viewBox="0 0 12 12"><path d="M0 12 H8 M0 12 V4" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute bottom-1.5 right-2 w-3 h-3 opacity-50" viewBox="0 0 12 12"><path d="M12 12 H4 M12 12 V4" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>

      <div
        className="relative h-full w-full grid items-center"
        style={{ gridTemplateColumns: "minmax(140px, 22%) 1fr minmax(180px, 28%)" }}
      >
        {/* zone 1 — artifact (left) */}
        <div className="h-full hidden min-[700px]:block">
          <ArtifactPreview activeId={activeId} />
        </div>
        {/* zone 2 — actions (center) */}
        <div className="h-full col-span-1 min-[700px]:col-span-1">
          <ActionDock activeId={activeId} />
        </div>
        {/* zone 3 — BYOP (right) */}
        <div className="h-full">
          <BYOPDock />
        </div>
      </div>
    </div>
  );
};

export default ConsoleRail;
