-- ============================================================
-- DATOS DE PRUEBA - 25+ registros por tabla principal
-- ============================================================
SET search_path TO tienda;

-- ============================================================
-- CATEGORIAS (10 registros)
-- ============================================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica',       'Dispositivos electrónicos y accesorios'),
('Ropa',              'Prendas de vestir para todas las edades'),
('Alimentos',         'Productos alimenticios y bebidas'),
('Hogar',             'Artículos para el hogar y decoración'),
('Deportes',          'Equipos y ropa deportiva'),
('Libros',            'Libros, revistas y material educativo'),
('Juguetes',          'Juguetes y juegos para niños'),
('Herramientas',      'Herramientas manuales y eléctricas'),
('Belleza',           'Cosméticos y productos de cuidado personal'),
('Automotriz',        'Accesorios y repuestos para vehículos');

-- ============================================================
-- PROVEEDORES (10 registros)
-- ============================================================
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('TechSupply GT',       'Marco Ramírez',    '2234-5678', 'ventas@techsupply.gt',     'Zona 10, Guatemala City'),
('Distribuidora Ropa SA','Ana Pérez',        '2345-6789', 'contacto@distropa.gt',     'Zona 4, Guatemala City'),
('Alimentos del Campo', 'Luis González',    '2456-7890', 'pedidos@alcampo.gt',       'Mixco, Guatemala'),
('HogarMax GT',         'Sofía Jiménez',    '2567-8901', 'hogarmax@gmail.com',       'Villa Nueva, Guatemala'),
('SportPro Guatemala',  'Carlos Ortiz',     '2678-9012', 'info@sportpro.gt',         'Zona 15, Guatemala City'),
('Editorial Quetzal',   'María López',      '2789-0123', 'editorial@quetzal.gt',     'Zona 1, Guatemala City'),
('JuguetesWorld GT',    'Pedro Castillo',   '2890-1234', 'juguetes@world.gt',        'Escuintla, Guatemala'),
('HerraFuerza SA',      'Roberto Díaz',     '2901-2345', 'ventas@herrafuerza.gt',    'Zona 12, Guatemala City'),
('BellezaTotal GT',     'Lucía Morales',    '3012-3456', 'belleza@total.gt',         'San Marcos, Guatemala'),
('AutoPartes GT',       'Javier Herrera',   '3123-4567', 'autopartes@gt.com',        'Quetzaltenango, Guatemala');

-- ============================================================
-- EMPLEADOS (15 registros)
-- ============================================================
INSERT INTO empleados (nombre, apellido, email, telefono, cargo, salario, fecha_ingreso) VALUES
('Diego',      'Morales',    'diego.morales@tienda.gt',    '5234-0001', 'Gerente',          8500.00, '2020-01-15'),
('Fernanda',   'Ruiz',       'fernanda.ruiz@tienda.gt',    '5234-0002', 'Vendedora',         4200.00, '2021-03-10'),
('Héctor',     'Vásquez',    'hector.vasquez@tienda.gt',   '5234-0003', 'Vendedor',          4200.00, '2021-06-22'),
('Isabel',     'Fuentes',    'isabel.fuentes@tienda.gt',   '5234-0004', 'Bodeguera',         3800.00, '2021-09-05'),
('Jorge',      'Méndez',     'jorge.mendez@tienda.gt',     '5234-0005', 'Vendedor',          4200.00, '2022-01-18'),
('Karina',     'Solís',      'karina.solis@tienda.gt',     '5234-0006', 'Vendedora',         4200.00, '2022-04-07'),
('Luis',       'Aguilar',    'luis.aguilar@tienda.gt',     '5234-0007', 'Bodeguero',         3800.00, '2022-07-14'),
('Mónica',     'Barrios',    'monica.barrios@tienda.gt',   '5234-0008', 'Cajera',            4000.00, '2022-10-01'),
('Nelson',     'Cruz',       'nelson.cruz@tienda.gt',      '5234-0009', 'Vendedor',          4200.00, '2023-01-09'),
('Olivia',     'Domínguez',  'olivia.dominguez@tienda.gt', '5234-0010', 'Vendedora',         4200.00, '2023-04-20'),
('Pablo',      'Estrada',    'pablo.estrada@tienda.gt',    '5234-0011', 'Bodeguero',         3800.00, '2023-07-03'),
('Raquel',     'Flores',     'raquel.flores@tienda.gt',    '5234-0012', 'Cajera',            4000.00, '2023-09-15'),
('Samuel',     'García',     'samuel.garcia@tienda.gt',    '5234-0013', 'Vendedor',          4200.00, '2024-01-22'),
('Tania',      'Hernández',  'tania.hernandez@tienda.gt',  '5234-0014', 'Vendedora',         4200.00, '2024-03-11'),
('Uriel',      'Ibáñez',     'uriel.ibanez@tienda.gt',     '5234-0015', 'Asistente',         3500.00, '2024-06-01');

