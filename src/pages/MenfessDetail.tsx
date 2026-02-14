
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Music, Disc } from "lucide-react";
import { api, Menfess } from "../services/api";

const MenfessDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [menfess, setMenfess] = useState<Menfess | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                const data = await api.getMenfessById(id);
                setMenfess(data);
            } catch (error) {
                console.error("Failed to fetch menfess", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-primary animate-pulse">DECODING SIGNAL...</p>
                </div>
            </div>
        );
    }

    if (!menfess) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-display text-red-500 mb-4 glitch" data-text="SIGNAL LOST">SIGNAL LOST</h2>
                <button
                    onClick={() => navigate('/menfess')}
                    className="px-6 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors font-mono text-sm"
                >
                    RETURN TO FEED
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-body relative overflow-hidden flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent opacity-50" />

            <div className="max-w-4xl w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

                {/* Left: Message Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <button
                        onClick={() => navigate('/menfess')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-xs tracking-widest">BACK</span>
                    </button>

                    <div className="bg-zinc-900/80 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Disc className="w-24 h-24 animate-spin-slow" />
                        </div>

                        <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                            <div>
                                <div className="text-xs font-mono text-muted-foreground mb-1">RECIPIENT</div>
                                <div className="text-lg font-bold text-white tracking-wide">{menfess.recipient_name}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-mono text-muted-foreground mb-1">DATE</div>
                                <div className="text-sm font-bold text-white">{new Date(menfess.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="mb-8 relative z-10">
                            <Music className="w-8 h-8 text-primary mb-4 opacity-50" />
                            <p className="text-xl md:text-2xl font-serif italic text-zinc-200 leading-relaxed">
                                "{menfess.message}"
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <span className="font-mono text-sm text-pink-400 font-bold">SENDER: {menfess.sender_name}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Music Player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    {menfess.spotify_track_id ? (
                        <div className="bg-black/50 p-4 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                            {/* CRT Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none z-20" />

                            <div className="relative z-10 rounded-2xl overflow-hidden bg-black shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${menfess.spotify_track_id}?utm_source=generator&theme=0`}
                                    width="100%"
                                    height="352"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    className="block"
                                />
                            </div>

                            <div className="mt-4 flex justify-between items-center px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-mono text-green-500 tracking-widest">SYSTEM ONLINE</span>
                                </div>
                                <span className="text-xs font-mono text-zinc-500">AUDIO OUTPUT ACTIVE</span>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-square bg-zinc-900/50 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <Music className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-mono text-sm">NO AUDIO FRAGMENT ATTACHED</p>
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default MenfessDetail;
