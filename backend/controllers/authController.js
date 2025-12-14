const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

// 1. ฟังก์ชันสมัครสมาชิก
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userCheck = await db.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2', 
            [username, email]
        );
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, role',
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. ฟังก์ชันเข้าสู่ระบบ
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0]; 

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { 
                user_id: user.user_id, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({
            message: 'Login successful!',
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role 
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}; // <--- ปิดปีกกา login ตรงนี้ (อย่าลืม!)

// 3. ฟังก์ชันเปลี่ยนรหัสผ่าน (แยกออกมาข้างนอก)
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user_id = req.user.user_id;

    try {
        const userRes = await db.query('SELECT password_hash FROM users WHERE user_id = $1', [user_id]);
        if (userRes.rows.length === 0) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });

        const validPassword = await bcrypt.compare(oldPassword, userRes.rows[0].password_hash);
        if (!validPassword) return res.status(400).json({ message: 'รหัสผ่านเดิมไม่ถูกต้อง' });

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [newHash, user_id]);

        res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. ดึงข้อมูล Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const result = await db.query(
            `SELECT user_id, username, email, role, wallet_balance, avatar_url, created_at
             FROM users WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 5. อัพเดท Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { username, email, avatar_url } = req.body;

        // เช็คว่า username หรือ email ซ้ำหรือไม่ (ยกเว้นของตัวเอง)
        if (username) {
            const usernameCheck = await db.query(
                'SELECT user_id FROM users WHERE username = $1 AND user_id != $2',
                [username, userId]
            );
            if (usernameCheck.rows.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        if (email) {
            const emailCheck = await db.query(
                'SELECT user_id FROM users WHERE email = $1 AND user_id != $2',
                [email, userId]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // อัพเดทข้อมูล
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (username) {
            updateFields.push(`username = $${paramIndex}`);
            updateValues.push(username);
            paramIndex++;
        }
        if (email) {
            updateFields.push(`email = $${paramIndex}`);
            updateValues.push(email);
            paramIndex++;
        }
        if (avatar_url !== undefined) {
            updateFields.push(`avatar_url = $${paramIndex}`);
            updateValues.push(avatar_url);
            paramIndex++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        updateValues.push(userId);
        const query = `
            UPDATE users 
            SET ${updateFields.join(', ')}
            WHERE user_id = $${paramIndex}
            RETURNING user_id, username, email, role, wallet_balance, avatar_url, created_at
        `;

        const result = await db.query(query, updateValues);
        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};