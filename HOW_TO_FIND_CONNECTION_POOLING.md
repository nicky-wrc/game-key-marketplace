# 📍 วิธีหา Connection Pooling URL และ Port ใน Supabase

## 🎯 ขั้นตอนหา Connection Pooling

---

## **Step 1: ไปที่ Supabase Dashboard**

1. ไปที่ [https://supabase.com](https://supabase.com)
2. Sign in และเลือก Project ของคุณ
3. ไปที่ **Settings** → **Database**

---

## **Step 2: หา Connection Pooling**

### **วิธีที่ 1: ดูที่ Connection String (แนะนำ)**

1. ไปที่ **Settings** → **Database**
2. ดูที่ส่วน **Connection string** หรือ **Connection pooling**
3. จะเห็น **Connection Pooling URL** หรือ **Connection Pooling Mode**

**ตัวอย่าง Connection Pooling URL:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres?pgbouncer=true
```

**หรือ:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres
```

**สังเกต:**
- Port จะเป็น `6543` (ไม่ใช่ `5432`)
- มี `pgbouncer=true` หรือไม่ก็ได้

---

### **วิธีที่ 2: ดูที่ Connection Info**

1. ไปที่ **Settings** → **Database**
2. ดูที่ส่วน **Connection Info** หรือ **Connection parameters**
3. จะเห็น:
   - **Host:** `db.xxx.supabase.co`
   - **Port:** `6543` (สำหรับ Connection Pooling)
   - **Database:** `postgres`
   - **User:** `postgres`

---

### **วิธีที่ 3: ดูที่ Connection Pooling Configuration**

1. ไปที่ **Settings** → **Database**
2. ดูที่ส่วน **Connection pooling configuration**
3. จะเห็น:
   - **Pool Size:** 15 (default)
   - **Max Client Connections:** 200
   - **Port:** `6543` (สำหรับ Connection Pooling)

---

## 📋 **ข้อมูลที่ต้อง Copy**

### **Option 1: Copy Connection Pooling URL (แนะนำ)**

Copy Connection Pooling URL ทั้งหมด:
```
postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres
```

**แยกเป็น:**
- `postgres` = DB_USER
- `Worachatp2547` = DB_PASSWORD
- `db.sqxfmorndklxuehgpbkv.supabase.co` = DB_HOST
- `6543` = DB_PORT (สำหรับ Connection Pooling)
- `postgres` = DB_DATABASE

---

### **Option 2: Copy แค่ Port**

ถ้าไม่เห็น Connection Pooling URL:
- Copy Port: `6543`
- ใช้ DB_HOST เดิม: `db.sqxfmorndklxuehgpbkv.supabase.co`
- ใช้ DB_USER เดิม: `postgres`
- ใช้ DB_DATABASE เดิม: `postgres`
- ใช้ DB_PASSWORD เดิม: `Worachatp2547`

---

## 🔧 **วิธีตั้งค่าใน Render**

### **วิธีที่ 1: ใช้ Port 6543 (ง่ายที่สุด)**

1. ไปที่ Render Dashboard → Settings → Environment
2. แก้ไข `DB_PORT`:
   ```
   DB_PORT=6543
   ```
3. **Save Changes**
4. **Redeploy**

---

### **วิธีที่ 2: ใช้ Connection Pooling URL ทั้งหมด**

1. ไปที่ Render Dashboard → Settings → Environment
2. เพิ่ม `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres
   ```
3. **Save Changes**
4. **Redeploy**

**หมายเหตุ:** ถ้าใช้วิธีนี้ ต้องแก้ไข `backend/db.js` ให้รองรับ `DATABASE_URL`

---

## 🎯 **สรุปขั้นตอน**

1. **Supabase Dashboard** → **Settings** → **Database**
2. **ดูที่ Connection string** หรือ **Connection pooling**
3. **Copy Port:** `6543` (หรือ Connection Pooling URL ทั้งหมด)
4. **Render Dashboard** → **Settings** → **Environment**
5. **แก้ไข `DB_PORT`** เป็น `6543`
6. **Save และ Redeploy**

---

## ⚠️ **หมายเหตุ**

- **Direct Connection (Port 5432):** เชื่อมต่อตรงกับ Database
- **Connection Pooling (Port 6543):** ใช้ PgBouncer สำหรับจัดการ connections (แนะนำสำหรับ production)

**Connection Pooling มีข้อดี:**
- ✅ รองรับ connections มากกว่า
- ✅ ประสิทธิภาพดีกว่า
- ✅ เหมาะสำหรับ production
- ✅ แก้ปัญหา IPv6 connection issues

---

**🔧 ลองดูที่ Connection string ใน Supabase Dashboard ครับ!**

