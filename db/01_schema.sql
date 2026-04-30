-- ============================================================
-- PROYECTO 2 - Bases de Datos 1 | cc3088
-- DDL Schema - Tienda de Inventario y Ventas
-- DBMS: PostgreSQL
-- Usuario: proy2 | Contraseña: secret
-- ============================================================

-- Crear schema
CREATE SCHEMA IF NOT EXISTS tienda;
SET search_path TO tienda;

-- ============================================================
-- TABLA: categorias
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria    SERIAL          PRIMARY KEY,
    nombre          VARCHAR(100)    NOT NULL,
    descripcion     TEXT,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: proveedores
-- ============================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor    SERIAL          PRIMARY KEY,
    nombre          VARCHAR(150)    NOT NULL,
    contacto        VARCHAR(100)    NOT NULL,
    telefono        VARCHAR(20)     NOT NULL,
    email           VARCHAR(150)    NOT NULL,
    direccion       TEXT            NOT NULL,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: productos
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
    id_producto     SERIAL          PRIMARY KEY,
    id_categoria    INT             NOT NULL,
    id_proveedor    INT             NOT NULL,
    nombre          VARCHAR(150)    NOT NULL,
    descripcion     TEXT,
    precio_compra   NUMERIC(10,2)   NOT NULL,
    precio_venta    NUMERIC(10,2)   NOT NULL,
    stock           INT             NOT NULL DEFAULT 0,
    stock_minimo    INT             NOT NULL DEFAULT 5,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT fk_producto_proveedor FOREIGN KEY (id_proveedor)
        REFERENCES proveedores(id_proveedor) ON DELETE RESTRICT,
    CONSTRAINT chk_precio_venta CHECK (precio_venta >= precio_compra),
    CONSTRAINT chk_stock_positivo CHECK (stock >= 0)
);

-- ============================================================
-- TABLA: empleados
-- ============================================================
CREATE TABLE IF NOT EXISTS empleados (
    id_empleado     SERIAL          PRIMARY KEY,
    nombre          VARCHAR(100)    NOT NULL,
    apellido        VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    telefono        VARCHAR(20)     NOT NULL,
    cargo           VARCHAR(80)     NOT NULL,
    salario         NUMERIC(10,2)   NOT NULL,
    fecha_ingreso   DATE            NOT NULL,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: usuarios (autenticación)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario      SERIAL          PRIMARY KEY,
    id_empleado     INT             NOT NULL UNIQUE,
    username        VARCHAR(80)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    rol             VARCHAR(30)     NOT NULL DEFAULT 'vendedor',
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_login    TIMESTAMP,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_usuario_empleado FOREIGN KEY (id_empleado)
        REFERENCES empleados(id_empleado) ON DELETE CASCADE,
    CONSTRAINT chk_rol CHECK (rol IN ('admin', 'vendedor', 'bodeguero'))
);

-- ============================================================
-- TABLA: clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente      SERIAL          PRIMARY KEY,
    nombre          VARCHAR(100)    NOT NULL,
    apellido        VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    UNIQUE,
    telefono        VARCHAR(20)     NOT NULL,
    direccion       TEXT,
    nit             VARCHAR(20)     UNIQUE,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: ventas
-- ============================================================
CREATE TABLE IF NOT EXISTS ventas (
    id_venta        SERIAL          PRIMARY KEY,
    id_cliente      INT             NOT NULL,
    id_empleado     INT             NOT NULL,
    fecha_venta     TIMESTAMP       NOT NULL DEFAULT NOW(),
    total           NUMERIC(12,2)   NOT NULL DEFAULT 0,
    estado          VARCHAR(30)     NOT NULL DEFAULT 'completada',
    notas           TEXT,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    CONSTRAINT fk_venta_empleado FOREIGN KEY (id_empleado)
        REFERENCES empleados(id_empleado) ON DELETE RESTRICT,
    CONSTRAINT chk_estado_venta CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
    CONSTRAINT chk_total_positivo CHECK (total >= 0)
);

-- ============================================================
-- TABLA: detalle_ventas
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id_detalle      SERIAL          PRIMARY KEY,
    id_venta        INT             NOT NULL,
    id_producto     INT             NOT NULL,
    cantidad        INT             NOT NULL,
    precio_unitario NUMERIC(10,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   NOT NULL,
    CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta)
        REFERENCES ventas(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto) ON DELETE RESTRICT,
    CONSTRAINT chk_cantidad_positiva CHECK (cantidad > 0),
    CONSTRAINT chk_subtotal_positivo CHECK (subtotal > 0)
);

