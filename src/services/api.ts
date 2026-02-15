
import { supabase } from '../lib/supabase';

export interface Student {
    id: string;
    full_name: string;
    nickname: string;
    role: 'KM' | 'Wakil KM' | 'Sekretaris' | 'Bendahara' | 'Siswa';
    nis: string;
    specialty?: string;
    valorant_agent?: string;
    avatar_url?: string;
    bio_quote?: string;
    created_at: string;
}

export interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    category: 'Classmeet' | 'Study' | 'Hangout' | 'Other';
    uploaded_at: string;
}

export interface ChatMessage {
    id: string;
    user_name: string;
    user_avatar?: string;
    content: string;
    room_id: string;
    created_at: string;
}

export interface Menfess {
    id: string;
    sender_name: string;
    recipient_name: string;
    message: string;
    spotify_track_id?: string;
    spotify_track_name?: string;
    spotify_artist_name?: string;
    spotify_image_url?: string;
    created_at: string;
}

export const api = {
    getStudents: async (): Promise<Student[]> => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('nickname', { ascending: true }); // Simple soft sort

            if (error) throw error;
            return data as Student[];
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    },

    getStudentById: async (id: string): Promise<Student | null> => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Student;
        } catch (error) {
            console.error('Error fetching student:', error);
            return null;
        }
    },

    getGallery: async (): Promise<GalleryItem[]> => {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('uploaded_at', { ascending: false });

            if (error) throw error;
            return data as GalleryItem[];
        } catch (error) {
            console.error('Error fetching gallery:', error);
            return [];
        }
    },

    getMessages: async (roomId?: string): Promise<ChatMessage[]> => {
        try {
            // Ephemeral: Only messages from the last 24 hours
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            let query = supabase
                .from('messages')
                .select('*')
                .gt('created_at', oneDayAgo)
                .order('created_at', { ascending: false }) // Fetch latest first
                .limit(100);

            if (roomId) {
                query = query.eq('room_id', roomId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data as ChatMessage[]).reverse(); // Return oldest first for chat UI
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    sendMessage: async (message: { user_name: string; content: string; user_avatar?: string; room_id?: string }): Promise<ChatMessage | null> => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    user_name: message.user_name,
                    content: message.content,
                    user_avatar: message.user_avatar,
                    room_id: message.room_id || 'general'
                }])
                .select()
                .single();

            if (error) throw error;
            return data as ChatMessage;
        } catch (error) {
            console.error('Error sending message:', error);
            return null;
        }
    },

    register: async (username: string, pin_code: string) => {
        try {
            const { data, error } = await supabase
                .from('chat_users')
                .insert([{ username, pin_code }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error: unknown) {
            // Check for duplicate key error (Git-style)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((error as any).code === '23505') {
                throw new Error('Username already taken');
            }
            throw new Error((error as Error).message || 'Registration failed');
        }
    },

    login: async (username: string, pin_code: string) => {
        try {
            // Use RPC for secure server-side check
            const { data, error } = await supabase.rpc('func_login', {
                username_in: username,
                pin_in: pin_code
            });

            if (error) throw error;

            // data is returned as SetOf, so it comes as an array
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const users = data as any[];
            if (!users || users.length === 0) {
                throw new Error('Invalid username or PIN');
            }

            return users[0];
        } catch (error: unknown) {
            throw new Error((error as Error).message || 'Login failed');
        }
    },

    getMenfess: async (): Promise<Menfess[]> => {
        try {
            const { data, error } = await supabase
                .from('menfess')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Menfess[];
        } catch (error) {
            console.error('Error fetching menfess:', error);
            return [];
        }
    },

    createMenfess: async (menfess: Partial<Menfess>) => {
        const { data, error } = await supabase
            .from('menfess')
            .insert([menfess])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getMenfessById: async (id: string): Promise<Menfess | null> => {
        try {
            const { data, error } = await supabase
                .from('menfess')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Menfess;
        } catch (error) {
            console.error('Error fetching menfess detail:', error);
            return null;
        }
    },

    // --- RADIO FEATURE ---

    getRadioQueue: async () => {
        try {
            const { data, error } = await supabase
                .from('radio_queue')
                .select('*')
                .order('votes', { ascending: false })
                .order('created_at', { ascending: true }); // If votes equal, oldest first

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching radio queue:', error);
            return [];
        }
    },

    getRadioNowPlaying: async () => {
        try {
            const { data, error } = await supabase
                .from('radio_now_playing')
                .select('*')
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // No rows found
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error fetching now playing:', error);
            return null;
        }
    },

    submitRadioTrack: async (track: { spotify_url: string; title: string; artist: string; submitted_by?: string }) => {
        const { data, error } = await supabase
            .from('radio_queue')
            .insert([track])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    voteRadioTrack: async (queue_id: string, voter_id: string) => {
        // 1. Record the vote to prevent duplicates
        const { error: voteError } = await supabase
            .from('radio_votes')
            .insert([{ queue_id, voter_id }]);

        if (voteError) {
            if (voteError.code === '23505') throw new Error('You have already voted for this track.');
            throw voteError;
        }

        // 2. Increment the vote count in radio_queue (RPC is better, but this works for simple cases)
        // Ideally we'd use a database trigger or an RPC function "increment_vote", 
        // but reading -> updating is "okay" for this scale if we accept potential race conditions,
        // OR we can rely on realtime subscription to update the UI eventually.
        // Let's stick to a simple client-side increment for now.
        const { error: updateError } = await supabase.rpc('increment_vote', { row_id: queue_id });

        // If RPC doesn't exist (user needs to create it), fallback to fetch-update (risky but functional)
        if (updateError) {
            // Fallback: Fetch current, add 1, update. 
            // NOTE: This IS prone to race conditions. 
            // FOR PROD: Ensure 'increment_vote' RPC exists.
            // For now, let's assume the user might not have created RPC.
            // We will just return success and let Realtime handle the UI update if another client did it.
            // But actually, let's try a direct update 
            /*
            const { data: current } = await supabase.from('radio_queue').select('votes').eq('id', queue_id).single();
            if (current) {
                await supabase.from('radio_queue').update({ votes: current.votes + 1 }).eq('id', queue_id);
            }
            */
            // A better way without RPC for simple increment is usually unavailable without extensions.
            // Let's try to assume the user WILL run the RPC or we just do the naive update.
            // Let's implement the naive fetch-and-update for safety if RPC fails.

            const { data: current } = await supabase.from('radio_queue').select('votes').eq('id', queue_id).single();
            if (current) {
                await supabase.from('radio_queue').update({ votes: current.votes + 1 }).eq('id', queue_id);
            }
        }

        return true;
    },

    playRadioTrack: async (queueId: string) => {
        try {
            // 1. Get the track from queue
            const { data: track, error: getError } = await supabase
                .from('radio_queue')
                .select('*')
                .eq('id', queueId)
                .single();

            if (getError) throw getError;

            // 2. Clear current Now Playing (optional, or just overwrite since we fetch .single())
            // Best practice: Delete all rows in now_playing then insert
            await supabase.from('radio_now_playing').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

            // 3. Insert into Now Playing
            const { error: insertError } = await supabase
                .from('radio_now_playing')
                .insert([{
                    spotify_url: track.spotify_url,
                    title: track.title,
                    artist: track.artist
                }]);

            if (insertError) throw insertError;

            // 4. Remove from Queue (DISABLED per user request: Keep in queue)
            // await supabase.from('radio_queue').delete().eq('id', queueId);

            return true;
        } catch (error) {
            console.error('Error playing track:', error);
            throw error;
        }
    },

    stopRadioTrack: async () => {
        try {
            const { error } = await supabase
                .from('radio_now_playing')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error stopping track:', error);
            throw error;
        }
    }
};
