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
    <section id="connect" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">Contact</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-lg">
            Let's shape the
            <br />
            <span className="font-serif-i italic font-normal text-foreground/50">future together</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-body text-sm text-foreground/40 max-w-md mb-14 leading-relaxed"
        >
          I'm always excited to meet new people and explore interesting projects.
          Don't hesitate to reach out.
        </motion.p>

        {/* Links as list */}
        <div className="border-t border-foreground/10">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
              className="group flex items-center justify-between py-5 border-b border-foreground/10 transition-colors duration-300 hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <link.icon className="w-4 h-4 text-foreground/25 group-hover:text-primary transition-colors duration-300" />
                <span className="font-display text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors duration-300">
                  {link.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-foreground/20 hidden md:block">{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-foreground/15 group-hover:text-primary transition-all duration-300 translate-y-0.5 group-hover:translate-y-0" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
