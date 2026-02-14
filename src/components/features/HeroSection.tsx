
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Zap, Triangle, Circle, Hexagon } from "lucide-react";
import GlitchText from "../shared/GlitchText";
import ParticleVortex from "../shared/ParticleVortex";
import TiltCard from "../shared/TiltCard";
import { siteConfig } from "@/config/site";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax & Transform
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black perspective-1000"
    >
      {/* Background Layer */}
      <ParticleVortex />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black z-[1]" />

      {/* Grid Floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh] bg-[linear-gradient(transparent_0%,rgba(0,243,255,0.1)_100%)] opacity-50 z-[0]"
        style={{ transform: "perspective(500px) rotateX(60deg) translateY(100px) scale(2)" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,0,153,0.1)_25%,rgba(255,0,153,0.1)_26%,transparent_27%,transparent_74%,rgba(255,0,153,0.1)_75%,rgba(255,0,153,0.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,243,255,0.1)_25%,rgba(0,243,255,0.1)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.1)_75%,rgba(0,243,255,0.1)_76%,transparent_77%,transparent)] bg-[size:50px_50px]" />
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y, opacity, rotateX, rotateY }}
        className="relative z-10 text-center px-4 max-w-5xl"
      >
        {/* Overhead HUD Elements */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-primary/50" />
        <div className="flex justify-center gap-4 mb-4 text-[10px] font-mono tracking-[0.5em] text-cyan-400 opacity-70">
          <span>SYS.ONLINE</span>
          <span>::</span>
          <span>V.{siteConfig.version}</span>
        </div>

        {/* Main Title Group */}
        <div className="relative mb-6">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
          >
            <div className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 absolute inset-0 transform translate-x-1 translate-y-1 opacity-30 blur-sm">PPLG</span>
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">PPLG</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-cyan-500 animate-gradient-x bg-[length:200%_auto]">3</span>
              <span className="text-cyan-400 font-outline-1 sm:font-outline-2 md:font-outline-3">VERSE</span>
            </div>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-4 opacity-50"
          />
        </div>

        {/* Subtitle / School */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <Hexagon className="w-4 h-4 text-cyan-500 animate-spin-slow" />
          <h2 className="text-md md:text-xl font-mono text-zinc-300 tracking-wider uppercase">
            {siteConfig.school} <span className="text-primary font-bold">//</span> COHORT {siteConfig.cohort}
          </h2>
          <Hexagon className="w-4 h-4 text-cyan-500 animate-spin-slow" />
        </motion.div>

        {/* Action Modules */}
        <TiltCard className="inline-block">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <motion.button
              onClick={() => navigate('/menfess')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-zinc-900 border border-primary/50 text-white font-mono text-sm tracking-widest overflow-hidden md:w-auto w-full"
            >
              <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12" />
              <div className="relative flex items-center justify-center gap-3">
                <Music className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                <span>OPEN_SONGFESS_PROTOCOL</span>
              </div>
              {/* Corner Accents */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-left"
            >
              {siteConfig.stats.map((stat, i) => {
                const icons = [Triangle, Circle, Hexagon];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="flex items-center gap-3 text-zinc-500 group cursor-default">
                    <Icon className="w-8 h-8 stroke-1 text-zinc-800 group-hover:text-cyan-500 transition-colors" />
                    <div>
                      <div className="text-xs font-mono">{stat.label}_UNIT</div>
                      <div className="text-lg font-bold text-zinc-300 group-hover:text-white transition-colors">{stat.value}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Decorative Overlays */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="flex flex-col gap-2">
          <div className="w-24 h-1 bg-primary/20" />
          <div className="w-12 h-1 bg-cyan-500/20" />
          <div className="w-36 h-1 bg-purple-500/20" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

