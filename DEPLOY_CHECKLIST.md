# ✅ Checklist สำหรับ Deploy ใหม่ - Game Key Marketplace

## 🎯 สิ่งที่ต้องตรวจสอบและแก้ไขในเว็บ Deploy

---

## 🔧 **Render (Backend) - game-key-marketplace**

### 1. **Environment Variables** (Settings → Environment)
ตรวจสอบว่ามีตัวแปรเหล่านี้ครบถ้วน:

```env
DB_USER=postgres
DB_HOST=xxx.supabase.co (หรือ database host ของคุณ)
DB_DATABASE=postgres
DB_PASSWORD=your_database_password
DB_PORT=5432
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

**⚠️ สำคัญ:**
- `DB_HOST` ต้องเป็น URL ของ Database ที่ deploy แล้ว (Supabase/Neon/Railway)
- `JWT_SECRET` ต้องเป็น random string ยาวๆ (ใช้ `openssl rand -base64 32` สร้าง)
- อย่าใช้ `localhost` ใน production

### 2. **Build Settings** (Settings → Build & Deploy)
ตรวจสอบว่า:

- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Root Directory:** `backend` (ถ้ามีตัวเลือกนี้)

### 3. **Health Check**
- **Health Check Path:** `/api/games` หรือ `/test-db`
- ตรวจสอบว่า Backend ทำงานได้โดยเข้าไปที่ URL: `https://game-key-marketplace.onrender.com/test-db`

### 4. **Auto-Deploy**
- ตรวจสอบว่า **Auto-Deploy** เปิดอยู่
- ตรวจสอบว่าเชื่อมต่อกับ GitHub repository ถูกต้อง
- Branch ที่ใช้: `main`

---

## 🎨 **Vercel (Frontend) - game-key-marketplace-frontend**

### 1. **Environment Variables** (Settings → Environment Variables)
ตรวจสอบว่ามีตัวแปรนี้:

```env
VITE_API_URL=https://game-key-marketplace.onrender.com
```

**⚠️ สำคัญ:**
- ต้องเป็น URL ของ Backend ที่ deploy แล้ว (จาก Render)
- ต้องใช้ `https://` เสมอ (ไม่ใช่ `http://`)
- อย่าลืมใส่ `/` ต่อท้ายหรือไม่ก็ได้ (แต่ควรไม่ใส่)

### 2. **Build Settings** (Settings → General)
ตรวจสอบว่า:

- **Framework Preset:** Vite (หรือ Other)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (จะรันใน frontend directory อัตโนมัติ)
- **Output Directory:** `dist` (จะอ้างอิงจาก frontend/dist)

### 3. **Deployment Settings**
- ตรวจสอบว่า **Production Branch** เป็น `main`
- ตรวจสอบว่า **Auto-Deploy** เปิดอยู่

### 4. **Redeploy หลังแก้ไข Environment Variables**
- หลังจากแก้ไข `VITE_API_URL` แล้ว **ต้อง Redeploy**
- ไปที่ **Deployments** → เลือก deployment ล่าสุด → กด **Redeploy**

---

## 🗄️ **Database (Supabase/Neon/Railway)**

### 1. **Database Connection**
- ตรวจสอบว่า Database ทำงานได้
- Copy Connection String ไว้ใช้ใน Environment Variables

### 2. **Run Database Migration**
หลังจาก deploy backend แล้ว ต้องรัน SQL migration:

```sql
-- รันไฟล์ backend/database.sql ใน Database
```

**วิธีรัน:**
- **Supabase:** ไปที่ SQL Editor → Paste SQL → Run
- **Neon:** ไปที่ SQL Editor → Paste SQL → Run
- **Railway:** ใช้ Railway CLI หรือ SQL Editor

### 3. **Seed Database (ถ้าต้องการ)**
```sql
-- รันไฟล์ backend/seed.sql ใน Database
```

---

## 🔍 **การตรวจสอบหลัง Deploy**

### 1. **ตรวจสอบ Backend**
```bash
# ทดสอบ Health Check
curl https://game-key-marketplace.onrender.com/test-db

# ทดสอบ API
curl https://game-key-marketplace.onrender.com/api/games
```

### 2. **ตรวจสอบ Frontend**
- เปิดเว็บ: `https://game-key-marketplace-frontend.vercel.app`
- เปิด Browser Console (F12)
- ตรวจสอบว่าไม่มี CORS Error
- ตรวจสอบว่า API calls ไปถูก URL

### 3. **ทดสอบฟีเจอร์**
- ✅ Login/Register
- ✅ ดูรายการเกม
- ✅ ซื้อเกม
- ✅ Top Up
- ✅ Gacha

