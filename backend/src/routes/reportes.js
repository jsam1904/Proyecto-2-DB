const express = require('express');
const pool    = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/reportes/ventas-por-empleado
// GROUP BY + HAVING + funciones de agregación (req: visible en UI)
router.get('/ventas-por-empleado', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id_empleado,
        e.nombre || ' ' || e.apellido AS empleado,
        e.cargo,
        COUNT(v.id_venta)             AS total_ventas,
        SUM(v.total)                  AS ingresos_totales,
        AVG(v.total)                  AS promedio_venta,
        MAX(v.total)                  AS venta_maxima
      FROM tienda.empleados e
      JOIN tienda.ventas v ON v.id_empleado = e.id_empleado
      WHERE v.estado = 'completada'
      GROUP BY e.id_empleado, e.nombre, e.apellido, e.cargo
      HAVING COUNT(v.id_venta) >= 1
      ORDER BY ingresos_totales DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en reporte ventas por empleado' });
  }
});

// GET /api/reportes/ventas-por-categoria
// GROUP BY + JOIN múltiple (req: JOINs y GROUP BY visibles en UI)
router.get('/ventas-por-categoria', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cat.id_categoria,
        cat.nombre          AS categoria,
        COUNT(DISTINCT v.id_venta)  AS num_ventas,
        SUM(dv.cantidad)            AS unidades_vendidas,
        SUM(dv.subtotal)            AS ingresos_totales,
        AVG(dv.subtotal)            AS promedio_item
      FROM tienda.categorias cat
      JOIN tienda.productos p   ON p.id_categoria  = cat.id_categoria
      JOIN tienda.detalle_ventas dv ON dv.id_producto = p.id_producto
      JOIN tienda.ventas v      ON v.id_venta = dv.id_venta
      WHERE v.estado = 'completada'
      GROUP BY cat.id_categoria, cat.nombre
      ORDER BY ingresos_totales DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en reporte por categoría' });
  }
});

// GET /api/reportes/top-clientes
// CTE (WITH) + JOIN (req: CTE visible en UI)
router.get('/top-clientes', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH resumen_clientes AS (
        SELECT
          v.id_cliente,
          COUNT(v.id_venta)  AS total_compras,
          SUM(v.total)       AS gasto_total,
          MAX(v.fecha_venta) AS ultima_compra
        FROM tienda.ventas v
        WHERE v.estado = 'completada'
        GROUP BY v.id_cliente
      )
      SELECT
        c.id_cliente,
        c.nombre || ' ' || c.apellido AS cliente,
        c.email,
        c.nit,
        rc.total_compras,
        rc.gasto_total,
        rc.ultima_compra,
        RANK() OVER (ORDER BY rc.gasto_total DESC) AS ranking
      FROM resumen_clientes rc
      JOIN tienda.clientes c ON c.id_cliente = rc.id_cliente
      ORDER BY rc.gasto_total DESC
      LIMIT 15
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en reporte top clientes' });
  }
});

// GET /api/reportes/productos-sin-venta
// Subquery con NOT IN (req: subqueries visibles en UI)
router.get('/productos-sin-venta', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre        AS producto,
        cat.nombre      AS categoria,
        prov.nombre     AS proveedor,
        p.stock,
        p.precio_venta
      FROM tienda.productos p
      JOIN tienda.categorias cat ON cat.id_categoria = p.id_categoria
      JOIN tienda.proveedores prov ON prov.id_proveedor = p.id_proveedor
      WHERE p.id_producto NOT IN (
        SELECT DISTINCT dv.id_producto
        FROM tienda.detalle_ventas dv
        JOIN tienda.ventas v ON v.id_venta = dv.id_venta
        WHERE v.estado = 'completada'
      )
      AND p.activo = TRUE
      ORDER BY p.nombre
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en reporte productos sin venta' });
  }
});

// GET /api/reportes/resumen-mensual
// CTE + GROUP BY + funciones de ventana (reporte mensual completo)
router.get('/resumen-mensual', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH ventas_mensuales AS (
        SELECT
          DATE_TRUNC('month', fecha_venta) AS mes,
          COUNT(id_venta)                  AS num_ventas,
          SUM(total)                       AS ingresos,
          AVG(total)                       AS promedio
        FROM tienda.ventas
        WHERE estado = 'completada'
        GROUP BY DATE_TRUNC('month', fecha_venta)
      )
      SELECT
        TO_CHAR(mes, 'YYYY-MM') AS mes,
        num_ventas,
        ROUND(ingresos::numeric, 2)  AS ingresos,
        ROUND(promedio::numeric, 2)  AS promedio,
        SUM(ingresos) OVER (ORDER BY mes) AS ingresos_acumulados
      FROM ventas_mensuales
      ORDER BY mes DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en resumen mensual' });
  }
});

// GET /api/reportes/vista-ventas - Usa el VIEW definido en BD (req: VIEW visible en UI)
router.get('/vista-ventas', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.v_ventas_detalle ORDER BY fecha_venta DESC LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar vista de ventas' });
  }
});

// GET /api/reportes/top-productos - Usa VIEW v_top_productos
router.get('/top-productos', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tienda.v_top_productos LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar top productos' });
  }
});

module.exports = router;
