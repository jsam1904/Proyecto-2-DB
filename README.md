# TiendaDB — Proyecto 2 | cc3088 Bases de Datos 1

Sistema web para gestionar inventario y ventas de una tienda. Stack: **React + Node.js (Express) + PostgreSQL + Docker**.

---

## ⚡ Levantar el proyecto

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd tienda-project

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar todo
docker compose up
```

La app estará disponible en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **PostgreSQL:** localhost:5432

**Credenciales de BD:** usuario `proy2` / contraseña `secret`

**Login:** usuario `dmorales` / contraseña `Password123!` (rol: admin)

---

## 🏗️ Arquitectura

```
tienda-project/
├── docker-compose.yml
├── .env / .env.example
├── database/
│   ├── 01_schema.sql     # DDL: tablas, índices, views
│   └── 02_seed.sql       # Datos de prueba (25+ por tabla)
├── backend/              # Node.js + Express
│   └── src/
│       ├── index.js
│       ├── db/pool.js
│       ├── middleware/auth.js
│       └── routes/
│           ├── auth.js       # Login/logout JWT
│           ├── productos.js  # CRUD + bajo stock (EXISTS)
│           ├── ventas.js     # CRUD + transacción explícita
│           ├── reportes.js   # GROUP BY, CTE, subqueries, VIEWs
│           └── entidades.js  # Clientes, Empleados, Categorías, Proveedores
└── frontend/             # React + Vite
    └── src/
        ├── pages/        # Dashboard, Productos, Ventas, Clientes...
        └── api.js        # Llamadas a la API
```

---

## 🗃️ Diseño de base de datos

### Entidades principales

| Tabla | Descripción |
|-------|-------------|
| `categorias` | Grupos de productos |
| `proveedores` | Empresas que surten productos |
| `productos` | Artículos con stock |
| `clientes` | Compradores registrados |
| `empleados` | Personal de la tienda |
| `usuarios` | Cuentas de acceso (1:1 con empleados) |
| `ventas` | Encabezado de cada venta |
| `detalle_ventas` | Líneas de cada venta |
| `compras` | Órdenes a proveedores |
| `detalle_compras` | Líneas de cada compra |

### Modelo relacional

```
categorias(id_categoria PK, nombre, descripcion, activo, creado_en)
proveedores(id_proveedor PK, nombre, contacto, telefono, email, direccion, activo, creado_en)
productos(id_producto PK, id_categoria FK, id_proveedor FK, nombre, descripcion,
          precio_compra, precio_venta, stock, stock_minimo, activo, creado_en)
empleados(id_empleado PK, nombre, apellido, email UNIQUE, telefono, cargo, salario, fecha_ingreso, activo)
usuarios(id_usuario PK, id_empleado FK UNIQUE, username UNIQUE, password_hash, rol, activo, ultimo_login)
clientes(id_cliente PK, nombre, apellido, email UNIQUE, telefono, direccion, nit UNIQUE, activo)
ventas(id_venta PK, id_cliente FK, id_empleado FK, fecha_venta, total, estado, notas)
detalle_ventas(id_detalle PK, id_venta FK, id_producto FK, cantidad, precio_unitario, subtotal)
compras(id_compra PK, id_proveedor FK, id_empleado FK, fecha_compra, total, estado)
detalle_compras(id_detalle PK, id_compra FK, id_producto FK, cantidad, precio_unitario, subtotal)
```

### Normalización hasta 3FN

**1FN:** Todas las tablas tienen PK, atributos atómicos, sin grupos repetidos.

**2FN:** En `detalle_ventas`, todos los atributos (`cantidad`, `precio_unitario`, `subtotal`) dependen de la PK compuesta `(id_venta, id_producto)` completa. No hay dependencias parciales.

**3FN:** No existen dependencias transitivas. Por ejemplo, en `productos` el nombre del proveedor no está guardado directamente; se accede via FK `id_proveedor → proveedores`. Lo mismo para categorías.

---

## ✅ Rúbrica cubierta

### I. Diseño de base de datos (40 pts)
- [x] Diagrama ER: entidades, atributos, relaciones, cardinalidades
- [x] Modelo relacional documentado
- [x] Normalización 3FN justificada
- [x] DDL con PRIMARY KEY, FOREIGN KEY, NOT NULL, CHECK constraints
- [x] Datos de prueba realistas 25+ registros por tabla
- [x] Índices en 5 columnas justificadas

### II. SQL (50 pts)
- [x] 3 consultas JOIN múltiple (ventas, productos, reportes — visibles en UI)
- [x] 2 subqueries: `EXISTS` en bajo-stock, `NOT IN` en productos-sin-venta
- [x] GROUP BY + HAVING + agregaciones (reporte por empleado, por categoría)
- [x] CTE con `WITH` (top clientes con RANK, resumen mensual)
- [x] VIEW usado por backend (`v_ventas_detalle`, `v_top_productos`)
- [x] Transacción explícita BEGIN/COMMIT/ROLLBACK en registro de ventas

### III. Aplicación web (35 pts)
- [x] CRUD completo: Productos, Clientes, Empleados
- [x] Reportes visibles en UI con datos reales
- [x] Manejo de errores con mensajes al usuario
- [x] README funcional con docker compose up

### IV. Avanzado (15 pts)
- [x] Autenticación JWT (login/logout con sesión)
- [x] Exportar reportes a CSV desde la UI
