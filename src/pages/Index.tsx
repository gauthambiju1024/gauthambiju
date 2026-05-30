import HeroAboutFlip from "@/components/HeroAboutFlip";

import ToolboxToSkillsBridge from "@/components/ToolboxToSkillsBridge";
import MarginDoodles from "@/components/MarginDoodles";
import { AssemblyHeader } from "@/components/AssemblyHeader";
import { AssemblyHeaderMobile } from "@/components/AssemblyHeaderMobile";
import { Entropy } from "@/components/ui/entropy";

const panelIds = ["home", "about", "projects", "skills", "desk-scene"];

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Entropy />
      <MarginDoodles />

      <AssemblyHeader panelIds={panelIds} />
      <div className="block min-[800px]:hidden">
        <AssemblyHeaderMobile panelIds={panelIds} />
      </div>

      <div className="margin-content-wrapper relative z-[2]">
        <HeroAboutFlip />

        <div style={{ marginTop: "-140vh" }}>
          <ToolboxToSkillsBridge />
        </div>
      </div>
    </div>
  );
};

export default Index;
