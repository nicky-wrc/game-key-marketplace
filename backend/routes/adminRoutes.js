const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/add-game', 
    [authMiddleware, adminMiddleware, upload.single('image')], 
    adminController.addGame
);

router.post('/add-stock', 
    [authMiddleware, adminMiddleware, upload.single('image')], 
    adminController.addStock
);

module.exports = router;