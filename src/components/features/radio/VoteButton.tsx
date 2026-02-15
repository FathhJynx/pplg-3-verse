
import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface VoteButtonProps {
    queueId: string;
    initialVotes: number;
    hasVoted?: boolean;
}

const VoteButton = ({ queueId, initialVotes, hasVoted = false }: VoteButtonProps) => {
    const [votes, setVotes] = useState(initialVotes);
    const [userHasVoted, setUserHasVoted] = useState(hasVoted);
    const [loading, setLoading] = useState(false);

    const handleVote = async () => {
        if (userHasVoted || loading) return;

        setLoading(true);
        // Optimistic update
        setVotes(prev => prev + 1);
        setUserHasVoted(true);

        try {
            // Generate a simple fingerprit or use localstorage ID
            let voterId = localStorage.getItem('radio_voter_id');
            if (!voterId) {
                voterId = crypto.randomUUID();
                localStorage.setItem('radio_voter_id', voterId);
            }

            await api.voteRadioTrack(queueId, voterId);
            toast.success("Vote recorded!");
        } catch (error: any) {
            // Revert on failure
            setVotes(prev => prev - 1);
            setUserHasVoted(false);
            toast.error(error.message || "Failed to vote");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVote}
            disabled={userHasVoted}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${userHasVoted
                    ? "bg-primary/20 border-primary text-primary cursor-default"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-primary hover:text-white"
                }`}
        >
            <ThumbsUp className={`w-3 h-3 ${userHasVoted ? "fill-primary" : ""}`} />
            <span>{votes}</span>
        </motion.button>
    );
};

export default VoteButton;
