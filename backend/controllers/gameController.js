const db = require('../db');

// ดึงเกมทั้งหมด (หน้าแรก)
exports.getAllGames = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM games ORDER BY game_id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงสต็อกรายเกม (รายการไอดีที่ขายแยก)
exports.getGameStock = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await db.query(
            `SELECT code_id, title, description, price, image_url 
             FROM game_codes 
             WHERE game_id = $1 AND status = 'available' AND is_public = TRUE`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};