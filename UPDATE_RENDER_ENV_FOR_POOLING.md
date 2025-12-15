# 🔧 อัพเดท Environment Variables ใน Render สำหรับ Connection Pooling

## 📋 Connection Pooling URL ที่ได้มา

```
postgresql://postgres.sqxfmorndklxuehgpbkv:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 🔍 **แยกข้อมูลจาก Connection String**

จาก Connection String:
```
postgresql://postgres.sqxfmorndklxuehgpbkv:Worachatp2547@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**แยกเป็น:**
- **DB_USER:** `postgres.sqxfmorndklxuehgpbkv`
- **DB_PASSWORD:** `Worachatp2547` (ใช้รหัสผ่านเดิม)
- **DB_HOST:** `aws-1-ap-southeast-1.pooler.supabase.com`
- **DB_PORT:** `6543`
- **DB_DATABASE:** `postgres`

---

## 🔧 **Step 1: อัพเดท Environment Variables ใน Render**

### 1.1 ไปที่ Render Dashboard
1. ไปที่ [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in และเลือก Service: **game-key-marketplace**
3. ไปที่ **Settings** → **Environment**

### 1.2 อัพเดท Environment Variables

**แก้ไขค่าต่อไปนี้:**

```env
DB_USER=postgres.sqxfmorndklxuehgpbkv
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_DATABASE=postgres
DB_PASSWORD=Worachatp2547
DB_PORT=6543
PORT=5000
JWT_SECRET=nickysecretkey12345
NODE_ENV=production
```

**⚠️ สิ่งที่เปลี่ยน:**
- `DB_USER`: จาก `postgres` เป็น `postgres.sqxfmorndklxuehgpbkv`
- `DB_HOST`: จาก `db.sqxfmorndklxuehgpbkv.supabase.co` เป็น `aws-1-ap-southeast-1.pooler.supabase.com`
- `DB_PORT`: จาก `5432` เป็น `6543`

**สิ่งที่ไม่เปลี่ยน:**
- `DB_PASSWORD`: `Worachatp2547` (ใช้รหัสผ่านเดิม)
- `DB_DATABASE`: `postgres`
- `PORT`: `5000`
- `JWT_SECRET`: `nickysecretkey12345`

---

## ✅ **Step 2: Save และ Redeploy**

### 2.1 Save Changes
1. กด **Save Changes** หลังจากแก้ไข Environment Variables
2. รอให้บันทึกเสร็จ

### 2.2 Redeploy Backend
1. ไปที่ **Events** tab
2. เลือก deployment ล่าสุด
3. กด **Redeploy** หรือ **Manual Deploy**
4. รอให้ deploy เสร็จ (ประมาณ 2-3 นาที)

---

## 🧪 **Step 3: ทดสอบ**

### 3.1 ทดสอบ Health Check
1. เปิด Browser ไปที่:
   ```
   https://game-key-marketplace.onrender.com/test-db
   ```
2. **ควรเห็น:**
   ```json
   {
     "message": "Database Connected!",
     "time": "2025-01-16T..."
   }
   ```

### 3.2 ทดสอบ API
1. เปิด Browser ไปที่:
   ```
   https://game-key-marketplace.onrender.com/api/games
   ```
2. **ควรเห็น:** JSON ของเกมทั้งหมด

---

## 📋 **Checklist**

- [ ] อัพเดท `DB_USER` เป็น `postgres.sqxfmorndklxuehgpbkv`
- [ ] อัพเดท `DB_HOST` เป็น `aws-1-ap-southeast-1.pooler.supabase.com`
- [ ] อัพเดท `DB_PORT` เป็น `6543`
- [ ] ตรวจสอบ `DB_PASSWORD` ถูกต้อง (`Worachatp2547`)
- [ ] Save Environment Variables
- [ ] Redeploy Backend
- [ ] ทดสอบ Health Check (`/test-db`)
- [ ] ทดสอบ API (`/api/games`)

---

## 🎯 **สรุป Environment Variables ที่ต้องตั้ง**

```env
DB_USER=postgres.sqxfmorndklxuehgpbkv
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_DATABASE=postgres
DB_PASSWORD=Worachatp2547
DB_PORT=6543
PORT=5000
JWT_SECRET=nickysecretkey12345
NODE_ENV=production
```

---

## ⚠️ **หมายเหตุ**

**Connection Pooling มีข้อดี:**
- ✅ รองรับ IPv4 (แก้ปัญหา ENETUNREACH)
- ✅ รองรับ connections มากกว่า
- ✅ ประสิทธิภาพดีกว่า
- ✅ เหมาะสำหรับ production

**สิ่งที่เปลี่ยน:**
- `DB_USER` ต้องมี project ID ต่อท้าย (`postgres.sqxfmorndklxuehgpbkv`)
- `DB_HOST` เปลี่ยนเป็น pooler URL (`aws-1-ap-southeast-1.pooler.supabase.com`)
- `DB_PORT` เปลี่ยนเป็น `6543`

---

**🔧 อัพเดท Environment Variables แล้ว Redeploy ครับ!**

