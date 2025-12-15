# 🔧 วิธีตั้งค่า Connection Pooling ใน Supabase

## 🎯 จากหน้า "Connect to your project"

---

## **Step 1: เปลี่ยน Method**

1. **ดูที่ dropdown "Method"**
   - ตอนนี้เลือก: **"Direct connection"**
   - เปลี่ยนเป็น: **"Session Pooler"** หรือ **"Connection Pooling"**

2. **คลิกที่ dropdown "Method"**
   - เลือก **"Session Pooler"** หรือ **"Transaction Pooler"**

---

## **Step 2: Copy Connection String**

หลังจากเปลี่ยน Method แล้ว:

1. **Connection String จะเปลี่ยนเป็น:**
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres?pgbouncer=true
   ```

2. **สังเกต:**
   - Port เปลี่ยนจาก `5432` เป็น `6543`
   - มี `?pgbouncer=true` ต่อท้าย

3. **Copy Connection String นี้**

---

## **Step 3: แยกข้อมูล**

จาก Connection String:
```
postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres?pgbouncer=true
```

**แยกเป็น:**
- `postgres` = DB_USER
- `Worachatp2547` = DB_PASSWORD
- `db.sqxfmorndklxuehgpbkv.supabase.co` = DB_HOST
- `6543` = DB_PORT (สำหรับ Connection Pooling)
- `postgres` = DB_DATABASE

---

## **Step 4: อัพเดทใน Render**

### **วิธีที่ 1: ใช้ Port 6543 (ง่ายที่สุด)**

1. ไปที่ **Render Dashboard** → **Settings** → **Environment**
2. แก้ไข `DB_PORT`:
   ```
   DB_PORT=6543
   ```
3. **Save Changes**
4. **Redeploy**

---

### **วิธีที่ 2: ใช้ Connection String ทั้งหมด**

1. ไปที่ **Render Dashboard** → **Settings** → **Environment**
2. เพิ่ม `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres:Worachatp2547@db.sqxfmorndklxuehgpbkv.supabase.co:6543/postgres?pgbouncer=true
   ```
3. **Save Changes**
4. **Redeploy**

---

## ⚠️ **Warning ที่เห็น**

**"Not IPv4 compatible. Use Session Pooler if on a IPv4 network"**

**นี่คือสาเหตุของปัญหา!**
- Direct connection (Port 5432) = ไม่รองรับ IPv4
- Session Pooler (Port 6543) = รองรับ IPv4 ✅

**วิธีแก้:**
- เปลี่ยน Method เป็น **"Session Pooler"** หรือ **"Transaction Pooler"**
- ใช้ Port `6543` แทน `5432`

---

## 🎯 **สรุปขั้นตอน**

1. **Supabase Dashboard** → **Settings** → **Database**
2. **คลิก "Connect to your project"** (หรือดูที่ Connection String)
3. **เปลี่ยน Method** จาก "Direct connection" เป็น **"Session Pooler"**
4. **Copy Connection String** ที่มี Port `6543`
5. **Render Dashboard** → **Settings** → **Environment**
6. **แก้ไข `DB_PORT`** เป็น `6543`
7. **Save และ Redeploy**

---

## 📋 **Checklist**

- [ ] เปลี่ยน Method เป็น "Session Pooler"
- [ ] Copy Connection String ที่มี Port 6543
- [ ] อัพเดท `DB_PORT=6543` ใน Render
- [ ] Save Environment Variables
- [ ] Redeploy Backend
- [ ] ทดสอบ Health Check (`/test-db`)

---

**🔧 เปลี่ยน Method เป็น "Session Pooler" แล้ว Copy Connection String ครับ!**

