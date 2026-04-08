import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "thinking", label: "Thinking" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

const sectionIds = navItems.map(n => n.id);

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Intersection observer for active section
  useEffect(() => {
    if (location.pathname !== '/') return;
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { root: null, rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed left-0 right-0 z-40 flex items-center justify-between px-4 md:px-12 py-2 backdrop-blur-md"
      style={{
        top: 28,
        background: "hsl(var(--background) / 0.8)",
        borderBottom: "1px solid hsl(220 15% 40% / 0.1)",
        height: 44,
      }}
    >
      <button
        onClick={() => scrollToSection("home")}
        className="font-handwritten text-xl font-bold tracking-tight"
        style={{ color: 'hsl(40 30% 85%)' }}
      >
        GB.
      </button>

      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="relative px-2 md:px-3 py-1.5 font-body text-xs transition-colors duration-300 whitespace-nowrap"
            style={{
              color: activeSection === item.id
                ? 'hsl(40 30% 85%)'
                : 'hsl(0 0% 100% / 0.3)',
            }}
          >
            {item.label}
            {activeSection === item.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full"
                style={{ background: 'hsl(40 30% 85%)' }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
