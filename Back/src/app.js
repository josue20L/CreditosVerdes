const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/db');
const usuariosRoutes = require('./routes/usuarios.routes');
const publicacionesRoutes = require('./routes/publicaciones.routes');
const productosRoutes = require('./routes/productos.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const ubicacionesRoutes = require('./routes/ubicaciones.routes');
const uploadsRoutes = require('./routes/uploads.routes');
const billeterasRoutes = require('./routes/billeteras.routes');
const truequesRoutes = require('./routes/trueques.routes');

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (uploads de imágenes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/billeteras', billeterasRoutes);
app.use('/api/trueques', truequesRoutes);

app.get('/api/health', async (req, res) => {
  const dbOk = await testConnection();

  res.json({
    status: 'ok',
    message: 'Backend base funcionando (JS)',
    database: dbOk ? 'connected' : 'error',
  });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();

module.exports = app;
