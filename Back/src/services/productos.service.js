const { pool } = require('../config/db');

async function getAllProductos() {
  const [rows] = await pool.query('SELECT * FROM productos ORDER BY producto_id DESC LIMIT 100');
  return rows;
}

async function getProductoById(id) {
  const [rows] = await pool.query('SELECT * FROM productos WHERE producto_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createProducto(data) {
  const {
    nombre,
    descripcion = null,
    peso_kg = null,
    material = null,
    stock = null,
    vida_util_m = null,
    categoria_id = null,
    estado_nombre = null,
  } = data;

  let estado_id = null;
  if (estado_nombre) {
    const [rows] = await pool.query(
      'SELECT estado_id FROM estados_producto WHERE nombre = ? LIMIT 1',
      [estado_nombre],
    );
    if (rows[0]) {
      estado_id = rows[0].estado_id;
    }
  }

  const [result] = await pool.query(
    `INSERT INTO productos (nombre, descripcion, peso_kg, material, stock, vida_util_m, categoria_id, estado_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, peso_kg, material, stock, vida_util_m, categoria_id, estado_id]
  );

  return { producto_id: result.insertId, ...data, estado_id };
}

async function updateProducto(id, data) {
  const fields = [];
  const values = [];

  const allowedFields = ['nombre', 'descripcion', 'peso_kg', 'material', 'stock', 'vida_util_m', 'categoria_id', 'estado_id'];

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);

  const [result] = await pool.query(
    `UPDATE productos SET ${fields.join(', ')} WHERE producto_id = ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deleteProducto(id) {
  const [result] = await pool.query('DELETE FROM productos WHERE producto_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
