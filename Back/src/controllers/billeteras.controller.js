const billeterasService = require('../services/billeteras.service');

async function obtenerBilletera(req, res) {
  try {
    const { usuarioId } = req.params;
    const billetera = await billeterasService.getBilleteraByUsuarioId(usuarioId);

    if (!billetera) {
      return res.status(404).json({ success: false, message: 'Billetera no encontrada' });
    }

    res.json({ success: true, data: billetera });
  } catch (error) {
    console.error('Error al obtener billetera:', error);
    res.status(500).json({ success: false, message: 'Error al obtener billetera' });
  }
}

async function listarMovimientos(req, res) {
  try {
    const { usuarioId } = req.params;
    const { limit } = req.query;

    const movimientos = await billeterasService.getMovimientosByUsuarioId(usuarioId, limit);
    res.json({ success: true, data: movimientos });
  } catch (error) {
    console.error('Error al listar movimientos de créditos:', error);
    res.status(500).json({ success: false, message: 'Error al listar movimientos de créditos' });
  }
}

module.exports = {
  obtenerBilletera,
  listarMovimientos,
};
