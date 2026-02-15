
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Radio } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { api } from "@/services/api";
import NowPlayingPanel from "./NowPlayingPanel";
import QueueList from "./QueueList";
import SubmitTrack from "./SubmitTrack";
import { motion } from "framer-motion";

const RadioSection = () => {
    const [nowPlaying, setNowPlaying] = useState<any>(null);
    const [triggerQueueRefresh, setTriggerQueueRefresh] = useState(0);

    const fetchNowPlaying = async () => {
        const data = await api.getRadioNowPlaying();
        setNowPlaying(data);
    };

    useEffect(() => {
        fetchNowPlaying();

        // Subscribe to Now Playing changes
        const channel = supabase
            .channel('radio_now_playing_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'radio_now_playing' },
                () => fetchNowPlaying()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-display">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black z-0" />
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 z-50 animate-gradient-x" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-12">
                    <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-sm tracking-widest">RETURN_TO_BASE</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-primary animate-pulse" />
                        <h1 className="text-2xl font-bold tracking-tighter">CLASS_RADIO<span className="text-primary">.FM</span></h1>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto">
                    <NowPlayingPanel track={nowPlaying} />

                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left: Queue */}
                        <div className="lg:col-span-7 order-2 lg:order-1">
                            <QueueList refreshTrigger={triggerQueueRefresh} />
                        </div>

                        {/* Right: Submit */}
                        <div className="lg:col-span-5 order-1 lg:order-2">
                            <div className="sticky top-8">
                                <SubmitTrack onSuccess={() => setTriggerQueueRefresh(prev => prev + 1)} />

                                <div className="mt-8 p-4 border border-zinc-800 rounded bg-zinc-900/50 text-xs font-mono text-zinc-500 space-y-2">
                                    <p>&gt;&gt; <span className="text-primary">INSTRUCTIONS:</span></p>
                                    <p>1. Enter your Operator ID (Name).</p>
                                    <p>2. Search for tracks in Uplink Terminal.</p>
                                    <p>3. Select signal for verification.</p>
                                    <p>4. Vote for priority transmission.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadioSection;
