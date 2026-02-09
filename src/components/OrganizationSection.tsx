import { motion } from "framer-motion";
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
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-primary" />
            <span className="text-sm font-body text-primary tracking-[0.3em] uppercase">Class Organization</span>
            <div className="w-12 h-px bg-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">STRUKTUR KELAS</h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Pengurus kelas yang memimpin dan mengorganisir kegiatan XII PPLG 3
          </p>
        </motion.div>

        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:justify-center md:flex-wrap">
            {orgRoles.map((role, index) => {
              const styles = tierStyles[role.tier];
              const Icon = role.icon;

              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`
                    flex-shrink-0 snap-center w-72 
                    ${styles.border} ${styles.glow}
                    border-2 bg-card relative overflow-hidden
                    clip-corners-lg transition-all duration-300
                  `}
                >
                  {/* Top tier badge */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${styles.badge}`} />

                  {/* Content */}
                  <div className="p-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${styles.bg} rounded-lg flex items-center justify-center mb-6 ${styles.border} border`}>
                      <Icon className={`w-8 h-8 ${styles.text}`} />
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                      <span className={`text-xs font-display ${styles.text} tracking-wider uppercase`}>
                        {role.tier.toUpperCase()} TIER
                      </span>
                      <h3 className="text-xl font-display font-bold text-foreground mt-1">
                        {role.title}
                      </h3>
                    </div>

                    {/* Name */}
                    <div className="bg-muted/50 p-4 border border-primary/10">
                      <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
                        Assigned To
                      </div>
                      <div className="text-lg font-display font-semibold text-foreground">
                        {role.name}
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className={`w-2 h-2 ${styles.bg} ${styles.border} border rounded-full`} />
                      <div className={`flex-1 h-px ${styles.bg}`} />
                      <div className={`w-2 h-2 ${styles.bg} ${styles.border} border rounded-full`} />
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className={`absolute top-2 right-2 w-4 h-4 border-r border-t ${styles.border}`} />
                  <div className={`absolute bottom-2 left-2 w-4 h-4 border-l border-b ${styles.border}`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationSection;
