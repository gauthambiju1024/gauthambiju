import { motion } from "framer-motion";
import Globe from "./Globe";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="px-8 md:px-16 pt-6 pb-8 relative overflow-hidden"
    >
      <div className="section-divider mb-6" />

      {/* Globe at bottom */}
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
        >
          <div className="w-full h-full rounded-full overflow-hidden opacity-60">
            <Globe />
          </div>
        </motion.div>
      </div>

      <div className="md:ml-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-handwritten text-base text-card-foreground/30">
          Gautham Biju
        </span>
        <span className="font-handwritten text-sm tracking-widest uppercase text-card-foreground/15">
          {currentYear} All rights reserved
        </span>
      </div>
    </motion.footer>
  );
};

export default Footer;
