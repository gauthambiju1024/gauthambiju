import { useSiteContent } from "@/hooks/useSiteData";

const defaultBeliefs = [
  { number: "01", title: "Tirelessly pursue clarity.", body: "The best solutions are often the simplest. Strip away complexity to reveal what truly matters." },
  { number: "02", title: "Obsess over the details.", body: "Every pixel, every interaction, every word contributes to the whole experience." },
  { number: "03", title: "Build with empathy.", body: "Understanding people is the foundation of creating meaningful technology." },
];

const BeliefsSection = () => {
  const { value } = useSiteContent('beliefs', 'items');
  const beliefs = (value as typeof defaultBeliefs | null) ?? defaultBeliefs;

  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div className="md:ml-8">
        <p className="font-handwritten text-xl mb-8">
          <span style={{ color: 'hsl(8 68% 45%)' }}>{beliefs.length} things I strongly believe in</span>
        </p>
        <div className="space-y-8">
          {beliefs.map((belief) => (
            <div key={belief.number} className="group relative pl-10 py-4" style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.3)' }}>
              <span className="absolute left-0 top-4 font-handwritten text-sm text-card-foreground/20">{belief.number}</span>
              <h3 className="font-handwritten text-xl md:text-2xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">{belief.title}</h3>
              <p className="font-handwritten text-base text-card-foreground/45 leading-relaxed max-w-lg">{belief.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeliefsSection;
