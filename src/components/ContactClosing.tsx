import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { useSocialLinks } from "@/hooks/useSiteData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail, Github, Linkedin, Twitter,
};

const defaultLinks = [
  { name: "Email", icon: "Mail", url: "mailto:hello@gauthambiju.com", label: "hello@gauthambiju.com" },
  { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com/in/gauthambiju", label: "in/gauthambiju" },
  { name: "GitHub", icon: "Github", url: "https://github.com/gauthambiju", label: "gauthambiju" },
  { name: "Twitter", icon: "Twitter", url: "https://twitter.com/gauthambiju", label: "@gauthambiju" },
];

const ContactClosing = () => {
  const { links: dbLinks } = useSocialLinks();
  const links = dbLinks.length > 0
    ? dbLinks.map((l) => ({ name: l.name, icon: l.icon, url: l.url, label: l.label ?? "" }))
    : defaultLinks;

  return (
    <section className="py-20 md:py-32" style={{ background: 'hsl(var(--cutting-mat))' }}>
      <div className="px-6 md:px-16 flex items-center gap-3 mb-12">
        <div className="h-px flex-1" style={{ background: 'hsl(var(--ruler-accent) / 0.2)' }} />
        <span className="dimension-label">End Notes</span>
      </div>

      <div className="px-6 md:px-16 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif-display text-3xl md:text-4xl leading-tight mb-6"
            style={{ color: 'hsl(var(--paper))' }}>
            Let's Connect
          </h2>
          <p className="font-body text-base leading-relaxed mb-12"
            style={{ color: 'hsl(var(--paper) / 0.5)' }}>
            I'm always open to conversations about product, technology, and building things that matter.
            If something here resonated, I'd love to hear from you.
          </p>
        </motion.div>

        {/* Ruler divider */}
        <div className="h-px mb-8 max-w-sm mx-auto" style={{ background: 'hsl(var(--ruler-accent) / 0.15)' }} />

        {/* Minimal link rows */}
        <motion.div
          className="space-y-1 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {links.map((link) => {
            const IconComp = iconMap[link.icon] ?? Mail;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-sm"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--mat-grid) / 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <IconComp className="w-4 h-4 text-muted-foreground group-hover:text-ruler-accent transition-colors" />
                <span className="font-mono text-sm transition-colors" style={{ color: 'hsl(var(--paper) / 0.6)' }}>{link.name}</span>
                {link.label && (
                  <span className="ml-auto text-xs font-mono" style={{ color: 'hsl(var(--paper) / 0.25)' }}>{link.label}</span>
                )}
                <ArrowUpRight className="w-3 h-3 transition-colors" style={{ color: 'hsl(var(--ruler-accent) / 0.3)' }} />
              </a>
            );
          })}
        </motion.div>

        {/* Signature */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="inline-block">
            <p className="font-handwritten text-2xl mb-1" style={{ color: 'hsl(var(--ruler-accent) / 0.4)' }}>— GB</p>
            <div className="h-px w-16 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--ruler-accent) / 0.2), transparent)' }} />
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid hsl(var(--mat-grid) / 0.3)' }}>
          <p className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'hsl(var(--paper) / 0.2)' }}>
            Designed & built with intent · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactClosing;
