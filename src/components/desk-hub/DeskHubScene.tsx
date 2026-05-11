import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Globe from "@/components/Globe";
import { useIsMobile } from "@/hooks/use-mobile";
import DeskHotspot from "./DeskHotspot";
import MobileHubCards from "./MobileHubCards";
import ProjectShelfOverlay from "./ProjectShelfOverlay";
import { GlobeWireSVG, IndiaSVG, PuneSVG, RoofSVG } from "./ZoomTiers";
import { HOTSPOTS } from "./hotspots";
import deskImg from "@/assets/builders-desk-noshelf.png";

/**
 * Pinned scroll section: Earth → India → Pune → rooftops → Builder's desk hub.
 * After zoom completes, the desk image becomes a clickable hub.
 */
const DeskHubScene = () => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Layer opacity transitions — globe canvas is just the first frame, then SVG wireframe takes over
  const cobeOpacity    = useTransform(scrollYProgress, [0.00, 0.08, 0.14], [1, 1, 0]);
  const wireOpacity    = useTransform(scrollYProgress, [0.06, 0.14, 0.22, 0.28], [0, 1, 1, 0]);
  const wireScale      = useTransform(scrollYProgress, [0.06, 0.28], [1, 2.6]);

  const indiaOpacity   = useTransform(scrollYProgress, [0.22, 0.30, 0.42, 0.48], [0, 1, 1, 0]);
  const indiaScale     = useTransform(scrollYProgress, [0.22, 0.48], [1, 2.4]);

  const puneOpacity    = useTransform(scrollYProgress, [0.42, 0.50, 0.60, 0.66], [0, 1, 1, 0]);
  const puneScale      = useTransform(scrollYProgress, [0.42, 0.66], [1, 2.2]);

  const roofsOpacity   = useTransform(scrollYProgress, [0.60, 0.68, 0.76, 0.82], [0, 1, 1, 0]);
  const roofsScale     = useTransform(scrollYProgress, [0.60, 0.82], [1, 2.0]);

  const deskOpacity    = useTransform(scrollYProgress, [0.78, 0.86], [0, 1]);
  const deskScale      = useTransform(scrollYProgress, [0.78, 0.88, 1.0], [1.2, 1, 1]);
  const hotspotsOpacity = useTransform(scrollYProgress, [0.88, 0.96], [0, 1]);

  const handleActivate = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isMobile) {
    return (
      <section id="desk-hub" style={{ background: "hsl(160 30% 6%)" }}>
        <MobileHubCards />
      </section>
    );
  }

  return (
    <section ref={ref} id="desk-hub" style={{ height: "400vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden", background: "hsl(160 35% 5%)" }}>
        {/* Layer 0: Cobe globe (first frame only, fades quickly) */}
        <motion.div
          style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: cobeOpacity, willChange: "opacity", zIndex: 1,
          }}
        >
          <div style={{ width: "min(70vh, 70vw)", aspectRatio: "1 / 1" }}>
            <Globe className="w-full h-full" />
          </div>
        </motion.div>

        {/* Layer 1: Globe wireframe SVG */}
        <motion.div
          style={{
            position: "absolute", inset: 0,
            opacity: wireOpacity, scale: wireScale, willChange: "transform, opacity", zIndex: 2,
          }}
        >
          <GlobeWireSVG />
        </motion.div>

        {/* Layer 2: India outline */}
        <motion.div
          style={{
            position: "absolute", inset: 0,
            opacity: indiaOpacity, scale: indiaScale, willChange: "transform, opacity", zIndex: 3,
          }}
        >
          <IndiaSVG />
        </motion.div>

        {/* Layer 3: Pune street grid */}
        <motion.div
          style={{
            position: "absolute", inset: 0,
            opacity: puneOpacity, scale: puneScale, willChange: "transform, opacity", zIndex: 4,
          }}
        >
          <PuneSVG />
        </motion.div>

        {/* Layer 4: Room floorplan */}
        <motion.div
          style={{
            position: "absolute", inset: 0,
            opacity: roofsOpacity, scale: roofsScale, willChange: "transform, opacity", zIndex: 5,
          }}
        >
          <RoofSVG />
        </motion.div>
        {/* Layer 5: Desk image + hotspots + project shelf */}
        <motion.div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: deskOpacity, scale: deskScale, willChange: "transform, opacity", zIndex: 6,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(100%, calc(100vh * 1.5))",
              aspectRatio: "3 / 2",
              maxHeight: "100vh",
              backgroundImage: `url(${deskImg})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {/* Live project shelf where the original bookshelf was (left:21% top:7% width:38% height:24%) */}
            <motion.div
              style={{
                position: "absolute",
                left: "21%", top: "5%", width: "38%", height: "26%",
                opacity: hotspotsOpacity,
                zIndex: 4,
              }}
            >
              <ProjectShelfOverlay />
            </motion.div>

            <motion.div style={{ position: "absolute", inset: 0, opacity: hotspotsOpacity }}>
              {HOTSPOTS.map((h) => (
                <DeskHotspot key={h.id} hotspot={h} onActivate={handleActivate} />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            fontSize: 10, letterSpacing: "1.6px", color: "hsl(40 30% 92% / 0.7)",
            opacity: useTransform(scrollYProgress, [0, 0.05, 0.85, 0.95], [1, 1, 1, 0]),
            zIndex: 10, pointerEvents: "none",
          }}
        >
          SCROLL TO ZOOM IN ↓
        </motion.div>
      </div>
    </section>
  );
};

export default DeskHubScene;
