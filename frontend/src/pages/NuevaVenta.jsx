import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

export default function NuevaVenta() {
  const navigate = useNavigate()
  const { user }  = useAuth()

  const [clientes,   setClientes]   = useState([])
  const [empleados,  setEmpleados]  = useState([])
  const [productos,  setProductos]  = useState([])
  const [id_cliente, setCliente]    = useState('')
  const [id_empleado,setEmpleado]   = useState('')
  const [notas,      setNotas]      = useState('')
  const [items,      setItems]      = useState([])
  const [prodSel,    setProdSel]    = useState('')
  const [qty,        setQty]        = useState(1)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    Promise.all([api.getClientes(), api.getEmpleados(), api.getProductos()])
      .then(([c, e, p]) => { setClientes(c); setEmpleados(e); setProductos(p.filter(x => x.activo && x.stock > 0)) })
  }, [])

  const addItem = () => {
    if (!prodSel) return
    const prod = productos.find(p => p.id_producto === parseInt(prodSel))
    if (!prod) return
    const existing = items.find(i => i.id_producto === prod.id_producto)
    if (existing) {
      const newQty = existing.cantidad + parseInt(qty)
      if (newQty > prod.stock) { setError(`Stock insuficiente para "${prod.nombre}" (máx ${prod.stock})`); return }
      setItems(items.map(i => i.id_producto === prod.id_producto
        ? { ...i, cantidad: newQty, subtotal: newQty * parseFloat(prod.precio_venta) }
        : i
      ))
    } else {
      if (parseInt(qty) > prod.stock) { setError(`Stock insuficiente (disponible: ${prod.stock})`); return }
      setItems([...items, {
        id_producto: prod.id_producto,
        nombre: prod.nombre,
        precio_unitario: parseFloat(prod.precio_venta),
        cantidad: parseInt(qty),
        subtotal: parseInt(qty) * parseFloat(prod.precio_venta),
        stock: prod.stock,
      }])
    }
    setProdSel(''); setQty(1); setError('')
  }

  const removeItem = (id) => setItems(items.filter(i => i.id_producto !== id))

  const total = items.reduce((s, i) => s + i.subtotal, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id_cliente || !id_empleado) { setError('Selecciona cliente y empleado'); return }
    if (items.length === 0) { setError('Agrega al menos un producto'); return }
    setLoading(true); setError('')
    try {
      const res = await api.createVenta({
        id_cliente: parseInt(id_cliente),
        id_empleado: parseInt(id_empleado),
        notas,
        items: items.map(i => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
      })
      navigate('/ventas', { state: { success: `Venta #${res.id_venta} registrada por Q${res.total.toFixed(2)}` } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Nueva Venta</h1>
        <p className="page-subtitle">Transacción con BEGIN / COMMIT / ROLLBACK explícito en el backend</p>
      </div>

      <div className="page-body">
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">⚠ {error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Datos de la venta</span></div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Cliente *</label>
                    <select value={id_cliente} onChange={e => setCliente(e.target.value)} required>
                      <option value="">Seleccionar cliente…</option>
                      {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Empleado (Vendedor) *</label>
                    <select value={id_empleado} onChange={e => setEmpleado(e.target.value)} required>
                      <option value="">Seleccionar empleado…</option>
                      {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.nombre} {e.apellido}</option>)}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Notas</label>
                    <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Observaciones opcionales…" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Agregar producto</span></div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Producto</label>
                    <select value={prodSel} onChange={e => setProdSel(e.target.value)}>
                      <option value="">Seleccionar…</option>
                      {productos.map(p => (
                        <option key={p.id_producto} value={p.id_producto}>
                          {p.nombre} — Q{parseFloat(p.precio_venta).toFixed(2)} (stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cantidad</label>
                    <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                    <label>&nbsp;</label>
                    <button type="button" className="btn btn-ghost" onClick={addItem}>+ Agregar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <span className="card-title">Detalle de la venta</span>
              <span className="sql-badge">TRANSACCIÓN EXPLÍCITA</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unit.</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Agrega productos arriba
                    </td></tr>
                  ) : items.map(i => (
                    <tr key={i.id_producto}>
                      <td><strong>{i.nombre}</strong></td>
                      <td>Q{i.precio_unitario.toFixed(2)}</td>
                      <td>{i.cantidad}</td>
                      <td className="text-green">Q{i.subtotal.toFixed(2)}</td>
                      <td><button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => removeItem(i.id_producto)}>✕</button></td>
                    </tr>
                  ))}
                  {items.length > 0 && (
                    <tr style={{ background: 'var(--surface2)' }}>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>TOTAL</td>
                      <td className="text-accent" style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem' }}>
                        Q{total.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-12">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/ventas')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || items.length === 0}>
              {loading ? 'Procesando…' : `Registrar Venta — Q${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
