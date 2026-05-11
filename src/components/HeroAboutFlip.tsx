import { useRef } from "react";
import { useScroll, useTransform, useMotionValue, motion } from "framer-motion";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import BlueprintFrame from "./desk/frames/BlueprintFrame";
import BusinessCardFrame from "./desk/frames/BusinessCardFrame";
import HeroIdBadge from "./HeroIdBadge";

/**
 * Pinned scroll-driven flip:
 * 0.00–0.30  Hero panel visible, real ID card draggable in its resting spot.
 * 0.30–0.55  Real ID card slides to viewport center and scales toward the viewer.
 * 0.55–0.80  Card 3D-flips on Y; backface-hidden reveals About panel beneath.
 * 0.80–1.00  About panel fully visible; ready to scroll into the next station.
 */
const HeroAboutFlip = () => {
  const tDummy = useMotionValue(0.5);
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const heroFade   = useTransform(scrollYProgress, [0.30, 0.55], [1, 0]);
  const backOpacity = useTransform(scrollYProgress, [0.62, 0.78], [0, 1]);

  return (
    <section ref={pinRef} id="home-about-pin" style={{ height: "200vh" }} className="relative">
      <div className="sticky top-0 w-full" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px]">
          <div className="relative w-full h-full">
            {/* Hero panel (anchor #home) */}
            <motion.div id="home" className="absolute inset-0" style={{ opacity: heroFade }}>
              <BlueprintFrame t={tDummy} active={true}>
                <HeroSection />
              </BlueprintFrame>
            </motion.div>

            {/* About panel sits behind, fades in once flip passes 90° */}
            <motion.div id="about" className="absolute inset-0" style={{ opacity: backOpacity }}>
              <BusinessCardFrame t={tDummy} active={true}>
                <AboutSection />
              </BusinessCardFrame>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The actual lanyard + ID card overlay; transforms driven by scrollYProgress */}
      <HeroIdBadge progressMV={scrollYProgress} anchorId="home" />
    </section>
  );
};

export default HeroAboutFlip;
