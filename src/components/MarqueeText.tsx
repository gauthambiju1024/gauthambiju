import { useSiteContent } from "@/hooks/useSiteData";

const defaultItems = ["Developer", "Designer", "Creator", "Problem Solver", "Tech Enthusiast"];

const MarqueeText = () => {
  const { value } = useSiteContent('marquee', 'items');
  const items = (value as string[] | null) ?? defaultItems;

  return (
    <div
      className="py-5 overflow-hidden group"
      style={{ borderTop: '1px solid hsl(30 20% 78% / 0.5)', borderBottom: '1px solid hsl(30 20% 78% / 0.5)' }}
    >
      <div
        className="marquee-track group-hover:[animation-play-state:paused]"
      >
        {[...items, ...items, ...items].map((item, index) => (
          <span key={index} className="flex items-center gap-6 mx-6 whitespace-nowrap">
            <span className="font-handwritten text-xl md:text-2xl text-card-foreground/20">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'hsl(8 68% 45% / 0.3)' }} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
