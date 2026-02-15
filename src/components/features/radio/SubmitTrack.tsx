
import { useState, useEffect } from "react";
import { Send, Music, User, Search, AlertCircle, Check } from "lucide-react";
import { api } from "@/services/api";
import { searchTracks, SpotifyTrack } from "@/services/spotify";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const SubmitTrack = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [senderName, setSenderName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setSearching(true);
                const results = await searchTracks(searchQuery);
                setSearchResults(results);
                setSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectTrack = (track: SpotifyTrack) => {
        setSelectedTrack(track);
        setSearchQuery(track.name);
        setSearchResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!senderName.trim()) {
            setError("ERR: IDENTITY_REQUIRED. PROTOCOL_HALTED.");
            return;
        }

        if (!selectedTrack) {
            setError("ERR: NO_SIGNAL_SELECTED. PROTOCOL_HALTED.");
            return;
        }

        setLoading(true);
        try {
            await api.submitRadioTrack({
                spotify_url: selectedTrack.external_urls.spotify,
                title: selectedTrack.name,
                artist: selectedTrack.artists.map(a => a.name).join(", "),
                submitted_by: senderName
            });

            toast.success("TRANSMISSION_RECEIVED: Track queued for broadcast.");

            // Reset
            setSearchQuery("");
            setSelectedTrack(null);
            setLoading(false);
            if (onSuccess) onSuccess();

        } catch (err: any) {
            setError(`ERR: UPLOAD_FAILED. ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-black/80 border border-primary/50 rounded-lg font-mono shadow-[0_0_20px_rgba(0,243,255,0.15)] relative z-20">
            <div className="bg-primary/10 px-4 py-2 border-b border-primary/30 flex items-center justify-between rounded-t-lg">
                <span className="text-xs text-primary font-bold tracking-widest">&gt;&gt; UPLINK_TERMINAL</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name Field */}
                <div>
                    <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-tighter">Signal_Origin (Your Name)</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="OPERATOR_NAME"
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded p-3 pl-10 text-white placeholder:text-zinc-700 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
                            required
                        />
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                    </div>
                </div>

                {/* Search Field */}
                <div className="relative">
                    <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-tighter">Frequency_Search (Spotify Library)</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (selectedTrack) setSelectedTrack(null);
                            }}
                            onFocus={() => {
                                if (searchQuery.length > 2 && searchResults.length === 0) {
                                    searchTracks(searchQuery).then(setSearchResults);
                                }
                            }}
                            placeholder="Type artist or song title..."
                            className={`w-full bg-zinc-950/50 border ${selectedTrack ? 'border-primary shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'border-zinc-800'} rounded p-3 pl-10 text-white placeholder:text-zinc-700 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all`}
                        />
                        {searching ? (
                            <div className="absolute right-3 top-3.5">
                                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : selectedTrack ? (
                            <Check className="absolute right-3 top-3.5 w-4 h-4 text-primary animate-in zoom-in" />
                        ) : null}

                        <Search className={`absolute left-3 top-3.5 w-4 h-4 transition-colors ${selectedTrack ? 'text-primary' : 'text-zinc-500 group-focus-within:text-primary'}`} />
                    </div>

                    {/* Results Dropdown */}
                    <AnimatePresence>
                        {searchResults.length > 0 && !selectedTrack && (
                            <motion.div
                                initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                className="absolute z-50 left-0 right-0 mt-2 bg-zinc-950/95 border border-primary/20 rounded shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-72 overflow-y-auto scrollbar-hide divide-y divide-white/5"
                            >
                                {searchResults.map((track) => (
                                    <button
                                        key={track.id}
                                        type="button"
                                        onClick={() => handleSelectTrack(track)}
                                        className="w-full p-3 flex items-center gap-4 hover:bg-primary/10 text-left transition-colors group relative overflow-hidden"
                                    >
                                        <div className="w-12 h-12 shrink-0 overflow-hidden rounded bg-black border border-white/5 relative">
                                            {track.album.images[0] && (
                                                <img src={track.album.images[0].url} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors leading-tight">{track.name}</div>
                                            <div className="text-[10px] text-zinc-500 truncate group-hover:text-zinc-400 font-mono mt-0.5">{track.artists.map(a => a.name).join(", ")}</div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="px-2 py-0.5 rounded border border-primary/30 text-[8px] text-primary font-bold uppercase tracking-widest whitespace-nowrap">Select</div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-500 text-[10px] flex items-center gap-2 pt-2 border-t border-red-500/20"
                    >
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={loading || !selectedTrack}
                    className={`w-full py-3 rounded font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 relative overflow-hidden group ${loading || !selectedTrack
                        ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
                        : "bg-primary text-black hover:bg-cyan-400 border border-primary/50 shadow-[0_0_15px_rgba(0,243,255,0.3)] active:scale-95"
                        }`}
                >
                    {loading ? (
                        <>UPLINKING_SIGNAL...</>
                    ) : (
                        <>
                            INITIATE_BROADCAST <Send className={`w-3 h-3 ${!selectedTrack ? 'opacity-30' : ''}`} />
                        </>
                    )}
                    {!loading && selectedTrack && (
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12 pointer-events-none" />
                    )}
                </button>
            </form>

            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
        </div>
    );
};

export default SubmitTrack;

