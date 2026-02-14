
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
        } catch (error: any) {
            // Check for duplicate key error (Git-style)
            if (error.code === '23505') {
                throw new Error('Username already taken');
            }
            throw new Error(error.message || 'Registration failed');
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
            const users = data as any[];
            if (!users || users.length === 0) {
                throw new Error('Invalid username or PIN');
            }

            return users[0];
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
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
        try {
            const { data, error } = await supabase
                .from('menfess')
                .insert([menfess])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
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
    }
};
