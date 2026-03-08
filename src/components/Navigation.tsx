import { useState } from "react";
import { motion } from "framer-motion";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("about");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "about", label: "about" },
    { id: "work", label: "work" },
    { id: "connect", label: "connect" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-between px-8 md:px-16 py-6 relative z-10"
    >
      <button
        onClick={() => scrollToSection("about")}
        className="font-handwritten text-2xl font-bold tracking-tight text-primary"
      >
        GB.
      </button>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`relative px-4 py-2 font-handwritten text-xl transition-colors duration-300 ${
              activeSection === item.id
                ? "text-primary"
                : "text-card-foreground/50 hover:text-card-foreground"
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <motion.div
                layoutId="nav-underline"
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;
