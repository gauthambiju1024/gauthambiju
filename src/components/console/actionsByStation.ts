import { FrameId } from "@/components/desk/frames/FrameTypes";

export interface ConsoleAction {
  label: string;
  /** Anchor id to scroll to, or external href */
  href?: string;
  /** Local action key — handled by ActionDock (e.g. copy email) */
  action?: "copy-email" | "noop";
  /** Mark as default-active visual */
  primary?: boolean;
}

export interface StationMeta {
  status: string; // small status verb, e.g. "calibrating capabilities"
  actions: ConsoleAction[];
}

export const STATION_META: Record<FrameId, StationMeta> = {
  home: {
    status: "drafting introduction",
    actions: [
      { label: "View Work", href: "#projects", primary: true },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  about: {
    status: "writing bio",
    actions: [
      { label: "Bio", href: "#about", primary: true },
      { label: "Now", href: "#journey" },
      { label: "Contact", href: "#contact" },
    ],
  },
  projects: {
    status: "shelving builds",
    actions: [
      { label: "Featured", href: "#projects", primary: true },
      { label: "Case Studies", href: "#thinking" },
      { label: "Product" },
      { label: "AI / PM" },
    ],
  },
  thinking: {
    status: "pinning notes",
    actions: [
      { label: "Pinned", href: "#thinking", primary: true },
      { label: "Strategy" },
      { label: "Product Essays" },
    ],
  },
  skills: {
    status: "calibrating capabilities",
    actions: [
      { label: "Product", primary: true },
      { label: "Technical" },
      { label: "Design" },
      { label: "Systems" },
    ],
  },
  journey: {
    status: "unrolling timeline",
    actions: [
      { label: "Experience", href: "#journey", primary: true },
      { label: "Education" },
      { label: "Latest" },
    ],
  },
  writing: {
    status: "indexing notes",
    actions: [
      { label: "Latest", href: "#writing", primary: true },
      { label: "Product" },
      { label: "Systems" },
      { label: "Reflections" },
    ],
  },
  contact: {
    status: "finalizing connection",
    actions: [
      { label: "Copy Email", action: "copy-email", primary: true },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Schedule", href: "#contact" },
    ],
  },
};
