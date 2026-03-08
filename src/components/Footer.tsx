import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-10 px-8 text-center relative"
    >
      {/* Top decorative border */}
      <div className="doodle-divider mb-8" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <p className="font-handwritten text-2xl text-muted-foreground inline-flex items-center gap-2 justify-center flex-wrap">
          Made with
          <motion.span 
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          >
            <Coffee className="w-4 h-4 text-primary" />
          </motion.span>
          &
          <motion.span 
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2, delay: 0.3 }}
          >
            <Heart className="w-4 h-4 text-primary fill-primary" />
          </motion.span>
          by Gautham Biju
        </p>
        
        <p className="font-body text-sm text-muted-foreground/60">
          © {currentYear} All rights reserved
        </p>
        
        {/* Decorative signature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <svg 
            viewBox="0 0 100 30" 
            className="w-24 h-8 mx-auto text-primary/30"
          >
            <motion.path
              d="M10,20 Q20,5 35,15 T60,10 Q75,5 90,15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
