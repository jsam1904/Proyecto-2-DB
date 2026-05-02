const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const pool    = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username y password son requeridos' });
  }

  try {
    const result = await pool.query(
      `SELECT u.id_usuario, u.username, u.password_hash, u.rol, u.activo,
              e.nombre || ' ' || e.apellido AS nombre_completo
       FROM tienda.usuarios u
       JOIN tienda.empleados e ON e.id_empleado = u.id_empleado
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    if (!user.activo) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Actualizar último login
    await pool.query(
      `UPDATE tienda.usuarios SET ultimo_login = NOW() WHERE id_usuario = $1`,
      [user.id_usuario]
    );

    const token = jwt.sign(
      { id_usuario: user.id_usuario, username: user.username, rol: user.rol, nombre: user.nombre_completo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id:       user.id_usuario,
        username: user.username,
        rol:      user.rol,
        nombre:   user.nombre_completo
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
