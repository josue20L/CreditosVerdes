const { pool } = require('../config/db');

async function getAllCategorias() {
  const [rows] = await pool.query('SELECT categoria_id, nombre FROM categorias ORDER BY nombre ASC');
  return rows;
}

module.exports = {
  getAllCategorias,
};
