import { motion } from "framer-motion";
import GlitchText from "./GlitchText";
import GeometricBackground from "./GeometricBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GeometricBackground />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
      
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-primary/50" />

      <div className="relative z-10 text-center px-4">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1 border border-primary/50 text-primary text-sm font-body tracking-[0.3em] uppercase">
            Class Portfolio
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-wider">
            <GlitchText text="XII PPLG 3" className="text-neon text-primary" />
          </h1>
        </motion.div>

        {/* School name */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground/90 tracking-wide">
            SMKN 4 TASIKMALAYA
          </h2>
        </motion.div>

        {/* Cohort badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="clip-corners bg-muted px-8 py-3 border border-primary/30">
              <span className="text-lg md:text-xl font-display font-semibold text-primary tracking-[0.2em]">
                ANGKATAN 2023
              </span>
            </div>
            {/* Glowing corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary/50" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/50" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary/50" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary/50" />
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex justify-center gap-8 md:gap-16"
        >
          {[
            { label: "STUDENTS", value: "32" },
            { label: "COHORT", value: "2023" },
            { label: "MAJOR", value: "PPLG" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="text-3xl md:text-5xl font-display font-bold text-primary mb-1"
              >
                {stat.value}
              </motion.div>
              <div className="text-xs md:text-sm font-body text-muted-foreground tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-body text-muted-foreground tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
