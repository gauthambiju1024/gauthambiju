import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Toolbox3D, TBX_W, TBX_D, TBX_H_BASE, TBX_H_LID } from "./skills/ToolboxSvg";
import ToolboxInterior from "./skills/ToolboxInterior";
import DeskSceneStage from "./DeskSceneStage";
import { choreo } from "@/lib/choreography";
import { subscribeFrame } from "@/lib/choreography";
import { SCROLL_DAMPING } from "@/lib/motion";

/**
 * Toolbox → Skills bridge.
 *
 * Phase 2 rewrite: the 0.0–1.0 keyframe choreography is preserved EXACTLY; only
 * the way progress reaches the DOM changed:
 *   • Motion is no longer mapped from RAW scroll. Each frame we compute a target
 *     progress and interpolate the *rendered* progress toward it
 *     (rendered += (target - rendered) * damping). At rest rendered === target,
 *     so resting poses are pixel-identical to before — it only removes stepping.
 *   • No standalone requestAnimationFrame: subscribes to the app's single
 *     measure→mutate ticker. All reads happen in `measure`, all writes in
 *     `mutate`, so there is no read-after-write layout thrash.
 *   • Cross-component coupling goes through the typed `choreo` store instead of
 *     window.__* globals (frame-synced, no cross-loop lag).
 *
 * Phases (progress p):
 *   0.00–0.25  park on the shelf rect (shelf prop hidden via choreo.skillsFlipActive)
 *   0.25–0.45  fly to centre + scale up
 *   0.45–0.60  rotate to top-down (-90°)
 *   0.55–0.70  lid hinges open
 *   0.62–0.74  interior fades in
 *   0.85–1.00  settle: rotate back to -15° / +35°, slight shrink
 */
