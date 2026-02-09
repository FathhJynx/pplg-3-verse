import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING SYSTEM...");

  useEffect(() => {
    const statuses = [
      "INITIALIZING SYSTEM...",
      "LOADING ASSETS...",
      "CONNECTING TO SERVER...",
      "PREPARING INTERFACE...",
      "SYSTEM READY",
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus("SYSTEM READY");
          setTimeout(onComplete, 500);
          return 100;
        }

        // Update status based on progress
        const statusIndex = Math.floor((newProgress / 100) * (statuses.length - 1));
        setStatus(statuses[statusIndex]);
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      
      {/* Animated circles */}
      <motion.div
        className="absolute w-96 h-96 border border-primary/20 rounded-full"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-72 h-72 border border-primary/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-48 h-48 border-2 border-primary/40 rounded-full"
        animate={{ rotate: 360, scale: [1, 0.9, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Center content */}
      <div className="relative z-10 text-center">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-display font-black text-primary text-neon tracking-wider">
            XII PPLG 3
          </h1>
          <p className="text-sm font-body text-muted-foreground tracking-[0.3em] mt-2">
            SMKN 4 TASIKMALAYA
          </p>
        </motion.div>

        {/* Loading bar container */}
        <div className="w-80 mx-auto">
          {/* Progress bar */}
          <div className="relative h-2 bg-muted border border-primary/30 clip-corners overflow-hidden mb-4">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Status text */}
          <div className="flex justify-between items-center">
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-body text-primary tracking-wider"
            >
              {status}
            </motion.span>
            <span className="text-xs font-display font-bold text-primary">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-4"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/50 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/50" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="w-full h-full"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
