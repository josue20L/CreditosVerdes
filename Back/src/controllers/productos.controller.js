const productosService = require('../services/productos.service');

async function listarProductos(req, res) {
  try {
    const productos = await productosService.getAllProductos();
    res.json({ success: true, data: productos });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ success: false, message: 'Error al listar productos' });
  }
}

async function obtenerProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await productosService.getProductoById(id);

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, data: producto });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ success: false, message: 'Error al obtener producto' });
  }
}

async function crearProducto(req, res) {
  try {
    const body = req.body;

    if (!body.nombre) {
      return res.status(400).json({
        success: false,
        message: 'nombre es obligatorio',
      });
    }

    const nuevo = await productosService.createProducto(body);
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ success: false, message: 'Error al crear producto' });
  }
}

async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await productosService.updateProducto(id, body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado o sin cambios' });
    }

    res.json({ success: true, message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
}

async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    const deleted = await productosService.deleteProducto(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
