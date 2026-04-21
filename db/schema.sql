-- ============================================================
--  Sistema de Ventas -- PostgreSQL
--  Modelo en 3NF
-- ============================================================

DROP TABLE IF EXISTS detalle_venta CASCADE;
DROP TABLE IF EXISTS venta        CASCADE;
DROP TABLE IF EXISTS producto     CASCADE;
DROP TABLE IF EXISTS cliente      CASCADE;
DROP TABLE IF EXISTS empleado     CASCADE;
DROP TABLE IF EXISTS proveedor    CASCADE;
DROP TABLE IF EXISTS categoria    CASCADE;

-- ------------------------------------------------------------
-- CATEGORIA
-- ------------------------------------------------------------
CREATE TABLE categoria (
    id_categoria SERIAL      PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- PROVEEDOR
-- ------------------------------------------------------------
CREATE TABLE proveedor (
    id_proveedor SERIAL      PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    contacto     VARCHAR(150),
    telefono     VARCHAR(20)
);

-- ------------------------------------------------------------
-- PRODUCTO
-- ------------------------------------------------------------
CREATE TABLE producto (
    id_producto  SERIAL         PRIMARY KEY,
    nombre       VARCHAR(150)   NOT NULL,
    precio       NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock        INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    id_categoria INTEGER        NOT NULL REFERENCES categoria  (id_categoria),
    id_proveedor INTEGER        NOT NULL REFERENCES proveedor  (id_proveedor)
);

-- ------------------------------------------------------------
-- CLIENTE
-- ------------------------------------------------------------
CREATE TABLE cliente (
    id_cliente SERIAL      PRIMARY KEY,
    nombre     VARCHAR(150) NOT NULL,
    nit        VARCHAR(20)  UNIQUE,
    direccion  TEXT
);

-- ------------------------------------------------------------
-- EMPLEADO
-- ------------------------------------------------------------
CREATE TABLE empleado (
    id_empleado SERIAL      PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    puesto      VARCHAR(100)
);

-- ------------------------------------------------------------
-- VENTA
-- ------------------------------------------------------------
CREATE TABLE venta (
    id_venta    SERIAL         PRIMARY KEY,
    fecha       DATE           NOT NULL DEFAULT CURRENT_DATE,
    total       NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    id_cliente  INTEGER        NOT NULL REFERENCES cliente  (id_cliente),
    id_empleado INTEGER        NOT NULL REFERENCES empleado (id_empleado)
);

-- ------------------------------------------------------------
-- DETALLE_VENTA
-- ------------------------------------------------------------
CREATE TABLE detalle_venta (
    id_detalle      SERIAL         PRIMARY KEY,
    id_venta        INTEGER        NOT NULL REFERENCES venta   (id_venta)   ON DELETE CASCADE,
    id_producto     INTEGER        NOT NULL REFERENCES producto (id_producto),
    cantidad        INTEGER        NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    -- Subtotal calculado (columna generada, disponible en PG 12+)
    subtotal        NUMERIC(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

-- ------------------------------------------------------------
-- DATOS DE EJEMPLO
-- ------------------------------------------------------------
INSERT INTO categoria (nombre) VALUES
    ('Electrónica'),
    ('Papelería'),
    ('Alimentos');

INSERT INTO proveedor (nombre, contacto, telefono) VALUES
    ('Distribuidora Tech S.A.',  'Carlos López',   '5551-1234'),
    ('Suministros del Sur',      'Ana Pérez',      '5552-5678'),
    ('Importadora Central',      'Luis Martínez',  '5553-9012');

INSERT INTO producto (nombre, precio, stock, id_categoria, id_proveedor) VALUES
    ('Teclado mecánico',   350.00, 20, 1, 1),
    ('Mouse inalámbrico',  150.00, 35, 1, 1),
    ('Resma papel A4',      55.00, 80, 2, 2),
    ('Bolígrafo azul x12',  25.00,200, 2, 2),
    ('Café molido 250g',    48.50, 60, 3, 3);

INSERT INTO cliente (nombre, nit, direccion) VALUES
    ('María García',    '12345678-9', 'Zona 10, Ciudad de Guatemala'),
    ('Empresa XYZ',     '98765432-1', 'Zona 4, Ciudad de Guatemala'),
    ('Roberto Sánchez', '11223344-5', 'Mixco, Guatemala');

INSERT INTO empleado (nombre, puesto) VALUES
    ('Pedro Juárez',  'Cajero'),
    ('Sofía Herrera', 'Vendedora'),
    ('Diego Ramos',   'Supervisor');

-- Venta 1
INSERT INTO venta (fecha, total, id_cliente, id_empleado)
    VALUES ('2025-04-15', 500.00, 1, 1);
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
    VALUES (1, 1, 1, 350.00), (1, 3, 2, 55.00), (1, 4, 2, 25.00);

-- Venta 2
INSERT INTO venta (fecha, total, id_cliente, id_empleado)
    VALUES ('2025-04-16', 750.00, 2, 2);
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
    VALUES (2, 2, 3, 150.00), (2, 5, 4, 48.50), (2, 4, 3, 25.00);

-- Actualizar totales usando los subtotales calculados
UPDATE venta SET total = (
    SELECT COALESCE(SUM(subtotal), 0) FROM detalle_venta WHERE id_venta = venta.id_venta
);

-- ------------------------------------------------------------
-- VISTA útil: detalle completo de ventas
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_ventas_detalle AS
SELECT
    v.id_venta,
    v.fecha,
    c.nombre        AS cliente,
    c.nit,
    e.nombre        AS empleado,
    e.puesto,
    p.nombre        AS producto,
    dv.cantidad,
    dv.precio_unitario,
    dv.subtotal,
    v.total         AS total_venta
FROM venta v
JOIN cliente        c  ON c.id_cliente  = v.id_cliente
JOIN empleado       e  ON e.id_empleado = v.id_empleado
JOIN detalle_venta  dv ON dv.id_venta   = v.id_venta
JOIN producto       p  ON p.id_producto = dv.id_producto
ORDER BY v.fecha DESC, v.id_venta, p.nombre;