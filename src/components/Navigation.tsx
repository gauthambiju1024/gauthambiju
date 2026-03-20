import { useState, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = scrollContainer?.current;
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 20);
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
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
    setMobileOpen(false);
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="z-50 flex items-center justify-between px-8 md:px-16 py-4 transition-all duration-300"
      style={{
        background: 'transparent',
        borderBottom: scrolled ? '1px solid hsl(var(--notebook-paper) / 0.08)' : '1px solid transparent',
      }}
    >
      <button
        onClick={() => scrollToSection("about")}
        className="font-serif-i italic text-2xl font-bold tracking-tight"
        style={{ color: 'hsl(var(--notebook-paper))' }}
      >
        GB.
      </button>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="relative px-4 py-2 font-serif-i italic text-xl transition-colors duration-300"
            style={{
              color: activeSection === item.id
                ? 'hsl(var(--primary))'
                : 'hsl(var(--notebook-paper) / 0.5)',
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

        <button
          onClick={() => scrollToSection("connect")}
          className="ml-4 px-5 py-1.5 rounded-full font-serif-i italic text-base transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            border: '1px solid hsl(var(--notebook-paper) / 0.25)',
            color: 'hsl(var(--notebook-paper) / 0.8)',
          }}
        >
          Let's Talk
        </button>
      </div>

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 transition-colors"
          style={{ color: 'hsl(var(--notebook-paper) / 0.7)' }}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 z-50 py-4 px-8 flex flex-col gap-2"
            style={{ background: 'hsl(var(--background) / 0.97)', backdropFilter: 'blur(12px)' }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-serif-i italic text-xl py-2 text-left transition-colors duration-200"
                style={{
                  color: activeSection === item.id
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--notebook-paper) / 0.5)',
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("connect")}
              className="mt-2 px-5 py-2 rounded-full font-serif-i italic text-base self-start transition-all duration-300"
              style={{
                border: '1px solid hsl(var(--notebook-paper) / 0.25)',
                color: 'hsl(var(--notebook-paper) / 0.8)',
              }}
            >
              Let's Talk
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
