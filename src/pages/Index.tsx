import { motion } from "framer-motion";
import Book from "@/components/Book";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MarqueeText from "@/components/MarqueeText";
import BeliefsSection from "@/components/BeliefsSection";
import WorkSection from "@/components/WorkSection";
import StorySection from "@/components/StorySection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

const Index = () => {
  const pages = [
    {
      id: "about",
      label: "about",
      pageNumber: "page 01",
      content: (
        <>
          <Navigation />
          <HeroSection />
          <div className="section-divider" />
          <MarqueeText />
          <BeliefsSection />
        </>
      ),
    },
    {
      id: "work",
      label: "work",
      pageNumber: "page 02",
      content: (
        <>
          <WorkSection />
          <div className="section-divider" />
          <StorySection />
        </>
      ),
    },
    {
      id: "connect",
      label: "connect",
      pageNumber: "page 03",
      content: (
        <>
          <ConnectSection />
          <Footer />
        </>
      ),
    },
  ];

  return <Book pages={pages} />;
};

export default Index;
