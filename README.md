# TiendaDB — Proyecto 2 | cc3088 Bases de Datos 1

Sistema web para gestionar inventario y ventas de una tienda. Stack: **React + Node.js (Express) + PostgreSQL + Docker**.

---

## Levantar el proyecto

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Proyecto-2-DB

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar todo
docker compose up -d
```

Si el comando anterior falla con `container tienda_db is unhealthy`, espera unos segundos y corre:

```bash
docker compose up -d backend frontend
```

Esto ocurre porque PostgreSQL necesita un momento para recuperarse en el primer arranque. El `start_period: 30s` del healthcheck lo maneja automáticamente en la mayoría de los casos.

La app estará disponible en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **PostgreSQL:** localhost:5432

Para detener el proyecto limpiamente (evita el problema de arranque):

```bash
docker compose stop    # detiene sin borrar contenedores
docker compose start   # reanuda sin necesidad de recuperación
```

---

## Credenciales

### Base de datos

| Campo    | Valor                                 |
|----------|---------------------------------------|
| Usuario  | `proy2`                               |
| Password | `secret`                              |
| Base     | `tienda_db`                           |
| Host     | `localhost` / `db` (dentro de Docker) |

### Usuarios de la aplicación

Todos los usuarios comparten la contraseña: **`Password123!`**

| Usuario      | Rol        |
|--------------|------------|
| `dmorales`   | admin      |
| `ifuentes`   | bodeguero  |
| `laguilar`   | bodeguero  |
| `pestrada`   | bodeguero  |
| `fruiz`      | vendedor   |
| `hvasquez`   | vendedor   |
| `jmendez`    | vendedor   |
| `ksolis`     | vendedor   |
| `mbarrios`   | vendedor   |
| `ncruz`      | vendedor   |
| `odominguez` | vendedor   |
| `rflores`    | vendedor   |
| `sgarcia`    | vendedor   |
| `thernandez` | vendedor   |
| `uibanez`    | vendedor   |

---

## Arquitectura

```
Proyecto-2-DB/
├── docker-compose.yml
├── .env / .env.example
├── db/
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

## Diseño de base de datos

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
