import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface FooterProps {
  scrollContainer?: React.RefObject<HTMLDivElement>;
}

const Footer = ({ scrollContainer }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (scrollContainer?.current) {
      scrollContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="px-8 md:px-16 pt-6 pb-8 relative overflow-hidden"
    >
      <div className="section-divider mb-6" />

      <div className="md:ml-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-serif-i italic text-lg text-card-foreground/35">
            Thanks for visiting ✦
          </span>
          <span className="font-handwritten text-sm tracking-widest uppercase text-card-foreground/15">
            © {currentYear} Gautham Biju
          </span>
        </div>

        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          style={{ border: '1px solid hsl(var(--card-foreground) / 0.1)' }}
        >
          <span className="font-handwritten text-sm text-card-foreground/30 group-hover:text-card-foreground/50 transition-colors">Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 text-card-foreground/25 group-hover:text-card-foreground/50 group-hover:-translate-y-0.5 transition-all duration-300" />
        </button>
      </div>
    </motion.footer>
  );
};

export default Footer;
