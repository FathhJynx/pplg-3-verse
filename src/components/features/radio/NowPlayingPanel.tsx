
import { motion } from "framer-motion";
import { Radio, Activity, Disc, ExternalLink, Square } from "lucide-react";
import { api } from "@/services/api";
import { useState } from "react";
import CyberpunkAlertDialog from "@/components/ui/CyberpunkAlertDialog";

interface NowPlayingProps {
    track: {
        spotify_url: string;
        title: string;
        artist: string;
        started_at: string;
    } | null;
}

const NowPlayingPanel = ({ track }: NowPlayingProps) => {
    const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
    const [isStopping, setIsStopping] = useState(false);

    // Extract Spotify Embed ID from URL
    const getEmbedUrl = (url: string) => {
        try {
            // Handle various spotify url formats
            // https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
            const id = url.split('track/')[1]?.split('?')[0];
            return id ? `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0` : null;
        } catch (e) {
            return null;
        }
    };

    const embedUrl = track ? getEmbedUrl(track.spotify_url) : null;

    const handleStop = async () => {
        setIsStopping(true);
        try {
            await api.stopRadioTrack();
            setIsStopDialogOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsStopping(false);
        }
    };

    return (
        <>
            <div className="relative w-full max-w-4xl mx-auto mb-12">
                {/* Cyberpunk Deco Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                        <Radio className="w-4 h-4" />
                        <span className="text-xs font-mono tracking-[0.2em] font-bold">LIVE_BROADCAST//ON_AIR</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                        <span className="text-[10px] text-red-500 font-mono">REC</span>
                    </div>
                </div>

                {/* Main Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-zinc-900/80 border border-primary/30 rounded-lg overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(0,243,255,0.1)]"
                >
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20 opacity-20" />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                        {/* Left: Info & Viz */}
                        <div className="md:col-span-12 p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 min-h-[100px]">
                            <div>
                                {track ? (
                                    <>
                                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1 truncate">{track.title}</h2>
                                        <p className="text-cyan-400 font-mono text-sm truncate mb-4">&gt;&gt; {track.artist}</p>

                                        <div className="flex flex-wrap gap-2">
                                            <a
                                                href={track.spotify_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full text-[10px] md:text-xs transition-colors"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                <span>OPEN SPOTIFY</span>
                                            </a>

                                            <button
                                                onClick={() => setIsStopDialogOpen(true)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded-full text-[10px] md:text-xs transition-colors"
                                                title="Stop Broadcast"
                                            >
                                                <Square className="w-3 h-3 fill-current" />
                                                <span>STOP SIGNAL</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl md:text-2xl font-display font-bold text-zinc-500 mb-1">OFFLINE</h2>
                                        <p className="text-zinc-600 font-mono text-sm">&gt;&gt; Waiting for signal...</p>
                                    </>
                                )}
                            </div>

                            {/* Audio Visualizer (Fake) */}
                            <div className="flex items-end gap-1 h-16 opacity-50">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: track ? ["20%", "80%", "40%"] : "10%" }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: i * 0.1
                                        }}
                                        className={`w-2 rounded-t-sm ${track ? 'bg-primary' : 'bg-zinc-800'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right: Embed */}
                        <div className="md:col-span-12 bg-black/50 p-4 relative">
                            {embedUrl ? (
                                <iframe
                                    style={{ borderRadius: "12px" }}
                                    src={embedUrl}
                                    width="100%"
                                    height="352"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    className="relative z-10 shadow-lg"
                                />
                            ) : (
                                <div className="w-full h-[352px] bg-zinc-900 rounded-xl border border-dashed border-zinc-700 flex items-center justify-center">
                                    <Disc className="w-12 h-12 text-zinc-800 animate-spin-slow" />
                                </div>
                            )}

                            {/* Status Overlay */}
                            <div className="absolute top-2 right-2 flex gap-1">
                                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-green-500">SIGNAL_STABLE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <CyberpunkAlertDialog
                isOpen={isStopDialogOpen}
                onClose={() => setIsStopDialogOpen(false)}
                onConfirm={handleStop}
                title="TERMINATE SIGNAL?"
                description="This will immediately stop the current broadcast for all tuned-in listeners. Are you sure you want to proceed?"
                confirmText="STOP BROADCAST"
                variant="danger"
                isLoading={isStopping}
            />
        </>
    );
};

export default NowPlayingPanel;
