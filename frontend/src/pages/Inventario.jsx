import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Inventario() {
  const [bajoStock, setBajoStock] = useState([])
  const [todos,     setTodos]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState('bajo')

  useEffect(() => {
    Promise.all([api.getBajoStock(), api.getProductos()])
      .then(([b, t]) => { setBajoStock(b); setTodos(t); setLoading(false) })
  }, [])

  const stockPct = (p) => Math.min(100, Math.round((p.stock / Math.max(p.stock_minimo * 2, 1)) * 100))

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Inventario</h1>
        <p className="page-subtitle">Control de stock · Subquery con EXISTS y NOT IN</p>
      </div>

      <div className="page-body">
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <div className="stat-card red">
            <div className="stat-label">Bajo stock</div>
            <div className="stat-value">{bajoStock.length}</div>
            <div className="stat-icon">⚠️</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Productos activos</div>
            <div className="stat-value">{todos.filter(p => p.activo).length}</div>
            <div className="stat-icon">📦</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Total en stock</div>
            <div className="stat-value">{todos.reduce((s, p) => s + p.stock, 0)}</div>
            <div className="stat-icon">🏷️</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button className={`btn ${tab === 'bajo' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('bajo')}>
            ⚠ Bajo stock ({bajoStock.length})
          </button>
          <button className={`btn ${tab === 'todos' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('todos')}>
            Todos los productos
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex-center gap-8">
              <span className="card-title">{tab === 'bajo' ? 'Productos con stock bajo' : 'Inventario completo'}</span>
              <span className="sql-badge">{tab === 'bajo' ? 'WHERE EXISTS (subquery)' : 'JOIN categorías + proveedores'}</span>
            </div>
          </div>
          <div className="table-wrap">
            {loading ? <div className="loading"><div className="spinner" /></div> : (
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Proveedor</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                    <th>Nivel</th>
                    <th>P. Venta</th>
                  </tr>
                </thead>
                <tbody>
                  {(tab === 'bajo' ? bajoStock : todos).map(p => {
                    const pct = stockPct(p)
                    return (
                      <tr key={p.id_producto}>
                        <td><strong>{p.nombre}</strong></td>
                        <td><span className="badge badge-blue">{p.categoria}</span></td>
                        <td className="text-muted">{p.proveedor}</td>
                        <td>
                          <span className={`badge ${p.stock <= p.stock_minimo ? 'badge-red' : p.stock <= p.stock_minimo * 1.5 ? 'badge-yellow' : 'badge-green'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="text-muted">{p.stock_minimo}</td>
                        <td style={{ width: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${pct}%`,
                                background: pct < 40 ? 'var(--accent2)' : pct < 70 ? 'var(--accent)' : 'var(--green)',
                                borderRadius: 3,
                                transition: 'width 0.3s'
                              }} />
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.75rem', width: 32 }}>{pct}%</span>
                          </div>
                        </td>
                        <td className="text-green">Q{parseFloat(p.precio_venta).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
