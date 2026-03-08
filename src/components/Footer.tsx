import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="px-8 md:px-16 pt-6 pb-8"
    >
      <div className="section-divider mb-6" />
      <div className="md:ml-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-handwritten text-base text-card-foreground/30">
          Gautham Biju
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-card-foreground/15">
          {currentYear} All rights reserved
        </span>
      </div>
    </motion.footer>
  );
};

export default Footer;
