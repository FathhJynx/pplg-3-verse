
const supabase = require('../config/supabaseClient');

const getStudents = async (req, res) => {
    try {
        // Fetch students sorted by role hierarchy might need complex sorting or doing it in code.
        // For now, let's sort by created_at or name, or map specific roles.
        // A simple approach is to fetch all and sort in JS, or use a numeric rank column in DB.
        // Let's assume we fetch all and sorting is handled by frontend or basic alphanumeric.

        // To sort by custom order in SQL is tricky without a helper function or separate table.
        // Let's just order by nickname for now.

        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        // Optional: Custom sorting logic here if needed
        // const roleOrder = { 'KM': 1, 'Wakil KM': 2, 'Sekretaris': 3, 'Bendahara': 4, 'Siswa': 5 };
        // data.sort((a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ error: 'Student not found or database error' });
    }
};

module.exports = {
    getStudents,
    getStudentById
};
