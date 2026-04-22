import { ReactNode } from "react";
import { MotionValue } from "framer-motion";

export interface FrameProps {
  children: ReactNode;
  /** Local progress 0→1 for this section (50% = fully on stage) */
  t: MotionValue<number>;
  /** Whether this frame is the active stage object */
  active: boolean;
}

export type FrameId =
  | "home"
  | "about"
  | "projects"
  | "thinking"
  | "skills"
  | "journey"
  | "writing"
  | "contact";
