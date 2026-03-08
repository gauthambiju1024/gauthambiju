import { motion, useScroll, useSpring } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import ConnectSection from "@/components/ConnectSection";
import DecorativeBorder from "@/components/DecorativeBorder";
import Footer from "@/components/Footer";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      
      <div className="flex items-stretch max-w-6xl w-full">
        {/* Left decorative border */}
        <DecorativeBorder side="left" />
        
        {/* Main notebook container */}
        <motion.main
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="notebook-container notebook-grid flex-1 rounded-lg overflow-hidden relative"
        >
          {/* Bookmark ribbons */}
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
            className="bookmark-ribbon" 
          />
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            className="bookmark-ribbon-left" 
          />
          
          {/* Spiral binding effect */}
          <div className="spiral-binding hidden md:block" />
          
          {/* Red margin line */}
          <div className="notebook-margin" />
          
          {/* Content */}
          <div className="relative z-10">
            <Navigation />
            <HeroSection />
            <MarqueeText />
            <BeliefsSection />
            <WorkSection />
            <StorySection />
            <ConnectSection />
            <Footer />
          </div>
          
          {/* Decorative page corner shadow */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
               style={{
                 background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.03) 50%)"
               }}
          />
        </motion.main>
        
        {/* Right decorative border */}
        <DecorativeBorder side="right" />
      </div>
    </div>
  );
};

export default Index;
