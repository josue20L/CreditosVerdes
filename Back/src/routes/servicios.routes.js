const express = require('express');
const serviciosController = require('../controllers/servicios.controller');

const router = express.Router();

// GET /api/servicios
router.get('/', serviciosController.listarServicios);

// GET /api/servicios/:id
router.get('/:id', serviciosController.obtenerServicio);

// POST /api/servicios
router.post('/', serviciosController.crearServicio);

// PUT /api/servicios/:id
router.put('/:id', serviciosController.actualizarServicio);

// DELETE /api/servicios/:id
router.delete('/:id', serviciosController.eliminarServicio);

module.exports = router;
