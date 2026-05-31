/**
 * choreography.ts — shared, typed cross-component store + a single rAF ticker.
 *
 * Replaces the former `window.__*` globals used to coordinate the
 * Hero → About → Projects → Skills(toolbox) → Desk scroll choreography, and
 * replaces the multiple competing per-component requestAnimationFrame loops
 * with ONE frame-synced driver.
 *
 * Why one ticker: the bridges, HeroIdBadge, DeskSceneStage and Entropy each
 * used to run their own rAF loop and talk through `window.__*`. Because the
 * loops were not frame-synchronised, one loop's output could lag another by a
 * frame, tearing the handoffs. A single loop with an explicit
 * measure → mutate ordering removes that lag AND removes layout thrash
 * (all reads happen before any writes within a frame).
 */

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
}

export interface ToolboxRect extends RectLike {
  visible: boolean;
}

export interface DeskToolboxSlot {
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  bottom: number;
}

export interface SkillsEndState {
  scale: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  active: boolean;
  done: boolean;
}

/** The shared choreography state (formerly scattered across window.__*). */
interface ChoreoStore {
  // About → Projects bridge
  bridgeSlotRect: RectLike | null;
  bridgeActive: boolean;
  bridgeProgress: number;
  bridgeSettled: boolean;
  bridgeFadeOut: number;
  // Toolbox prop handed from the projects shelf to the skills flip
  toolboxEl: HTMLElement | null;
  toolboxRect: ToolboxRect | null;
  // Skills flip → Desk
  skillsFlipActive: boolean;
  deskProgress: number;
  deskToolboxSlot: DeskToolboxSlot | undefined;
  skillsEndState: SkillsEndState | null;
}

export const choreo: ChoreoStore = {
  bridgeSlotRect: null,
  bridgeActive: false,
  bridgeProgress: 0,
  bridgeSettled: false,
  bridgeFadeOut: 0,
  toolboxEl: null,
  toolboxRect: null,
  skillsFlipActive: false,
  deskProgress: 0,
  deskToolboxSlot: undefined,
  skillsEndState: null,
};

/* ----------------------------------------------------------------------- *
 *  Single rAF ticker
 * ----------------------------------------------------------------------- */

type FrameFn = (time: number) => void;

interface FrameSubscriber {
  measure?: FrameFn;
  mutate?: FrameFn;
}

let driver: FrameFn | null = null; // runs first each frame (e.g. lenis.raf)
const measures = new Set<FrameFn>();
const mutates = new Set<FrameFn>();
let rafId = 0;
let running = false;

const frame: FrameFn = (time) => {
  if (driver) driver(time);
  // Phase 1: every subscriber reads layout.
  measures.forEach((fn) => fn(time));
  // Phase 2: every subscriber writes. Reads-before-writes avoids forced reflow.
  mutates.forEach((fn) => fn(time));
  rafId = requestAnimationFrame(frame);
};

const ensureRunning = () => {
  if (running) return;
  if (!driver && measures.size === 0 && mutates.size === 0) return;
  running = true;
  rafId = requestAnimationFrame(frame);
};

const maybeStop = () => {
  if (!running) return;
  if (driver || measures.size > 0 || mutates.size > 0) return;
  cancelAnimationFrame(rafId);
  running = false;
};

/** Register the per-frame driver (Lenis). Runs before all measures. */
export function setFrameDriver(fn: FrameFn | null): () => void {
  driver = fn;
  ensureRunning();
  return () => {
    if (driver === fn) driver = null;
    maybeStop();
  };
}

/** Subscribe a measure (reads) and/or mutate (writes) callback to the ticker. */
export function subscribeFrame(sub: FrameSubscriber): () => void {
  if (sub.measure) measures.add(sub.measure);
  if (sub.mutate) mutates.add(sub.mutate);
  ensureRunning();
  return () => {
    if (sub.measure) measures.delete(sub.measure);
    if (sub.mutate) mutates.delete(sub.mutate);
    maybeStop();
  };
}
