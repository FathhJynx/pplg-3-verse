import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { User, Code, Palette, Terminal, Gamepad2, Cpu, Database, Globe } from "lucide-react";
import { api, Student } from "../../services/api";
import TiltCard from "../shared/TiltCard";
import SectionHeading from "../shared/SectionHeading";
import { siteConfig } from "@/config/site";

const StudentRoster = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching roster:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const getSpecialtyIcon = (specialty?: string) => {
    if (!specialty) return User;
    const lower = specialty.toLowerCase();
    if (lower.includes('frontend') || lower.includes('web')) return Globe;
    if (lower.includes('backend') || lower.includes('data')) return Database;
    if (lower.includes('design') || lower.includes('ui')) return Palette;
    if (lower.includes('game')) return Gamepad2;
    if (lower.includes('iot') || lower.includes('hardware')) return Cpu;
    return Terminal;
  };

  return (
    <section ref={containerRef} className="py-24 px-4 bg-zinc-950 relative overflow-hidden" id="students">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="CORE_PERSONNEL"
          subtitle={`${siteConfig.name} // DIRECTORY`}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white/5 rounded-xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-4 perspective-1000">
            {students.slice(0, visibleCount).map((student, index) => {
              const Icon = getSpecialtyIcon(student.specialty);
              return (
                <TiltCard key={student.id} onClick={() => navigate(`/student/${student.id}`)} className="group">
                  <div className="p-6 text-center w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl transition-colors group-hover:bg-zinc-900/80 group-hover:border-primary/30" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" style={{ transform: 'translateZ(-20px)' }} />

                    <div className="w-24 h-24 rounded-full bg-zinc-900 overflow-hidden border-2 border-primary/50 mb-6 shadow-[0_0_20px_rgba(0,255,0,0.2)] group-hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all" style={{ transform: 'translateZ(50px)' }}>
                      {student.avatar_url ? (
                        <img
                          src={student.avatar_url}
                          alt={student.nickname}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-2xl mb-1 text-white group-hover:text-primary transition-colors" style={{ transform: 'translateZ(40px)' }}>
                      {student.full_name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4" style={{ transform: 'translateZ(30px)' }}>
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-mono tracking-widest text-muted-foreground">
                        {student.nis}
                      </span>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-mono tracking-widest border border-primary/30">
                        {student.role || 'OPERATOR'}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 line-clamp-2 px-4 italic font-serif transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4" style={{ transform: 'translateZ(20px)' }}>
                      "{student.bio_quote || "No data available."}"
                    </p>

                    <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0" style={{ transform: 'translateZ(60px)' }}>
                      <div className="text-[10px] font-mono text-primary flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
                        ACCESS DATA <Terminal className="w-3 h-3 animate-pulse" />
                      </div>
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-primary/20 group-hover:border-primary/50 transition-colors" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-primary/20 group-hover:border-primary/50 transition-colors" />
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}

        {!loading && visibleCount < students.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 10, students.length))}
              className="px-6 py-2 bg-primary/10 text-primary border border-primary/30 rounded-full font-mono text-sm hover:bg-primary/20 transition-all active:scale-95"
            >
              LOAD MORE DATA [{students.length - visibleCount} REMAINING]
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentRoster;
