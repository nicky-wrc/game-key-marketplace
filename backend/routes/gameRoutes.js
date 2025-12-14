const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.getAllGames);
router.get('/featured', gameController.getFeaturedGames);
router.get('/popular', gameController.getPopularGames);
router.get('/new', gameController.getNewGames);
router.get('/:id', gameController.getGameById);
router.get('/:id/stock', gameController.getGameStock);

module.exports = router;