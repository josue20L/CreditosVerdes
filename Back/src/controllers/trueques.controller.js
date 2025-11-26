const truequesService = require('../services/trueques.service');

async function crearTrueque(req, res) {
  try {
    const body = req.body || {};
    const { publicacion_id, comprador_id, vendedor_id, valor_cv } = body;

    if (!publicacion_id || !comprador_id || !vendedor_id || !valor_cv) {
      return res.status(400).json({
        success: false,
        message: 'publicacion_id, comprador_id, vendedor_id y valor_cv son obligatorios',
      });
    }

    const nuevo = await truequesService.createTrueque(body);
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear trueque:', error);
    res.status(500).json({ success: false, message: 'Error al crear trueque' });
  }
}

async function listarPorComprador(req, res) {
  try {
    const { usuarioId } = req.params;
    const rows = await truequesService.getTruequesByComprador(usuarioId);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar trueques por comprador:', error);
    res.status(500).json({ success: false, message: 'Error al listar trueques del comprador' });
  }
}

async function listarPorVendedor(req, res) {
  try {
    const { usuarioId } = req.params;
    const rows = await truequesService.getTruequesByVendedor(usuarioId);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar trueques por vendedor:', error);
    res.status(500).json({ success: false, message: 'Error al listar trueques del vendedor' });
  }
}

async function confirmarTrueque(req, res) {
  try {
    const { id } = req.params;

    const ok = await truequesService.confirmarTrueque(id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Trueque no encontrado o ya confirmado' });
    }

    res.json({ success: true, message: 'Trueque confirmado correctamente' });
  } catch (error) {
    console.error('Error al confirmar trueque:', error);
    res.status(500).json({ success: false, message: 'Error al confirmar trueque' });
  }
}

module.exports = {
  crearTrueque,
  listarPorComprador,
  listarPorVendedor,
  confirmarTrueque,
};
