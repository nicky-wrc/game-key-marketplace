# 📍 ดูค่า Environment Variables จากไหนได้บ้าง?

## 🎯 สรุปค่า Environment Variables ที่ต้องตั้งค่า

---

## 🔍 **1. Database Values (จาก Supabase)**

### **DB_USER**
- **ค่า:** `postgres`
- **ดูจาก:** Supabase Dashboard → Settings → Database
- **หมายเหตุ:** มักจะเป็น `postgres` เสมอ (default)

### **DB_HOST**
- **ค่า:** `db.sqxfmorndklxuehgpbkv.supabase.co`
- **ดูจาก:** Supabase Dashboard → Settings → Database → Connection string
- **วิธีหา:**
  1. ไปที่ Supabase Dashboard
  2. เลือก Project ของคุณ
  3. ไปที่ **Settings** → **Database**
  4. ดูที่ **Connection string** (URI)
  5. Copy ส่วน `db.xxx.supabase.co` (ไม่ต้องใส่ `postgresql://` และส่วนอื่นๆ)

### **DB_DATABASE**
- **ค่า:** `postgres`
- **ดูจาก:** Supabase Dashboard → Settings → Database
- **หมายเหตุ:** มักจะเป็น `postgres` เสมอ (default)

### **DB_PASSWORD**
- **ค่า:** `Worachatp2547` (ตัวอย่าง)
- **ดูจาก:** รหัสผ่านที่ตั้งไว้ตอนสร้าง Supabase Project
- **วิธีหา:**
  1. ไปที่ Supabase Dashboard → Settings → Database
  2. ดูที่ **Database Password**
  3. ถ้าลืม → กด **Reset Database Password** (ระวัง: จะต้องอัพเดททุกที่ที่ใช้)

### **DB_PORT**
- **ค่า:** `5432`
- **ดูจาก:** Supabase Dashboard → Settings → Database
- **หมายเหตุ:** มักจะเป็น `5432` เสมอ (default PostgreSQL port)

---

## 🔐 **2. JWT_SECRET**

### **JWT_SECRET**
- **ค่า:** `nickysecretkey12345` (ตัวอย่าง - ควรเปลี่ยนเป็น random string ยาวๆ)
- **ดูจาก:** 
  - **ถ้ามีใน Render:** ไปที่ Render Dashboard → Settings → Environment
  - **ถ้ายังไม่มี:** ต้องสร้างใหม่ (ดูด้านล่าง)

### **วิธีสร้าง JWT_SECRET ใหม่:**

#### วิธีที่ 1: ใช้ OpenSSL (แนะนำ)
```bash
openssl rand -base64 32
```

#### วิธีที่ 2: ใช้ Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### วิธีที่ 3: ใช้ Online Generator
- ไปที่: https://randomkeygen.com/
- เลือก "CodeIgniter Encryption Keys"
- Copy ค่าที่ได้

**⚠️ หมายเหตุ:** 
- JWT_SECRET ควรเป็น random string ยาวๆ (อย่างน้อย 32 characters)
- อย่าใช้คำง่ายๆ เช่น `nickysecretkey12345` ใน production จริง
- เก็บค่าไว้อย่างปลอดภัย (อย่าแชร์)

---

## ⚙️ **3. PORT**

### **PORT**
- **ค่า:** `5000`
- **ดูจาก:** 
  - **Render:** Settings → Environment (ถ้าตั้งไว้)
  - **Default:** `5000` (จาก `backend/server.js`: `process.env.PORT || 5000`)
- **หมายเหตุ:** มักจะเป็น `5000` เสมอ (ไม่ต้องเปลี่ยน)

---

## 🌐 **4. NODE_ENV**

### **NODE_ENV**
- **ค่า:** `production`
- **ดูจาก:** 
  - **Render:** Settings → Environment (ถ้าตั้งไว้)
  - **Default:** ไม่มี (ถ้าไม่ตั้ง)
- **หมายเหตุ:** 
  - ควรตั้งเป็น `production` ใน Render
  - ไม่จำเป็นต้องมีใน local development

---

## 📋 **สรุป: ดูจากไหน?**

### **จาก Supabase Dashboard:**
1. ไปที่ [https://supabase.com](https://supabase.com)
2. Sign in และเลือก Project ของคุณ
3. ไปที่ **Settings** → **Database**
4. ดูที่ **Connection string** (URI)

**ตัวอย่าง Connection String:**
```
postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:5432/postgres
```

**แยกเป็น:**
- `postgresql://` = Protocol (ไม่ต้องใส่)
- `postgres` = DB_USER
- `Worachatp2547` = DB_PASSWORD
- `db.sqxfmorndklxuehgpbkv.supabase.co` = DB_HOST
- `5432` = DB_PORT
- `postgres` = DB_DATABASE

---

### **จาก Render Dashboard:**
1. ไปที่ [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in และเลือก Service: **game-key-marketplace**
3. ไปที่ **Settings** → **Environment**
4. ดู Environment Variables ทั้งหมด

---

## ✅ **ตรวจสอบค่าที่ตั้งไว้แล้ว**

จากรูปภาพที่คุณแสดง:
- ✅ **DB_USER:** `postgres` ✓
- ✅ **DB_HOST:** `db.sqxfmorndklxuehgpbkv.supabase.co` ✓
- ✅ **DB_DATABASE:** `postgres` ✓
- ✅ **DB_PASSWORD:** `Worachatp2547` ✓
- ✅ **DB_PORT:** `5432` ✓
- ✅ **PORT:** `5000` ✓
- ✅ **JWT_SECRET:** `nickysecretkey12345` ✓

**⚠️ คำแนะนำ:**
- JWT_SECRET ควรเปลี่ยนเป็น random string ยาวๆ ที่ปลอดภัยกว่า
- ใช้ `openssl rand -base64 32` สร้างใหม่

---

## 🎯 **ขั้นตอนต่อไป**

1. **ตรวจสอบว่า Environment Variables ครบถ้วน** ✓ (ดูจากรูปแล้วครบ)
2. **Redeploy Backend** (ถ้ายังไม่ได้ deploy)
3. **ทดสอบ Backend:** `https://game-key-marketplace.onrender.com/test-db`
4. **ตั้งค่า Frontend:** เพิ่ม `VITE_API_URL` ใน Vercel

---

**🎉 ดูเหมือนว่าคุณตั้งค่า Environment Variables ครบถ้วนแล้ว!**

