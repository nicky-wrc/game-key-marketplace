# 🔐 แก้ไขปัญหา Password Hash

## ❌ ปัญหา
- Login ไม่ได้ทั้ง 2 admin accounts
- Password hash เก่าไม่ถูกต้อง

## ✅ วิธีแก้ไข

### 🔍 สาเหตุ
Password hash เก่าใน seed.sql ไม่ถูกต้อง (hash เก่าไม่ผ่านการ verify กับ "admin123")

### 🔧 วิธีแก้ไข

#### **Step 1: อัพเดท Password Hash ในฐานข้อมูล**

ไปที่ **Supabase Dashboard** → **SQL Editor** และรันคำสั่งนี้:

```sql
-- อัพเดท password hash สำหรับ admin@nickykey.com
UPDATE users SET password_hash = '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO' WHERE email = 'admin@nickykey.com';

-- อัพเดท password hash สำหรับ adnicky@admin.com
UPDATE users SET password_hash = '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO' WHERE email = 'adnicky@admin.com';

-- อัพเดท password hash สำหรับ seller@nickykey.com (ถ้าต้องการ)
UPDATE users SET password_hash = '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO' WHERE email = 'seller@nickykey.com';

-- อัพเดท password hash สำหรับ test@nickykey.com (ถ้าต้องการ)
UPDATE users SET password_hash = '$2b$10$neYbIDk9onO0a2lU6rJ8ieRpVXBBhEkpktTKLRP3uvG6k5W1.9SMO' WHERE email = 'test@nickykey.com';
```

#### **Step 2: ทดสอบ Login**

หลังจากรัน SQL แล้ว ทดสอบ login ด้วย:

**Admin Account 1:**
- Email: `admin@nickykey.com`
- Password: `admin123`

**Admin Account 2:**
- Email: `adnicky@admin.com`
- Password: `admin123`

---

## 📋 ข้อมูล Login

### Admin Users:
1. **Email:** `admin@nickykey.com`
   - **Password:** `admin123`
   - **Username:** `admin`

2. **Email:** `adnicky@admin.com`
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

- [ ] รัน SQL เพื่ออัพเดท password hash
- [ ] ทดสอบ Login ด้วย `admin@nickykey.com` / `admin123`
- [ ] ทดสอบ Login ด้วย `adnicky@admin.com` / `admin123`
- [ ] ตรวจสอบว่า Login สำเร็จ
- [ ] ตรวจสอบว่าเห็น Admin Panel

---

## 🎯 สรุป

**วิธีแก้ไข:**
1. ไปที่ Supabase → SQL Editor
2. รัน SQL commands ข้างบนเพื่ออัพเดท password hash
3. Login ด้วย `admin@nickykey.com` หรือ `adnicky@admin.com` / `admin123`

**✅ แก้ไขแล้ว!**

