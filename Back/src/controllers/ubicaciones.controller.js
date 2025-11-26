const ubicacionesService = require('../services/ubicaciones.service');

async function listarUbicaciones(req, res) {
  try {
    const ubicaciones = await ubicacionesService.getAllUbicaciones();
    res.json({ success: true, data: ubicaciones });
  } catch (error) {
    console.error('Error al listar ubicaciones:', error);
    res.status(500).json({ success: false, message: 'Error al listar ubicaciones' });
  }
}

module.exports = {
  listarUbicaciones,
};
