/**
 * deviceCapability.ts — context-dependent quality detection (Phase 5).
 *
 * Used to scale animation complexity: full choreography on capable desktops,
 * simplified on touch / low-power, and a static fallback under
 * prefers-reduced-motion.
 */

export type DeviceTier = "high" | "medium" | "low";

export interface DeviceCapability {
  /** matchMedia('(pointer: coarse)') — touch-first devices. */
  coarsePointer: boolean;
  /** prefers-reduced-motion: reduce */
  reducedMotion: boolean;
  /** Logical CPU cores (navigator.hardwareConcurrency), best-effort. */
  cores: number;
  /** Approx device memory in GB (navigator.deviceMemory), best-effort. */
  memory: number;
  /** Coarse perf tier derived from the above. */
  tier: DeviceTier;
  /** Convenience: should we run the full, heavy choreography? */
  fullMotion: boolean;
}

const mq = (q: string): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(q).matches;

export function detectDeviceCapability(): DeviceCapability {
  const coarsePointer = mq("(pointer: coarse)");
  const reducedMotion = mq("(prefers-reduced-motion: reduce)");
  const cores =
    (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4;
  const memory =
    (typeof navigator !== "undefined" &&
      (navigator as unknown as { deviceMemory?: number }).deviceMemory) ||
    4;

  let tier: DeviceTier = "high";
  if (reducedMotion) {
    tier = "low";
  } else if (coarsePointer && (cores <= 4 || memory <= 4)) {
    tier = "low";
  } else if (coarsePointer || cores <= 4 || memory <= 4) {
    tier = "medium";
  }

  return {
    coarsePointer,
    reducedMotion,
    cores,
    memory,
    tier,
    fullMotion: !reducedMotion && tier !== "low",
  };
}

export function prefersReducedMotion(): boolean {
  return mq("(prefers-reduced-motion: reduce)");
}
