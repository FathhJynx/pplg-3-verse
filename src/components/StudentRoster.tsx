import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { User, ChevronRight } from "lucide-react";

// Generate 32 student placeholders
const students = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `Student ${String(i + 1).padStart(2, "0")}`,
  number: String(i + 1).padStart(2, "0"),
}));

const StudentRoster = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden"
      style={{ perspective: "2000px" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                className="h-px bg-primary"
              />
              <span className="text-sm font-body text-primary tracking-[0.3em] uppercase">
                Select Agent
              </span>
            </div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-display font-bold"
            >
              STUDENT ROSTER
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-muted-foreground font-body"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-primary font-display font-bold text-2xl"
            >
              32
            </motion.span>
            <span>Students Available</span>
          </motion.div>
        </motion.div>

        {/* Bento grid with parallax */}
        <motion.div style={{ y }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: index * 0.02,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 5,
                  rotateX: -5,
                  zIndex: 20,
                  transition: { duration: 0.2 },
                }}
                className="group relative transform-gpu"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative bg-card border border-primary/20 overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] clip-corners">
                  {/* Number badge */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.02 }}
                    className="absolute top-0 right-0 bg-primary/20 px-2 py-0.5"
                  >
                    <span className="text-[10px] font-display font-bold text-primary">
                      #{student.number}
                    </span>
                  </motion.div>

                  {/* Avatar area */}
                  <div className="aspect-square bg-gradient-to-br from-muted to-background flex items-center justify-center relative overflow-hidden">
                    {/* Default icon */}
                    <User className="w-12 h-12 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />

                    {/* Hover overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-primary/10"
                    />

                    {/* Scanlines */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
                        }}
                      />
                    </div>

                    {/* Glowing effect on hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={false}
                      animate={{
                        background: [
                          "radial-gradient(circle at 50% 50%, rgba(0,255,0,0.1) 0%, transparent 50%)",
                          "radial-gradient(circle at 50% 50%, rgba(0,255,0,0.2) 0%, transparent 70%)",
                          "radial-gradient(circle at 50% 50%, rgba(0,255,0,0.1) 0%, transparent 50%)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Name section */}
                  <div className="p-2 bg-muted/30 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-body font-semibold text-foreground truncate">
                        {student.name}
                      </span>
                      <motion.div
                        initial={{ x: -5, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                      >
                        <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom glow on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom info bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-8"
        >
          {[
            { label: "Total Members", value: "32" },
            { label: "Class", value: "XII PPLG 3" },
            { label: "Major", value: "PPLG" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <span className="text-sm font-body text-muted-foreground">
                {stat.label}:
              </span>
              <span className="text-sm font-display font-bold text-primary">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StudentRoster;
