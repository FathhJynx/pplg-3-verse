import { motion } from "framer-motion";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    className?: string;
    glitch?: boolean;
}

const SectionHeading = ({ title, subtitle, className = "", glitch = true }: SectionHeadingProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center mb-16 ${className}`}
        >
            {subtitle && (
                <span className="text-[10px] sm:text-sm font-mono text-primary tracking-[0.2em] sm:tracking-[0.3em] uppercase block mb-2">
                    {subtitle}
                </span>
            )}
            <h2 className={`text-2xl sm:text-4xl md:text-6xl font-display font-bold mb-4 relative inline-block ${glitch ? 'glitch' : ''}`} data-text={title}>
                <span className="relative z-10">{title}</span>
                {glitch && (
                    <>
                        <span className="absolute top-0 left-0 -translate-x-1 translate-y-1 text-primary opacity-30 blur-[1px] -z-10">{title}</span>
                        <span className="absolute top-0 left-0 translate-x-1 -translate-y-1 text-secondary opacity-30 blur-[1px] -z-10">{title}</span>
                    </>
                )}
            </h2>
        </motion.div>
    );
};

export default SectionHeading;
