
const supabase = require('../config/supabaseClient');

// Auth Handlers
const register = async (req, res) => {
    const { username, pin_code } = req.body;
    if (!username || !pin_code) return res.status(400).json({ error: 'Username and PIN are required' });

    try {
        const { data, error } = await supabase
            .from('chat_users')
            .insert([{ username, pin_code }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') return res.status(409).json({ error: 'Username taken. Choose another.' }); // Unique violation
            throw error;
        }
        res.status(201).json({ message: 'Welcome to the Squad', user: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { username, pin_code } = req.body;
    if (!username || !pin_code) return res.status(400).json({ error: 'Username and PIN are required' });

    try {
        const { data, error } = await supabase
            .from('chat_users')
            .select('*')
            .eq('username', username)
            .eq('pin_code', pin_code) // Security note: Plain text for prototype. Hash in prod.
            .single();

        if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });

        res.status(200).json({ message: 'Access Granted', user: data });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}

// Messaging Handlers
const sendMessage = async (req, res) => {
    const { user_name, user_avatar, content, room_id } = req.body;

    if (!content || !user_name) {
        return res.status(400).json({ error: 'Content and User Name are required' });
    }

    try {
        // Optional: Verify user exists before sending? FK constraint handles it mostly.
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    user_name,
                    user_avatar,
                    content,
                    room_id: room_id || 'general'
                }
            ])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    const { room_id } = req.query;
    try {
        // Calculate 24 hours ago
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        let query = supabase
            .from('messages')
            .select('*')
            .gt('created_at', oneDayAgo) // Ephemeral filter
            .order('created_at', { ascending: false })
            .limit(100);

        if (room_id) {
            query = query.eq('room_id', room_id);
        }

        const { data, error } = await query;

        if (error) throw error;
        // Check for old messages cleanup? Not triggered here, usually cron job.
        // We just filter read.

        res.status(200).json(data.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
    sendMessage,
    getMessages
};
