const db = require('../db');

exports.getAllGames = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM games ORDER BY game_id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};