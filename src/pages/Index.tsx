import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsShelf from "@/components/ProjectsShelf";
import ThinkingWall from "@/components/ThinkingWall";
import SkillsToolbox from "@/components/SkillsToolbox";
import JourneyTimeline from "@/components/JourneyTimeline";
import WritingDesk from "@/components/WritingDesk";
import ContactClosing from "@/components/ContactClosing";
import MarginDoodles from "@/components/MarginDoodles";
import { AssemblyHeader } from "@/components/AssemblyHeader";
import { Entropy } from "@/components/ui/entropy";
import DeskStage, { SectionConfig } from "@/components/DeskStage";
import BlueprintFrame from "@/components/desk/frames/BlueprintFrame";
import BusinessCardFrame from "@/components/desk/frames/BusinessCardFrame";
import BookshelfFrame from "@/components/desk/frames/BookshelfFrame";
import CorkboardFrame from "@/components/desk/frames/CorkboardFrame";
import ToolboxFrame from "@/components/desk/frames/ToolboxFrame";
import ScrollFrame from "@/components/desk/frames/ScrollFrame";
import NotebookFrame from "@/components/desk/frames/NotebookFrame";
import LetterFrame from "@/components/desk/frames/LetterFrame";

const sections: SectionConfig[] = [
  { id: "home", label: "Home", Frame: BlueprintFrame, Section: HeroSection },
  { id: "about", label: "About", Frame: BusinessCardFrame, Section: AboutSection },
  { id: "projects", label: "Projects", Frame: BookshelfFrame, Section: ProjectsShelf },
  { id: "thinking", label: "Thinking", Frame: CorkboardFrame, Section: ThinkingWall },
  { id: "skills", label: "Skills", Frame: ToolboxFrame, Section: SkillsToolbox },
  { id: "journey", label: "Journey", Frame: ScrollFrame, Section: JourneyTimeline },
  { id: "writing", label: "Writing", Frame: NotebookFrame, Section: WritingDesk },
  { id: "contact", label: "Contact", Frame: LetterFrame, Section: ContactClosing },
];

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Entropy />
      <MarginDoodles />

      <div className="margin-content-wrapper relative z-[2]">
        <AssemblyHeader panelIds={["home","about","projects","thinking","skills","journey","writing","contact"]} />
        <DeskStage sections={sections} />
      </div>
    </div>
  );
};

export default Index;
