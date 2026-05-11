import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Globe from "@/components/Globe";
import { useIsMobile } from "@/hooks/use-mobile";
import DeskHotspot from "./DeskHotspot";
import MobileHubCards from "./MobileHubCards";
import { HOTSPOTS } from "./hotspots";
import deskImg from "@/assets/builders-desk.png";
import indiaImg from "@/assets/zoom-india.jpg";
import puneImg from "@/assets/zoom-pune.jpg";
import roofsImg from "@/assets/zoom-rooftops.jpg";

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

  // Layer opacity transitions
  const globeOpacity   = useTransform(scrollYProgress, [0.00, 0.15, 0.22], [1, 1, 0]);
  const globeScale     = useTransform(scrollYProgress, [0.00, 0.22], [1, 2.4]);

  const indiaOpacity   = useTransform(scrollYProgress, [0.15, 0.22, 0.36, 0.42], [0, 1, 1, 0]);
  const indiaScale     = useTransform(scrollYProgress, [0.15, 0.42], [1, 2.0]);

  const puneOpacity    = useTransform(scrollYProgress, [0.36, 0.42, 0.54, 0.60], [0, 1, 1, 0]);
  const puneScale      = useTransform(scrollYProgress, [0.36, 0.60], [1, 1.8]);

  const roofsOpacity   = useTransform(scrollYProgress, [0.54, 0.60, 0.72, 0.78], [0, 1, 1, 0]);
  const roofsScale     = useTransform(scrollYProgress, [0.54, 0.78], [1, 1.6]);

  const deskOpacity    = useTransform(scrollYProgress, [0.72, 0.82], [0, 1]);
  const deskScale      = useTransform(scrollYProgress, [0.72, 0.85, 1.0], [1.15, 1, 1]);
  const hotspotsOpacity = useTransform(scrollYProgress, [0.86, 0.95], [0, 1]);

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
        {/* Layer 0: Globe (outer space) */}
        <motion.div
          style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: globeOpacity, scale: globeScale, willChange: "transform, opacity", zIndex: 1,
          }}
        >
          <div style={{ width: "min(70vh, 70vw)", aspectRatio: "1 / 1" }}>
            <Globe className="w-full h-full" />
          </div>
        </motion.div>

        {/* Layer 1: India */}
        <motion.img
          src={indiaImg} alt="" loading="lazy" width={1280} height={1280}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: indiaOpacity, scale: indiaScale, willChange: "transform, opacity", zIndex: 2,
          }}
        />

        {/* Layer 2: Pune */}
        <motion.img
          src={puneImg} alt="" loading="lazy" width={1280} height={1280}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: puneOpacity, scale: puneScale, willChange: "transform, opacity", zIndex: 3,
          }}
        />

        {/* Layer 3: Rooftops */}
        <motion.img
          src={roofsImg} alt="" loading="lazy" width={1280} height={1280}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: roofsOpacity, scale: roofsScale, willChange: "transform, opacity", zIndex: 4,
          }}
        />

        {/* Layer 4: Desk image + hotspots */}
        <motion.div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: deskOpacity, scale: deskScale, willChange: "transform, opacity", zIndex: 5,
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
