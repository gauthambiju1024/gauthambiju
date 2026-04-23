import { MotionValue } from "framer-motion";
import { FrameId } from "@/components/desk/frames/FrameTypes";
import ActionDock from "./ActionDock";
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
        style={{ gridTemplateColumns: "minmax(180px, 24%) 1fr minmax(180px, 28%)" }}
      >
        {/* zone 1 — live build (left) */}
        <div className="h-full hidden min-[700px]:block">
          <LiveBuild />
        </div>
        {/* zone 2 — actions (center) */}
        <div className="h-full">
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
