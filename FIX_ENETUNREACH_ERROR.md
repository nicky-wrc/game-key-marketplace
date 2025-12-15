# 🔧 แก้ไข ENETUNREACH Error (IPv6 Connection Issue)

## 🚨 ปัญหาที่พบ
```
Error: connect ENETUNREACH 2406:da18:243:7418:98e5:6dd8:8a5d:aeb7:5432
code: 'ENETUNREACH'
```

**สาเหตุ:**
- Render พยายามเชื่อมต่อ Database ด้วย IPv6 address
- Supabase Database อาจไม่รองรับ IPv6 หรือ Network ไม่สามารถเข้าถึงได้
- Render free tier อาจมีข้อจำกัดในการเชื่อมต่อ IPv6

---

## 🔧 **วิธีแก้ไข**

### **วิธีที่ 1: ใช้ Supabase Connection Pooling (แนะนำ) ⭐**

#### ขั้นตอน:

1. **ไปที่ Supabase Dashboard**
   - ไปที่ [https://supabase.com](https://supabase.com)
   - Sign in และเลือก Project ของคุณ

2. **เปิด Connection Pooling**
   - ไปที่ **Settings** → **Database**
   - ดูที่ **Connection Pooling**
   - Copy **Connection Pooling URL** หรือ **Connection Pooling Mode**

3. **อัพเดท Environment Variables ใน Render**
   - ไปที่ Render Dashboard → Settings → Environment
   - แก้ไข `DB_PORT` จาก `5432` เป็น `6543`
   - หรือเพิ่ม `DB_USE_POOLING=true`
   - **Save Changes**

4. **Redeploy Backend**
   - ไปที่ Render → Events → Redeploy

---

### **วิธีที่ 2: ใช้ Direct Connection (IPv4)**

#### ขั้นตอน:

1. **ตรวจสอบ Network Access ใน Supabase**
   - ไปที่ Supabase → Settings → Database
   - ดูที่ **Network Access**
   - ตรวจสอบว่า Render IP ถูกอนุญาต

2. **ใช้ Direct Connection String**
   - Copy **Connection String** (URI) จาก Supabase
   - ใช้ Port `5432` (Direct Connection)
   - ตรวจสอบว่า `DB_HOST` ถูกต้อง

3. **อัพเดท Environment Variables**
   - ตรวจสอบว่า `DB_HOST` เป็น domain name (ไม่ใช่ IP address)
   - ตัวอย่าง: `db.sqxfmorndklxuehgpbkv.supabase.co`

---

### **วิธีที่ 3: ใช้ Connection String แบบ Full URI**

#### ขั้นตอน:

1. **แก้ไข `backend/db.js`** (ถ้าต้องการ)
   - ใช้ Connection String แบบ full URI แทนการแยกค่า
   - ตัวอย่าง:
   ```javascript
   const connectionString = process.env.DATABASE_URL || 
     `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
   
   const pool = new Pool({
     connectionString: connectionString,
   });
   ```

2. **เพิ่ม `DATABASE_URL` ใน Render**
   - ไปที่ Render → Settings → Environment
   - เพิ่ม `DATABASE_URL` ด้วย Connection String จาก Supabase
   - ตัวอย่าง:
   ```
   DATABASE_URL=postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:5432/postgres
   ```

---

## 🎯 **วิธีแก้ไขที่แนะนำ (Connection Pooling)**

### **Step 1: เปิด Connection Pooling ใน Supabase**

1. ไปที่ Supabase Dashboard → Settings → Database
2. ดูที่ **Connection Pooling**
3. Copy **Connection Pooling URL** หรือ **Port**

### **Step 2: อัพเดท Environment Variables ใน Render**

1. ไปที่ Render Dashboard → Settings → Environment
2. แก้ไขหรือเพิ่ม:

```env
DB_PORT=6543
```

หรือ

```env
DB_USE_POOLING=true
DB_PORT=6543
```

3. **Save Changes**

### **Step 3: Redeploy Backend**

1. ไปที่ Render → Events
2. เลือก deployment ล่าสุด
3. กด **Redeploy**

### **Step 4: ทดสอบ**

1. เปิด Browser: `https://game-key-marketplace.onrender.com/test-db`
2. ควรเห็น: `{"message":"Database Connected!","time":"..."}`

---

## 📋 **Checklist แก้ไขปัญหา**

- [ ] เปิด Connection Pooling ใน Supabase
- [ ] อัพเดท `DB_PORT` เป็น `6543` ใน Render
- [ ] Save Environment Variables
- [ ] Redeploy Backend
- [ ] ทดสอบ Health Check (`/test-db`)
- [ ] ทดสอบ API (`/api/games`)

---

## 🆘 **ถ้ายังไม่ได้ผล**

### ตรวจสอบ Network Access:
1. ไปที่ Supabase → Settings → Database
2. ดูที่ **Network Access**
3. ตรวจสอบว่า Render IP ถูกอนุญาต
4. ถ้าไม่ → เพิ่ม IP ของ Render

### ตรวจสอบ Database Status:
1. ไปที่ Supabase Dashboard
2. ตรวจสอบว่า Database ทำงานได้
3. ทดสอบ Connection จาก Supabase SQL Editor

### ใช้ Direct Connection:
1. ใช้ Port `5432` (Direct Connection)
2. ตรวจสอบว่า `DB_HOST` ถูกต้อง
3. ตรวจสอบว่า `DB_PASSWORD` ถูกต้อง

---

## 🎯 **สรุปขั้นตอนแก้ไข**

1. **เปิด Connection Pooling ใน Supabase**
2. **อัพเดท `DB_PORT` เป็น `6543` ใน Render**
3. **Save และ Redeploy**
4. **ทดสอบ**

---

**🔧 ลองใช้ Connection Pooling (Port 6543) ก่อนครับ!**

