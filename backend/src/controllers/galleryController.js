
const supabase = require('../config/supabaseClient');

const getGallery = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getGallery
};
