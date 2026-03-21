import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "blog", label: "blog" },
  { id: "connect", label: "connect" },
];

interface NavigationProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

const Navigation = ({ activeSection = "about", onNavigate }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // After navigating home, the flip book will start at page 0
      return;
    }
    onNavigate?.(sectionId);
  };

  return (
    <nav className="z-50 flex items-center justify-between px-8 md:px-16 py-4">
      <button
        onClick={() => handleClick("about")}
        className="font-handwritten text-2xl font-bold tracking-tight"
        style={{ color: 'hsl(var(--notebook-paper))' }}
      >
        GB.
      </button>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
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
