import { useState, useEffect, RefObject } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "blog", label: "blog" },
  { id: "connect", label: "connect" },
];

const sectionIds = navItems.map(n => n.id);

interface NavigationProps {
  scrollContainer?: RefObject<HTMLDivElement>;
}

const Navigation = ({ scrollContainer }: NavigationProps) => {
  const [activeSection, setActiveSection] = useState("about");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return;
    const root = scrollContainer?.current ?? null;

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
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
    <nav className="z-50 flex items-center justify-between px-8 md:px-16 py-4">
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
            onClick={() => scrollToSection(item.id)}
            className="relative px-4 py-2 font-handwritten text-xl transition-colors duration-300"
            style={{
              color: activeSection === item.id
                ? 'hsl(var(--primary))'
                : 'hsl(var(--notebook-paper) / 0.5)',
            }}
          >
            {item.label}
            {activeSection === item.id && (
              <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
