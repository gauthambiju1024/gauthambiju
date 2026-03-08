import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen py-4 md:py-6 px-2 md:px-4 lg:px-8 desk-pattern" style={{ background: 'hsl(var(--background))' }}>
      <div className="notebook notebook-grid max-w-7xl mx-auto relative" style={{ scrollBehavior: 'smooth' }}>
        {/* Spine */}
        <div className="notebook-spine hidden md:block" />
        {/* Margin line */}
        <div className="notebook-margin hidden md:block" />
        {/* Hole punches */}
        <div className="notebook-holes hidden md:block">
          <div className="notebook-hole" style={{ top: '80px' }} />
          <div className="notebook-hole" style={{ top: '50%', transform: 'translateY(-50%)' }} />
          <div className="notebook-hole" style={{ bottom: '80px' }} />
        </div>
        {/* Page fold */}
        <div className="page-fold" />

        {/* Content */}
        <div className="relative z-[1]">
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
        </div>
      </div>
    </div>
  );
};

export default Index;
