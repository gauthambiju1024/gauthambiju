import { useRef } from "react";
import { useScroll, useMotionValue, motion, useTransform } from "framer-motion";
import HeroSection from "./HeroSection";
import BlueprintFrame from "./desk/frames/BlueprintFrame";
import HeroIdBadge from "./HeroIdBadge";

/**
 * Pinned scroll-driven flip:
 * 0.00–0.30  Hero panel visible, ID card resting in its top-right spot.
 * 0.30–0.55  Stage lerps from hero rect to #about-card-slot rect.
 * 0.55–0.90  Card 3D-flips to its journey back face.
 */
const HeroAboutFlip = () => {
  const tDummy = useMotionValue(0.5);
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const heroFade = useTransform(scrollYProgress, [0.30, 0.55], [1, 0]);

  return (
    <section ref={pinRef} id="home-about-pin" style={{ height: "200vh" }} className="relative">
      <div className="sticky top-0 w-full" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px]">
          <div id="home" className="relative w-full h-full">
            <motion.div className="absolute inset-0" style={{ opacity: heroFade }}>
              <BlueprintFrame t={tDummy} active={true}>
                <HeroSection />
              </BlueprintFrame>
            </motion.div>
          </div>
        </div>
      </div>
      <HeroIdBadge progressMV={scrollYProgress} anchorId="home" slotId="about-card-slot" />
    </section>
  );
};

export default HeroAboutFlip;
