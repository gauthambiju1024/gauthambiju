import { Mail, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import Globe from "./Globe";
import { useSocialLinks } from "@/hooks/useSiteData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail, Github, Linkedin, Twitter,
};

const defaultLinks = [
  { name: "Email", icon: "Mail", url: "mailto:hello@gauthambiju.com", label: "hello@gauthambiju.com" },
  { name: "GitHub", icon: "Github", url: "https://github.com", label: "github.com" },
  { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com", label: "linkedin.com" },
  { name: "Twitter", icon: "Twitter", url: "https://twitter.com", label: "twitter.com" },
];

const ConnectSection = () => {
  const { links: dbLinks } = useSocialLinks();
  const links = dbLinks.length > 0
    ? dbLinks.map(l => ({ name: l.name, icon: l.icon, url: l.url, label: l.label ?? '' }))
    : defaultLinks;

  return (
    <section className="py-16 md:py-24 px-8 md:px-16 relative overflow-hidden">
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] hidden md:block pointer-events-none">
        <div className="w-full h-full rounded-full overflow-hidden opacity-40">
          <Globe />
        </div>
      </div>

      <div className="md:ml-8">
        <div className="mb-10">
          <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>Get in touch</p>
          <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground max-w-md">
            Let's shape the<span className="font-handwritten font-normal text-card-foreground/45 ml-2">future</span>
          </h2>
        </div>

        <p className="font-handwritten text-base text-card-foreground/40 max-w-md mb-10 leading-relaxed">
          I'm always excited to meet new people and explore interesting projects. Don't hesitate to reach out.
        </p>

        <div style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {links.map((link) => {
            const IconComp = iconMap[link.icon] ?? Mail;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }}
                className="group flex items-center justify-between py-4 transition-colors duration-300 relative"
              >
                <div className="flex items-center gap-3">
                  <IconComp className="w-4 h-4 text-card-foreground/20 group-hover:text-primary transition-colors duration-300" />
                  <span className="font-handwritten text-lg font-medium text-card-foreground/55 group-hover:text-card-foreground transition-colors duration-300">{link.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-handwritten text-sm text-card-foreground/18 hidden md:block">{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-card-foreground/12 group-hover:text-primary transition-all duration-300" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
