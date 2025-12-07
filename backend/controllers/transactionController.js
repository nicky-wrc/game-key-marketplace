const db = require('../db');

// 1. ฟังก์ชันซื้อเกม (ตัดเงิน + ตัดของ + รองรับคูปองส่วนลด)
exports.buyGame = async (req, res) => {
    // รับ game_id และ coupon_code (ถ้ามี)
    const { game_id, coupon_code } = req.body; 
    const user_id = req.user.user_id;

    try {
        await db.query('BEGIN'); // เริ่ม Transaction

        // --- Step A: เช็คสต็อกสินค้า ---
        const codeCheck = await db.query(
            `SELECT * FROM game_codes WHERE game_id = $1 AND status = 'available' LIMIT 1 FOR UPDATE`,
            [game_id]
        );

        if (codeCheck.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'สินค้าหมด (Out of Stock)' });
        }

        const gameCode = codeCheck.rows[0];

        // --- Step B: คำนวณราคา & เช็คคูปอง ---
        let finalPrice = parseFloat(gameCode.price);
        let discount = 0;

        if (coupon_code) {
            const couponRes = await db.query('SELECT * FROM coupons WHERE code = $1', [coupon_code]);
            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                // เช็คว่าสิทธิ์เต็มหรือยัง
                if (coupon.used_count < coupon.usage_limit) {
                    discount = parseFloat(coupon.discount_amount);
                    finalPrice = finalPrice - discount;
                    if (finalPrice < 0) finalPrice = 0; // กันราคาติดลบ

                    // อัปเดตยอดใช้คูปอง +1
                    await db.query('UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1', [coupon.coupon_id]);
                }
            }
        }

        // --- Step C: เช็คเงินในกระเป๋า ---
        const userRes = await db.query('SELECT wallet_balance FROM users WHERE user_id = $1', [user_id]);
        const balance = parseFloat(userRes.rows[0].wallet_balance);

        if (balance < finalPrice) {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'ยอดเงินไม่พอ กรุณาเติมเงิน' });
        }

        // --- Step D: ดำเนินการตัดยอด ---
        // 1. หักเงินลูกค้า (ตามราคาหลังลด)
        await db.query('UPDATE users SET wallet_balance = wallet_balance - $1 WHERE user_id = $2', [finalPrice, user_id]);
        
        // 2. ตัดสต็อกสินค้า
        await db.query(`UPDATE game_codes SET status = 'sold' WHERE code_id = $1`, [gameCode.code_id]);

        // 3. บันทึกประวัติ (Transactions)
        const note = discount > 0 ? ` (Discount ${discount}฿ from ${coupon_code})` : '';
        const newTransaction = await db.query(
            `INSERT INTO transactions (buyer_id, game_code_id, amount, status, details, game_id)
             VALUES ($1, $2, $3, 'completed', $4, $5)
             RETURNING *`,
            [user_id, gameCode.code_id, finalPrice, `Game Code: ${gameCode.code}${note}`, game_id] 
        );

        await db.query('COMMIT'); // ยืนยันจบงาน

        // ส่งผลลัพธ์กลับไปหน้าเว็บ
        res.json({
            message: 'ซื้อสำเร็จ!',
            game_code: gameCode.code,
            price_paid: finalPrice,
            transaction: newTransaction.rows[0]
        });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// 2. ฟังก์ชันดึงประวัติของฉัน
exports.getMyHistory = async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const result = await db.query(
            `SELECT * FROM transactions 
             WHERE buyer_id = $1 
             ORDER BY transaction_date DESC`, 
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};