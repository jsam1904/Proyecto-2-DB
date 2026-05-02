const express = require('express');
const pool    = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/productos - JOIN múltiples tablas (req: 3 JOINs visibles en UI)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio_compra,
        p.precio_venta,
        p.stock,
        p.stock_minimo,
        p.activo,
        cat.nombre   AS categoria,
        cat.id_categoria,
        prov.nombre  AS proveedor,
        prov.id_proveedor
      FROM tienda.productos p
      JOIN tienda.categorias  cat  ON cat.id_categoria  = p.id_categoria
      JOIN tienda.proveedores prov ON prov.id_proveedor = p.id_proveedor
      ORDER BY p.nombre
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/productos/bajo-stock - Subquery con EXISTS (req: subqueries visibles en UI)
router.get('/bajo-stock', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.stock, p.stock_minimo,
             cat.nombre AS categoria, prov.nombre AS proveedor
      FROM tienda.productos p
      JOIN tienda.categorias cat ON cat.id_categoria = p.id_categoria
      JOIN tienda.proveedores prov ON prov.id_proveedor = p.id_proveedor
      WHERE EXISTS (
        SELECT 1 FROM tienda.productos px
        WHERE px.id_producto = p.id_producto
          AND px.stock <= px.stock_minimo
          AND px.activo = TRUE
      )
      ORDER BY (p.stock - p.stock_minimo) ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos bajo stock' });
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, cat.nombre AS categoria, prov.nombre AS proveedor
      FROM tienda.productos p
      JOIN tienda.categorias cat ON cat.id_categoria = p.id_categoria
      JOIN tienda.proveedores prov ON prov.id_proveedor = p.id_proveedor
      WHERE p.id_producto = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /api/productos
router.post('/', async (req, res) => {
  const { id_categoria, id_proveedor, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo } = req.body;

  if (!id_categoria || !id_proveedor || !nombre || !precio_compra || !precio_venta) {
    return res.status(400).json({ error: 'Campos requeridos: categoria, proveedor, nombre, precios' });
  }
  if (parseFloat(precio_venta) < parseFloat(precio_compra)) {
    return res.status(400).json({ error: 'El precio de venta no puede ser menor al de compra' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO tienda.productos (id_categoria, id_proveedor, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [id_categoria, id_proveedor, nombre, descripcion || null, precio_compra, precio_venta, stock || 0, stock_minimo || 5]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
  const { nombre, descripcion, id_categoria, id_proveedor, precio_compra, precio_venta, stock, stock_minimo, activo } = req.body;

  try {
    const result = await pool.query(`
      UPDATE tienda.productos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        id_categoria = COALESCE($3, id_categoria),
        id_proveedor = COALESCE($4, id_proveedor),
        precio_compra = COALESCE($5, precio_compra),
        precio_venta = COALESCE($6, precio_venta),
        stock = COALESCE($7, stock),
        stock_minimo = COALESCE($8, stock_minimo),
        activo = COALESCE($9, activo)
      WHERE id_producto = $10 RETURNING *
    `, [nombre, descripcion, id_categoria, id_proveedor, precio_compra, precio_venta, stock, stock_minimo, activo, req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/productos/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tienda.productos SET activo = FALSE WHERE id_producto = $1 RETURNING id_producto`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