-- ============================================================
-- TABLA: compras (órdenes a proveedores)
-- ============================================================
CREATE TABLE IF NOT EXISTS compras (
    id_compra       SERIAL          PRIMARY KEY,
    id_proveedor    INT             NOT NULL,
    id_empleado     INT             NOT NULL,
    fecha_compra    TIMESTAMP       NOT NULL DEFAULT NOW(),
    total           NUMERIC(12,2)   NOT NULL DEFAULT 0,
    estado          VARCHAR(30)     NOT NULL DEFAULT 'recibida',
    notas           TEXT,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor)
        REFERENCES proveedores(id_proveedor) ON DELETE RESTRICT,
    CONSTRAINT fk_compra_empleado FOREIGN KEY (id_empleado)
        REFERENCES empleados(id_empleado) ON DELETE RESTRICT,
    CONSTRAINT chk_estado_compra CHECK (estado IN ('pendiente', 'recibida', 'cancelada'))
);

-- ============================================================
-- TABLA: detalle_compras
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_compras (
    id_detalle      SERIAL          PRIMARY KEY,
    id_compra       INT             NOT NULL,
    id_producto     INT             NOT NULL,
    cantidad        INT             NOT NULL,
    precio_unitario NUMERIC(10,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   NOT NULL,
    CONSTRAINT fk_dcompra_compra FOREIGN KEY (id_compra)
        REFERENCES compras(id_compra) ON DELETE CASCADE,
    CONSTRAINT fk_dcompra_producto FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto) ON DELETE RESTRICT,
    CONSTRAINT chk_dcantidad_positiva CHECK (cantidad > 0)
);

-- ============================================================
-- ÍNDICES (justificados para búsquedas frecuentes)
-- ============================================================
-- Índice en productos.nombre para búsqueda de productos
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Índice en ventas.fecha_venta para reportes por rango de fecha
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);

-- Índice en detalle_ventas.id_venta para JOIN rápido
CREATE INDEX idx_detalle_ventas_venta ON detalle_ventas(id_venta);

-- Índice en clientes.email para búsqueda de clientes
CREATE INDEX idx_clientes_email ON clientes(email);

-- Índice en productos.id_categoria para filtrado por categoría
CREATE INDEX idx_productos_categoria ON productos(id_categoria);

-- ============================================================
-- VIEWS
-- ============================================================

-- View: resumen de ventas con info de cliente y empleado
CREATE OR REPLACE VIEW tienda.v_ventas_detalle AS
SELECT
    v.id_venta,
    v.fecha_venta,
    v.total,
    v.estado,
    c.nombre || ' ' || c.apellido AS cliente,
    c.nit,
    e.nombre || ' ' || e.apellido AS empleado,
    COUNT(dv.id_detalle) AS cantidad_items
FROM ventas v
JOIN clientes c ON c.id_cliente = v.id_cliente
JOIN empleados e ON e.id_empleado = v.id_empleado
LEFT JOIN detalle_ventas dv ON dv.id_venta = v.id_venta
GROUP BY v.id_venta, v.fecha_venta, v.total, v.estado,
         c.nombre, c.apellido, c.nit, e.nombre, e.apellido;

-- View: productos con stock bajo mínimo
CREATE OR REPLACE VIEW tienda.v_productos_bajo_stock AS
SELECT
    p.id_producto,
    p.nombre AS producto,
    cat.nombre AS categoria,
    prov.nombre AS proveedor,
    p.stock,
    p.stock_minimo,
    p.precio_venta
FROM productos p
JOIN categorias cat ON cat.id_categoria = p.id_categoria
JOIN proveedores prov ON prov.id_proveedor = p.id_proveedor
WHERE p.stock <= p.stock_minimo AND p.activo = TRUE;

-- View: top productos más vendidos
CREATE OR REPLACE VIEW tienda.v_top_productos AS
SELECT
    p.id_producto,
    p.nombre AS producto,
    cat.nombre AS categoria,
    SUM(dv.cantidad) AS total_vendido,
    SUM(dv.subtotal) AS ingresos_total
FROM detalle_ventas dv
JOIN productos p ON p.id_producto = dv.id_producto
JOIN categorias cat ON cat.id_categoria = p.id_categoria
JOIN ventas v ON v.id_venta = dv.id_venta
WHERE v.estado = 'completada'
GROUP BY p.id_producto, p.nombre, cat.nombre
ORDER BY total_vendido DESC;