---

## 🚨 **ปัญหาที่พบบ่อย**

### ปัญหา 1: CORS Error
**อาการ:** Frontend ไม่สามารถเรียก API ได้

**แก้ไข:**
1. ตรวจสอบว่า Backend ตั้งค่า CORS ถูกต้อง:
   ```javascript
   app.use(cors()); // ใน backend/server.js
   ```
2. ตรวจสอบว่า `VITE_API_URL` ใน Vercel ถูกต้อง

### ปัญหา 2: Database Connection Failed
**อาการ:** Backend ไม่สามารถเชื่อมต่อ Database ได้

**แก้ไข:**
1. ตรวจสอบ Environment Variables ใน Render
2. ตรวจสอบว่า Database อนุญาต connection จาก IP ของ Render
3. ตรวจสอบ Connection String

### ปัญหา 3: Frontend ไม่แสดงข้อมูล
**อาการ:** หน้าเว็บโหลดแต่ไม่มีข้อมูล

**แก้ไข:**
1. เปิด Browser Console (F12)
2. ตรวจสอบ Network tab ว่า API calls ไปถูก URL หรือไม่
3. ตรวจสอบว่า `VITE_API_URL` ใน Vercel ถูกต้อง
4. **Redeploy Frontend** หลังแก้ไข Environment Variables

### ปัญหา 4: Build Failed
**อาการ:** Deploy ล้มเหลว

**แก้ไข:**
1. ตรวจสอบ Build Logs ใน Render/Vercel
2. ตรวจสอบว่า `package.json` มี dependencies ครบ
3. ตรวจสอบว่า Build Command ถูกต้อง

---

## 📝 **ขั้นตอน Deploy ใหม่ (สรุป)**

### Step 1: ตรวจสอบ Backend (Render)
1. ✅ ตรวจสอบ Environment Variables
2. ✅ ตรวจสอบ Build Settings
3. ✅ Deploy/Redeploy Backend
4. ✅ ทดสอบ Backend API

### Step 2: ตรวจสอบ Frontend (Vercel)
1. ✅ ตรวจสอบ Environment Variables (`VITE_API_URL`)
2. ✅ ตรวจสอบ Build Settings
3. ✅ **Redeploy Frontend** (สำคัญ!)
4. ✅ ทดสอบ Frontend

### Step 3: ตรวจสอบ Database
1. ✅ Run Migration (database.sql)
2. ✅ Run Seed (seed.sql) - ถ้าต้องการ
3. ✅ ทดสอบ Database Connection

### Step 4: ทดสอบระบบ
1. ✅ ทดสอบ Login/Register
2. ✅ ทดสอบซื้อเกม
3. ✅ ทดสอบฟีเจอร์อื่นๆ

---

## 🎯 **สิ่งที่ต้องแก้ไขในเว็บ Deploy**

### Render (Backend):
1. **Environment Variables** - ตรวจสอบว่าครบถ้วนและถูกต้อง
2. **Build Command** - `cd backend && npm install`
3. **Start Command** - `cd backend && npm start`
4. **Root Directory** - `backend` (ถ้ามี)

### Vercel (Frontend):
1. **Environment Variables** - `VITE_API_URL=https://game-key-marketplace.onrender.com`
2. **Root Directory** - `frontend`
3. **Build Command** - `npm run build`
4. **Output Directory** - `dist`
5. **Redeploy** - หลังแก้ไข Environment Variables

---

## ✅ **Checklist สรุป**

### Render (Backend):
- [ ] Environment Variables ครบถ้วน
- [ ] Build Command ถูกต้อง
- [ ] Start Command ถูกต้อง
- [ ] Root Directory ถูกต้อง
- [ ] Backend Deploy สำเร็จ
- [ ] Health Check ทำงานได้

### Vercel (Frontend):
- [ ] Environment Variables (`VITE_API_URL`) ถูกต้อง
- [ ] Root Directory ถูกต้อง
- [ ] Build Command ถูกต้อง
- [ ] Output Directory ถูกต้อง
- [ ] Frontend Deploy สำเร็จ
- [ ] Frontend เชื่อมต่อ Backend ได้

### Database:
- [ ] Database Migration รันแล้ว
- [ ] Database Seed รันแล้ว (ถ้าต้องการ)
- [ ] Database Connection ทำงานได้

### ทดสอบ:
- [ ] Login/Register ทำงานได้
- [ ] ดูรายการเกมได้
- [ ] ซื้อเกมได้
- [ ] Top Up ทำงานได้
- [ ] Gacha ทำงานได้

---

**🎉 Happy Deploying!**

