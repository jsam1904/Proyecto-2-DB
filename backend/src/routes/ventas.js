const express = require('express');
const pool    = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/ventas - JOIN entre ventas, clientes, empleados (req: JOINs visibles en UI)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_venta,
        v.total,
        v.estado,
        v.notas,
        c.id_cliente,
        c.nombre || ' ' || c.apellido AS cliente,
        c.nit,
        e.id_empleado,
        e.nombre || ' ' || e.apellido AS empleado,
        COUNT(dv.id_detalle) AS cantidad_items
      FROM tienda.ventas v
      JOIN tienda.clientes   c  ON c.id_cliente  = v.id_cliente
      JOIN tienda.empleados  e  ON e.id_empleado = v.id_empleado
      LEFT JOIN tienda.detalle_ventas dv ON dv.id_venta = v.id_venta
      GROUP BY v.id_venta, v.fecha_venta, v.total, v.estado, v.notas,
               c.id_cliente, c.nombre, c.apellido, c.nit,
               e.id_empleado, e.nombre, e.apellido
      ORDER BY v.fecha_venta DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// GET /api/ventas/:id - Detalle de una venta
router.get('/:id', async (req, res) => {
  try {
    const venta = await pool.query(`
      SELECT v.*, c.nombre || ' ' || c.apellido AS cliente, c.nit,
             e.nombre || ' ' || e.apellido AS empleado
      FROM tienda.ventas v
      JOIN tienda.clientes c ON c.id_cliente = v.id_cliente
      JOIN tienda.empleados e ON e.id_empleado = v.id_empleado
      WHERE v.id_venta = $1
    `, [req.params.id]);

    if (venta.rows.length === 0) return res.status(404).json({ error: 'Venta no encontrada' });

    const detalle = await pool.query(`
      SELECT dv.*, p.nombre AS producto, p.descripcion
      FROM tienda.detalle_ventas dv
      JOIN tienda.productos p ON p.id_producto = dv.id_producto
      WHERE dv.id_venta = $1
    `, [req.params.id]);

    res.json({ ...venta.rows[0], detalle: detalle.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener venta' });
  }
});

// POST /api/ventas - TRANSACCIÓN EXPLÍCITA con manejo de error y ROLLBACK
router.post('/', async (req, res) => {
  const { id_cliente, id_empleado, notas, items } = req.body;

  if (!id_cliente || !id_empleado || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Se requiere cliente, empleado y al menos un producto' });
  }

  const client = await pool.connect();

  try {
    // === INICIO DE TRANSACCIÓN EXPLÍCITA ===
    await client.query('BEGIN');

    // 1. Verificar stock de cada producto
    for (const item of items) {
      const stockResult = await client.query(
        `SELECT nombre, stock FROM tienda.productos WHERE id_producto = $1 AND activo = TRUE`,
        [item.id_producto]
      );

      if (stockResult.rows.length === 0) {
        throw new Error(`Producto ID ${item.id_producto} no existe o está inactivo`);
      }
      if (stockResult.rows[0].stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para "${stockResult.rows[0].nombre}". Disponible: ${stockResult.rows[0].stock}, solicitado: ${item.cantidad}`
        );
      }
    }

    // 2. Calcular total
    let total = 0;
    const itemsConPrecio = [];
    for (const item of items) {
      const precioResult = await client.query(
        `SELECT precio_venta FROM tienda.productos WHERE id_producto = $1`,
        [item.id_producto]
      );
      const precio = parseFloat(precioResult.rows[0].precio_venta);
      const subtotal = precio * item.cantidad;
      total += subtotal;
      itemsConPrecio.push({ ...item, precio_unitario: precio, subtotal });
    }

    // 3. Insertar venta
    const ventaResult = await client.query(
      `INSERT INTO tienda.ventas (id_cliente, id_empleado, total, estado, notas)
       VALUES ($1, $2, $3, 'completada', $4) RETURNING id_venta`,
      [id_cliente, id_empleado, total, notas || null]
    );
    const id_venta = ventaResult.rows[0].id_venta;

    // 4. Insertar detalles y descontar stock
    for (const item of itemsConPrecio) {
      await client.query(
        `INSERT INTO tienda.detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
      );

      await client.query(
        `UPDATE tienda.productos SET stock = stock - $1 WHERE id_producto = $2`,
        [item.cantidad, item.id_producto]
      );
    }

    // === COMMIT ===
    await client.query('COMMIT');

    res.status(201).json({ message: 'Venta registrada exitosamente', id_venta, total });
  } catch (err) {
    // === ROLLBACK EN CASO DE ERROR ===
    await client.query('ROLLBACK');
    console.error('Venta ROLLBACK:', err.message);
    res.status(400).json({ error: err.message || 'Error al procesar la venta' });
  } finally {
    client.release();
  }
});

module.exports = router;
