import { LucideIcon } from "lucide-react";

interface StatusTagProps {
    icon?: LucideIcon;
    text: string;
    className?: string;
    animate?: boolean;
}

const StatusTag = ({ icon: Icon, text, className = "", animate = true }: StatusTagProps) => {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 border border-primary/30 rounded-full bg-primary/5 backdrop-blur-sm ${className}`}>
            {Icon && <Icon className={`w-3.5 h-3.5 text-primary ${animate ? 'animate-pulse' : ''}`} />}
            <span className="text-[10px] font-mono text-primary tracking-widest uppercase">
                {text}
            </span>
        </div>
    );
};

export default StatusTag;
