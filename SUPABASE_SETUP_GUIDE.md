# 📖 คู่มือตั้งค่า Database ใน Supabase

## 🎯 วิธีรันไฟล์ SQL ใน Supabase

---

## 📝 ขั้นตอนที่ 1: เข้า Supabase Dashboard

1. ไปที่ [https://supabase.com](https://supabase.com)
2. **Sign in** เข้าสู่ระบบ
3. เลือก **Project** ของคุณ (game-key-marketplace)

---

## 🔧 ขั้นตอนที่ 2: เปิด SQL Editor

1. ดูที่ **Sidebar ด้านซ้าย**
2. คลิกที่ **"SQL Editor"** (ไอคอนเป็น `</>` หรือ `SQL`)
3. จะเห็นหน้า **SQL Editor** พร้อมช่องสำหรับเขียน SQL

---

## 📄 ขั้นตอนที่ 3: รันไฟล์ database.sql (Migration)

### 3.1 เปิดไฟล์ database.sql
1. เปิดไฟล์ `backend/database.sql` ในโปรเจคของคุณ
2. **Copy ทั้งหมด** (Ctrl+A แล้ว Ctrl+C)

### 3.2 Paste ใน SQL Editor
1. กลับมาที่ Supabase SQL Editor
2. **Paste** เนื้อหา SQL ที่ Copy มา (Ctrl+V)
3. จะเห็นโค้ด SQL ทั้งหมดในช่อง

### 3.3 Run SQL
1. ดูที่ **ปุ่มด้านล่างขวา**:
   - **"Run"** (ปุ่มสีเขียว) หรือ
   - กด **Ctrl+Enter** (Windows/Linux) หรือ **Cmd+Enter** (Mac)
2. รอให้รันเสร็จ (ประมาณ 5-10 วินาที)

### 3.4 ตรวจสอบผลลัพธ์
- จะเห็นข้อความ **"Success. No rows returned"** หรือ **"Success"**
- ถ้ามี Error จะแสดงข้อความสีแดง
- ตรวจสอบว่าไม่มี Error

---

## 🌱 ขั้นตอนที่ 4: รันไฟล์ seed.sql (ข้อมูลตัวอย่าง)

### 4.1 เปิดไฟล์ seed.sql
1. เปิดไฟล์ `backend/seed.sql` ในโปรเจคของคุณ
2. **Copy ทั้งหมด** (Ctrl+A แล้ว Ctrl+C)

### 4.2 Paste ใน SQL Editor
1. กลับมาที่ Supabase SQL Editor
2. **เคลียร์** SQL เดิม (ถ้ามี)
3. **Paste** เนื้อหา SQL จาก seed.sql (Ctrl+V)

### 4.3 Run SQL
1. กดปุ่ม **"Run"** หรือ **Ctrl+Enter**
2. รอให้รันเสร็จ (อาจใช้เวลานานหน่อย เพราะมีข้อมูลเยอะ)

### 4.4 ตรวจสอบผลลัพธ์
- จะเห็นข้อความ **"Success"** หรือ **"INSERT 0 X"** (X = จำนวนแถวที่เพิ่ม)
- ถ้ามี Error จะแสดงข้อความสีแดง

---

## ✅ ขั้นตอนที่ 5: ตรวจสอบว่า Tables ถูกสร้างแล้ว

### 5.1 ดู Tables
1. ไปที่ **Sidebar ด้านซ้าย**
2. คลิกที่ **"Table Editor"** (ไอคอนเป็นตาราง)
3. จะเห็น **Tables** ทั้งหมดที่สร้างแล้ว

### 5.2 ตรวจสอบ Tables ที่ควรมี:
- ✅ `categories` - หมวดหมู่เกม
- ✅ `users` - ผู้ใช้
- ✅ `games` - เกม
- ✅ `game_codes` - โค้ดเกม
- ✅ `transactions` - การซื้อขาย
- ✅ `coupons` - คูปอง
- ✅ `mystery_boxes` - กล่องสุ่ม
- ✅ `wishlists` - รายการโปรด
- ✅ `reviews` - รีวิว
- ✅ `topup_history` - ประวัติการเติมเงิน
- ✅ `mystery_box_items` - รายการในกล่องสุ่ม

### 5.3 ตรวจสอบข้อมูล
1. คลิกที่ Table ใดๆ (เช่น `games`)
2. จะเห็นข้อมูลที่ถูกเพิ่มจาก seed.sql
3. ตรวจสอบว่ามีข้อมูลหรือไม่

---

## 🎨 ภาพประกอบ (Text-based)

```
┌─────────────────────────────────────┐
│  Supabase Dashboard                 │
├─────────────────────────────────────┤
│  [Home] [Table Editor] [SQL Editor] │  ← คลิก SQL Editor
│  [Auth] [Storage] [Settings]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SQL Editor                         │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ CREATE TABLE categories (     │ │  ← Paste SQL ที่นี่
│  │   category_id SERIAL...       │ │
│  │ );                             │ │
│  │                                │ │
│  │ CREATE TABLE users (           │ │
│  │   user_id SERIAL...            │ │
│  │ );                             │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Run] [Save] [Format]              │  ← กด Run
└─────────────────────────────────────┘
```

---

## ⚠️ ข้อควรระวัง

### 1. **รัน database.sql ก่อนเสมอ**
- ต้องรัน `database.sql` ก่อน `seed.sql`
- เพราะ `database.sql` สร้าง Tables
- `seed.sql` เพิ่มข้อมูลเข้าไปใน Tables

### 2. **ถ้ามี Error**
- อ่าน Error Message อย่างละเอียด
- บางครั้งอาจมี Table ซ้ำ (ถ้ารันซ้ำ)
- ลองลบ Table ที่มีปัญหาแล้วรันใหม่

### 3. **ถ้ารันซ้ำ**
- `database.sql` อาจ Error ถ้า Table มีอยู่แล้ว
- `seed.sql` อาจ Error ถ้าข้อมูลซ้ำ (UNIQUE constraint)
- ใช้คำสั่ง `DROP TABLE IF EXISTS` ก่อนสร้าง Table ใหม่

---

## 🔍 วิธีแก้ปัญหา Error

### Error: "relation already exists"
**ปัญหา:** Table มีอยู่แล้ว

**แก้ไข:**
1. ไปที่ **Table Editor**
2. คลิกขวาที่ Table → **Delete**
3. หรือเพิ่ม `DROP TABLE IF EXISTS table_name;` ก่อน `CREATE TABLE`

### Error: "duplicate key value"
**ปัญหา:** ข้อมูลซ้ำ (UNIQUE constraint)

**แก้ไข:**
1. ลบข้อมูลเก่าออกก่อน
2. หรือใช้ `INSERT ... ON CONFLICT DO NOTHING;`

### Error: "syntax error"
**ปัญหา:** SQL Syntax ผิด

**แก้ไข:**
1. ตรวจสอบว่า Copy SQL ครบถ้วน
2. ตรวจสอบว่าไม่มีตัวอักษรพิเศษ
3. ลองรันทีละส่วน

---

## 📋 Checklist

### Migration (database.sql):
- [ ] เปิด Supabase Dashboard
- [ ] เปิด SQL Editor
- [ ] Copy เนื้อหาจาก `backend/database.sql`
- [ ] Paste ใน SQL Editor
- [ ] กด Run
- [ ] ตรวจสอบว่าไม่มี Error
- [ ] ตรวจสอบ Tables ใน Table Editor

### Seed (seed.sql):
- [ ] Copy เนื้อหาจาก `backend/seed.sql`
- [ ] Paste ใน SQL Editor
- [ ] กด Run
- [ ] ตรวจสอบว่าไม่มี Error
- [ ] ตรวจสอบข้อมูลใน Tables

---

## 🎯 สรุปขั้นตอนแบบเร็ว

1. **Supabase Dashboard** → **SQL Editor**
2. **Copy** `backend/database.sql` → **Paste** → **Run**
3. **Copy** `backend/seed.sql` → **Paste** → **Run**
4. **ตรวจสอบ** Tables ใน Table Editor

---

**🎉 เสร็จแล้ว! Database พร้อมใช้งาน**

