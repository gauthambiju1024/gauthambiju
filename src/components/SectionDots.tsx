import { motion } from "framer-motion";

const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "blog", label: "Blog" },
  { id: "connect", label: "Connect" },
];

interface SectionDotsProps {
  activeSection: string;
  onDotClick: (id: string) => void;
}

const SectionDots = ({ activeSection, onDotClick }: SectionDotsProps) => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onDotClick(section.id)}
          className="group relative flex items-center"
          aria-label={`Go to ${section.label}`}
        >
          {/* Label */}
          <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-handwritten text-xs text-card-foreground/50 whitespace-nowrap pointer-events-none"
            style={{ color: 'hsl(var(--notebook-paper) / 0.5)' }}
          >
            {section.label}
          </span>
          {/* Dot */}
          <motion.div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: activeSection === section.id
                ? 'hsl(var(--primary))'
                : 'hsl(var(--notebook-paper) / 0.2)',
            }}
            animate={{
              scale: activeSection === section.id ? 1.4 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </button>
      ))}
    </div>
  );
};

export default SectionDots;
