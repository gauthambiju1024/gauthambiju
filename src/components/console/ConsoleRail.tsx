import { MotionValue } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import ActionDock from "./ActionDock";
import ArtifactPreview from "./ArtifactPreview";
import LiveBuild from "./LiveBuild";
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
      {/* corner machining marks (ambiance only) */}
      <svg className="absolute top-1.5 left-2 w-3 h-3 opacity-40" viewBox="0 0 12 12"><path d="M0 0 H8 M0 0 V8" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute top-1.5 right-2 w-3 h-3 opacity-40" viewBox="0 0 12 12"><path d="M12 0 H4 M12 0 V8" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute bottom-1.5 left-2 w-3 h-3 opacity-40" viewBox="0 0 12 12"><path d="M0 12 H8 M0 12 V4" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>
      <svg className="absolute bottom-1.5 right-2 w-3 h-3 opacity-40" viewBox="0 0 12 12"><path d="M12 12 H4 M12 12 V4" stroke="hsl(38 60% 52%)" strokeWidth="1" fill="none" /></svg>

      <div
        className="relative h-full w-full grid items-center"
        style={{ gridTemplateColumns: "minmax(160px, 22%) 1fr minmax(320px, 36%)" }}
      >
        {/* zone 1 — section artifact (left) */}
        <div className="h-full hidden min-[700px]:block">
          <ArtifactPreview activeId={activeId} />
        </div>
        {/* zone 2 — actions (center) */}
        <div className="h-full">
          <ActionDock activeId={activeId} />
        </div>
        {/* zone 3 — BUILD ▸ then live build (right, in that order) */}
        <div className="h-full flex items-center justify-end gap-2">
          <BYOPDock />
          <div className="w-px h-8 bg-white/[0.08] hidden min-[900px]:block" />
          <div className="hidden min-[900px]:flex h-full items-center">
            <LiveBuild />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleRail;
