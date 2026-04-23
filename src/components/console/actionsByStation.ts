import { FrameId } from "@/components/desk/frames/FrameTypes";

export interface ConsoleAction {
  label: string;
  href?: string;
  action?: "copy-email" | "noop";
  primary?: boolean;
}

export interface StationMeta {
  actions: ConsoleAction[];
}

// Hard cap: 2–4 actions per station, primary first.
export const STATION_META: Record<FrameId, StationMeta> = {
  home: {
    actions: [
      { label: "View Work", href: "#projects", primary: true },
      { label: "Resume", href: "#contact" },
    ],
  },
  about: {
    actions: [
      { label: "Bio", href: "#about", primary: true },
      { label: "Contact", href: "#contact" },
    ],
  },
  projects: {
    actions: [
      { label: "Featured", href: "#projects", primary: true },
      { label: "Case Studies", href: "#thinking" },
    ],
  },
  thinking: {
    actions: [
      { label: "Pinned", href: "#thinking", primary: true },
      { label: "Strategy", href: "#thinking" },
    ],
  },
  skills: {
    actions: [
      { label: "Product", primary: true },
      { label: "Technical" },
      { label: "Design" },
    ],
  },
  journey: {
    actions: [
      { label: "Experience", href: "#journey", primary: true },
      { label: "Latest", href: "#writing" },
    ],
  },
  writing: {
    actions: [
      { label: "Latest", href: "#writing", primary: true },
      { label: "Essays", href: "#writing" },
    ],
  },
  contact: {
    actions: [
      { label: "Copy Email", action: "copy-email", primary: true },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
};
