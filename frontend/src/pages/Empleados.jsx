import { useState, useEffect } from 'react'
import { api } from '../api'

const EMPTY = { nombre: '', apellido: '', email: '', telefono: '', cargo: '', salario: '', fecha_ingreso: '' }

export default function Empleados() {
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const load = () => { setLoading(true); api.getEmpleados().then(d => { setRows(d); setLoading(false) }) }
  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit   = (e) => {
    setEditing(e)
    setForm({ nombre: e.nombre, apellido: e.apellido, email: e.email, telefono: e.telefono, cargo: e.cargo, salario: e.salario, fecha_ingreso: e.fecha_ingreso?.split('T')[0] || '' })
    setError(''); setModal(true)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault(); setError('')
    try {
      if (editing) await api.updateEmpleado(editing.id_empleado, form)
      else         await api.createEmpleado(form)
      setModal(false); setSuccess(editing ? 'Empleado actualizado' : 'Empleado creado'); load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) }
  }

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Desactivar empleado "${nombre}"?`)) return
    try { await api.deleteEmpleado(id); setSuccess('Empleado desactivado'); load(); setTimeout(() => setSuccess(''), 3000) }
    catch (err) { setError(err.message) }
  }

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const cargos = ['Gerente', 'Vendedor', 'Vendedora', 'Bodeguero', 'Bodeguera', 'Cajero', 'Cajera', 'Asistente']

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Empleados</h1>
        <p className="page-subtitle">CRUD completo · Gestión del personal</p>
      </div>

      <div className="page-body">
        {success && <div className="alert alert-success">✓ {success}</div>}
        {error   && <div className="alert alert-error">⚠ {error}</div>}

        <div className="card">
          <div className="card-header">
            <span className="card-title">Personal activo</span>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Nuevo</button>
          </div>
          <div className="table-wrap">
            {loading ? <div className="loading"><div className="spinner" /></div> : (
              <table>
                <thead><tr><th>#</th><th>Nombre</th><th>Cargo</th><th>Email</th><th>Salario</th><th>Ingreso</th><th>Acciones</th></tr></thead>
                <tbody>
                  {rows.map(e => (
                    <tr key={e.id_empleado}>
                      <td className="text-muted monospace">{e.id_empleado}</td>
                      <td><strong>{e.nombre} {e.apellido}</strong></td>
                      <td><span className="badge badge-blue">{e.cargo}</span></td>
                      <td className="text-muted">{e.email}</td>
                      <td className="text-green">Q{parseFloat(e.salario).toLocaleString()}</td>
                      <td className="text-muted">{new Date(e.fecha_ingreso).toLocaleDateString('es-GT')}</td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(e)}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(e.id_empleado, `${e.nombre} ${e.apellido}`)}>🗑</button>
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
        <div className="modal-overlay" onClick={ev => ev.target === ev.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">⚠ {error}</div>}
                <div className="form-grid">
                  <div className="form-group"><label>Nombre *</label><input value={form.nombre} onChange={f('nombre')} required /></div>
                  <div className="form-group"><label>Apellido *</label><input value={form.apellido} onChange={f('apellido')} required /></div>
                  <div className="form-group full"><label>Email *</label><input type="email" value={form.email} onChange={f('email')} required /></div>
                  <div className="form-group"><label>Teléfono *</label><input value={form.telefono} onChange={f('telefono')} required /></div>
                  <div className="form-group">
                    <label>Cargo *</label>
                    <select value={form.cargo} onChange={f('cargo')} required>
                      <option value="">Seleccionar…</option>
                      {cargos.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Salario (Q) *</label><input type="number" step="0.01" min="0" value={form.salario} onChange={f('salario')} required /></div>
                  <div className="form-group"><label>Fecha Ingreso *</label><input type="date" value={form.fecha_ingreso} onChange={f('fecha_ingreso')} required /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
