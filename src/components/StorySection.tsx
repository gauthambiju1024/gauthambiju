import { useSiteContent } from "@/hooks/useSiteData";

const defaultStats = [
  { value: "3+", label: "Years" },
  { value: "10+", label: "Projects" },
  { value: "100%", label: "Passion" },
];

const StorySection = () => {
  const { value: storyData } = useSiteContent('story', 'main');
  const { value: statsData } = useSiteContent('story', 'stats');

  const story = storyData as { heading?: string; body?: string } | null;
  const stats = (statsData as typeof defaultStats | null) ?? defaultStats;

  return (
    <section className="py-16 md:py-24 px-8 md:px-16">
      <div className="md:ml-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
          <div className="md:sticky md:top-24">
            <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>
              Background
            </p>
            <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground">
              My
              <span className="font-handwritten font-normal text-card-foreground/45 ml-2">journey</span>
            </h2>
          </div>

          <div className="space-y-5">
            <p className="font-handwritten text-xl md:text-2xl text-card-foreground/55 leading-relaxed">
              {story?.heading ?? "From curiosity to creation."}
            </p>
            <p className="font-handwritten text-base text-card-foreground/40 leading-relaxed">
              {story?.body ?? "Every project, every line of code, every design decision has been a step in a journey of learning, growing, and building things that matter. I believe the best work comes from genuine curiosity and an unwillingness to settle for \"good enough.\""}
            </p>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-6" style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="font-handwritten text-3xl md:text-4xl font-bold block" style={{ color: 'hsl(8 68% 45%)' }}>
                    {stat.value}
                  </span>
                  <span className="font-handwritten text-sm tracking-widest uppercase text-card-foreground/30">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
