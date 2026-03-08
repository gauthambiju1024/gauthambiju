import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

const NotebookPage = ({ children, id, bookmarkTop }: { children: React.ReactNode; id?: string; bookmarkTop?: string }) => (
  <div id={id} className="notebook-page notebook-grid relative">
    {/* Spine */}
    <div className="notebook-spine hidden md:block" />
    {/* Margin line */}
    <div className="notebook-margin hidden md:block" />
    {/* Hole punches */}
    <div className="notebook-holes hidden md:block">
      <div className="notebook-hole" style={{ top: '60px' }} />
      <div className="notebook-hole" style={{ top: '50%', transform: 'translateY(-50%)' }} />
      <div className="notebook-hole" style={{ bottom: '60px' }} />
    </div>
    {/* Ribbon bookmark */}
    {bookmarkTop && <div className="ribbon-bookmark" style={{ top: bookmarkTop }} />}
    {/* Page fold */}
    <div className="page-fold" />
    {/* Content */}
    <div className="relative z-[1]">
      {children}
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen desk-pattern" style={{ background: 'hsl(var(--background))' }}>
      {/* Navigation — outside notebook, on dark desk */}
      <Navigation />

      {/* Stacked notebook pages */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 pb-8">
        <NotebookPage id="about" bookmarkTop="40px">
          <HeroSection />
          <div className="section-divider" />
          <MarqueeText />
          <BeliefsSection />
        </NotebookPage>

        <NotebookPage id="work" bookmarkTop="30px">
          <WorkSection />
          <div className="section-divider" />
          <StorySection />
        </NotebookPage>

        <NotebookPage id="connect" bookmarkTop="50px">
          <ConnectSection />
          <Footer />
        </NotebookPage>
      </div>
    </div>
  );
};

export default Index;
