import { useState, useEffect } from 'react'
import { api } from '../api'

const fmt = (n) => `Q${Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`

const tabs = [
  { id: 'empleados',  label: 'Por Empleado',   sql: 'GROUP BY + HAVING + AVG/MAX/SUM' },
  { id: 'categorias', label: 'Por Categoría',   sql: 'JOIN múltiple + GROUP BY' },
  { id: 'clientes',   label: 'Top Clientes',    sql: 'WITH CTE + RANK() OVER' },
  { id: 'sinventa',   label: 'Sin Ventas',      sql: 'NOT IN (subquery)' },
  { id: 'mensual',    label: 'Resumen Mensual', sql: 'CTE + SUM() OVER ventana' },
  { id: 'vistaventas',label: 'Vista Ventas',    sql: 'VIEW v_ventas_detalle' },
]

function exportCSV(data, filename) {
  if (!data.length) return
  const keys = Object.keys(data[0])
  const csv  = [keys.join(','), ...data.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export default function Reportes() {
  const [tab,     setTab]     = useState('empleados')
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)

  const fetchers = {
    empleados:   api.getVentasPorEmpleado,
    categorias:  api.getVentasPorCategoria,
    clientes:    api.getTopClientes,
    sinventa:    api.getProductosSinVenta,
    mensual:     api.getResumenMensual,
    vistaventas: api.getVistaVentas,
  }

  useEffect(() => {
    setLoading(true)
    fetchers[tab]().then(d => { setData(d); setLoading(false) })
  }, [tab])

  const currentTab = tabs.find(t => t.id === tab)

  const renderTable = () => {
    if (!data.length) return <div className="empty-state"><div className="icon">📭</div><p>Sin datos</p></div>

    const cols = Object.keys(data[0])
    return (
      <table>
        <thead>
          <tr>{cols.map(c => <th key={c}>{c.replace(/_/g, ' ').toUpperCase()}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c}>
                  {typeof row[c] === 'number' && c.includes('total') ? fmt(row[c])
                   : typeof row[c] === 'number' && c.includes('ingreso') ? fmt(row[c])
                   : typeof row[c] === 'number' && c.includes('gasto') ? fmt(row[c])
                   : typeof row[c] === 'number' && c.includes('promedio') ? fmt(row[c])
                   : row[c] instanceof Date ? new Date(row[c]).toLocaleDateString('es-GT')
                   : String(row[c] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">JOINs, subqueries, CTEs, GROUP BY, HAVING y VIEWs — todos desde la aplicación</p>
      </div>

      <div className="page-body">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`btn ${tab === t.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex-center gap-8">
              <span className="card-title">{currentTab?.label}</span>
              <span className="sql-badge">{currentTab?.sql}</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => exportCSV(data, `reporte-${tab}.csv`)}
              disabled={!data.length}
            >
              ↓ Exportar CSV
            </button>
          </div>

          <div className="table-wrap">
            {loading ? <div className="loading"><div className="spinner" /></div> : renderTable()}
          </div>
        </div>
      </div>
    </>
  )
}
