const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/games', [authMiddleware, adminMiddleware], adminController.getAllGames);
router.post('/add-game', [authMiddleware, adminMiddleware, upload.single('image')], adminController.addGame);
router.put('/games/:id', [authMiddleware, adminMiddleware, upload.single('image')], adminController.updateGame);
router.delete('/games/:id', [authMiddleware, adminMiddleware], adminController.deleteGame);

router.get('/stocks', [authMiddleware, adminMiddleware], adminController.getAllStocks);
router.post('/add-stock', [authMiddleware, adminMiddleware, upload.single('image')], adminController.addStock);
router.put('/stocks/:id', [authMiddleware, adminMiddleware, upload.single('image')], adminController.updateStock);
router.delete('/stocks/:id', [authMiddleware, adminMiddleware], adminController.deleteStock);

router.get('/coupons', [authMiddleware, adminMiddleware], adminController.getAllCoupons);
router.post('/add-coupon', [authMiddleware, adminMiddleware], adminController.addCoupon);
router.put('/coupons/:id', [authMiddleware, adminMiddleware], adminController.updateCoupon);
router.delete('/coupons/:id', [authMiddleware, adminMiddleware], adminController.deleteCoupon);

router.get('/dashboard', [authMiddleware, adminMiddleware], adminController.getDashboardStats);

router.get('/gacha-boxes', [authMiddleware, adminMiddleware], adminController.getAllGachaBoxes);
router.post('/add-gacha-box', [authMiddleware, adminMiddleware, upload.single('image')], adminController.addGachaBox);
router.put('/gacha-boxes/:id', [authMiddleware, adminMiddleware, upload.single('image')], adminController.updateGachaBox);
router.delete('/gacha-boxes/:id', [authMiddleware, adminMiddleware], adminController.deleteGachaBox);

module.exports = router;