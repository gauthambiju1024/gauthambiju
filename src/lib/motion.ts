/**
 * motion.ts — shared easing / spring tokens (Phase 4).
 *
 * One vocabulary of motion so reveals, hovers and page transitions feel
 * consistent (Apple/Airbnb consistency = the *same* easing everywhere).
 * The cubic-beziers below match the ones already used in index.css
 * (lines for .ribbon-bookmark-interactive / .card-hover) so adopting these
 * tokens is visually neutral.
 */

import type { Transition } from "framer-motion";

/** Smooth "ease-out expo"-ish curve — primary easing for entrances. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Gentle settle used for card-level movement. */
export const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Spring tuned for user-perceived movement (reveals, cards). */
export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
};

/** Snappier spring for small UI affordances. */
export const SPRING_SNAPPY: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.8,
};

/** Opacity-only fades stay as tweens (springs add nothing to alpha). */
export const FADE_TWEEN: Transition = {
  type: "tween",
  ease: EASE_OUT_EXPO,
  duration: 0.6,
};

/** Default per-item stagger for grouped reveals (skills, projects). */
export const STAGGER_STEP = 0.06; // 60ms

/**
 * Lerp/damping factor used by scroll-linked motion to interpolate the
 * *rendered* value toward its target each frame, instead of snapping to raw
 * scroll. Converges exactly to the target at rest, so resting poses are
 * pixel-identical — it only removes the per-frame stepping.
 */
export const SCROLL_DAMPING = 0.18;

/** Frame-rate-independent damping toward `target` from `current`. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt);
}
