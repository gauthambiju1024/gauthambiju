import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
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

interface LinkRowProps {
  link: { name: string; icon: string; url: string; label: string };
  index: number;
  scrollYProgress: MotionValue<number>;
}

const LinkRow = ({ link, index, scrollYProgress }: LinkRowProps) => {
  const IconComp = iconMap[link.icon] ?? Mail;
  const start = 0.25 + index * 0.1;
  const end = start + 0.15;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [20, 0]);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ opacity, y, borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }}
      className="group flex items-center justify-between py-4 transition-colors duration-300 relative"
    >
      <div className="flex items-center gap-3">
        <IconComp className="w-4 h-4 text-card-foreground/20 group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
        <span className="font-handwritten text-lg font-medium text-card-foreground/55 group-hover:text-card-foreground transition-colors duration-300">{link.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-handwritten text-sm text-card-foreground/18 hidden md:block">{link.label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-card-foreground/12 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </motion.a>
  );
};

const ConnectSection = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const { links: dbLinks } = useSocialLinks();
  const links = dbLinks.length > 0
    ? dbLinks.map(l => ({ name: l.name, icon: l.icon, url: l.url, label: l.label ?? '' }))
    : defaultLinks;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 0.6"] });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const globeY = useTransform(scrollYProgress, [0, 1], [60, -40]);

  return (
    <section className="py-16 md:py-24 px-8 md:px-16 relative overflow-hidden">
      <motion.div
        style={{ y: globeY }}
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] hidden md:block pointer-events-none"
      >
        <div className="w-full h-full rounded-full overflow-hidden opacity-40">
          <Globe />
        </div>
      </motion.div>

      <div ref={ref} className="md:ml-8">
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-10">
          <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>Get in touch</p>
          <h2 className="font-handwritten text-3xl md:text-5xl font-bold tracking-tight text-card-foreground max-w-md">
            Let's shape the<span className="font-handwritten font-normal text-card-foreground/45 ml-2">future</span>
          </h2>
        </motion.div>

        <motion.p style={{ opacity: descOpacity }} className="font-handwritten text-base text-card-foreground/40 max-w-md mb-10 leading-relaxed">
          I'm always excited to meet new people and explore interesting projects. Don't hesitate to reach out.
        </motion.p>

        <div style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {links.map((link, index) => (
            <LinkRow key={link.name} link={link} index={index} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
