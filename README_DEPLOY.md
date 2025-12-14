# 🚀 Game Key Marketplace - Deployment Guide

## 📦 โครงสร้างโปรเจค

```
game-key-marketplace/
├── backend/          # Express.js Backend API
├── frontend/         # React + Vite Frontend
├── DEPLOY.md        # คู่มือ Deploy แบบละเอียด
├── QUICK_DEPLOY.md  # คู่มือ Deploy แบบเร็ว
└── README_DEPLOY.md # ไฟล์นี้
```

---

## 🎯 แนะนำ Platform สำหรับ Deploy

### Backend:
- ⭐ **Railway** (แนะนำ) - ฟรี $5/เดือน, ง่าย, รองรับ PostgreSQL
- **Render** - ฟรี, รองรับ PostgreSQL
- **Heroku** - ฟรี (จำกัด), รองรับ PostgreSQL

### Frontend:
- ⭐ **Vercel** (แนะนำ) - ฟรี, เร็วมาก, Auto-deploy
- **Netlify** - ฟรี, ง่าย
- **Render** - ฟรี, Static Site

### Database:
- ⭐ **Supabase** (แนะนำ) - ฟรี, PostgreSQL, ง่าย
- **Neon** - ฟรี, Serverless PostgreSQL
- **Railway PostgreSQL** - ถ้าใช้ Railway

---

## 📋 Checklist ก่อน Deploy

- [ ] โค้ด push ขึ้น GitHub แล้ว
- [ ] Database สร้างแล้ว (Supabase/Neon)
- [ ] Environment Variables เตรียมไว้แล้ว
- [ ] JWT_SECRET สร้างแล้ว
- [ ] Database Migration SQL พร้อมแล้ว

---

## 🔐 Environment Variables

### Backend:
```env
DB_USER=postgres
DB_HOST=xxx.supabase.co
DB_DATABASE=postgres
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
JWT_SECRET=your_secret_key
```

### Frontend:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 📚 เอกสารเพิ่มเติม

- **DEPLOY.md** - คู่มือ Deploy แบบละเอียด (ทุก platform)
- **QUICK_DEPLOY.md** - คู่มือ Deploy แบบเร็ว (Railway + Vercel + Supabase)

---

## 🆘 ต้องการความช่วยเหลือ?

1. อ่าน **QUICK_DEPLOY.md** สำหรับขั้นตอนแบบละเอียด
2. อ่าน **DEPLOY.md** สำหรับตัวเลือกอื่นๆ
3. ตรวจสอบ Logs ใน Platform ที่ใช้
4. ตรวจสอบ Console ใน Browser (F12)

---

**Happy Deploying! 🎉**

