const { pool } = require('../config/db');

async function getBilleteraByUsuarioId(usuarioId) {
  const [rows] = await pool.query(
    'SELECT * FROM billeteras WHERE usuario_id = ? LIMIT 1',
    [usuarioId],
  );
  return rows[0] || null;
}

async function getMovimientosByUsuarioId(usuarioId, limit = 50) {
  const [rows] = await pool.query(
    `SELECT * FROM movimientos_creditos WHERE usuario_id = ? ORDER BY fecha_mov DESC LIMIT ?`,
    [usuarioId, Number(limit) || 50],
  );
  return rows;
}

async function createBilleteraForUsuario(usuarioId) {
  // Crea una billetera básica con saldos en cero para el usuario dado
  const [result] = await pool.query(
    `INSERT INTO billeteras (usuario_id, saldo_disponible, saldo_retenido, saldo_incentivo, estado_billetera)
     VALUES (?, 50, 0, 0, 1)`,
    [usuarioId],
  );

  return { billetera_id: result.insertId, usuario_id: usuarioId, saldo_disponible: 50, saldo_retenido: 0, saldo_incentivo: 0, estado_billetera: 1 };
}

async function addCreditosToUsuario(usuarioId, monto) {
  await pool.query(
    `UPDATE billeteras
     SET saldo_disponible = saldo_disponible + ?, ultima_actualizacion = NOW()
     WHERE usuario_id = ?`,
    [monto, usuarioId],
  );
}

module.exports = {
  getBilleteraByUsuarioId,
  getMovimientosByUsuarioId,
  createBilleteraForUsuario,
  addCreditosToUsuario,
};
