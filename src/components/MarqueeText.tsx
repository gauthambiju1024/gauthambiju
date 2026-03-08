const items = ["Developer", "Designer", "Creator", "Problem Solver", "Tech Enthusiast"];

const MarqueeText = () => {
  return (
    <div className="py-8 border-y border-foreground/5 overflow-hidden">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span key={index} className="flex items-center gap-8 mx-8 whitespace-nowrap">
            <span className="font-display text-2xl md:text-3xl font-light tracking-tight text-foreground/15">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
