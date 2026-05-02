require('dotenv').config();
const express  = require('express');
const cors     = require('cors');

const authRoutes     = require('./routes/auth');
const productosRoutes= require('./routes/productos');
const ventasRoutes   = require('./routes/ventas');
const reportesRoutes = require('./routes/reportes');
const entidadesRoutes= require('./routes/entidades');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Rutas ───────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas',    ventasRoutes);
app.use('/api/reportes',  reportesRoutes);
app.use('/api',           entidadesRoutes);

// ── Health check ────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
