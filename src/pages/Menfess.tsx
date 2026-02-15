
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Music, Disc, Search, Terminal, Radio, ArrowLeft } from "lucide-react";
import { api, Menfess as MenfessType } from "../services/api";
import CreateMenfessModal from "../components/modals/CreateMenfessModal";
import GlitchText from "../components/shared/GlitchText";

const Menfess = () => {
    const [menfesses, setMenfesses] = useState<MenfessType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchMenfess = async () => {
        setLoading(true);
        try {
            const data = await api.getMenfess();
            // Ensure descending order by date
            const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setMenfesses(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenfess();
    }, []);

    const filteredMenfesses = menfesses.filter(item =>
        item.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.spotify_track_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
            {/* Matrices Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

            {/* Header Section */}
            <header className="relative pt-20 pb-12 px-4 border-b border-primary/20 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs tracking-widest uppercase font-bold">Return to_Base</span>
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <Radio className="w-4 h-4 animate-pulse" />
                                <span className="text-xs tracking-widest uppercase">Encrypted Transmission Protocol</span>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-display font-bold mb-4 text-white">
                                <GlitchText text="SONG_FESS" />
                            </h1>
                            <p className="text-zinc-400 max-w-xl text-sm border-l-2 border-primary/50 pl-4 py-1">
                                Anonymous audio-visual fragments. Broadcast your signal to the void.
                                <br />All transmissions are encrypted and permanently stored in the archive.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-zinc-900/80 border border-primary/30 p-1 rounded-lg w-full md:w-80 shadow-[0_0_15px_rgba(0,255,0,0.1)] focus-within:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-shadow">
                                <span className="pl-3 text-primary font-bold">$&gt;</span>
                                <input
                                    type="text"
                                    placeholder="grep 'recipient'"
                                    className="bg-transparent border-none outline-none text-white text-sm w-full py-2 placeholder:text-zinc-600 font-mono"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-4 h-4 text-primary mr-3" />
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group relative bg-primary text-black font-bold py-3 px-6 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform active:scale-95"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative flex items-center justify-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    <span>INITIATE_UPLOAD</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header >

            {/* Feed Section */}
            < main className="max-w-7xl mx-auto px-4 py-12" >
                {
                    loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
                            {
                                [1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-64 bg-zinc-900/50 rounded-lg animate-pulse border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan" />
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            <AnimatePresence>
                                {filteredMenfesses.map((item, index) => (
                                    <MenfessCard key={item.id} item={item} index={index} onClick={() => navigate(`/menfess/${item.id}`)} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                {
                    !loading && filteredMenfesses.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
                            <Terminal className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 font-mono">NO SIGNALS DETECTED MATCHING QUERY</p>
                        </div>
                    )
                }
            </main >

            <CreateMenfessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchMenfess}
            />
        </div >
    );
};

const MenfessCard = ({ item, index, onClick }: { item: MenfessType, index: number, onClick: () => void }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={onClick}
            className="break-inside-avoid bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer relative hover:shadow-[0_0_30px_-10px_rgba(0,255,0,0.15)]"
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">ID: {item.id.slice(0, 8)}</div>
            </div>

            <div className="p-6 relative">
                {/* Matrix Rain Effect (Simplified) */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] text-primary font-mono vertical-text opacity-50">010101</div>
                </div>

                <div className="mb-4 space-y-1">
                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                        <span className="text-primary">&gt;</span> TARGET:
                        <span className="text-white bg-white/10 px-1 rounded">{item.recipient_name}</span>
                    </div>
                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                        <span className="text-primary">&gt;</span> SOURCE:
                        <span className="text-zinc-300">{item.sender_name}</span>
                    </div>
                </div>

                <p className="text-lg text-zinc-300 font-sans leading-relaxed mb-6 whitespace-pre-wrap group-hover:text-white transition-colors">
                    "{item.message}"
                </p>

                {item.spotify_track_id && (
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5 flex items-center gap-3 group-hover:border-primary/30 transition-colors">
                        {item.spotify_image_url ? (
                            <img src={item.spotify_image_url} alt="Art" className="w-10 h-10 rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                                <Music className="w-5 h-5 text-zinc-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-zinc-300 truncate group-hover:text-primary transition-colors font-display tracking-wide">
                                {item.spotify_track_name}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate font-mono">{item.spotify_artist_name}</div>
                        </div>
                        <Disc className="w-4 h-4 text-zinc-600 group-hover:text-primary group-hover:animate-spin-slow transition-colors" />
                    </div>
                )}
            </div>

            {/* Bottom Status Bar */}
            <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span className="group-hover:text-primary transition-colors">ENCRYPTED</span>
            </div>
        </motion.div>
    );
};

export default Menfess;
