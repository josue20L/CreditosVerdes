const express = require('express');
const ubicacionesController = require('../controllers/ubicaciones.controller');

const router = express.Router();

// GET /api/ubicaciones
router.get('/', ubicacionesController.listarUbicaciones);

module.exports = router;
