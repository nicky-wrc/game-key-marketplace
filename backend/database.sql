-- 1. ตารางผู้ใช้งาน (Users)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- user, seller, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตารางรายชื่อเกม (Games)
CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- Steam, Origin, etc.
    description TEXT,
    image_url TEXT, -- เพิ่ม URL รูปภาพปกเกม
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ตารางโค้ดเกม (Game Codes)
CREATE TABLE game_codes (
    code_id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
    seller_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    code VARCHAR(255) NOT NULL, -- ควรเข้ารหัสก่อนเก็บจริง
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available', -- available, sold, pending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ตารางประวัติการซื้อขาย (Transactions)
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES users(user_id),
    game_code_id INT REFERENCES game_codes(code_id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);