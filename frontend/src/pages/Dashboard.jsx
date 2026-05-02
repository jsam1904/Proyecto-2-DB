import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { api } from '../api'

const fmt = (n) => `Q${Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats,    setStats]    = useState(null)
  const [mensual,  setMensual]  = useState([])
  const [catData,  setCatData]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      api.getVentas(),
      api.getProductos(),
      api.getClientes(),
      api.getResumenMensual(),
      api.getVentasPorCategoria(),
      api.getBajoStock(),
    ]).then(([ventas, productos, clientes, mensualData, catDataRaw, bajoStock]) => {
      const totalIngresos = ventas.reduce((s, v) => s + parseFloat(v.total), 0)
      setStats({
        ventas: ventas.length,
        ingresos: totalIngresos,
        productos: productos.length,
        clientes: clientes.length,
        bajoStock: bajoStock.length,
      })
      setMensual(mensualData.slice(0, 6).reverse())
      setCatData(catDataRaw.slice(0, 6))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /><span>Cargando dashboard…</span></div>

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general de la tienda</p>
      </div>

      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card accent">
            <div className="stat-label">Ingresos totales</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{fmt(stats?.ingresos ?? 0)}</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Ventas</div>
            <div className="stat-value">{stats?.ventas ?? 0}</div>
            <div className="stat-icon">🛒</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Productos</div>
            <div className="stat-value">{stats?.productos ?? 0}</div>
            <div className="stat-icon">📦</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Bajo stock</div>
            <div className="stat-value">{stats?.bajoStock ?? 0}</div>
            <div className="stat-icon">⚠️</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Ingresos mensuales</span>
              <span className="sql-badge">WITH CTE + GROUP BY</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mensual}>
                  <XAxis dataKey="mes" tick={{ fill: '#7a8099', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#7a8099', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1e2230', border: '1px solid #2a2f42', borderRadius: 8, color: '#e8eaf0' }}
                    formatter={(v) => [fmt(v), 'Ingresos']}
                  />
                  <Bar dataKey="ingresos" fill="#f5a623" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Ventas por categoría</span>
              <span className="sql-badge">JOIN + GROUP BY + HAVING</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={catData} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#7a8099', fontSize: 11 }} />
                  <YAxis dataKey="categoria" type="category" tick={{ fill: '#7a8099', fontSize: 11 }} width={90} />
                  <Tooltip
                    contentStyle={{ background: '#1e2230', border: '1px solid #2a2f42', borderRadius: 8, color: '#e8eaf0' }}
                    formatter={(v) => [fmt(v), 'Ingresos']}
                  />
                  <Bar dataKey="ingresos_totales" fill="#4f8ef7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Acciones rápidas</span>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/ventas/new')}>+ Nueva Venta</button>
            <button className="btn btn-ghost" onClick={() => navigate('/productos')}>Ver Productos</button>
            <button className="btn btn-ghost" onClick={() => navigate('/reportes')}>Ver Reportes</button>
            <button className="btn btn-ghost" onClick={() => navigate('/inventario')}>Inventario</button>
          </div>
        </div>
      </div>
    </>
  )
}
