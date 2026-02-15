import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface CyberpunkAlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'info' | 'success';
}

const CyberpunkAlertDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "CONFIRM",
    cancelText = "ABORT",
    isLoading = false,
    variant = 'danger'
}: CyberpunkAlertDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                    >
                        {/* Status Bar */}
                        <div className={`h-1 w-full ${variant === 'danger' ? 'bg-red-500' : 'bg-primary'}`} />

                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 py-2 px-4 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 py-2 px-4 text-black text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden group
                                        ${variant === 'danger'
                                            ? 'bg-red-500 hover:bg-red-400'
                                            : 'bg-primary hover:bg-cyan-300'
                                        }
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {isLoading ? (
                                        <span className="animate-pulse">PROCESSING...</span>
                                    ) : (
                                        confirmText
                                    )}
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12" />
                                </button>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-2 right-2 flex gap-1">
                            <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                            <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                        </div>
                        <div className="absolute bottom-2 left-2 text-[8px] text-zinc-700 font-mono">
                            SYS.ALERT.V1
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CyberpunkAlertDialog;
