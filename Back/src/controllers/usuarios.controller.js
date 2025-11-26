const usuariosService = require('../services/usuarios.service');
const billeterasService = require('../services/billeteras.service');

function generateReferralCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * chars.length);
    code += chars[idx];
  }
  return code;
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.getAllUsuarios();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al listar usuarios' });
  }
}

async function loginUsuario(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email y password son obligatorios',
      });
    }

    const usuario = await usuariosService.getUsuarioByEmail(email);

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Por ahora comparamos en texto plano; más adelante se reemplaza por bcrypt
    if (usuario.contrasena_hash !== password) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Error en login de usuario:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
}

async function obtenerUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuario = await usuariosService.getUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
}

async function crearUsuario(req, res) {
  try {
    const body = req.body || {};
    if (!body.nombre_user || !body.email || !body.contrasena_hash || !body.role_id) {
      return res.status(400).json({
        success: false,
        message: 'nombre_user, email, contrasena_hash y role_id son obligatorios',
      });
    }

    const codigoAmigo = body.codigo_amigo || null;

    // Generar código propio de invitación (5 letras mayúsculas)
    body.codigo_invitacion = generateReferralCode(5);

    // Inicialmente cod_referido (FK) va en null; si hay codigo_amigo válido lo actualizaremos luego
    body.cod_referido = null;

    const nuevo = await usuariosService.createUsuario(body);

    try {
      await billeterasService.createBilleteraForUsuario(nuevo.usuario_id);
    } catch (walletError) {
      // No romper el registro de usuario si falla la billetera, solo loguear
      console.error('Error al crear billetera para nuevo usuario:', walletError);
    }

    // Si el nuevo usuario ingresó el código de un amigo, darle 10 CV al invitador
    if (codigoAmigo) {
      try {
        const invitador = await usuariosService.getUsuarioByCodigoReferido(codigoAmigo);
        if (invitador && invitador.usuario_id) {
          await billeterasService.addCreditosToUsuario(invitador.usuario_id, 10);
          // Opcional: guardar la relación FK de quién lo invitó
          await usuariosService.updateUsuario(nuevo.usuario_id, {
            cod_referido: invitador.usuario_id,
          });
        }
      } catch (refError) {
        console.error('Error al asignar créditos por referido:', refError);
      }
    }

    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await usuariosService.updateUsuario(id, body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado o sin cambios' });
    }

    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const deleted = await usuariosService.deleteUsuario(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario,
};
