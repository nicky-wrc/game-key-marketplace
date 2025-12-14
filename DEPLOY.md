# 🚀 คู่มือการ Deploy Game Key Marketplace

## 📋 สารบัญ
1. [เตรียมความพร้อม](#เตรียมความพร้อม)
2. [Deploy Backend](#deploy-backend)
3. [Deploy Frontend](#deploy-frontend)
4. [ตั้งค่า Database](#ตั้งค่า-database)
5. [Environment Variables](#environment-variables)

---

## 🛠️ เตรียมความพร้อม

### สิ่งที่ต้องมี:
- ✅ GitHub Account
- ✅ PostgreSQL Database (แนะนำใช้ [Supabase](https://supabase.com) หรือ [Neon](https://neon.tech) ฟรี)
- ✅ Account บน Platform ที่เลือก (Vercel, Railway, Render)

---

## 🗄️ ตั้งค่า Database

### ตัวเลือก Database (แนะนำ):

#### 1. **Supabase** (ฟรี, ง่ายที่สุด) ⭐ แนะนำ
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. ไปที่ Settings → Database
4. Copy Connection String (URI)
5. ใช้ข้อมูลนี้ใน Environment Variables

#### 2. **Neon** (ฟรี, Serverless PostgreSQL)
1. ไปที่ [neon.tech](https://neon.tech)
2. สร้างโปรเจคใหม่
3. Copy Connection String
4. ใช้ข้อมูลนี้ใน Environment Variables

#### 3. **Railway PostgreSQL** (ถ้าใช้ Railway)
- Railway จะสร้างให้อัตโนมัติเมื่อ deploy

---

## 🔧 Deploy Backend

### ตัวเลือก 1: Railway (แนะนำ) ⭐

**ทำไมเลือก Railway:**
- ✅ ฟรี $5/เดือน
- ✅ รองรับ PostgreSQL
- ✅ Deploy ง่าย
- ✅ Auto-deploy จาก GitHub

**ขั้นตอน:**

1. **เตรียมไฟล์:**
   - สร้างไฟล์ `railway.json` (มีให้แล้ว)
   - สร้างไฟล์ `Procfile` (มีให้แล้ว)

2. **Deploy:**
   - ไปที่ [railway.app](https://railway.app)
   - Sign in with GitHub
   - กด "New Project" → "Deploy from GitHub repo"
   - เลือก repository ของคุณ
   - เลือก "Backend" service

3. **ตั้งค่า Environment Variables:**
   ```
   DB_USER=postgres
   DB_HOST=xxx.railway.app
   DB_DATABASE=railway
   DB_PASSWORD=xxx
   DB_PORT=5432
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

4. **ตั้งค่า PostgreSQL:**
   - กด "New" → "Database" → "Add PostgreSQL"
   - Railway จะสร้างให้อัตโนมัติ
   - Copy connection string ไปใส่ใน Environment Variables

5. **Run Migration:**
   - ไปที่ Deployments → View Logs
   - หรือใช้ Railway CLI: `railway run npm run migrate`

---

### ตัวเลือก 2: Render

**ขั้นตอน:**

1. **เตรียมไฟล์:**
   - สร้างไฟล์ `render.yaml` (มีให้แล้ว)

2. **Deploy:**
   - ไปที่ [render.com](https://render.com)
   - Sign in with GitHub
   - กด "New" → "Web Service"
   - เชื่อมต่อ GitHub repository
   - ตั้งค่า:
     - **Name:** game-key-marketplace-backend
     - **Environment:** Node
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Root Directory:** `backend`

3. **ตั้งค่า Environment Variables:**
   - ไปที่ Environment → Add Environment Variable
   - เพิ่มตัวแปรทั้งหมดจาก `.env.example`

4. **ตั้งค่า PostgreSQL:**
   - กด "New" → "PostgreSQL"
   - Render จะสร้างให้อัตโนมัติ
   - Copy connection string ไปใส่ใน Environment Variables

---

### ตัวเลือก 3: Heroku

**ขั้นตอน:**

1. **ติดตั้ง Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **สร้าง App:**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **เพิ่ม PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **ตั้งค่า Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## 🎨 Deploy Frontend

### ตัวเลือก 1: Vercel (แนะนำ) ⭐

**ทำไมเลือก Vercel:**
- ✅ ฟรี
- ✅ Deploy เร็วมาก
- ✅ Auto-deploy จาก GitHub
- ✅ Custom Domain ฟรี

**ขั้นตอน:**

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy:**
   - ไปที่ [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - กด "Add New Project"
   - เลือก repository ของคุณ
   - ตั้งค่า:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **ตั้งค่า Environment Variables:**
   - ไปที่ Settings → Environment Variables
   - เพิ่ม:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - **สำคัญ:** ต้องใส่ URL ของ Backend ที่ deploy แล้ว

4. **Redeploy:**
   - หลังจากตั้งค่า Environment Variables แล้ว
   - ไปที่ Deployments → เลือก deployment ล่าสุด → Redeploy

---

### ตัวเลือก 2: Netlify

**ขั้นตอน:**

1. **Deploy:**
   - ไปที่ [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - กด "Add new site" → "Import an existing project"
   - เลือก repository

2. **ตั้งค่า Build:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

3. **ตั้งค่า Environment Variables:**
   - ไปที่ Site settings → Environment variables
   - เพิ่ม `VITE_API_URL`

---

### ตัวเลือก 3: Render (Frontend)

**ขั้นตอน:**

1. **Deploy:**
   - ไปที่ [render.com](https://render.com)
   - กด "New" → "Static Site"
   - เชื่อมต่อ GitHub repository

2. **ตั้งค่า:**
   - **Name:** game-key-marketplace-frontend
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

---

## 🔐 Environment Variables

### Backend (.env):
```env
DB_USER=postgres
DB_HOST=xxx.supabase.co
DB_DATABASE=postgres
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend-url.railway.app
```

**⚠️ หมายเหตุ:**
- อย่าลืมเปลี่ยน `localhost:5000` ใน frontend เป็น URL ของ backend ที่ deploy แล้ว
- ใช้ `https://` เสมอใน production
- JWT_SECRET ควรเป็น random string ยาวๆ (ใช้ `openssl rand -base64 32`)

---

## 📝 หลัง Deploy

### 1. Run Database Migration:
```bash
# ถ้าใช้ Railway
railway run npm run migrate

# ถ้าใช้ Render
render run npm run migrate
```

### 2. Seed Database (ถ้าต้องการ):
```bash
railway run npm run seed
```

### 3. ตรวจสอบ:
- ✅ Backend API ทำงาน (ทดสอบด้วย Postman)
- ✅ Frontend เชื่อมต่อ Backend ได้
- ✅ Database มีข้อมูล

---

## 🆘 Troubleshooting

### ปัญหา: CORS Error
**แก้ไข:** ตรวจสอบว่า Backend ตั้งค่า CORS ถูกต้อง:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
```

### ปัญหา: Database Connection Failed
**แก้ไข:** 
- ตรวจสอบ Environment Variables
- ตรวจสอบว่า Database อนุญาต connection จาก IP ของ server

### ปัญหา: Frontend ไม่แสดงข้อมูล
**แก้ไข:**
- ตรวจสอบ `VITE_API_URL` ใน Frontend
- ตรวจสอบ Console ใน Browser (F12)
- ตรวจสอบ Network tab ว่า API call ไปถูก URL หรือไม่

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## ✅ Checklist

- [ ] Database สร้างแล้ว
- [ ] Backend Deploy แล้ว
- [ ] Environment Variables ตั้งค่าแล้ว
- [ ] Database Migration รันแล้ว
- [ ] Frontend Deploy แล้ว
- [ ] Frontend เชื่อมต่อ Backend ได้
- [ ] ทดสอบ Login/Register
- [ ] ทดสอบซื้อเกม
- [ ] Custom Domain (ถ้าต้องการ)

---

**🎉 Happy Deploying!**