const ToolboxToSkillsBridge = () => {
  const pinRef = useRef<HTMLElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const hasSeenShelfRef = useRef(false);
  const handoffStartRef = useRef<number | null>(null);

  const scale = useMotionValue(0.25);
  const rotX = useMotionValue("0deg");
  const rotY = useMotionValue("0deg");
  const lidRot = useMotionValue("0deg");
  const interiorOpacity = useMotionValue(0);
  const interiorY = useMotionValue(30);

  const [endScale, setEndScale] = useState(1);

  useLayoutEffect(() => {
    const compute = () => {
      const max =
        Math.min(
          (window.innerWidth * 0.92) / TBX_W,
          (window.innerHeight * 0.78) / TBX_D,
          1.1
        ) * 0.6;
      setEndScale(max);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const actor = actorRef.current;
    if (!pin || !actor) return;

    const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const seg = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
    const easeInOut = (x: number) => x * x * (3 - 2 * x);

    // ---- Phase 3: runway derived from a CACHED pixel height ----
    // The section is 340vh tall with a 100vh sticky child, so 240vh scrolls;
    // skills owns the first 120vh, the desk stage the next 120vh. Deriving the
    // runway from the element's pixel height (updated only on real resize) means
    // the choreography timing no longer shifts when the mobile URL bar resizes
    // `vh` mid-scroll.
    let runwayPx = window.innerHeight * 1.2;
    const computeRunway = () => {
      const h = pin.offsetHeight;
      runwayPx = h > 0 ? h * (1.2 / 3.4) : window.innerHeight * 1.2;
    };
    computeRunway();
    const ro = new ResizeObserver(computeRunway);
    ro.observe(pin);
    window.addEventListener("resize", computeRunway);

    // ---- per-frame measured values (read phase) ----
    let rawP = 0;
    let deskP = 0;
    let screenCx = window.innerWidth / 2;
    let screenCy = window.innerHeight / 2;
    let shelf:
      | { top: number; height: number; width: number; cx: number }
      | null = null;
    let shelfVisible = false;

    // ---- damped rendered progress (the smoothness fix) ----
    let renderedP = 0;
    let renderedDeskP = 0;
    let initialized = false; // snap to target on first frame (no load-in sweep)

    const measure = () => {
      const rect = pin.getBoundingClientRect();
      screenCx = window.innerWidth / 2;
      screenCy = window.innerHeight / 2;
      // Skills choreography keeps its 120vh runway; sourced from the cached
      // pixel height so it is stable against mobile URL-bar resize.
      const skillsRunway = runwayPx;
      const scrollPx = -rect.top;
      rawP = clamp(scrollPx / skillsRunway);
      deskP = clamp((scrollPx - skillsRunway) / skillsRunway);

      // Shelf geometry comes from the store (published by AboutToProjectsBridge)
      // — no second getBoundingClientRect on the shelf element here.
      const tr = choreo.toolboxRect;
      if (tr && tr.width > 0) {
        shelf = { top: tr.top, height: tr.height, width: tr.width, cx: tr.cx };
        shelfVisible = tr.visible === true;
      } else {
        shelf = null;
        shelfVisible = false;
      }
    };

    const mutate = () => {
      // --- handoff state machine (runs on RAW progress, unchanged logic) ---
      if (shelfVisible && !hasSeenShelfRef.current) {
        hasSeenShelfRef.current = true;
        handoffStartRef.current = rawP;
      }
      if (!shelfVisible && rawP <= 0.01) {
        hasSeenShelfRef.current = false;
        handoffStartRef.current = null;
      }

      const startP = handoffStartRef.current ?? rawP;
      const targetP = hasSeenShelfRef.current
        ? clamp((rawP - startP) / Math.max(0.52, 1 - startP))
        : 0;

      // --- damp rendered progress toward the targets ---
      if (!initialized) {
        renderedP = targetP;
        renderedDeskP = deskP;
        initialized = true;
      } else {
        renderedP += (targetP - renderedP) * SCROLL_DAMPING;
        renderedDeskP += (deskP - renderedDeskP) * SCROLL_DAMPING;
        // Snap when essentially settled so resting poses are pixel-exact.
        if (Math.abs(targetP - renderedP) < 0.0005) renderedP = targetP;
        if (Math.abs(deskP - renderedDeskP) < 0.0005) renderedDeskP = deskP;
      }
      const p = renderedP;
      const dp = renderedDeskP;

      const TBX_H = TBX_H_BASE + TBX_H_LID;
      let sx = 0,
        sy = 0,
        sScale = 0.25;
      if (shelf) {
        sScale = shelf.width / TBX_W;
        const shelfBottom = shelf.top + shelf.height;
        sx = shelf.cx - screenCx;
        sy = shelfBottom - (TBX_H * sScale) / 2 - screenCy;
      }

      const flyU = easeInOut(seg(0.25, 0.45, p));
      const settleU = seg(0.85, 1.0, p);
      let x = lerp(sx, 0, flyU);
      let y = lerp(sy, 0, flyU) + settleU * 40;
      let scl = lerp(sScale, endScale, flyU) * lerp(1, 0.92, settleU);

      const flipU = easeInOut(seg(0.45, 0.6, p));
      const finalU = easeInOut(seg(0.85, 1.0, p));
      let rx = lerp(0, -90, flipU) + finalU * 75;
      let ry = finalU * 35;

      const lidOpen = easeInOut(seg(0.55, 0.7, p));
      const lidClose = easeInOut(seg(0.92, 1.0, p));
      const lid = lerp(0, 125, lidOpen) * (1 - lidClose);

      const deskSlot = choreo.deskToolboxSlot;
      const deskU = easeInOut(seg(0.06, 0.38, dp));
      if (deskSlot && dp > 0) {
        const deskScale = deskSlot.width / TBX_W;
        const deskX = deskSlot.cx - screenCx;
        const deskY = deskSlot.bottom - (TBX_H * deskScale) / 2 - screenCy;
        x = lerp(0, deskX, deskU);
        y = lerp(40, deskY, deskU);
        scl = lerp(endScale * 0.92, deskScale, deskU);
        rx = lerp(-15, 0, deskU);
        ry = lerp(35, 0, deskU);
      }

      actor.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      scale.set(scl);
      rotX.set(`${rx.toFixed(2)}deg`);
      rotY.set(`${ry.toFixed(2)}deg`);
      lidRot.set(`${lid.toFixed(2)}deg`);

      const intIn = easeInOut(seg(0.62, 0.74, p));
      const intOut = easeInOut(seg(0.92, 1.0, p));
      interiorOpacity.set(intIn * (1 - intOut));
      interiorY.set(lerp(30, 0, intIn));

      // Visibility gating stays on RAW progress so the actor never disappears
      // early while the damped pose is still catching up.
      const showActor = shelfVisible || (hasSeenShelfRef.current && rawP > 0.05);
      actor.style.opacity = showActor ? "1" : "0";

      // will-change scoped to the active actor only (removed when idle).
      actor.style.willChange = showActor ? "transform, opacity" : "auto";

      choreo.skillsFlipActive = showActor && rawP < 0.999;
      choreo.bridgeFadeOut = showActor ? clamp(seg(0.2, 0.45, p)) : 0;
      choreo.deskProgress = dp;
      choreo.skillsEndState = {
        scale: scl,
        rx,
        ry,
        cx: screenCx + x,
        cy: screenCy + y,
        active: showActor,
        done: rawP >= 0.999,
      };
    };

    const unsub = subscribeFrame({ measure, mutate });
    return () => {
      unsub();
      ro.disconnect();
      window.removeEventListener("resize", computeRunway);
      choreo.skillsFlipActive = false;
      choreo.bridgeFadeOut = 0;
    };
  }, [endScale, scale, rotX, rotY, lidRot, interiorOpacity, interiorY]);

  return (
    <section
      ref={pinRef}
      id="skills"
      aria-label="Skills toolbox"
      style={{ height: "340vh" }}
      className="relative"
    >
      <span id="desk-scene" className="absolute left-0 w-1 h-1 pointer-events-none" style={{ top: "120vh" }} aria-hidden />
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>
        <DeskSceneStage />
        <div
          className="absolute inset-0 flex items-center justify-center [perspective:1200px]"
          style={{ pointerEvents: "none", zIndex: 10 }}
        >
          <div
            ref={actorRef}
            className="relative"
            style={{ pointerEvents: "auto", willChange: "transform, opacity", opacity: 0 }}
          >
            <Toolbox3D
              scale={scale}
              rotateX={rotX}
              rotateY={rotY}
              lidRotateX={lidRot}
              floorContent={
                <motion.div
                  style={{ opacity: interiorOpacity, y: interiorY }}
                  className="w-full h-full bg-[#0a0a0c] p-6 flex flex-col gap-4 relative rounded-md shadow-[inset_0_20px_50px_rgba(0,0,0,1)] overflow-hidden border-[6px] border-[#05080a]"
                >
                  <div className="absolute inset-0 opacity-70 bg-[repeating-linear-gradient(45deg,#0c0c0e_0,#0c0c0e_4px,transparent_4px,transparent_8px),repeating-linear-gradient(-45deg,#111_0,#111_2px,transparent_2px,transparent_6px)] mix-blend-overlay pointer-events-none" />
                  <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                    <ToolboxInterior />
                  </div>
                </motion.div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolboxToSkillsBridge;
