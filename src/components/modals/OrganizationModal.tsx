
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface OrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: {
        title: string;
        name: string;
        icon: LucideIcon;
        tier: "gold" | "silver" | "bronze";
        description?: string;
        image?: string;
    } | null;
}

const tierStyles = {
    gold: {
        border: "border-yellow-500",
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        glow: "shadow-[0_0_50px_rgba(234,179,8,0.5)]",
    },
    silver: {
        border: "border-gray-400",
        bg: "bg-gray-400/10",
        text: "text-gray-300",
        glow: "shadow-[0_0_50px_rgba(156,163,175,0.5)]",
    },
    bronze: {
        border: "border-orange-600",
        bg: "bg-orange-600/10",
        text: "text-orange-400",
        glow: "shadow-[0_0_50px_rgba(234,88,12,0.5)]",
    },
};

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let currentIndex = 0;

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText((prev) => prev + text[currentIndex]);
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 30); // Typing speed

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

const OrganizationModal = ({ isOpen, onClose, role }: OrganizationModalProps) => {
    if (!role) return null;

    const styles = tierStyles[role.tier];
    const Icon = role.icon;

    // Placeholder description if none provided
    const description = role.description || `Role: ${role.title}. Assigned Operator: ${role.name}. 
  Status: Active. Clearance Level: ${role.tier.toUpperCase()}. 
  Mission: Oversee and execute class operations with maximum efficiency.`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        style={{ perspective: 1000 }}
                        className={`
              relative w-full max-w-4xl bg-card/90 
              border-2 ${styles.border} ${styles.glow}
              rounded-lg overflow-hidden shadow-2xl
              flex flex-col md:flex-row
            `}
                    >
                        {/* Character Image Section (Desktop: Left, Mobile: Top) */}
                        <div className="relative w-full md:w-1/3 h-48 md:h-auto bg-black/50 overflow-hidden border-b md:border-b-0 md:border-r border-white/10 group">
                            {role.image ? (
                                <img
                                    src={role.image}
                                    alt={role.name}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <Icon className={`w-20 h-20 ${styles.text} opacity-20`} />
                                </div>
                            )}

                            {/* Image Overlay/Vignette */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent`} />

                            <div className="absolute bottom-4 left-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-black/60 ${styles.text} border ${styles.border}`}>
                                    IMG_REF: {role.tier.toUpperCase()}_01
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col">
                            {/* Header */}
                            <div className={`p-4 border-b ${styles.border} bg-black/40 flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded bg-white/5 border ${styles.border}`}>
                                        <Icon className={`w-5 h-5 ${styles.text}`} />
                                    </div>
                                    <h3 className={`text-xl font-display font-bold ${styles.text} uppercase tracking-wider`}>
                                        {role.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className={`p-1 hover:bg-white/10 rounded transition-colors ${styles.text}`}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 relative flex-1 min-h-[200px]">
                                {/* Background Grid for Tech Feel */}
                                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                                <div className="relative z-10">
                                    <div className="mb-4">
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Operator Identity</span>
                                        <div className="text-2xl font-display font-bold text-foreground typing-cursor">
                                            <TypewriterText text={role.name} delay={200} />
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">Operational Duties</span>
                                        <p className="font-body text-foreground/80 leading-relaxed font-medium">
                                            <TypewriterText text={description} delay={800} />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Status Bar */}
                            <div className={`p-2 border-t ${styles.border} bg-black/40 flex justify-between items-center text-xs font-mono text-muted-foreground`}>
                                <span>SYS.STATUS: ONLINE</span>
                                <span className={styles.text}>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${styles.border}`} />
                        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${styles.border}`} />

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrganizationModal;
