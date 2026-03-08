import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const socialLinks = [
  { name: "Email", icon: Mail, href: "mailto:hello@gauthambiju.com", label: "hello@gauthambiju.com" },
  { name: "GitHub", icon: Github, href: "https://github.com", label: "github.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com", label: "linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com", label: "twitter.com" },
];

const ConnectSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="connect" className="py-16 md:py-24 px-8 md:px-16 relative">
      {/* Tape */}
      <div className="absolute top-4 right-16 tape-strip px-3 py-1 hidden md:block" style={{ transform: 'rotate(-1.5deg)' }}>
        <span className="font-handwritten text-sm text-card-foreground/40">page 03</span>
      </div>

      <div ref={ref} className="md:ml-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-handwritten text-xl mb-3" style={{ color: 'hsl(8 68% 45%)' }}>
            Get in touch
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-card-foreground max-w-md">
            Let's shape the
            <span className="font-serif-i italic font-normal text-card-foreground/45 ml-2">future</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-body text-sm text-card-foreground/40 max-w-md mb-10 leading-relaxed"
        >
          I'm always excited to meet new people and explore interesting projects.
          Don't hesitate to reach out.
        </motion.p>

        {/* Links */}
        <div style={{ borderTop: '1px solid hsl(30 20% 78% / 0.4)' }}>
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.2 + index * 0.07 }}
              className="group flex items-center justify-between py-4 transition-colors duration-300"
              style={{ borderBottom: '1px solid hsl(30 20% 78% / 0.4)' }}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-4 h-4 text-card-foreground/20 group-hover:text-primary transition-colors duration-300" />
                <span className="font-display text-sm font-medium text-card-foreground/55 group-hover:text-card-foreground transition-colors duration-300">
                  {link.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-card-foreground/18 hidden md:block">{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-card-foreground/12 group-hover:text-primary transition-all duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
