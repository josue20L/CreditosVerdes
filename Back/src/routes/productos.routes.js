const express = require('express');
const productosController = require('../controllers/productos.controller');

const router = express.Router();

// GET /api/productos
router.get('/', productosController.listarProductos);

// GET /api/productos/:id
router.get('/:id', productosController.obtenerProducto);

// POST /api/productos
router.post('/', productosController.crearProducto);

// PUT /api/productos/:id
router.put('/:id', productosController.actualizarProducto);

// DELETE /api/productos/:id
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;
