const multer = require('multer');
const path = require('path');

// ตั้งค่าที่เก็บไฟล์และการตั้งชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // เก็บในโฟลเดอร์ uploads
    },
    filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์ใหม่: รูป-เวลาปัจจุบัน.นามสกุลเดิม (กันชื่อซ้ำ)
        cb(null, 'game-' + Date.now() + path.extname(file.originalname));
    }
});

// กรองรับเฉพาะไฟล์รูปภาพ
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;