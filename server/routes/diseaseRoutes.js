const express = require('express');
const router = express.Router();
const { diagnosePlant, getPlants } = require('../controllers/diseaseController');

// Маршрут для діагностики
router.post('/diagnose', diagnosePlant);

// Маршрут для списку рослин
router.get('/plants', getPlants);

module.exports = router;