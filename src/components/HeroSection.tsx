import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import GlitchText from "./GlitchText";
import GeometricBackground from "./GeometricBackground";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // 3D Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <GeometricBackground />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Corner decorations with parallax */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-primary/50"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-primary/50"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-primary/50"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-primary/50"
      />

      <motion.div
        style={{ y: y2, scale, opacity, rotateX }}
        className="relative z-10 text-center px-4"
      >
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
          transition={{ duration: 0.8, delay: 0.5 }}
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
          transition={{ duration: 0.6, delay: 0.7 }}
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
          transition={{ duration: 0.6, delay: 0.9 }}
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
          transition={{ duration: 0.8, delay: 1.1 }}
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
                transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-body text-muted-foreground tracking-widest">
            SCROLL
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
