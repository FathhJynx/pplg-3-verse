import { useEffect, useState } from "react";
import { ArrowUp, Clock, Hash, User } from "lucide-react";
import { api } from "@/services/api";
import VoteButton from "./VoteButton";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import CyberpunkAlertDialog from "@/components/ui/CyberpunkAlertDialog";

interface QueueItem {
    id: string;
    title: string;
    artist: string;
    votes: number;
    submitted_by: string;
    spotify_url: string;
}

const QueueList = ({ refreshTrigger }: { refreshTrigger: number }) => {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        const data = await api.getRadioQueue();
        setQueue(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchQueue();
    }, [refreshTrigger]);

    useEffect(() => {
        // Realtime Subscription
        const channel = supabase
            .channel('radio_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'radio_queue' },
                () => fetchQueue()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Helper to get fingerprint/id
    const getVoterId = () => {
        let id = localStorage.getItem('radio_voter_id');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('radio_voter_id', id);
        }
        return id;
    };

    // We can fetch user's votes to disable buttons properly, 
    // but for now we rely on the click handler optimistic update + error handling.
    // Ideally we would fetch `radio_votes` where voter_id = current.

    // Track action state
    const [actionTrackId, setActionTrackId] = useState<string | null>(null);
    const [isPlayDialogOpen, setIsPlayDialogOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const handlePlayRequest = (trackId: string) => {
        setActionTrackId(trackId);
        setIsPlayDialogOpen(true);
    };

    const confirmPlay = async () => {
        if (!actionTrackId) return;
        setIsActionLoading(true);
        try {
            await api.playRadioTrack(actionTrackId);
            setIsPlayDialogOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsActionLoading(false);
            setActionTrackId(null);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-4">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <span className="text-primary">&gt;</span> TRANSMISSION_QUEUE
                </h3>
                <div className="text-xs font-mono text-zinc-500">
                    {queue.length} PACKETS PENDING
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-zinc-900/50 animate-pulse rounded border border-white/5" />
                    ))}
                </div>
            ) : queue.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded bg-zinc-900/20">
                    <p className="text-zinc-500 font-mono">NO SIGNALS DETECTED. QUEUE EMPTY.</p>
                </div>
            ) : (
                <motion.div layout className="space-y-3">
                    <AnimatePresence>
                        {queue.map((track, index) => (
                            <motion.div
                                layout
                                key={track.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="group relative bg-zinc-900/40 border border-white/5 hover:border-primary/30 p-4 rounded-lg flex items-center justify-between transition-all hover:bg-zinc-900/60"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-display font-bold text-zinc-700 w-8 text-center group-hover:text-primary transition-colors">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">
                                            {track.title}
                                        </div>
                                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                                            {track.artist}
                                        </div>
                                        <div className="text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
                                            <User className="w-3 h-3" /> Submitted by: {track.submitted_by}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayRequest(track.id);
                                        }}
                                        className="p-2 rounded-full hover:bg-white/10 text-zinc-500 hover:text-cyan-400 transition-colors"
                                        title="Play Now"
                                    >
                                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-0.5" />
                                    </button>

                                    <VoteButton
                                        queueId={track.id}
                                        initialVotes={track.votes}
                                    />
                                    <a
                                        href={track.spotify_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-zinc-600 hover:text-green-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ArrowUp className="w-4 h-4 rotate-45" />
                                    </a>
                                </div>

                                {/* Progress bar decoration */}
                                <div
                                    className="absolute bottom-0 left-0 h-[2px] bg-primary/20 transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (track.votes / 10) * 100)}%` }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            <CyberpunkAlertDialog
                isOpen={isPlayDialogOpen}
                onClose={() => setIsPlayDialogOpen(false)}
                onConfirm={confirmPlay}
                title="INITIATE SEQUENCE?"
                description="This will override the current broadcast with this track. Handshake protocol will begin immediately."
                confirmText="PLAY TRACK"
                variant="info"
                isLoading={isActionLoading}
            />
        </div>
    );
};

export default QueueList;
