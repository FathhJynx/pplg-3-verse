
import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

const GlitchText = ({ text, className = "", as = "span" }: GlitchTextProps) => {
  const Component = motion[as] as any;

  return (
    <div className={`relative inline-block ${className}`}>
      <Component
        className="relative z-10"
        initial={{ opacity: 1 }}
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          transition: {
            duration: 0.2,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: Math.random() * 5 + 2,
          }
        }}
      >
        {text}
      </Component>

      {/* Glitch Layers */}
      <Component
        className="absolute top-0 left-0 w-full h-full text-red-500 opacity-70 z-0 pointer-events-none"
        style={{ clipPath: "inset(45% 0 10% 0)" }}
        animate={{
          x: [0, -3, 3, -1, 0],
          opacity: [0, 0.7, 0.3, 0.7, 0],
          transition: {
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: Math.random() * 3 + 1,
          }
        }}
      >
        {text}
      </Component>
      <Component
        className="absolute top-0 left-0 w-full h-full text-cyan-400 opacity-70 z-0 pointer-events-none"
        style={{ clipPath: "inset(10% 0 45% 0)" }}
        animate={{
          x: [0, 3, -3, 1, 0],
          opacity: [0, 0.7, 0.3, 0.7, 0],
          transition: {
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: Math.random() * 3 + 1,
          }
        }}
      >
        {text}
      </Component>
    </div>
  );
};

export default GlitchText;
