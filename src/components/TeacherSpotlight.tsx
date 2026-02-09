import { motion } from "framer-motion";
import { Star, Award, Crown } from "lucide-react";

const TeacherSpotlight = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 diagonal-stripes" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-primary" />
            <span className="text-sm font-body text-primary tracking-[0.3em] uppercase">Homeroom Teacher</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">WALI KELAS</h2>
        </motion.div>

        {/* Teacher card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative bg-card border border-primary/20 clip-corners-lg overflow-hidden">
            {/* Top banner */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
            
            <div className="flex flex-col md:flex-row">
              {/* Profile image section */}
              <div className="relative md:w-1/3 p-8 flex items-center justify-center bg-gradient-to-br from-muted to-background">
                <div className="relative">
                  {/* Rotating border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-dashed border-primary/30 rounded-full"
                  />
                  
                  {/* Avatar placeholder */}
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary/50 flex items-center justify-center pulse-glow">
                    <Crown className="w-20 h-20 text-primary" />
                  </div>
                  
                  {/* Rank badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs font-display font-bold tracking-wider clip-corners">
                    LEGENDARY
                  </div>
                </div>
              </div>

              {/* Info section */}
              <div className="flex-1 p-8 md:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                      IBU EUIS NURSIDAH
                    </h3>
                    <p className="text-primary font-body text-lg tracking-wide">Wali Kelas XII PPLG 3</p>
                  </div>
                  <Award className="w-12 h-12 text-primary hidden md:block" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Role", value: "Homeroom Teacher" },
                    { label: "Subject", value: "Programming" },
                    { label: "Class", value: "XII PPLG 3" },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/50 p-4 border border-primary/10">
                      <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
                        {item.label}
                      </div>
                      <div className="text-sm font-display font-semibold text-foreground">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative pl-4 border-l-2 border-primary/50">
                  <p className="text-muted-foreground font-body italic">
                    "Membimbing generasi programmer masa depan dengan dedikasi dan semangat tinggi."
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
          </div>

          {/* Corner accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-primary" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-primary" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary" />
        </motion.div>
      </div>
    </section>
  );
};

export default TeacherSpotlight;
