const { pool } = require('../config/db');

async function getAllUsuarios() {
  const [rows] = await pool.query('SELECT * FROM usuarios LIMIT 100');
  return rows;
}

async function getUsuarioById(id) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function getUsuarioByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function getUsuarioByCodigoReferido(codReferido) {
  // Busca al usuario por su código de invitación propio (codigo_invitacion)
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE codigo_invitacion = ? LIMIT 1', [codReferido]);
  return rows[0] || null;
}

async function createUsuario(data) {
  const {
    nombre_user,
    email,
    contrasena_hash,
    salt = null,
    telefono = null,
    estado_user = 1,
    cod_referido = null,
    codigo_invitacion = null,
    role_id,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre_user, email, contrasena_hash, salt, telefono, estado_user, cod_referido, codigo_invitacion, role_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre_user, email, contrasena_hash, salt, telefono, estado_user, cod_referido, codigo_invitacion, role_id]
  );

  return { usuario_id: result.insertId, ...data };
}

async function updateUsuario(id, data) {
  const fields = [];
  const values = [];

  const allowedFields = ['nombre_user', 'email', 'contrasena_hash', 'salt', 'telefono', 'estado_user', 'cod_referido', 'role_id'];

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
    `UPDATE usuarios SET ${fields.join(', ')} WHERE usuario_id = ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deleteUsuario(id) {
  const [result] = await pool.query('DELETE FROM usuarios WHERE usuario_id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  getUsuarioByCodigoReferido,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
