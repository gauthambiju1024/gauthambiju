import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("about");
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setActiveSection(sectionId);
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "about", label: "about" },
    { id: "work", label: "work" },
    { id: "blog", label: "blog", isRoute: true },
    { id: "connect", label: "connect" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 max-w-7xl mx-auto"
    >
      <button
        onClick={() => scrollToSection("about")}
        className="font-handwritten text-2xl font-bold tracking-tight"
        style={{ color: 'hsl(var(--notebook-paper))' }}
      >
        GB.
      </button>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => (item as any).isRoute ? navigate('/blog') : scrollToSection(item.id)}
            className="relative px-4 py-2 font-handwritten text-xl transition-colors duration-300"
            style={{
              color: activeSection === item.id
                ? 'hsl(var(--primary))'
                : 'hsl(var(--notebook-paper) / 0.6)',
            }}
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
