const { pool } = require('../config/db');

async function getAllPublicaciones() {
  const [rows] = await pool.query(`
    SELECT 
      p.*,
      COALESCE(cp.nombre, cs.nombre) AS categoria_nombre
    FROM publicaciones p
    LEFT JOIN productos pr ON p.producto_id = pr.producto_id
    LEFT JOIN categorias cp ON pr.categoria_id = cp.categoria_id
    LEFT JOIN servicios sv ON p.servicio_id = sv.servicio_id
    LEFT JOIN categorias cs ON sv.categoria_id = cs.categoria_id
    ORDER BY p.fecha_public DESC
    LIMIT 100
  `);
  return rows;
}

async function getPublicacionById(id) {
  const [rows] = await pool.query('SELECT * FROM publicaciones WHERE publicacion_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createPublicacion(data) {
  const {
    usuario_id,
    titulo,
    valor_creditos,
    fecha_public = new Date(),
    foto_url = null,
    impacto_estimado = null,
    producto_id = null,
    servicio_id = null,
    ubicacion_id,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO publicaciones (usuario_id, titulo, valor_creditos, fecha_public, foto_url, impacto_estimado, producto_id, servicio_id, ubicacion_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [usuario_id, titulo, valor_creditos, fecha_public, foto_url, impacto_estimado, producto_id, servicio_id, ubicacion_id]
  );

  return { publicacion_id: result.insertId, ...data };
}

async function updatePublicacion(id, data) {
  const fields = [];
  const values = [];

  const allowedFields = [
    'usuario_id',
    'titulo',
    'valor_creditos',
    'fecha_public',
    'foto_url',
    'impacto_estimado',
    'producto_id',
    'servicio_id',
    'ubicacion_id',
  ];

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const [result] = await pool.query(
    `UPDATE publicaciones SET ${fields.join(', ')} WHERE publicacion_id = ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deletePublicacion(id) {
  // Primero obtener los IDs relacionados
  const [rows] = await pool.query(
    'SELECT producto_id, servicio_id FROM publicaciones WHERE publicacion_id = ? LIMIT 1',
    [id],
  );

  if (!rows[0]) {
    return false;
  }

  const { producto_id, servicio_id } = rows[0];

  // Eliminar la publicación
  const [result] = await pool.query('DELETE FROM publicaciones WHERE publicacion_id = ?', [id]);

  if (result.affectedRows === 0) {
    return false;
  }

  // Eliminar el producto o servicio asociado si existen
  if (producto_id) {
    await pool.query('DELETE FROM productos WHERE producto_id = ?', [producto_id]);
  }

  if (servicio_id) {
    await pool.query('DELETE FROM servicios WHERE servicio_id = ?', [servicio_id]);
  }

  return true;
}

module.exports = {
  getAllPublicaciones,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
};
