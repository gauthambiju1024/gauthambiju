import { motion, useScroll, useSpring } from "framer-motion";
import NotebookLayout from "@/components/NotebookLayout";
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
    <div className="relative">
      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ scaleX, background: 'hsl(8 68% 45%)' }}
      />

      <NotebookLayout>
        <Navigation />
        <HeroSection />
        <div className="section-divider" />
        <MarqueeText />
        <BeliefsSection />
        <div className="section-divider" />
        <WorkSection />
        <div className="section-divider" />
        <StorySection />
        <div className="section-divider" />
        <ConnectSection />
        <Footer />
      </NotebookLayout>
    </div>
  );
};

export default Index;
