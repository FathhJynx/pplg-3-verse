import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

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
    const styles = tierStyles[role.tier];
    const Icon = role.icon;
    const [hovered, setHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
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

    function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
        setHovered(true);
        const touch = event.touches[0];
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;
        x.set(touch.clientX - cx);
        y.set(touch.clientY - cy);
    }

    function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
        const touch = event.touches[0];
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;
        x.set(touch.clientX - cx);
        y.set(touch.clientY - cy);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
    const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

    return (
        <motion.div
            onClick={onClick}
            style={{
                perspective: 1000,
                zIndex: isActive ? 50 : 1,
            }}
            className={`relative cursor-pointer transition-all duration-500 ${isActive ? "scale-110" : "scale-100 hover:scale-105"}`}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: isActive ? 0 : rotateX,
                    rotateY: isActive ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`w-72 h-96 relative bg-card border-2 ${styles.border} ${isActive ? styles.glow : ""} rounded-xl backdrop-blur-sm transition-colors duration-300`}
                animate={{
                    boxShadow: isActive || hovered
                        ? `0 0 40px ${role.tier === 'gold' ? 'rgba(234,179,8,0.4)' : role.tier === 'silver' ? 'rgba(156,163,175,0.4)' : 'rgba(234,88,12,0.4)'}`
                        : "0 0 10px rgba(0,0,0,0.5)",
                }}
            >
                {/* Holographic Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${styles.gradient} opacity-20 rounded-xl pointer-events-none`} />

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
                            y: isActive ? [0, -10, 0] : 0,
                            filter: isActive ? "brightness(1.2)" : "brightness(1)"
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transform: "translateZ(50px)" }}
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${styles.bg} ${styles.border} border-2 relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45" />
                            <Icon className={`w-12 h-12 ${styles.text}`} />
                        </div>
                        {/* Holograhic Pedestal Effect */}
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-${role.tier === 'gold' ? 'yellow-500' : role.tier === 'silver' ? 'gray-400' : 'orange-600'}/20 blur-lg rounded-full`} />
                    </motion.div>

                    {/* Info Block */}
                    <div className="text-center w-full bg-black/40 p-4 rounded-lg border border-white/5 backdrop-blur-md" style={{ transform: "translateZ(30px)" }}>
                        <h3 className={`text-2xl font-display font-bold ${styles.text} mb-1`}>{role.title}</h3>
                        <div className="h-px w-16 mx-auto bg-white/20 mb-2" />
                        <p className="text-lg font-body text-white font-medium">{role.name}</p>
                    </div>

                </div>

                {/* Tech Decor Corners */}
                <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${styles.border} rounded-tl-lg`} />
                <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${styles.border} rounded-tr-lg`} />
                <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${styles.border} rounded-bl-lg`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${styles.border} rounded-br-lg`} />

            </motion.div>
        </motion.div>
    );
};

export default Organization3DCard;
