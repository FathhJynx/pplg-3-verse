import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Shield, Users, FileText, Coins } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface OrgRole {
  title: string;
  name: string;
  icon: LucideIcon;
  tier: "gold" | "silver" | "bronze";
}

const orgRoles: OrgRole[] = [
  { title: "Ketua Murid", name: "TBA", icon: Shield, tier: "gold" },
  { title: "Wakil KM", name: "TBA", icon: Users, tier: "silver" },
  { title: "Sekretaris", name: "TBA", icon: FileText, tier: "bronze" },
  { title: "Bendahara", name: "TBA", icon: Coins, tier: "bronze" },
];

const tierStyles = {
  gold: {
    border: "border-yellow-500/50",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    glow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
    badge: "bg-yellow-500",
  },
  silver: {
    border: "border-gray-400/50",
    bg: "bg-gray-400/10",
    text: "text-gray-300",
    glow: "shadow-[0_0_20px_rgba(156,163,175,0.3)]",
    badge: "bg-gray-400",
  },
  bronze: {
    border: "border-orange-600/50",
    bg: "bg-orange-600/10",
    text: "text-orange-400",
    glow: "shadow-[0_0_15px_rgba(234,88,12,0.3)]",
    badge: "bg-orange-600",
  },
};

const OrganizationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4"
      style={{ perspective: "1500px" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-px bg-primary"
            />
            <span className="text-sm font-body text-primary tracking-[0.3em] uppercase">
              Class Organization
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-px bg-primary"
            />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            STRUKTUR KELAS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground font-body max-w-xl mx-auto"
          >
            Pengurus kelas yang memimpin dan mengorganisir kegiatan XII PPLG 3
          </motion.p>
        </motion.div>

        {/* Cards with 3D scroll effect */}
        <motion.div style={{ x }} className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:justify-center md:flex-wrap">
            {orgRoles.map((role, index) => {
              const styles = tierStyles[role.tier];
              const Icon = role.icon;

              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{
                    y: -15,
                    rotateY: 5,
                    rotateX: -5,
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  className={`
                    flex-shrink-0 snap-center w-72 
                    ${styles.border} ${styles.glow}
                    border-2 bg-card relative overflow-hidden
                    clip-corners-lg transition-all duration-300
                    transform-gpu
                  `}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Top tier badge */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${styles.badge}`} />

                  {/* Content */}
                  <div className="p-6">
                    {/* Icon with float animation */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`w-16 h-16 ${styles.bg} rounded-lg flex items-center justify-center mb-6 ${styles.border} border`}
                    >
                      <Icon className={`w-8 h-8 ${styles.text}`} />
                    </motion.div>

                    {/* Title */}
                    <div className="mb-4">
                      <span
                        className={`text-xs font-display ${styles.text} tracking-wider uppercase`}
                      >
                        {role.tier.toUpperCase()} TIER
                      </span>
                      <h3 className="text-xl font-display font-bold text-foreground mt-1">
                        {role.title}
                      </h3>
                    </div>

                    {/* Name */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-muted/50 p-4 border border-primary/10"
                    >
                      <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
                        Assigned To
                      </div>
                      <div className="text-lg font-display font-semibold text-foreground">
                        {role.name}
                      </div>
                    </motion.div>

                    {/* Decorative elements */}
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 ${styles.bg} ${styles.border} border rounded-full`}
                      />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`flex-1 h-px ${styles.bg}`}
                      />
                      <div
                        className={`w-2 h-2 ${styles.bg} ${styles.border} border rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div
                    className={`absolute top-2 right-2 w-4 h-4 border-r border-t ${styles.border}`}
                  />
                  <div
                    className={`absolute bottom-2 left-2 w-4 h-4 border-l border-b ${styles.border}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrganizationSection;
