# 🚀 Quick Deploy Guide - Game Key Marketplace

## ⚡ Deploy แบบเร็ว (แนะนำสำหรับมือใหม่)

### 🎯 แผนการ Deploy ที่แนะนำ:
- **Backend:** Railway (ฟรี $5/เดือน)
- **Frontend:** Vercel (ฟรี)
- **Database:** Supabase (ฟรี)

---

## 📝 ขั้นตอนที่ 1: เตรียม Database (Supabase)

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง Account (Sign in with GitHub)
3. กด "New Project"
4. ตั้งค่า:
   - **Name:** game-key-marketplace
   - **Database Password:** ตั้งรหัสผ่านที่แข็งแรง (จำไว้!)
   - **Region:** เลือกใกล้ที่สุด
5. รอให้สร้างเสร็จ (ประมาณ 2 นาที)
6. ไปที่ **Settings** → **Database**
7. Copy **Connection String** (URI) ไว้ใช้ตอนหลัง

---

## 🔧 ขั้นตอนที่ 2: Deploy Backend (Railway)

### 2.1 เตรียม GitHub Repository
1. Push โค้ดขึ้น GitHub (ถ้ายังไม่มี)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/game-key-marketplace.git
   git push -u origin main
   ```

### 2.2 Deploy บน Railway
1. ไปที่ [railway.app](https://railway.app)
2. Sign in with GitHub
3. กด **"New Project"**
4. เลือก **"Deploy from GitHub repo"**
5. เลือก repository ของคุณ
6. Railway จะ detect โค้ดอัตโนมัติ

### 2.3 ตั้งค่า Environment Variables
1. ไปที่ **Variables** tab
2. เพิ่มตัวแปรต่อไปนี้:

```
DB_USER=postgres
DB_HOST=db.xxx.supabase.co
DB_DATABASE=postgres
DB_PASSWORD=your_supabase_password
DB_PORT=5432
PORT=5000
JWT_SECRET=your_random_secret_key_here
```

**วิธีสร้าง JWT_SECRET:**
- ใช้ [randomkeygen.com](https://randomkeygen.com) เลือก "CodeIgniter Encryption Keys"
- หรือใช้คำสั่ง: `openssl rand -base64 32`

**วิธีหา Database Info จาก Supabase:**
- ไปที่ Supabase Dashboard → Settings → Database
- **Connection string:** `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`
- แยกเป็น:
  - `DB_HOST`: `db.xxx.supabase.co`
  - `DB_USER`: `postgres`
  - `DB_DATABASE`: `postgres`
  - `DB_PASSWORD`: รหัสผ่านที่ตั้งไว้
  - `DB_PORT`: `5432`

### 2.4 เพิ่ม PostgreSQL Database (ถ้าใช้ Railway Database)
1. กด **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway จะสร้างให้อัตโนมัติ
3. Copy connection string จาก Railway ไปใส่ใน Environment Variables

### 2.5 Run Database Migration
1. ไปที่ **Deployments** tab
2. กด **"..."** → **"Run Command"**
3. พิมพ์: `cd backend && npm run migrate`
4. กด Run

### 2.6 Seed Database (ถ้าต้องการ)
1. ไปที่ **Deployments** tab
2. กด **"..."** → **"Run Command"**
3. พิมพ์: `cd backend && npm run seed`
4. กด Run

### 2.7 Copy Backend URL
1. ไปที่ **Settings** → **Domains**
2. Copy **Default Domain** (เช่น: `game-key-marketplace-production.up.railway.app`)
3. เก็บไว้ใช้ตอน deploy frontend

---

## 🎨 ขั้นตอนที่ 3: Deploy Frontend (Vercel)

### 3.1 Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 3.2 Deploy บน Vercel
1. ไปที่ [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. กด **"Add New Project"**
4. เลือก repository ของคุณ
5. ตั้งค่า:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3.3 ตั้งค่า Environment Variables
1. ไปที่ **Settings** → **Environment Variables**
2. เพิ่ม:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (เปลี่ยน `your-backend-url.railway.app` เป็น URL ที่ copy จาก Railway)

### 3.4 Redeploy
1. ไปที่ **Deployments**
2. เลือก deployment ล่าสุด
3. กด **"..."** → **"Redeploy"**

---

## ✅ ตรวจสอบการทำงาน

### 1. ทดสอบ Backend
- เปิด: `https://your-backend-url.railway.app/api/games`
- ควรเห็น JSON response

### 2. ทดสอบ Frontend
- เปิด URL จาก Vercel
- ควรเห็นหน้าเว็บ
- ทดสอบ Login/Register
- ทดสอบซื้อเกม

---

## 🐛 Troubleshooting

### Backend ไม่ทำงาน
- ตรวจสอบ Environment Variables
- ตรวจสอบ Database Connection
- ดู Logs ใน Railway

### Frontend ไม่แสดงข้อมูล
- ตรวจสอบ `VITE_API_URL` ใน Vercel
- ตรวจสอบ Console ใน Browser (F12)
- ตรวจสอบ Network tab

### CORS Error
- ตรวจสอบว่า Backend ตั้งค่า CORS ถูกต้อง
- ตรวจสอบว่า Frontend URL ถูกต้อง

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 🎉 เสร็จแล้ว!

ตอนนี้เว็บไซต์ของคุณพร้อมใช้งานแล้ว! 🚀

**Next Steps:**
- [ ] ตั้งค่า Custom Domain (ถ้าต้องการ)
- [ ] ตั้งค่า SSL Certificate (อัตโนมัติ)
- [ ] ทดสอบทุกฟีเจอร์
- [ ] แชร์ให้เพื่อนๆ ใช้!

