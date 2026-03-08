import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "connect", label: "Connect" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-foreground/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <button
          onClick={() => scrollToSection("about")}
          className="font-display font-semibold text-foreground tracking-tight text-lg"
        >
          GB
        </button>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                activeSection === item.id
                  ? "text-primary"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-4 right-4 h-px bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
