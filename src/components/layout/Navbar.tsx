
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, Music, Image, Terminal } from "lucide-react";

const navItems = [
    { icon: <Home className="w-5 h-5 md:w-6 md:h-6" />, label: "HOME", path: "/" },
    { icon: <Users className="w-5 h-5 md:w-6 md:h-6" />, label: "CLASS", path: "/#students" },
    { icon: <Image className="w-5 h-5 md:w-6 md:h-6" />, label: "GALLERY", path: "/#gallery" },
    { icon: <Terminal className="w-5 h-5 md:w-6 md:h-6" />, label: "CHAT", path: "/#chat" },
    { icon: <Music className="w-5 h-5 md:w-6 md:h-6" />, label: "SONGFESS", path: "/menfess" },
];

const Navbar = () => {
    const location = useLocation();

    return (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-2 sm:px-4 pointer-events-none">
            <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex justify-between items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Glowing border effect */}
                <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link key={item.label} to={item.path} className="relative group/btn flex-1 flex justify-center">
                            <motion.div
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 sm:p-3 rounded-xl transition-all duration-300 relative ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`}
                            >
                                {item.icon}

                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-0 bg-primary/20 blur-md rounded-xl z-[-1]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.div>

                            {/* Tooltip - Hidden on mobile, shown on md+ */}
                            <div className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/80 border border-white/10 px-2 py-1 rounded text-[10px] font-mono tracking-widest pointer-events-none whitespace-nowrap">
                                {item.label}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default Navbar;
