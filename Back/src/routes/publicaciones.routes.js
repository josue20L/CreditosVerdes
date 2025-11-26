const express = require('express');
const publicacionesController = require('../controllers/publicaciones.controller');

const router = express.Router();

// GET /api/publicaciones
router.get('/', publicacionesController.listarPublicaciones);

// GET /api/publicaciones/:id
router.get('/:id', publicacionesController.obtenerPublicacion);

// POST /api/publicaciones
router.post('/', publicacionesController.crearPublicacion);

// PUT /api/publicaciones/:id
router.put('/:id', publicacionesController.actualizarPublicacion);

// DELETE /api/publicaciones/:id
router.delete('/:id', publicacionesController.eliminarPublicacion);

module.exports = router;
