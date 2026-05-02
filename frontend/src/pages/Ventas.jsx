import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function Ventas() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(location.state?.success || '')
  const [detail,  setDetail]  = useState(null)

  useEffect(() => {
    api.getVentas().then(d => { setRows(d); setLoading(false) })
    if (success) setTimeout(() => setSuccess(''), 4000)
  }, [])

  const openDetail = async (id) => {
    const d = await api.getVenta(id)
    setDetail(d)
  }

  const statusBadge = (s) => {
    const map = { completada: 'badge-green', pendiente: 'badge-yellow', cancelada: 'badge-red' }
    return <span className={`badge ${map[s] || 'badge-blue'}`}>{s}</span>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Ventas</h1>
        <p className="page-subtitle">Historial · JOIN entre ventas, clientes y empleados</p>
      </div>

      <div className="page-body">
        {success && <div className="alert alert-success">✓ {success}</div>}

        <div className="card">
          <div className="card-header">
            <div className="flex-center gap-8">
              <span className="card-title">Historial de ventas</span>
              <span className="sql-badge">3-TABLE JOIN</span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/ventas/new')}>+ Nueva Venta</button>
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>NIT</th>
                    <th>Empleado</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(v => (
                    <tr key={v.id_venta}>
                      <td className="text-muted monospace">{v.id_venta}</td>
                      <td className="text-muted">{new Date(v.fecha_venta).toLocaleDateString('es-GT')}</td>
                      <td><strong>{v.cliente}</strong></td>
                      <td className="text-muted monospace">{v.nit || '—'}</td>
                      <td className="text-muted">{v.empleado}</td>
                      <td className="text-muted">{v.cantidad_items}</td>
                      <td className="text-green">Q{parseFloat(v.total).toFixed(2)}</td>
                      <td>{statusBadge(v.estado)}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => openDetail(v.id_venta)}>Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2>Venta #{detail.id_venta}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div><span className="text-muted" style={{ fontSize: '0.75rem' }}>CLIENTE</span><br /><strong>{detail.cliente}</strong></div>
                <div><span className="text-muted" style={{ fontSize: '0.75rem' }}>EMPLEADO</span><br />{detail.empleado}</div>
                <div><span className="text-muted" style={{ fontSize: '0.75rem' }}>FECHA</span><br />{new Date(detail.fecha_venta).toLocaleString('es-GT')}</div>
                <div><span className="text-muted" style={{ fontSize: '0.75rem' }}>ESTADO</span><br />{detail.estado}</div>
              </div>
              <table>
                <thead>
                  <tr><th>Producto</th><th>Cantidad</th><th>P.Unit.</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  {detail.detalle?.map(d => (
                    <tr key={d.id_detalle}>
                      <td>{d.producto}</td>
                      <td>{d.cantidad}</td>
                      <td>Q{parseFloat(d.precio_unitario).toFixed(2)}</td>
                      <td className="text-green">Q{parseFloat(d.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--surface2)', fontWeight: 700 }}>
                    <td colSpan={3} style={{ textAlign: 'right' }}>TOTAL</td>
                    <td className="text-accent">Q{parseFloat(detail.total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
