const { pool } = require('../config/db');

async function getAllServicios() {
  const [rows] = await pool.query('SELECT * FROM servicios ORDER BY servicio_id DESC LIMIT 100');
  return rows;
}

async function getServicioById(id) {
  const [rows] = await pool.query('SELECT * FROM servicios WHERE servicio_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createServicio(data) {
  const {
    nombre,
    descripcion = null,
    fecha_ini = null,
    fecha_fin = null,
    estado = null,
    categoria_id = null,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO servicios (nombre, descripcion, fecha_ini, fecha_fin, estado, categoria_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, fecha_ini, fecha_fin, estado, categoria_id]
  );

  return { servicio_id: result.insertId, ...data };
}

async function updateServicio(id, data) {
  const fields = [];
  const values = [];

  const allowedFields = ['nombre', 'descripcion', 'fecha_ini', 'fecha_fin', 'estado', 'categoria_id'];

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);

  const [result] = await pool.query(
    `UPDATE servicios SET ${fields.join(', ')} WHERE servicio_id = ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deleteServicio(id) {
  const [result] = await pool.query('DELETE FROM servicios WHERE servicio_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
};
