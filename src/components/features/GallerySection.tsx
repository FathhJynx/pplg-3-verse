import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { Maximize2, X, Image as ImageIcon, Database } from "lucide-react";
import { api, GalleryItem } from "../../services/api";
import SectionHeading from "../shared/SectionHeading";
import { siteConfig } from "@/config/site";

const GallerySection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await api.getGallery();
                setItems(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchGallery();
    }, []);

    return (
        <section ref={containerRef} className="py-32 px-4 relative overflow-hidden bg-black" id="gallery">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="absolute top-0 right-0 w-full h-24 bg-gradient-to-b from-zinc-900 to-transparent z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeading
                    title="MEMORY_BANK"
                    subtitle="DATABASE_VISUALS"
                />

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl border border-white/10" />)}
                    </div>
                ) : (
                    <motion.div style={{ y }} className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="col-span-3 text-center text-muted-foreground py-24 border border-dashed border-white/10 rounded-xl bg-white/5">
                                <p className="font-mono">NO DATA FRAGMENTS FOUND</p>
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <GalleryCard key={item.id} item={item} index={index} onClick={() => setSelectedImage(item)} />
                            ))
                        )}
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedImage(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-6xl w-full max-h-[90vh] bg-zinc-900 border border-primary/20 rounded-2xl overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-white/10 transition-colors z-20 border border-white/10">
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="relative w-full h-full flex flex-col md:flex-row">
                            <div className="flex-1 relative bg-black/50 flex items-center justify-center p-4">
                                <img src={selectedImage.image_url} alt={selectedImage.title} className="max-w-full max-h-[80vh] object-contain shadow-2xl" />
                            </div>

                            <div className="w-full md:w-80 bg-zinc-950 p-8 border-l border-white/10 flex flex-col justify-center">
                                <h3 className="text-2xl font-display font-bold text-white mb-2">{selectedImage.title}</h3>
                                <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-mono mb-6">
                                    {selectedImage.category.toUpperCase()}
                                </span>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">UPLOAD_DATE</div>
                                        <div className="text-sm text-white font-mono">{new Date(selectedImage.uploaded_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-mono mb-1">FILE_IID</div>
                                        <div className="text-sm text-white font-mono truncate">{selectedImage.id}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
};

const GalleryCard = ({ item, index, onClick }: { item: GalleryItem, index: number, onClick: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group break-inside-avoid"
            onClick={onClick}
        >
            <div className="relative bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[50%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="p-3 bg-black/50 backdrop-blur rounded-full border border-white/20">
                            <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-zinc-900 border-t border-white/5 relative z-10">
                    <h3 className="font-display font-bold text-lg leading-tight text-white group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                            {item.category}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default GallerySection;

