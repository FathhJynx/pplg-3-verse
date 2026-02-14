
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { Star, Award, Crown, Cpu, Scan, Binary } from "lucide-react";
import TiltCard from "../shared/TiltCard";
import StatusTag from "../shared/StatusTag";
import { siteConfig } from "@/config/site";

const TeacherSpotlight = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]); // Reduced range for subtle perf
  const rotateX = useTransform(scrollYProgress, [0, 1], [5, -5]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-4 overflow-hidden bg-zinc-950"
      style={{ perspective: "1500px" }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,150,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,150,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">

        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 text-left"
        >
          <div className="mb-4">
            <StatusTag icon={Scan} text="TARGET_IDENTITY: HOMEROOM_TEACHER" className="border-secondary/30 text-secondary" />
          </div>


          <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-none uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{siteConfig.teacher.nickname.split(' ')[0]} {siteConfig.teacher.nickname.split(' ')[1]}</span>
            <br />
            <span className="text-primary text-glow">{siteConfig.teacher.name.split(' ').slice(2).join(' ')}</span>
          </h2>

          <p className="text-xl text-zinc-400 font-body leading-relaxed mb-8 border-l-2 border-primary/50 pl-6 italic">
            "{siteConfig.teacher.bio}"
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "CLASS", value: siteConfig.name, icon: Binary },
              { label: "ROLE", value: "MENTOR", icon: Crown },
              { label: "STATUS", value: "ONLINE", icon: Cpu },
              { label: "RANK", value: "ELITE", icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 p-4 rounded hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <stat.icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] font-mono tracking-wider">{stat.label}</span>
                </div>
                <div className="text-lg font-bold font-display">{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D Holographic Card */}
        <motion.div
          style={{ y, rotateX, perspective: 1000 }}
          className="flex-1 w-full max-w-md"
        >
          <TiltCard className="w-full">
            <motion.div
              // Removed internal mouse handlers as TiltCard handles them now
              style={{ transformStyle: "preserve-3d" }}
              className="relative aspect-[3/4] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl group"
            >
              {/* Card Border Glow */}
              <div className="absolute inset-0 border border-primary/30 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card Content Layer */}
              <div className="relative h-full w-full bg-zinc-900/80 rounded-xl overflow-hidden border border-white/5 flex flex-col items-center justify-center p-8" style={{ transform: "translateZ(20px)" }}>

                {/* Spinning Ring */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                  <div className="w-[500px] h-[500px] border border-dashed border-primary rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-[400px] h-[400px] border border-dotted border-secondary rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>

                <motion.div
                  style={{ transform: "translateZ(50px)" }}
                  className="w-48 h-48 rounded-full border-4 border-primary/50 p-2 mb-8 relative"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-zinc-800 to-black overflow-hidden flex items-center justify-center relative">
                    <Crown className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]" />

                    {/* Scan Line Animation over Image */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent w-full h-[10%] animate-scan" style={{ animationDuration: '3s' }} />
                  </div>
                </motion.div>

                <motion.div style={{ transform: "translateZ(30px)" }} className="text-center">
                  <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase">{siteConfig.teacher.name}</h3>
                  <div className="inline-block px-3 py-1 bg-primary/20 border border-primary/50 text-primary text-xs font-mono tracking-widest rounded-full animate-pulse">
                    ACCESS GRANTED
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </TiltCard>
        </motion.div>

      </div>
    </section>
  );
};

export default TeacherSpotlight;

