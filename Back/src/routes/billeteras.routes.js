const express = require('express');
const billeterasController = require('../controllers/billeteras.controller');

const router = express.Router();

// GET /api/billeteras/:usuarioId
router.get('/:usuarioId', billeterasController.obtenerBilletera);

// GET /api/billeteras/:usuarioId/movimientos
router.get('/:usuarioId/movimientos', billeterasController.listarMovimientos);

module.exports = router;
