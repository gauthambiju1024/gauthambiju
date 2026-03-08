import { motion, useScroll, useSpring } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <Navigation />

      <main>
        <HeroSection />
        <MarqueeText />
        <BeliefsSection />
        <WorkSection />
        <StorySection />
        <ConnectSection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
