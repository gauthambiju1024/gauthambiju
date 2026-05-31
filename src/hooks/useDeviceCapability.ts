import { useEffect, useState } from "react";
import {
  detectDeviceCapability,
  type DeviceCapability,
} from "@/lib/deviceCapability";

/**
 * Reactive device-capability hook (Phase 5). Re-evaluates when the relevant
 * media queries change (e.g. user toggles reduced-motion, or pointer type
 * changes on a 2-in-1).
 */
export function useDeviceCapability(): DeviceCapability {
  const [cap, setCap] = useState<DeviceCapability>(() =>
    detectDeviceCapability()
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const queries = [
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    const onChange = () => setCap(detectDeviceCapability());
    queries.forEach((q) => q.addEventListener("change", onChange));
    onChange();
    return () =>
      queries.forEach((q) => q.removeEventListener("change", onChange));
  }, []);

  return cap;
}
