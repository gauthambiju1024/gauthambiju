import { useRef } from "react";
import { useScroll, useMotionValue, motion, useTransform } from "framer-motion";
import HeroSection from "./HeroSection";
import BlueprintFrame from "./desk/frames/BlueprintFrame";
import HeroIdBadge from "./HeroIdBadge";
import AboutToProjectsBridge from "./AboutToProjectsBridge";

/**
 * Pinned scroll-driven flip:
 * 0.00–0.30  Hero panel visible, real ID card draggable in its resting spot.
 * 0.30–0.55  Real ID card slides to viewport center and scales toward the viewer.
 * 0.55–0.72  Card 3D-flips on Y; back of the card shows the About panel.
 * 0.72–1.00  The same card folds into a spine and lands on the live shelf.
 */
const HeroAboutFlip = () => {
  const tDummy = useMotionValue(0.5);
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // Subtle dim of the blueprint as the card takes focus.
  const heroFade = useTransform(scrollYProgress, [0.30, 0.55], [1, 0]);

  return (
      <section ref={pinRef} id="home-about-pin" style={{ height: "460vh" }} className="relative">
      <div className="sticky top-0 w-full" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px]">
          <div className="relative w-full h-full">
            {/* Hero panel — id="home" stays opaque so the portal-mounted ID card stage doesn't inherit the fade */}
            <div id="home" className="absolute inset-0">
              <motion.div className="absolute inset-0" style={{ opacity: heroFade }}>
                <BlueprintFrame t={tDummy} active={true}>
                  <HeroSection />
                </BlueprintFrame>
              </motion.div>
            </div>

            <AboutToProjectsBridge progressMV={scrollYProgress} />
          </div>
        </div>
      </div>

      {/* Anchor for the About nav link — placed past the flip midpoint so clicking it lands on the flipped state */}
      <div id="about" style={{ position: "absolute", top: "55%", left: 0, width: 1, height: 1 }} aria-hidden />
      <div id="projects" style={{ position: "absolute", top: "82%", left: 0, width: 1, height: 1 }} aria-hidden />

      {/* Lanyard + ID card overlay; back face is rendered inside HeroIdBadge */}
      <HeroIdBadge progressMV={scrollYProgress} anchorId="home" />
    </section>
  );
};

export default HeroAboutFlip;
