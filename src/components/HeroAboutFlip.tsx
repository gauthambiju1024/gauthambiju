import { useMotionValue } from "framer-motion";
import HeroSection from "./HeroSection";
import BlueprintFrame from "./desk/frames/BlueprintFrame";

/**
 * Hero pin — simplified. The About section is now a separate, content-driven
 * panel with its own ID card + globe layout. Hero just sticks for one viewport
 * height for visual breathing room.
 */
const HeroAboutFlip = () => {
  const tDummy = useMotionValue(0.5);

  return (
    <section id="home-pin" style={{ height: "100vh" }} className="relative">
      <div className="sticky top-0 w-full" style={{ height: "100vh" }}>
        <div className="w-full h-full pt-[100px]">
          <div id="home" className="relative w-full h-full">
            <BlueprintFrame t={tDummy} active={true}>
              <HeroSection />
            </BlueprintFrame>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAboutFlip;
