import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState, useRef } from "react";

interface Organization3DCardProps {
    role: {
        title: string;
        name: string;
        icon: LucideIcon;
        tier: "gold" | "silver" | "bronze";
    };
    isActive: boolean;
    onClick: () => void;
}

const tierStyles = {
    gold: {
        border: "border-yellow-500/50",
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        glow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
        badge: "bg-yellow-500",
        gradient: "from-yellow-500/20 to-transparent",
    },
    silver: {
        border: "border-gray-400/50",
        bg: "bg-gray-400/10",
        text: "text-gray-300",
        glow: "shadow-[0_0_20px_rgba(156,163,175,0.3)]",
        badge: "bg-gray-400",
        gradient: "from-gray-400/20 to-transparent",
    },
    bronze: {
        border: "border-orange-600/50",
        bg: "bg-orange-600/10",
        text: "text-orange-400",
        glow: "shadow-[0_0_15px_rgba(234,88,12,0.3)]",
        badge: "bg-orange-600",
        gradient: "from-orange-600/20 to-transparent",
    },
};

const Organization3DCard = ({ role, isActive, onClick }: Organization3DCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const styles = tierStyles[role.tier];
    const Icon = role.icon;
    const [hovered, setHovered] = useState(false);

    // Performance optimization: only compute when in view
    const isInView = useInView(ref, { once: false, amount: 0.1 });

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (!isInView) return;
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;
        x.set(event.clientX - cx);
        y.set(event.clientY - cy);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
        setHovered(false);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); // Reduced tilt for stability
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            style={{
                perspective: 1000,
                zIndex: isActive ? 50 : 1,
            }}
            className={`relative cursor-pointer transition-all duration-500 ${isActive ? "scale-105 sm:scale-110" : "scale-100 hover:scale-105"}`}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            onTouchStart={() => setHovered(true)}
            onTouchEnd={onMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: isActive ? 0 : rotateX,
                    rotateY: isActive ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                }}
                className={`w-64 sm:w-72 h-[22rem] sm:h-96 relative bg-card border-2 ${styles.border} ${isActive ? styles.glow : ""} rounded-xl backdrop-blur-sm transition-colors duration-300`}
                animate={{
                    boxShadow: (isActive || hovered) && isInView
                        ? `0 0 40px ${role.tier === 'gold' ? 'rgba(234,179,8,0.4)' : role.tier === 'silver' ? 'rgba(156,163,175,0.4)' : 'rgba(234,88,12,0.4)'}`
                        : "0 0 10px rgba(0,0,0,0.5)",
                }}
            >
                {/* 3D Content Container */}
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-between" style={{ transform: "translateZ(20px)" }}>

                    {/* Header / Tier Badge */}
                    <div className="text-center w-full">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-display font-bold tracking-widest uppercase ${styles.bg} ${styles.text} border ${styles.border}`}>
                            {role.tier} Tier
                        </span>
                    </div>

                    {/* Character/Icon Display */}
                    <motion.div
                        className="relative"
                        animate={{
                            y: (isActive && isInView) ? [0, -10, 0] : 0,
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transform: "translateZ(40px)" }}
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${styles.bg} ${styles.border} border-2 relative overflow-hidden`}>
                            <Icon className={`w-12 h-12 ${styles.text}`} />
                        </div>
                    </motion.div>

                    {/* Info Block */}
                    <div className="text-center w-full bg-black/40 p-4 rounded-lg border border-white/5 backdrop-blur-md" style={{ transform: "translateZ(30px)" }}>
                        <h3 className={`text-2xl font-display font-bold ${styles.text} mb-1`}>{role.title}</h3>
                        <p className="text-lg font-body text-white font-medium">{role.name}</p>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default Organization3DCard;
