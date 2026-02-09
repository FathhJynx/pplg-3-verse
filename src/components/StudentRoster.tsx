import { motion } from "framer-motion";
import { User, ChevronRight } from "lucide-react";

// Generate 32 student placeholders
const students = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `Student ${String(i + 1).padStart(2, "0")}`,
  number: String(i + 1).padStart(2, "0"),
}));

const StudentRoster = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
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
              <div className="w-12 h-px bg-primary" />
              <span className="text-sm font-body text-primary tracking-[0.3em] uppercase">Select Agent</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold">STUDENT ROSTER</h2>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-body">
            <span className="text-primary font-display font-bold text-2xl">32</span>
            <span>Students Available</span>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="group relative"
            >
              <div className="relative bg-card border border-primary/20 overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(0,255,0,0.2)] clip-corners">
                {/* Number badge */}
                <div className="absolute top-0 right-0 bg-primary/20 px-2 py-0.5">
                  <span className="text-[10px] font-display font-bold text-primary">
                    #{student.number}
                  </span>
                </div>

                {/* Avatar area */}
                <div className="aspect-square bg-gradient-to-br from-muted to-background flex items-center justify-center relative overflow-hidden">
                  {/* Default icon */}
                  <User className="w-12 h-12 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Scanlines */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-full" style={{
                      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)"
                    }} />
                  </div>
                </div>

                {/* Name section */}
                <div className="p-2 bg-muted/30 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body font-semibold text-foreground truncate">
                      {student.name}
                    </span>
                    <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            </motion.div>
          ))}
        </div>

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
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-body text-muted-foreground">{stat.label}:</span>
              <span className="text-sm font-display font-bold text-primary">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StudentRoster;
