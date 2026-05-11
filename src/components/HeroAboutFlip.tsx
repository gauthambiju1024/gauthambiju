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
 * 0.55–0.80  Card 3D-flips on Y; back face IS the About section.
 */
const HeroAboutFlip = () => {
  const tDummy = useMotionValue(0.5);
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const heroFade   = useTransform(scrollYProgress, [0.30, 0.55], [1, 0]);
  // Soft paper backdrop fades in as the card flips so the back doesn't sit on dark blueprint.
  const paperFade  = useTransform(scrollYProgress, [0.55, 0.80], [0, 1]);

  return (
    <section ref={pinRef} id="home-about-pin" style={{ height: "200vh" }} className="relative">
      <div className="sticky top-0 w-full" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px]">
          <div className="relative w-full h-full">
            {/* Paper backdrop revealed as the card flips */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: paperFade, background: "hsl(36 37% 96%)", pointerEvents: "none" }}
              aria-hidden
            />

            {/* Hero panel (anchor #home) */}
            <motion.div id="home" className="absolute inset-0" style={{ opacity: heroFade }}>
              <BlueprintFrame t={tDummy} active={true}>
                <HeroSection />
              </BlueprintFrame>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Anchor for the About nav link — placed past the flip midpoint so clicking it lands on the flipped state */}
      <div id="about" style={{ position: "absolute", top: "65%", left: 0, width: 1, height: 1 }} aria-hidden />

      {/* The actual lanyard + ID card overlay; back face renders the About section */}
      <HeroIdBadge
        progressMV={scrollYProgress}
        anchorId="home"
        backChildren={
          <BusinessCardFrame t={tDummy} active={true}>
            <AboutSection />
          </BusinessCardFrame>
        }
      />
    </section>
  );
};

export default HeroAboutFlip;
