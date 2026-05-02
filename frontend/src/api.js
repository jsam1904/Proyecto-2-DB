const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
};

export const api = {
  // Auth
  login: (body) => fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  me:    ()     => fetch(`${BASE}/auth/me`,    { headers: headers() }).then(handle),

  // Productos
  getProductos:    ()   => fetch(`${BASE}/productos`,             { headers: headers() }).then(handle),
  getProducto:     (id) => fetch(`${BASE}/productos/${id}`,       { headers: headers() }).then(handle),
  getBajoStock:    ()   => fetch(`${BASE}/productos/bajo-stock`,  { headers: headers() }).then(handle),
  createProducto:  (b)  => fetch(`${BASE}/productos`,             { method: 'POST', headers: headers(), body: JSON.stringify(b) }).then(handle),
  updateProducto:  (id, b) => fetch(`${BASE}/productos/${id}`,    { method: 'PUT',  headers: headers(), body: JSON.stringify(b) }).then(handle),
  deleteProducto:  (id) => fetch(`${BASE}/productos/${id}`,       { method: 'DELETE', headers: headers() }).then(handle),

  // Ventas
  getVentas:   ()   => fetch(`${BASE}/ventas`,       { headers: headers() }).then(handle),
  getVenta:    (id) => fetch(`${BASE}/ventas/${id}`,  { headers: headers() }).then(handle),
  createVenta: (b)  => fetch(`${BASE}/ventas`,        { method: 'POST', headers: headers(), body: JSON.stringify(b) }).then(handle),

  // Clientes
  getClientes:   ()      => fetch(`${BASE}/clientes`,      { headers: headers() }).then(handle),
  createCliente: (b)     => fetch(`${BASE}/clientes`,      { method: 'POST', headers: headers(), body: JSON.stringify(b) }).then(handle),
  updateCliente: (id, b) => fetch(`${BASE}/clientes/${id}`,{ method: 'PUT',  headers: headers(), body: JSON.stringify(b) }).then(handle),
  deleteCliente: (id)    => fetch(`${BASE}/clientes/${id}`,{ method: 'DELETE', headers: headers() }).then(handle),

  // Empleados
  getEmpleados:   ()      => fetch(`${BASE}/empleados`,      { headers: headers() }).then(handle),
  createEmpleado: (b)     => fetch(`${BASE}/empleados`,      { method: 'POST', headers: headers(), body: JSON.stringify(b) }).then(handle),
  updateEmpleado: (id, b) => fetch(`${BASE}/empleados/${id}`,{ method: 'PUT',  headers: headers(), body: JSON.stringify(b) }).then(handle),
  deleteEmpleado: (id)    => fetch(`${BASE}/empleados/${id}`,{ method: 'DELETE', headers: headers() }).then(handle),

  // Catálogos
  getCategorias:   () => fetch(`${BASE}/categorias`,  { headers: headers() }).then(handle),
  getProveedores:  () => fetch(`${BASE}/proveedores`, { headers: headers() }).then(handle),
  createCategoria: (b) => fetch(`${BASE}/categorias`, { method: 'POST', headers: headers(), body: JSON.stringify(b) }).then(handle),
  createProveedor: (b) => fetch(`${BASE}/proveedores`,{ method: 'POST', headers: headers(), body: JSON.stringify(b) }).then(handle),

  // Reportes
  getVentasPorEmpleado:  () => fetch(`${BASE}/reportes/ventas-por-empleado`,  { headers: headers() }).then(handle),
  getVentasPorCategoria: () => fetch(`${BASE}/reportes/ventas-por-categoria`, { headers: headers() }).then(handle),
  getTopClientes:        () => fetch(`${BASE}/reportes/top-clientes`,         { headers: headers() }).then(handle),
  getProductosSinVenta:  () => fetch(`${BASE}/reportes/productos-sin-venta`,  { headers: headers() }).then(handle),
  getResumenMensual:     () => fetch(`${BASE}/reportes/resumen-mensual`,      { headers: headers() }).then(handle),
  getVistaVentas:        () => fetch(`${BASE}/reportes/vista-ventas`,         { headers: headers() }).then(handle),
  getTopProductos:       () => fetch(`${BASE}/reportes/top-productos`,        { headers: headers() }).then(handle),
};
