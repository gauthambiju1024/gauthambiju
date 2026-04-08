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

interface NavigationProps {
  embedded?: boolean;
}

const Navigation = ({ embedded = false }: NavigationProps) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isCompact, setIsCompact] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track window scroll for compact mode (only when not embedded)
  useEffect(() => {
    if (embedded) return;
    const handleScroll = () => setIsCompact(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [embedded]);

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

  if (embedded) {
    return (
      <nav className="flex items-center justify-between px-0 py-3">
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
  }

  return (
    <motion.nav
      className={`z-50 flex items-center justify-between px-4 md:px-12 transition-all duration-300 ${
        isCompact ? "py-2 backdrop-blur-md bg-background/70" : "py-4"
      }`}
      initial={false}
      animate={{ height: isCompact ? 48 : 56 }}
    >
      <button
        onClick={() => scrollToSection("home")}
        className="font-handwritten text-xl md:text-2xl font-bold tracking-tight"
        style={{ color: 'hsl(var(--notebook-paper))' }}
      >
        GB.
      </button>

      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`relative px-2 md:px-3 py-1.5 font-body text-xs md:text-sm transition-colors duration-300 whitespace-nowrap ${
              isCompact ? "text-[11px]" : ""
            }`}
            style={{
              color: activeSection === item.id
                ? 'hsl(var(--primary))'
                : 'hsl(var(--notebook-paper) / 0.45)',
            }}
          >
            {item.label}
            {activeSection === item.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;
