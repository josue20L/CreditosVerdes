const express = require('express');
const categoriasController = require('../controllers/categorias.controller');

const router = express.Router();

// GET /api/categorias
router.get('/', categoriasController.listarCategorias);

module.exports = router;
