# 🔐 แก้ไขปัญหา Login

## ❌ ปัญหา
ไม่สามารถ login ด้วย:
- Email: `adnicky@admin.com`
- Password: `admin123`

## ✅ วิธีแก้ไข

### วิธีที่ 1: ใช้ Email ที่ถูกต้อง (แนะนำ)
ใช้ email ที่มีอยู่ในฐานข้อมูล:
- **Email:** `admin@nickykey.com`
- **Password:** `admin123`

### วิธีที่ 2: เพิ่ม User ใหม่
ผมได้เพิ่ม user ใหม่ใน `seed.sql` แล้ว:
- **Email:** `adnicky@admin.com`
- **Password:** `admin123`
- **Role:** `admin`

---

## 🔄 ขั้นตอนอัพเดทฐานข้อมูล

### Option A: เพิ่ม User ใหม่ด้วย SQL (เร็วที่สุด)

1. ไปที่ **Supabase Dashboard** → **SQL Editor**
2. รันคำสั่งนี้:

```sql
INSERT INTO users (username, email, password_hash, role, wallet_balance) VALUES
('admin2', 'adnicky@admin.com', '$2a$10$rQnM1k8yVPZXKODvUKQXXeJXYM3zl1UQ0jFzPqF8W5iJX7vKxVbPa', 'admin', 99999.00)
ON CONFLICT (email) DO NOTHING;
```

3. **ทดสอบ Login:**
   - Email: `adnicky@admin.com`
   - Password: `admin123`

### Option B: รัน seed.sql ใหม่ (ถ้าต้องการ)

⚠️ **ระวัง:** จะเพิ่มข้อมูลซ้ำ (แต่ `ON CONFLICT` จะป้องกัน)

1. ไปที่ **Supabase Dashboard** → **SQL Editor**
2. Copy เนื้อหาจาก `backend/seed.sql`
3. รันเฉพาะส่วน Users (บรรทัด 27-31)

---

## 📋 ข้อมูล Login ที่มีอยู่

### Admin Users:
1. **Email:** `admin@nickykey.com`
   - **Password:** `admin123`
   - **Username:** `admin`

2. **Email:** `adnicky@admin.com` (ใหม่)
   - **Password:** `admin123`
   - **Username:** `admin2`

### Seller User:
- **Email:** `seller@nickykey.com`
- **Password:** `admin123`
- **Username:** `seller01`

### Test User:
- **Email:** `test@nickykey.com`
- **Password:** `admin123`
- **Username:** `testuser`

---

## ✅ Checklist

- [ ] รัน SQL เพื่อเพิ่ม user `adnicky@admin.com`
- [ ] ทดสอบ Login ด้วย `adnicky@admin.com` / `admin123`
- [ ] ตรวจสอบว่า Login สำเร็จ
- [ ] ตรวจสอบว่าเห็น Admin Panel

---

## 🎯 สรุป

**วิธีแก้ไขเร็วที่สุด:**
1. ไปที่ Supabase → SQL Editor
2. รัน SQL:
   ```sql
   INSERT INTO users (username, email, password_hash, role, wallet_balance) VALUES
   ('admin2', 'adnicky@admin.com', '$2a$10$rQnM1k8yVPZXKODvUKQXXeJXYM3zl1UQ0jFzPqF8W5iJX7vKxVbPa', 'admin', 99999.00)
   ON CONFLICT (email) DO NOTHING;
   ```
3. Login ด้วย `adnicky@admin.com` / `admin123`

---

**✅ แก้ไขแล้ว!**

