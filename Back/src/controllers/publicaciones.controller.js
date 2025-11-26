const publicacionesService = require('../services/publicaciones.service');

async function listarPublicaciones(req, res) {
  try {
    const publicaciones = await publicacionesService.getAllPublicaciones();
    res.json({ success: true, data: publicaciones });
  } catch (error) {
    console.error('Error al listar publicaciones:', error);
    res.status(500).json({ success: false, message: 'Error al listar publicaciones' });
  }
}

async function obtenerPublicacion(req, res) {
  try {
    const { id } = req.params;
    const publicacion = await publicacionesService.getPublicacionById(id);

    if (!publicacion) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
    }

    res.json({ success: true, data: publicacion });
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({ success: false, message: 'Error al obtener publicación' });
  }
}

async function crearPublicacion(req, res) {
  try {
    const body = req.body;

    if (!body.usuario_id || !body.titulo || !body.valor_creditos || !body.ubicacion_id) {
      return res.status(400).json({
        success: false,
        message: 'usuario_id, titulo, valor_creditos y ubicacion_id son obligatorios',
      });
    }

    const nueva = await publicacionesService.createPublicacion(body);
    res.status(201).json({ success: true, data: nueva });
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ success: false, message: 'Error al crear publicación' });
  }
}

async function actualizarPublicacion(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await publicacionesService.updatePublicacion(id, body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada o sin cambios' });
    }

    res.json({ success: true, message: 'Publicación actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar publicación' });
  }
}

async function eliminarPublicacion(req, res) {
  try {
    const { id } = req.params;
    const deleted = await publicacionesService.deletePublicacion(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
    }

    res.json({ success: true, message: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar publicación' });
  }
}

module.exports = {
  listarPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
};