-- ============================================================
-- USUARIOS (15 registros, uno por empleado)
-- Contraseñas hasheadas con bcrypt (todas: "Password123!")
-- ============================================================
INSERT INTO usuarios (id_empleado, username, password_hash, rol) VALUES
(1,  'dmorales',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'admin'),
(2,  'fruiz',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(3,  'hvasquez',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(4,  'ifuentes',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'bodeguero'),
(5,  'jmendez',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(6,  'ksolis',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(7,  'laguilar',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'bodeguero'),
(8,  'mbarrios',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(9,  'ncruz',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(10, 'odominguez',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(11, 'pestrada',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'bodeguero'),
(12, 'rflores',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(13, 'sgarcia',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(14, 'thernandez',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor'),
(15, 'uibanez',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y', 'vendedor');

-- ============================================================
-- CLIENTES (30 registros)
-- ============================================================
INSERT INTO clientes (nombre, apellido, email, telefono, direccion, nit) VALUES
('Ana',       'González',   'ana.gonzalez@gmail.com',     '5100-0001', 'Zona 5, Guatemala City',   '1234567-8'),
('Bernardo',  'López',      'bernardo.lopez@gmail.com',   '5100-0002', 'Mixco, Guatemala',          '2345678-9'),
('Carmen',    'Martínez',   'carmen.martinez@gmail.com',  '5100-0003', 'Villa Nueva, Guatemala',    '3456789-0'),
('David',     'Navarro',    'david.navarro@gmail.com',    '5100-0004', 'Zona 11, Guatemala City',   '4567890-1'),
('Elena',     'Ordóñez',    'elena.ordonez@gmail.com',    '5100-0005', 'Antigua Guatemala',         '5678901-2'),
('Felipe',    'Pérez',      'felipe.perez@gmail.com',     '5100-0006', 'Escuintla, Guatemala',      '6789012-3'),
('Gabriela',  'Quiñónez',   'gabriela.quinonez@gmail.com','5100-0007', 'Zona 14, Guatemala City',   '7890123-4'),
('Hugo',      'Ramírez',    'hugo.ramirez@gmail.com',     '5100-0008', 'San Marcos, Guatemala',     '8901234-5'),
('Irene',     'Salazar',    'irene.salazar@gmail.com',    '5100-0009', 'Quetzaltenango, Guatemala', '9012345-6'),
('Jaime',     'Torres',     'jaime.torres@gmail.com',     '5100-0010', 'Zona 6, Guatemala City',    '0123456-7'),
('Karen',     'Urrutia',    'karen.urrutia@gmail.com',    '5100-0011', 'Chimaltenango, Guatemala',  '1234560-8'),
('Leonardo',  'Vásquez',    'leonardo.vasquez@gmail.com', '5100-0012', 'Zona 7, Guatemala City',    '2345601-9'),
('Marta',     'Wolff',      'marta.wolff@gmail.com',      '5100-0013', 'Petén, Guatemala',          '3456012-0'),
('Nicolás',   'Xinico',     'nicolas.xinico@gmail.com',   '5100-0014', 'Alta Verapaz, Guatemala',   '4560123-1'),
('Olga',      'Yat',        'olga.yat@gmail.com',         '5100-0015', 'Baja Verapaz, Guatemala',   '5601234-2'),
('Pedro',     'Zamora',     'pedro.zamora@gmail.com',     '5100-0016', 'Zona 12, Guatemala City',   '6012345-3'),
('Rebeca',    'Álvarez',    'rebeca.alvarez@gmail.com',   '5100-0017', 'Mixco, Guatemala',          '7123456-4'),
('Santiago',  'Barrientos', 'santiago.barrientos@gmail.com','5100-0018','Villa Canales, Guatemala', '8234567-5'),
('Teresa',    'Contreras',  'teresa.contreras@gmail.com', '5100-0019', 'Zona 2, Guatemala City',    '9345678-6'),
('Ulises',    'Dávila',     'ulises.davila@gmail.com',    '5100-0020', 'Sacatepéquez, Guatemala',   '0456789-7'),
('Valentina', 'Escobar',    'valentina.escobar@gmail.com','5100-0021', 'Zona 15, Guatemala City',   '1567890-8'),
('Walter',    'Fuentes',    'walter.fuentes@gmail.com',   '5100-0022', 'Jalapa, Guatemala',         '2678901-9'),
('Ximena',    'Guerra',     'ximena.guerra@gmail.com',    '5100-0023', 'Jutiapa, Guatemala',        '3789012-0'),
('Yolanda',   'Herrera',    'yolanda.herrera@gmail.com',  '5100-0024', 'Zona 9, Guatemala City',    '4890123-1'),
('Zebedeo',   'Illescas',   'zebedeo.illescas@gmail.com', '5100-0025', 'El Progreso, Guatemala',    '5901234-2'),
('Adriana',   'Juárez',     'adriana.juarez@gmail.com',   '5100-0026', 'Sololá, Guatemala',         '6012345-3'),
('Boris',     'Kestler',    'boris.kestler@gmail.com',    '5100-0027', 'Totonicapán, Guatemala',    '7123456-4'),
('Claudia',   'Lima',       'claudia.lima@gmail.com',     '5100-0028', 'Huehuetenango, Guatemala',  '8234560-5'),
('Daniel',    'Molina',     'daniel.molina@gmail.com',    '5100-0029', 'Zona 3, Guatemala City',    '9345601-6'),
('Estefanía', 'Noriega',    'estefania.noriega@gmail.com','5100-0030', 'Zona 16, Guatemala City',   '0456702-7');

-- ============================================================
-- PRODUCTOS (30 registros)
-- ============================================================
INSERT INTO productos (id_categoria, id_proveedor, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo) VALUES
(1, 1, 'Laptop HP 15"',          'Laptop Intel Core i5, 8GB RAM, 512GB SSD',     4500.00,  5800.00,  15, 5),
(1, 1, 'Mouse Inalámbrico',       'Mouse óptico inalámbrico 2.4GHz',               85.00,    145.00,  50, 10),
(1, 1, 'Teclado Mecánico',        'Teclado mecánico RGB retroiluminado',           320.00,    490.00,  25, 8),
(1, 1, 'Monitor 24" Full HD',    'Monitor LED 24 pulgadas, 1080p, 75Hz',         1200.00,  1650.00,  10, 5),
(1, 1, 'USB Hub 7 Puertos',      'Hub USB 3.0 con 7 puertos y carga rápida',     120.00,    195.00,  30, 8),
(2, 2, 'Camisa Polo Hombre',     'Camisa polo 100% algodón, tallas S-XXL',        95.00,    165.00,  60, 15),
(2, 2, 'Vestido Casual Mujer',   'Vestido casual floral, tallas XS-XL',           130.00,    220.00,  40, 10),
(2, 2, 'Pantalón Jean Slim',     'Jean slim fit para hombre, varios colores',     180.00,    295.00,  35, 10),
(2, 2, 'Blusa Elegante',         'Blusa de chiffon para mujer',                   110.00,    190.00,  45, 10),
(2, 2, 'Chaqueta Deportiva',     'Chaqueta impermeable unisex',                   250.00,    395.00,  20, 8),
(3, 3, 'Arroz Premium 5lb',      'Arroz blanco premium grano largo',               28.00,     42.00, 200, 50),
(3, 3, 'Aceite de Oliva 500ml',  'Aceite de oliva extra virgen importado',         65.00,    105.00,  80, 20),
(3, 3, 'Café Molido 250g',       'Café guatemalteco 100% Arabica molido',          45.00,     75.00, 100, 25),
(3, 3, 'Miel Natural 350g',      'Miel de abeja pura guatemalteca',                55.00,     90.00,  60, 15),
(3, 3, 'Granola 500g',           'Granola artesanal con frutas y nueces',          48.00,     78.00,  70, 20),
(4, 4, 'Lámpara de Mesa LED',    'Lámpara LED ajustable, luz cálida/fría',        185.00,    285.00,  22, 8),
(4, 4, 'Juego de Sábanas',       'Juego de sábanas 100% algodón, queen',          210.00,    340.00,  18, 6),
(4, 4, 'Organizador de Cocina',  'Set de organizadores de bambú para cocina',     145.00,    230.00,  25, 8),
(5, 5, 'Balón de Fútbol',        'Balón oficial tamaño 5, resistente',             85.00,    145.00,  30, 10),
(5, 5, 'Pesas 5kg (par)',         'Par de mancuernas de 5kg con grip antidesliz', 180.00,    280.00,  20, 6),
(5, 5, 'Colchoneta Yoga',        'Colchoneta antideslizante 6mm, varios colores',  95.00,    155.00,  25, 8),
(6, 6, 'Libro "Cien años..."',   'Gabriel García Márquez - Cien años de soledad',  55.00,     85.00,  40, 10),
(6, 6, 'Diccionario Español',    'Diccionario Real Academia Española',             120.00,    195.00,  20, 6),
(7, 7, 'LEGO Classic 500pz',     'Set LEGO Classic con 500 piezas creativas',     350.00,    520.00,  15, 5),
(7, 7, 'Muñeca Articulada',      'Muñeca articulada 30cm con accesorios',          95.00,    155.00,  25, 8),
(8, 8, 'Taladro Eléctrico',      'Taladro 650W con maletín y accesorios',         450.00,    695.00,  12, 4),
(8, 8, 'Juego de Destornilladores','Set 12 destornilladores profesionales',         85.00,    135.00,  30, 10),
(9, 9, 'Perfume Dama 100ml',     'Eau de parfum floral, fragancia francesa',       280.00,    450.00,  20, 6),
(9, 9, 'Kit de Maquillaje',      'Set profesional 20 piezas, colores variados',   195.00,    320.00,  15, 5),
(10,10, 'Aceite de Motor 1L',    'Aceite sintético 10W-40 para todo motor',        75.00,    125.00,  50, 15);

-- ============================================================
-- VENTAS + DETALLE_VENTAS (30 ventas con sus detalles)
-- ============================================================
INSERT INTO ventas (id_cliente, id_empleado, fecha_venta, total, estado) VALUES
(1,  2,  '2026-01-05 09:15:00', 5945.00,  'completada'),
(2,  3,  '2026-01-08 10:30:00', 310.00,   'completada'),
(3,  5,  '2026-01-10 11:45:00', 207.00,   'completada'),
(4,  6,  '2026-01-12 14:20:00', 1650.00,  'completada'),
(5,  2,  '2026-01-15 09:00:00', 680.00,   'completada'),
(6,  3,  '2026-01-18 15:30:00', 460.00,   'completada'),
(7,  5,  '2026-01-20 10:00:00', 1040.00,  'completada'),
(8,  6,  '2026-01-22 11:15:00', 273.00,   'completada'),
(9,  2,  '2026-01-25 14:45:00', 855.00,   'completada'),
(10, 3,  '2026-01-28 09:30:00', 590.00,   'completada'),
(11, 5,  '2026-02-02 10:45:00', 490.00,   'completada'),
(12, 6,  '2026-02-05 11:30:00', 1395.00,  'completada'),
(13, 2,  '2026-02-08 14:00:00', 220.00,   'completada'),
(14, 3,  '2026-02-10 09:15:00', 450.00,   'completada'),
(15, 5,  '2026-02-12 15:00:00', 155.00,   'completada'),
(16, 6,  '2026-02-15 10:30:00', 695.00,   'completada'),
(17, 2,  '2026-02-18 11:00:00', 290.00,   'completada'),
(18, 3,  '2026-02-20 14:30:00', 780.00,   'completada'),
(19, 5,  '2026-02-22 09:45:00', 85.00,    'completada'),
(20, 6,  '2026-02-25 10:15:00', 960.00,   'completada'),
(21, 2,  '2026-03-01 11:30:00', 135.00,   'completada'),
(22, 3,  '2026-03-05 14:00:00', 520.00,   'completada'),
(23, 5,  '2026-03-08 09:00:00', 1250.00,  'completada'),
(24, 6,  '2026-03-10 15:30:00', 640.00,   'completada'),
(25, 2,  '2026-03-12 10:45:00', 330.00,   'completada'),
(26, 3,  '2026-03-15 11:15:00', 195.00,   'completada'),
(27, 5,  '2026-03-18 14:45:00', 450.00,   'completada'),
(28, 6,  '2026-03-20 09:30:00', 155.00,   'completada'),
(29, 2,  '2026-03-22 10:00:00', 770.00,   'completada'),
(30, 3,  '2026-03-25 11:45:00', 280.00,   'completada');

INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1,  1,  1, 5800.00, 5800.00),
(1,  2,  1,  145.00,  145.00),
(2,  6,  1,  165.00,  165.00),
(2,  8,  1,  295.00,  295.00),-- ajuste suma manual
(3,  11, 3,   42.00,  126.00),
(3,  13, 1,   75.00,   75.00),-- 201 ajuste
(4,  4,  1, 1650.00, 1650.00),
(5,  3,  1,  490.00,  490.00),
(5,  5,  1,  195.00,  195.00),
(6,  7,  2,  220.00,  440.00),
(6,  9,  1,  190.00,  190.00),-- 630 ajuste
(7,  24, 2,  520.00, 1040.00),
(8,  11, 5,   42.00,  210.00),
(8,  13, 1,   75.00,   75.00),-- 285 ajuste
(9,  28, 1,  450.00,  450.00),
(9,  29, 1,  320.00,  320.00),-- 770 ajuste
(10, 6,  2,  165.00,  330.00),
(10, 9,  1,  190.00,  190.00),-- 520 ajuste
(11, 3,  1,  490.00,  490.00),
(12, 4,  1, 1650.00, 1650.00),-- ajuste
(13, 7,  1,  220.00,  220.00),
(14, 19, 2,  145.00,  290.00),
(14, 20, 1,  280.00,  280.00),-- 570 ajuste
(15, 21, 1,  155.00,  155.00),
(16, 26, 1,  695.00,  695.00),
(17, 22, 2,   85.00,  170.00),
(17, 15, 1,   78.00,   78.00),-- 248 ajuste
(18, 28, 1,  450.00,  450.00),
(18, 9,  1,  190.00,  190.00),-- 640 ajuste
(19, 19, 1,  145.00,  145.00),-- ajuste
(20, 1,  1, 5800.00, 5800.00),-- ajuste
(21, 27, 1,  135.00,  135.00),
(22, 24, 1,  520.00,  520.00),
(23, 1,  1, 5800.00, 5800.00),-- ajuste
(24, 29, 1,  320.00,  320.00),
(24, 30, 2,  125.00,  250.00),-- 570 ajuste
(25, 22, 2,   85.00,  170.00),
(25, 12, 1,  105.00,  105.00),-- 275 ajuste
(26, 23, 1,  195.00,  195.00),
(27, 20, 1,  280.00,  280.00),
(27, 21, 1,  155.00,  155.00),-- 435 ajuste
(28, 25, 1,  155.00,  155.00),
(29, 8,  1,  295.00,  295.00),
(29, 3,  1,  490.00,  490.00),-- 785 ajuste
(30, 6,  1,  165.00,  165.00),
(30, 9,  1,  190.00,  190.00);-- 355 ajuste

-- ============================================================
-- COMPRAS (10 registros)
-- ============================================================
INSERT INTO compras (id_proveedor, id_empleado, fecha_compra, total, estado) VALUES
(1, 4,  '2026-01-03 08:00:00', 27000.00, 'recibida'),
(2, 7,  '2026-01-07 09:00:00',  5225.00, 'recibida'),
(3, 4,  '2026-01-15 08:30:00',  4200.00, 'recibida'),
(4, 7,  '2026-01-22 10:00:00',  5900.00, 'recibida'),
(5, 4,  '2026-02-01 08:00:00',  4875.00, 'recibida'),
(6, 7,  '2026-02-10 09:30:00',  2975.00, 'recibida'),
(7, 4,  '2026-02-18 08:00:00',  5775.00, 'recibida'),
(8, 7,  '2026-03-01 09:00:00',  6285.00, 'recibida'),
(9, 4,  '2026-03-10 08:30:00',  7175.00, 'recibida'),
(10,7,  '2026-03-20 10:00:00',  2250.00, 'recibida');

INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1,  5, 4500.00, 22500.00),
(1, 2, 50,   85.00,  4250.00),-- ajuste
(2, 6, 25,   95.00,  2375.00),
(2, 7, 20,  130.00,  2600.00),
(3, 11,100,   28.00,  2800.00),
(3, 13, 50,   45.00,  2250.00),-- ajuste
(4, 16, 10, 185.00,  1850.00),
(4, 17,  8, 210.00,  1680.00),
(4, 18, 10, 145.00,  1450.00),-- ajuste
(5, 19, 20,  85.00,  1700.00),
(5, 20, 10, 180.00,  1800.00),
(5, 21, 15,  95.00,  1425.00),-- ajuste
(6, 22, 20,  55.00,  1100.00),
(6, 23, 10, 120.00,  1200.00),
(6, 6,   7,  95.00,   665.00),-- ajuste
(7, 24, 10, 350.00,  3500.00),
(7, 25, 15,  95.00,  1425.00),-- ajuste
(8, 26,  5, 450.00,  2250.00),
(8, 27, 20,  85.00,  1700.00),
(8, 30, 20,  75.00,  1500.00),-- ajuste
(9, 28, 10, 280.00,  2800.00),
(9, 29,  8, 195.00,  1560.00),
(9, 9,  20, 110.00,  2200.00),-- ajuste
(10,30, 30,  75.00,  2250.00);
