const serviciosService = require('../services/servicios.service');

async function listarServicios(req, res) {
  try {
    const servicios = await serviciosService.getAllServicios();
    res.json({ success: true, data: servicios });
  } catch (error) {
    console.error('Error al listar servicios:', error);
    res.status(500).json({ success: false, message: 'Error al listar servicios' });
  }
}

async function obtenerServicio(req, res) {
  try {
    const { id } = req.params;
    const servicio = await serviciosService.getServicioById(id);

    if (!servicio) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    res.json({ success: true, data: servicio });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ success: false, message: 'Error al obtener servicio' });
  }
}

async function crearServicio(req, res) {
  try {
    const body = req.body;

    if (!body.nombre) {
      return res.status(400).json({
        success: false,
        message: 'nombre es obligatorio',
      });
    }

    const nuevo = await serviciosService.createServicio(body);
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ success: false, message: 'Error al crear servicio' });
  }
}

async function actualizarServicio(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await serviciosService.updateServicio(id, body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado o sin cambios' });
    }

    res.json({ success: true, message: 'Servicio actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar servicio' });
  }
}

async function eliminarServicio(req, res) {
  try {
    const { id } = req.params;
    const deleted = await serviciosService.deleteServicio(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    res.json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar servicio' });
  }
}

module.exports = {
  listarServicios,
  obtenerServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};
