import { useEffect } from "react";
import { subscribeFrame } from "@/lib/choreography";

/**
 * Subscribe a measure/mutate pair to the single global rAF ticker.
 *
 * `measure` runs in the read phase (all components' reads happen before any
 * writes), `mutate` runs in the write phase. Either may be omitted. The
 * callbacks are read from refs so identity changes never re-subscribe; pass
 * `deps` only to control when the subscription itself should reset.
 */
export function useChoreographyFrame(
  measure: ((time: number) => void) | undefined,
  mutate: ((time: number) => void) | undefined,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const unsub = subscribeFrame({ measure, mutate });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
