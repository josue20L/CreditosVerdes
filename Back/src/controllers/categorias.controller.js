const categoriasService = require('../services/categorias.service');

async function listarCategorias(req, res) {
  try {
    const categorias = await categoriasService.getAllCategorias();
    res.json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error al listar categorias:', error);
    res.status(500).json({ success: false, message: 'Error al listar categorias' });
  }
}

module.exports = {
  listarCategorias,
};
