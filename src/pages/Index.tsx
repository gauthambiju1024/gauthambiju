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

// Order matches AssemblyHeader/Navigation: Home → About → Projects → Thinking → Skills → Journey → Writing → Contact
const sections: SectionConfig[] = [
  {
    id: "home",
    label: "Home",
    Frame: BlueprintFrame,
    Section: HeroSection,
    slot: { shape: "mat", position: [-0.95, 0, 0.45], rotation: [0, 0.05, 0] },
  },
  {
    id: "about",
    label: "About",
    Frame: BusinessCardFrame,
    Section: AboutSection,
    slot: { shape: "card", position: [0.85, 0, 0.3], rotation: [0, -0.2, 0] },
  },
  {
    id: "projects",
    label: "Projects",
    Frame: BookshelfFrame,
    Section: ProjectsShelf,
    slot: { shape: "book", position: [-1.5, 0, 0.4], rotation: [0, 0.15, 0] },
  },
  {
    id: "thinking",
    label: "Thinking",
    Frame: CorkboardFrame,
    Section: ThinkingWall,
    slot: { shape: "cork", position: [0.0, 0, -0.2], rotation: [0, 0, 0] },
  },
  {
    id: "skills",
    label: "Skills",
    Frame: ToolboxFrame,
    Section: SkillsToolbox,
    slot: { shape: "toolbox", position: [1.55, 0, 0.1], rotation: [0, -0.25, 0] },
  },
  {
    id: "journey",
    label: "Journey",
    Frame: ScrollFrame,
    Section: JourneyTimeline,
    slot: { shape: "compass", position: [0.55, 0, 0.5], rotation: [0, 0.1, 0] },
  },
  {
    id: "writing",
    label: "Writing",
    Frame: NotebookFrame,
    Section: WritingDesk,
    slot: { shape: "notebook", position: [-0.05, 0, 0.45], rotation: [0, -0.02, 0] },
  },
  {
    id: "contact",
    label: "Contact",
    Frame: LetterFrame,
    Section: ContactClosing,
    slot: { shape: "envelope", position: [1.15, 0, 0.35], rotation: [0, -0.15, 0] },
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
