
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Send, Search, Disc, Loader2, Sparkles, Terminal } from 'lucide-react';
import { searchTracks, SpotifyTrack } from '../../services/spotify';
import { api } from '../../services/api';
import GlitchText from '../shared/GlitchText';

interface CreateMenfessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateMenfessModal = ({ isOpen, onClose, onSuccess }: CreateMenfessModalProps) => {
    const [step, setStep] = useState<'compose' | 'music'>('compose');
    const [message, setMessage] = useState('');
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);

    // Search State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SpotifyTrack[]>([]);
    const [searching, setSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSearching(true);
        const tracks = await searchTracks(query);
        setResults(tracks);
        setSearching(false);
    };

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setSubmitting(true);
        try {
            await api.createMenfess({
                message,
                sender_name: sender || 'Anonymous',
                recipient_name: recipient || 'Everyone',
                spotify_track_id: selectedTrack?.id,
                spotify_track_name: selectedTrack?.name,
                spotify_artist_name: selectedTrack?.artists[0].name,
                spotify_image_url: selectedTrack?.album.images[0]?.url
            });
            onSuccess();
            onClose();
            // Reset form
            setMessage('');
            setSender('');
            setRecipient('');
            setSelectedTrack(null);
            setStep('compose');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-black/80 border border-primary/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,255,0,0.1)] relative"
            >
                {/* Terminal Bar */}
                <div className="flex justify-between items-center p-3 bg-zinc-900/80 border-b border-primary/20">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-xs font-mono text-zinc-500">ROOT@SONGFESS:~</span>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 relative">
                    {/* Decorative lines */}
                    <div className="absolute top-0 left-6 w-px h-full bg-white/5 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {step === 'compose' ? (
                            <motion.div
                                key="compose"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4 pl-6">
                                    <div className="font-mono text-xs text-primary mb-4 pb-2 border-b border-white/5">
                                        &gt; INITIATING UPLOAD SEQUENCE...
                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-mono text-primary/70 mb-1 block tracking-wider">SOURCE_ID</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    maxLength={20}
                                                    value={sender}
                                                    onChange={e => setSender(e.target.value)}
                                                    placeholder="Anonymous"
                                                    className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:border-primary outline-none font-mono placeholder:text-zinc-700 transition-colors"
                                                />
                                                <div className="absolute bottom-0 left-0 w-0 h-px bg-primary group-focus-within:w-full transition-all duration-300" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono text-primary/70 mb-1 block tracking-wider">TARGET_ID</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    maxLength={20}
                                                    value={recipient}
                                                    onChange={e => setRecipient(e.target.value)}
                                                    placeholder="Everyone"
                                                    className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:border-primary outline-none font-mono placeholder:text-zinc-700 transition-colors"
                                                />
                                                <div className="absolute bottom-0 left-0 w-0 h-px bg-primary group-focus-within:w-full transition-all duration-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-mono text-primary/70 mb-1 block tracking-wider">DATA_PACKET</label>
                                        <div className="relative">
                                            <textarea
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                placeholder="Enter transmission content..."
                                                className="w-full h-32 bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:border-primary outline-none resize-none font-mono leading-relaxed"
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] text-zinc-600 font-mono">
                                                {message.length} CHARS
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTrack && (
                                        <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-primary/20 rounded relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                            <img src={selectedTrack.album.images[0]?.url} alt="" className="w-10 h-10 rounded relative z-10" />
                                            <div className="flex-1 min-w-0 relative z-10">
                                                <div className="text-sm font-bold text-white truncate font-mono">{selectedTrack.name}</div>
                                                <div className="text-xs text-primary truncate font-mono">{selectedTrack.artists[0].name}</div>
                                            </div>
                                            <button onClick={() => setSelectedTrack(null)} className="relative z-10 p-2 hover:bg-red-500/10 rounded-full transition-colors group/del">
                                                <X className="w-4 h-4 text-zinc-500 group-hover/del:text-red-500" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setStep('music')}
                                            className="px-4 py-2 border border-dashed border-zinc-700 hover:border-primary text-zinc-500 hover:text-primary rounded text-xs font-mono flex items-center gap-2 transition-all uppercase tracking-wider"
                                        >
                                            <Music className="w-3 h-3" />
                                            {selectedTrack ? 'Mod_Audio' : 'Add_Audio'}
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!message.trim() || submitting}
                                            className="flex-1 bg-primary text-black font-bold rounded hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-xs font-mono flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                                        >
                                            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                            INITIATE_TRANSMISSION
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Music Search Step */
                            <motion.div
                                key="music"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-[400px] flex flex-col pl-6"
                            >
                                <div className="font-mono text-xs text-primary mb-4 pb-2 border-b border-white/5">
                                    &gt; SEARCHING DATABASE...
                                </div>

                                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono">&gt;</span>
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={e => setQuery(e.target.value)}
                                            placeholder="query_search..."
                                            className="w-full bg-white/5 border border-white/10 rounded py-2 pl-8 pr-4 text-sm text-white focus:border-primary outline-none font-mono"
                                            autoFocus
                                        />
                                    </div>
                                    <button type="submit" className="p-2 bg-primary text-black rounded hover:bg-white transition-colors">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </form>

                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                                    {searching ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            <span className="text-xs font-mono">SCANNING...</span>
                                        </div>
                                    ) : (
                                        results.length > 0 ? (
                                            results.map(track => (
                                                <div
                                                    key={track.id}
                                                    onClick={() => { setSelectedTrack(track); setStep('compose'); }}
                                                    className="flex items-center gap-3 p-2 hover:bg-primary/20 rounded cursor-pointer group border border-transparent hover:border-primary/30 transition-all"
                                                >
                                                    <img src={track.album.images[2]?.url} alt="" className="w-8 h-8 rounded bg-zinc-800" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-white truncate font-mono group-hover:text-primary">{track.name}</div>
                                                        <div className="text-[10px] text-zinc-500 truncate font-mono">{track.artists[0].name}</div>
                                                    </div>
                                                    <Terminal className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-zinc-600 text-xs font-mono">
                                                AWAITING QUERY INPUT...
                                            </div>
                                        )
                                    )}
                                </div>

                                <button onClick={() => setStep('compose')} className="mt-4 text-xs text-zinc-500 hover:text-primary font-mono text-center w-full uppercase tracking-wider">
                                    [ ABORT SEARCH ]
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateMenfessModal;
