
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Globe, Database, Palette, Gamepad2, Cpu, Terminal, Shield, Award, Calendar } from "lucide-react";
import { api, Student } from "../services/api";

const StudentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchStudent = async () => {
            try {
                const data = await api.getStudentById(id);
                setStudent(data);
            } catch (error) {
                console.error("Failed to fetch student details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-primary font-mono animate-pulse">Loading Profile Data...</div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-display text-red-500 mb-4">ERROR 404: AGENT NOT FOUND</h2>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors">
                    Return to Base
                </button>
            </div>
        );
    }

    const Icon = getSpecialtyIcon(student.specialty);

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-body relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />

            <div className="max-w-7xl mx-auto px-4 py-8 pb-20 relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-sm tracking-widest">BACK TO ROSTER</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Avatar & Quick Stats */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group"
                        >
                            {student.avatar_url ? (
                                <img
                                    src={student.avatar_url}
                                    alt={student.nickname}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon className="w-32 h-32 text-white/10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 break-words">
                                    {student.nickname.toUpperCase()}
                                </h1>
                                <p className="font-mono text-primary tracking-widest text-sm mt-2">{student.role === 'Siswa' ? 'OPERATOR' : student.role.toUpperCase()}</p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-mono uppercase">
                                    <Shield className="w-4 h-4" /> NIS
                                </div>
                                <div className="text-xl font-display">{student.nis}</div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-mono uppercase">
                                    <Globe className="w-4 h-4" /> Agent
                                </div>
                                <div className="text-xl font-display">{student.valorant_agent || 'Unknown'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-sm font-mono text-primary mb-2 tracking-widest">FULL IDENTITY</h2>
                                <div className="text-3xl md:text-5xl font-display font-bold leading-tight mb-6">
                                    {student.full_name}
                                </div>

                                <div className="relative p-6 bg-zinc-900/30 rounded-2xl border-l-2 border-primary">
                                    <Terminal className="w-6 h-6 text-primary mb-4 opacity-50" />
                                    <p className="text-xl md:text-2xl italic font-serif text-zinc-300 leading-relaxed">
                                        "{student.bio_quote || 'No tactical data available.'}"
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <CodeIcon specialty={student.specialty} />
                                    </div>
                                    <h3 className="font-display text-lg">Specialization</h3>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    {student.specialty || 'Generalist'}
                                </div>
                                <p className="text-sm text-muted-foreground">Primary technical focus.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-display text-lg">Joined</h3>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    {new Date(student.created_at).getFullYear()}
                                </div>
                                <p className="text-sm text-muted-foreground">Class of 2024</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CodeIcon = ({ specialty }: { specialty?: string }) => {
    if (!specialty) return <Terminal className="w-5 h-5" />;
    const lower = specialty.toLowerCase();
    if (lower.includes('front')) return <Globe className="w-5 h-5" />;
    if (lower.includes('back')) return <Database className="w-5 h-5" />;
    if (lower.includes('design')) return <Palette className="w-5 h-5" />;
    return <Cpu className="w-5 h-5" />;
};

export default StudentDetail;
