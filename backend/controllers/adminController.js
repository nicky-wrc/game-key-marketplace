const db = require('../db');

exports.addGame = async (req, res) => {
    // ข้อมูล text จะอยู่ใน req.body
    const { name, platform, description, price } = req.body;
    
    // ข้อมูลไฟล์จะอยู่ใน req.file
    // ถ้ามีการอัปโหลดไฟล์ ให้สร้าง URL, ถ้าไม่มีให้ใช้ค่าว่างหรือรูป default
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

// เพิ่มสต็อกรหัสเกม (เติมของ)
exports.addStock = async (req, res) => {
    const { game_id, code, price } = req.body;
    const admin_id = req.user.user_id;

    try {
        const result = await db.query(
            `INSERT INTO game_codes (game_id, code, price, seller_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [game_id, code, price, admin_id]
        );
        res.json({ message: 'เติมสต็อกสำเร็จ!', stock: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};