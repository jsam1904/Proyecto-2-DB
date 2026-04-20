# Proyecto-2-DB

Sistema de gestión de ventas implementado con PostgreSQL y Docker. El proyecto incluye el esquema de base de datos en 3FN, datos de ejemplo y configuración de contenedores lista para usar.

## Tecnologías

- **Base de datos**: PostgreSQL 16 (Alpine)
- **Contenedores**: Docker & Docker Compose 3.9
- **Administración**: pgAdmin 4

## Estructura del Proyecto

```text
Proyecto-2-DB/
├── db/
│   └── schema.sql          # Esquema de BD y datos de ejemplo
├── docs/
│   └── Proyecto 2.docx     # Documentación del proyecto
├── backend/                # (pendiente)
├── frontend/               # (pendiente)
├── docker-compose.example.yml
└── docker-compose.yml
```

## Esquema de la Base de Datos

El esquema sigue la **Tercera Forma Normal (3FN)** y cuenta con 7 tablas:

| Tabla | Descripción |
| --- | --- |
| `categoria` | Categorías de productos |
| `proveedor` | Proveedores |
| `producto` | Productos con precio y stock |
| `cliente` | Clientes con NIT y dirección |
| `empleado` | Empleados y puestos |
| `venta` | Transacciones de venta |
| `detalle_venta` | Líneas de detalle por venta |

**Vista incluida:** `v_ventas_detalle` — une todas las tablas para consultas de reporte.

**Características del esquema:**

- Llaves foráneas con integridad referencial
- `CASCADE DELETE` en `detalle_venta`
- Restricciones `CHECK` en precios y cantidades
- Columna generada (`subtotal = cantidad × precio_unitario`)
- 7 índices de rendimiento en columnas frecuentemente consultadas

## Configuración e Instalación

### Prerrequisitos

- [Docker](https://www.docker.com/) instalado

### Pasos

1. Clona el repositorio:

   ```bash
   git clone <url-del-repo>
   cd Proyecto-2-DB
   ```

2. Copia el archivo de ejemplo y configura tus credenciales:

   ```bash
   cp docker-compose.example.yml docker-compose.yml
   ```

3. Crea un archivo `.env` con las variables necesarias (ver `docker-compose.example.yml`).

4. Levanta los contenedores:

   ```bash
   docker-compose up -d
   ```

Los servicios quedan disponibles en:

| Servicio | Puerto | Descripción |
| --- | --- | --- |
| PostgreSQL | `5432` | Base de datos principal |
| pgAdmin | `5050` | Interfaz web de administración |

> El script `schema.sql` se ejecuta automáticamente al crear el contenedor por primera vez, inicializando las tablas y los datos de ejemplo.

## Autor

**Javier Alvarado** — [@jsam1904](https://github.com/jsam1904)
