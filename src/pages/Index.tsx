import HeroAboutFlip from "@/components/HeroAboutFlip";

import ThinkingWall from "@/components/ThinkingWall";
import ToolboxToSkillsBridge from "@/components/ToolboxToSkillsBridge";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";
import { AssemblyHeader } from "@/components/AssemblyHeader";
import { AssemblyHeaderMobile } from "@/components/AssemblyHeaderMobile";
import { Entropy } from "@/components/ui/entropy";

import CorkboardFrame from "@/components/desk/frames/CorkboardFrame";
import NotebookFrame from "@/components/desk/frames/NotebookFrame";
import LetterFrame from "@/components/desk/frames/LetterFrame";
import { useMotionValue } from "framer-motion";

const trailingStations = [
  { id: "thinking", Frame: CorkboardFrame, Section: ThinkingWall },
  { id: "writing", Frame: NotebookFrame, Section: WritingDesk },
  { id: "contact", Frame: LetterFrame, Section: ContactClosing },
] as const;

const Index = () => {
  const tDummy = useMotionValue(0.5);
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Entropy />
      <MarginDoodles />

      <AssemblyHeader panelIds={["home","about","projects","thinking","skills","writing","contact"]} />
      <div className="block min-[800px]:hidden">
        <AssemblyHeaderMobile panelIds={["home","about","projects","thinking","skills","writing","contact"]} />
      </div>

      <div className="margin-content-wrapper relative z-[2]">
        <HeroAboutFlip />

        <div style={{ marginTop: "-50vh" }}>
          <ToolboxToSkillsBridge />
        </div>

        {trailingStations.map(({ id, Frame, Section }) => (
          <div key={id} className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 my-6 md:my-8">
            <section id={id} className="relative w-full">
              <Frame t={tDummy} active={true}>
                <Section />
              </Frame>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
