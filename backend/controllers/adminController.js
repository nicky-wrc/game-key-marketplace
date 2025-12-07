const db = require('../db');

// addGame (เหมือนเดิม ไม่ต้องแก้)
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

// addStock (แก้ใหม่! ให้รับไฟล์รูปได้)
exports.addStock = async (req, res) => {
    const { game_id, code, price, title, description, is_public } = req.body;
    const admin_id = req.user.user_id;

    // เช็คว่ามีรูปอัปโหลดมาไหม
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
                image_url || null, // ใช้ URL ที่สร้างจากไฟล์
                is_public || false
            ]
        );
        res.json({ message: 'เพิ่มสต็อกสำเร็จ!', stock: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};