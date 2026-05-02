import { useState, useEffect } from 'react'
import { api } from '../api'

const EMPTY = { nombre: '', descripcion: '', id_categoria: '', id_proveedor: '', precio_compra: '', precio_venta: '', stock: 0, stock_minimo: 5 }

export default function Productos() {
  const [rows,       setRows]       = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores,setProveedores]= useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState(null)
  const [form,       setForm]       = useState(EMPTY)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [search,     setSearch]     = useState('')

  const load = async () => {
    setLoading(true)
    const [p, c, pr] = await Promise.all([api.getProductos(), api.getCategorias(), api.getProveedores()])
    setRows(p); setCategorias(c); setProveedores(pr)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      nombre: p.nombre, descripcion: p.descripcion || '',
      id_categoria: p.id_categoria, id_proveedor: p.id_proveedor,
      precio_compra: p.precio_compra, precio_venta: p.precio_venta,
      stock: p.stock, stock_minimo: p.stock_minimo,
    })
    setError('')
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await api.updateProducto(editing.id_producto, form)
        setSuccess('Producto actualizado')
      } else {
        await api.createProducto(form)
        setSuccess('Producto creado')
      }
      setModal(false)
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Desactivar producto "${nombre}"?`)) return
    try {
      await api.deleteProducto(id)
      setSuccess('Producto desactivado')
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = rows.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Productos</h1>
        <p className="page-subtitle">CRUD completo · JOIN con categorías y proveedores</p>
      </div>

      <div className="page-body">
        {success && <div className="alert alert-success">✓ {success}</div>}
        {error   && <div className="alert alert-error">⚠ {error}</div>}

        <div className="card">
          <div className="card-header">
            <span className="card-title">Listado de productos</span>
            <div className="flex gap-8">
              <input
                placeholder="Buscar producto…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 200 }}
              />
              <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Nuevo</button>
            </div>
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Proveedor</th>
                    <th>P. Compra</th>
                    <th>P. Venta</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Sin resultados</td></tr>
                  ) : filtered.map(p => (
                    <tr key={p.id_producto}>
                      <td className="text-muted monospace">{p.id_producto}</td>
                      <td><strong>{p.nombre}</strong></td>
                      <td><span className="badge badge-blue">{p.categoria}</span></td>
                      <td className="text-muted">{p.proveedor}</td>
                      <td>Q{parseFloat(p.precio_compra).toFixed(2)}</td>
                      <td className="text-green">Q{parseFloat(p.precio_venta).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${p.stock <= p.stock_minimo ? 'badge-red' : 'badge-green'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.activo ? 'badge-green' : 'badge-red'}`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(p)}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p.id_producto, p.nombre)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">⚠ {error}</div>}
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Nombre *</label>
                    <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
                  </div>
                  <div className="form-group full">
                    <label>Descripción</label>
                    <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select value={form.id_categoria} onChange={e => setForm(f => ({ ...f, id_categoria: e.target.value }))} required>
                      <option value="">Seleccionar…</option>
                      {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Proveedor *</label>
                    <select value={form.id_proveedor} onChange={e => setForm(f => ({ ...f, id_proveedor: e.target.value }))} required>
                      <option value="">Seleccionar…</option>
                      {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Precio Compra (Q) *</label>
                    <input type="number" step="0.01" min="0" value={form.precio_compra} onChange={e => setForm(f => ({ ...f, precio_compra: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Precio Venta (Q) *</label>
                    <input type="number" step="0.01" min="0" value={form.precio_venta} onChange={e => setForm(f => ({ ...f, precio_venta: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Stock inicial</label>
                    <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Stock mínimo</label>
                    <input type="number" min="0" value={form.stock_minimo} onChange={e => setForm(f => ({ ...f, stock_minimo: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
