const express = require('express');
const pool    = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// ============ CLIENTES ============

// GET /api/clientes
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.clientes WHERE activo = TRUE ORDER BY apellido, nombre`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

router.get('/clientes/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.clientes WHERE id_cliente = $1`, [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

router.post('/clientes', async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, nit } = req.body;
  if (!nombre || !apellido || !telefono) {
    return res.status(400).json({ error: 'Nombre, apellido y teléfono son requeridos' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tienda.clientes (nombre, apellido, email, telefono, direccion, nit)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, apellido, email || null, telefono, direccion || null, nit || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email o NIT ya registrado' });
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

router.put('/clientes/:id', async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, nit, activo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tienda.clientes SET
        nombre    = COALESCE($1, nombre),
        apellido  = COALESCE($2, apellido),
        email     = COALESCE($3, email),
        telefono  = COALESCE($4, telefono),
        direccion = COALESCE($5, direccion),
        nit       = COALESCE($6, nit),
        activo    = COALESCE($7, activo)
       WHERE id_cliente = $8 RETURNING *`,
      [nombre, apellido, email, telefono, direccion, nit, activo, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email o NIT ya registrado' });
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

router.delete('/clientes/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tienda.clientes SET activo = FALSE WHERE id_cliente = $1 RETURNING id_cliente`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente desactivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

// ============ EMPLEADOS ============

router.get('/empleados', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.empleados WHERE activo = TRUE ORDER BY apellido, nombre`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

router.get('/empleados/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.empleados WHERE id_empleado = $1`, [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
});

router.post('/empleados', async (req, res) => {
  const { nombre, apellido, email, telefono, cargo, salario, fecha_ingreso } = req.body;
  if (!nombre || !apellido || !email || !cargo || !salario || !fecha_ingreso) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tienda.empleados (nombre, apellido, email, telefono, cargo, salario, fecha_ingreso)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [nombre, apellido, email, telefono, cargo, salario, fecha_ingreso]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email ya registrado' });
    res.status(500).json({ error: 'Error al crear empleado' });
  }
});

router.put('/empleados/:id', async (req, res) => {
  const { nombre, apellido, email, telefono, cargo, salario, fecha_ingreso, activo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tienda.empleados SET
        nombre       = COALESCE($1, nombre),
        apellido     = COALESCE($2, apellido),
        email        = COALESCE($3, email),
        telefono     = COALESCE($4, telefono),
        cargo        = COALESCE($5, cargo),
        salario      = COALESCE($6, salario),
        fecha_ingreso= COALESCE($7, fecha_ingreso),
        activo       = COALESCE($8, activo)
       WHERE id_empleado = $9 RETURNING *`,
      [nombre, apellido, email, telefono, cargo, salario, fecha_ingreso, activo, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

router.delete('/empleados/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tienda.empleados SET activo = FALSE WHERE id_empleado = $1 RETURNING id_empleado`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado desactivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

// ============ CATEGORÍAS ============

router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.categorias WHERE activo = TRUE ORDER BY nombre`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.post('/categorias', async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });
  try {
    const result = await pool.query(
      `INSERT INTO tienda.categorias (nombre, descripcion) VALUES ($1,$2) RETURNING *`,
      [nombre, descripcion || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// ============ PROVEEDORES ============

router.get('/proveedores', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.proveedores WHERE activo = TRUE ORDER BY nombre`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

router.post('/proveedores', async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre || !contacto || !telefono || !email || !direccion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tienda.proveedores (nombre, contacto, telefono, email, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, contacto, telefono, email, direccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

module.exports = router;
