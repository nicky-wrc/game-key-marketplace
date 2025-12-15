# 🔧 แก้ไข Database Connection Error

## 🚨 ปัญหาที่พบ
- `/test-db` แสดง: `Database connection error`
- `/api/games` แสดง: `{"message":"Server error"}`

---

## 🔍 **Step 1: ตรวจสอบ Environment Variables ใน Render**

### 1.1 ไปที่ Render Dashboard
1. ไปที่ [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in และเลือก Service: **game-key-marketplace**
3. ไปที่ **Settings** → **Environment**

### 1.2 ตรวจสอบ Environment Variables
ตรวจสอบว่ามีตัวแปรเหล่านี้ครบถ้วนและถูกต้อง:

```env
DB_USER=postgres
DB_HOST=db.sqxfmorndklxuehgpbkv.supabase.co
DB_DATABASE=postgres
DB_PASSWORD=Worachatp2547
DB_PORT=5432
PORT=5000
JWT_SECRET=nickysecretkey12345
NODE_ENV=production
```

**⚠️ ตรวจสอบ:**
- `DB_HOST` ต้องไม่มี `postgresql://` นำหน้า
- `DB_HOST` ต้องไม่มี `:5432` ต่อท้าย
- `DB_PASSWORD` ต้องถูกต้อง (ไม่มี space หรืออักขระพิเศษ)
- `DB_PORT` ต้องเป็น `5432`

---

## 🔍 **Step 2: ตรวจสอบ Logs ใน Render**

### 2.1 ดู Logs
1. ไปที่ Render Dashboard → **Logs**
2. ดู Error messages ล่าสุด
3. ตรวจสอบว่าเห็น Error อะไร

### 2.2 Error ที่พบบ่อย

#### Error: "password authentication failed"
**สาเหตุ:** DB_PASSWORD ไม่ถูกต้อง

**แก้ไข:**
1. ตรวจสอบรหัสผ่านใน Supabase
2. ไปที่ Supabase → Settings → Database
3. ตรวจสอบ Database Password
4. อัพเดท `DB_PASSWORD` ใน Render

#### Error: "getaddrinfo ENOTFOUND"
**สาเหตุ:** DB_HOST ไม่ถูกต้อง

**แก้ไข:**
1. ตรวจสอบ `DB_HOST` ใน Render
2. ต้องเป็น: `db.xxx.supabase.co` (ไม่มี `postgresql://` หรือ `:5432`)
3. Copy จาก Supabase → Settings → Database → Connection string

#### Error: "timeout"
**สาเหตุ:** Database ไม่สามารถเชื่อมต่อได้

**แก้ไข:**
1. ตรวจสอบว่า Database ใน Supabase ทำงานได้
2. ตรวจสอบว่า Connection Pooling เปิดอยู่
3. ลองใช้ Connection Pooling URL จาก Supabase

---

## 🔧 **Step 3: ตรวจสอบ Supabase Connection**

### 3.1 ตรวจสอบ Database Status
1. ไปที่ Supabase Dashboard
2. ไปที่ **Settings** → **Database**
3. ตรวจสอบว่า Database ทำงานได้

### 3.2 ตรวจสอบ Connection String
1. ไปที่ Supabase → Settings → Database
2. ดูที่ **Connection string** (URI)
3. Copy Connection String

**ตัวอย่าง:**
```
postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:5432/postgres
```

**แยกเป็น:**
- `postgres` = DB_USER
- `Worachatp2547` = DB_PASSWORD
- `db.sqxfmorndklxuehgpbkv.supabase.co` = DB_HOST
- `5432` = DB_PORT
- `postgres` = DB_DATABASE

### 3.3 ตรวจสอบ Connection Pooling
1. ไปที่ Supabase → Settings → Database
2. ดูที่ **Connection Pooling**
3. ตรวจสอบว่าเปิดอยู่

---

## 🔧 **Step 4: แก้ไขปัญหา**

### 4.1 อัพเดท Environment Variables
1. ไปที่ Render → Settings → Environment
2. ตรวจสอบและแก้ไข Environment Variables
3. **Save Changes**
4. **Redeploy** Backend

### 4.2 ตรวจสอบ Connection Pooling
ถ้าใช้ Connection Pooling:
- ใช้ Port: `6543` แทน `5432`
- ใช้ Connection Pooling URL จาก Supabase

---

## 🧪 **Step 5: ทดสอบใหม่**

### 5.1 ทดสอบ Health Check
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

### 5.2 ทดสอบ API
1. เปิด Browser ไปที่:
   ```
   https://game-key-marketplace.onrender.com/api/games
   ```
2. **ควรเห็น:** JSON ของเกมทั้งหมด

---

## 🆘 **วิธีแก้ไขเพิ่มเติม**

### ถ้ายังไม่ได้ผล:

#### 1. ตรวจสอบ Database Password
1. ไปที่ Supabase → Settings → Database
2. กด **Reset Database Password** (ถ้าจำเป็น)
3. อัพเดท `DB_PASSWORD` ใน Render
4. Redeploy

#### 2. ตรวจสอบ Network Access
1. ไปที่ Supabase → Settings → Database
2. ตรวจสอบว่า **Network Access** อนุญาต connection จาก Render
3. ถ้าไม่ → เพิ่ม IP ของ Render

#### 3. ใช้ Connection Pooling
1. ไปที่ Supabase → Settings → Database
2. Copy **Connection Pooling URL**
3. ใช้ Port `6543` แทน `5432`
4. อัพเดท Environment Variables

---

## 📋 **Checklist แก้ไขปัญหา**

- [ ] ตรวจสอบ Environment Variables ใน Render
- [ ] ตรวจสอบ Logs ใน Render
- [ ] ตรวจสอบ Database Status ใน Supabase
- [ ] ตรวจสอบ Connection String ใน Supabase
- [ ] อัพเดท Environment Variables
- [ ] Redeploy Backend
- [ ] ทดสอบ Health Check (`/test-db`)
- [ ] ทดสอบ API (`/api/games`)

---

## 🎯 **สรุปขั้นตอนแก้ไข**

1. **ตรวจสอบ Environment Variables:**
   - Render → Settings → Environment
   - ตรวจสอบ `DB_HOST`, `DB_PASSWORD`, `DB_PORT`

2. **ตรวจสอบ Logs:**
   - Render → Logs
   - ดู Error messages

3. **ตรวจสอบ Supabase:**
   - Supabase → Settings → Database
   - ตรวจสอบ Connection String

4. **แก้ไขและ Redeploy:**
   - อัพเดท Environment Variables
   - Save และ Redeploy

5. **ทดสอบ:**
   - `/test-db`
   - `/api/games`

---

**🔧 ลองทำตามขั้นตอนนี้ดูครับ!**

