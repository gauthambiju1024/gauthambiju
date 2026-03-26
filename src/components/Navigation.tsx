import { useState, useEffect, RefObject } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

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
  scrollContainer?: RefObject<HTMLDivElement>;
}

const Navigation = ({ scrollContainer }: NavigationProps) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isCompact, setIsCompact] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll for compact mode
  useEffect(() => {
    const root = scrollContainer?.current;
    if (!root) return;
    const handleScroll = () => setIsCompact(root.scrollTop > 60);
    root.addEventListener("scroll", handleScroll, { passive: true });
    return () => root.removeEventListener("scroll", handleScroll);
  }, [scrollContainer]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const root = scrollContainer?.current ?? null;
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { root, rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [location.pathname, scrollContainer]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el && scrollContainer?.current) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
