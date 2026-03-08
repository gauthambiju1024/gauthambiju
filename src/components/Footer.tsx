import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 px-6 md:px-12 lg:px-20"
    >
      <div className="divider-line mb-10" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-sm font-medium text-foreground/30">
          Gautham Biju
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/15">
          {currentYear} All rights reserved
        </span>
      </div>
    </motion.footer>
  );
};

export default Footer;
