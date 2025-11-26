const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const router = express.Router();

// GET /api/usuarios
router.get('/', usuariosController.listarUsuarios);

// GET /api/usuarios/:id
router.get('/:id', usuariosController.obtenerUsuario);

// POST /api/usuarios
router.post('/', usuariosController.crearUsuario);

// POST /api/usuarios/login
router.post('/login', usuariosController.loginUsuario);

// PUT /api/usuarios/:id
router.put('/:id', usuariosController.actualizarUsuario);

// DELETE /api/usuarios/:id
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;
