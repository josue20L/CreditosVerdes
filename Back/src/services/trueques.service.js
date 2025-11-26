const { pool } = require('../config/db');

async function createTrueque(data) {
  const { publicacion_id, comprador_id, vendedor_id, valor_cv, estado = 'PENDIENTE' } = data;

  const [result] = await pool.query(
    `INSERT INTO trueques (publicacion_id, comprador_id, vendedor_id, valor_cv, estado, fecha_creacion)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [publicacion_id, comprador_id, vendedor_id, valor_cv, estado],
  );

  return { trueque_id: result.insertId, ...data };
}

async function getTruequesByComprador(usuarioId) {
  const [rows] = await pool.query(
    `SELECT t.*, p.titulo, u.nombre_user AS vendedor_nombre, u.telefono AS vendedor_telefono
     FROM trueques t
     JOIN publicaciones p ON p.publicacion_id = t.publicacion_id
     JOIN usuarios u ON u.usuario_id = t.vendedor_id
     WHERE t.comprador_id = ?
     ORDER BY t.fecha_creacion DESC`,
    [usuarioId],
  );
  return rows;
}

async function getTruequesByVendedor(usuarioId) {
  const [rows] = await pool.query(
    `SELECT t.*, p.titulo, u.nombre_user AS comprador_nombre, u.telefono AS comprador_telefono
     FROM trueques t
     JOIN publicaciones p ON p.publicacion_id = t.publicacion_id
     JOIN usuarios u ON u.usuario_id = t.comprador_id
     WHERE t.vendedor_id = ?
     ORDER BY t.fecha_creacion DESC`,
    [usuarioId],
  );
  return rows;
}

async function confirmarTrueque(truequeId) {
  const [result] = await pool.query(
    `UPDATE trueques SET estado = 'CONFIRMADO', fecha_confirmacion = NOW() WHERE trueque_id = ?`,
    [truequeId],
  );
  return result.affectedRows > 0;
}

async function getTruequeById(id) {
  const [rows] = await pool.query('SELECT * FROM trueques WHERE trueque_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = {
  createTrueque,
  getTruequesByComprador,
  getTruequesByVendedor,
  confirmarTrueque,
  getTruequeById,
};
