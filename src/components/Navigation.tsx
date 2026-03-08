import { useState } from "react";
import { motion } from "framer-motion";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "about", label: "about" },
    { id: "work", label: "work" },
    { id: "connect", label: "connect" },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center gap-8 py-6 font-handwritten text-2xl relative"
    >
      {navItems.map((item, index) => (
        <motion.button
          key={item.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          onClick={() => scrollToSection(item.id)}
          onMouseEnter={() => setHoveredLink(item.id)}
          onMouseLeave={() => setHoveredLink(null)}
          className={`relative px-2 py-1 transition-colors duration-300 ${
            activeSection === item.id ? "text-primary" : "text-card-foreground hover:text-primary"
          }`}
        >
          {item.label}
          
          {/* Animated underline */}
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: activeSection === item.id || hoveredLink === item.id ? 1 : 0,
              rotate: activeSection === item.id ? -1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* Decorative dot */}
          {activeSection === item.id && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
            />
          )}
        </motion.button>
      ))}
    </motion.nav>
  );
};

export default Navigation;
