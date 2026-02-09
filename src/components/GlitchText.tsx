import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

const GlitchText = ({ text, className = "", as: Component = "span" }: GlitchTextProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Component
        className={`glitch font-display ${className}`}
        data-text={text}
      >
        {text}
      </Component>
    </motion.div>
  );
};

export default GlitchText;
