const db = require('../db');

// ===== เพิ่มเกม =====
exports.addGame = async (req, res) => {
    const { name, platform, description, price } = req.body;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

    if (!name || !price) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    try {
        const result = await db.query(
            `INSERT INTO games (name, platform, description, price, image_url) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, platform, description, price, image_url]
        );
        res.json({ message: 'เพิ่มเกมสำเร็จ!', game: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ดึงเกมทั้งหมด (สำหรับ Admin) =====
exports.getAllGames = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM games ORDER BY game_id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== แก้ไขเกม =====
exports.updateGame = async (req, res) => {
    const { id } = req.params;
    const { name, platform, description, price } = req.body;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.existing_image;

    try {
        const result = await db.query(
            `UPDATE games 
             SET name = $1, platform = $2, description = $3, price = $4, image_url = $5 
             WHERE game_id = $6 
             RETURNING *`,
            [name, platform, description, price, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเกมนี้' });
        }

        res.json({ message: 'แก้ไขเกมสำเร็จ!', game: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ลบเกม =====
exports.deleteGame = async (req, res) => {
    const { id } = req.params;

    try {
        // ลบสต็อกที่เกี่ยวข้องก่อน
        await db.query('DELETE FROM game_codes WHERE game_id = $1', [id]);
        
        // ลบเกม
        const result = await db.query('DELETE FROM games WHERE game_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเกมนี้' });
        }

        res.json({ message: 'ลบเกมสำเร็จ!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== เพิ่มสต็อก =====
exports.addStock = async (req, res) => {
    const { game_id, code, price, title, description, is_public } = req.body;
    const admin_id = req.user.user_id;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

    try {
        const result = await db.query(
            `INSERT INTO game_codes (game_id, code, price, seller_id, title, description, image_url, is_public) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [
                game_id, 
                code, 
                price, 
                admin_id, 
                title || null, 
                description || null, 
                image_url || null,
                is_public || false
            ]
        );
        res.json({ message: 'เพิ่มสต็อกสำเร็จ!', stock: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ดึงสต็อกทั้งหมด (สำหรับ Admin) =====
exports.getAllStocks = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT gc.*, g.name as game_name 
            FROM game_codes gc 
            LEFT JOIN games g ON gc.game_id = g.game_id 
            ORDER BY gc.code_id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== แก้ไขสต็อก =====
exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { code, price, title, description, is_public, status } = req.body;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.existing_image;

    try {
        const result = await db.query(
            `UPDATE game_codes 
             SET code = $1, price = $2, title = $3, description = $4, is_public = $5, status = $6, image_url = $7
             WHERE code_id = $8 
             RETURNING *`,
            [code, price, title, description, is_public, status, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบสต็อกนี้' });
        }

        res.json({ message: 'แก้ไขสต็อกสำเร็จ!', stock: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ลบสต็อก =====
exports.deleteStock = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM game_codes WHERE code_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบสต็อกนี้' });
        }

        res.json({ message: 'ลบสต็อกสำเร็จ!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};