const { pool } = require('../config/db');

async function getAllUbicaciones() {
  const [rows] = await pool.query('SELECT ubicacion_id, departamento, provincia, codigo FROM ubicaciones ORDER BY provincia ASC');
  return rows;
}

module.exports = {
  getAllUbicaciones,
};
