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

// Realistic spatial arrangement on the (foreshortened) desk.
// Back row sits higher (small top values), front row near camera (large top).
// Sizes bumped slightly so back-row props remain readable through the 38° tilt.
const sections: SectionConfig[] = [
  {
    id: "home",
    label: "Home",
    Frame: BlueprintFrame,
    Section: HeroSection,
    slot: { top: "22%", left: "16%", width: 145, height: 92, rotate: -4, zone: "back", shape: "blueprint" },
  },
  {
    id: "thinking",
    label: "Thinking",
    Frame: CorkboardFrame,
    Section: ThinkingWall,
    slot: { top: "20%", left: "44%", width: 154, height: 94, rotate: 1, zone: "back", shape: "cork" },
  },
  {
    id: "projects",
    label: "Projects",
    Frame: BookshelfFrame,
    Section: ProjectsShelf,
    slot: { top: "22%", left: "78%", width: 165, height: 82, rotate: 3, zone: "back", shape: "shelf" },
  },
  {
    id: "about",
    label: "About",
    Frame: BusinessCardFrame,
    Section: AboutSection,
    slot: { top: "52%", left: "22%", width: 122, height: 70, rotate: -8, zone: "mid", shape: "card" },
  },
  {
    id: "writing",
    label: "Writing",
    Frame: NotebookFrame,
    Section: WritingDesk,
    slot: { top: "55%", left: "50%", width: 165, height: 100, rotate: -3, zone: "mid", shape: "notebook" },
  },
  {
    id: "skills",
    label: "Skills",
    Frame: ToolboxFrame,
    Section: SkillsToolbox,
    slot: { top: "52%", left: "78%", width: 132, height: 76, rotate: 5, zone: "mid", shape: "toolbox" },
  },
  {
    id: "journey",
    label: "Journey",
    Frame: ScrollFrame,
    Section: JourneyTimeline,
    slot: { top: "85%", left: "28%", width: 165, height: 30, rotate: -10, zone: "front", shape: "scroll" },
  },
  {
    id: "contact",
    label: "Contact",
    Frame: LetterFrame,
    Section: ContactClosing,
    slot: { top: "85%", left: "70%", width: 122, height: 78, rotate: 8, zone: "front", shape: "letter" },
  },
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
