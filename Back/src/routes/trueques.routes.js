const express = require('express');
const truequesController = require('../controllers/trueques.controller');

const router = express.Router();

// POST /api/trueques
router.post('/', truequesController.crearTrueque);

// GET /api/trueques/comprador/:usuarioId
router.get('/comprador/:usuarioId', truequesController.listarPorComprador);

// GET /api/trueques/vendedor/:usuarioId
router.get('/vendedor/:usuarioId', truequesController.listarPorVendedor);

// PUT /api/trueques/:id/confirmar
router.put('/:id/confirmar', truequesController.confirmarTrueque);

module.exports = router;
