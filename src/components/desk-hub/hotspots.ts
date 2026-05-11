// Hotspot coordinates as % of the desk image stage.
// Calibrated against src/assets/builders-desk.png (3:2 aspect).
export type Hotspot = {
  id: string;
  target: string; // section anchor id
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export const HOTSPOTS: Hotspot[] = [
  // Bookshelf at top center → projects
  { id: "shelf",     target: "projects", label: "Projects",  left: 21, top: 7,  width: 38, height: 24 },
  // Corkboard top right → thinking
  { id: "corkboard", target: "thinking", label: "Thinking",  left: 65, top: 4,  width: 30, height: 30 },
  // Spiral notepad center-left → writing
  { id: "notepad",   target: "writing",  label: "Writing",   left: 27, top: 45, width: 12, height: 22 },
  // Toolbox right → skills
  { id: "toolbox",   target: "skills",   label: "Skills",    left: 76, top: 53, width: 22, height: 30 },
  // ID badge center-right → about
  { id: "badge",     target: "about",    label: "About",     left: 60, top: 50, width: 7,  height: 18 },
  // Contact tray far right (clipboard with letter) → contact
  { id: "contact",   target: "contact",  label: "Contact",   left: 67, top: 47, width: 9,  height: 22 },
];
