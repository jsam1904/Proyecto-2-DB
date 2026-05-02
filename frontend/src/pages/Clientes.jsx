import { useState, useEffect } from 'react'
import { api } from '../api'

const EMPTY = { nombre: '', apellido: '', email: '', telefono: '', direccion: '', nit: '' }

export default function Clientes() {
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [search,  setSearch]  = useState('')

  const load = () => { setLoading(true); api.getClientes().then(d => { setRows(d); setLoading(false) }) }
  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit   = (c) => {
    setEditing(c)
    setForm({ nombre: c.nombre, apellido: c.apellido, email: c.email || '', telefono: c.telefono, direccion: c.direccion || '', nit: c.nit || '' })
    setError('')
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    try {
      if (editing) await api.updateCliente(editing.id_cliente, form)
      else         await api.createCliente(form)
      setModal(false); setSuccess(editing ? 'Cliente actualizado' : 'Cliente creado'); load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) }
  }

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Desactivar cliente "${nombre}"?`)) return
    try { await api.deleteCliente(id); setSuccess('Cliente desactivado'); load(); setTimeout(() => setSuccess(''), 3000) }
    catch (err) { setError(err.message) }
  }

  const filtered = rows.filter(c =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.nit || '').includes(search)
  )

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">CRUD completo · 30 clientes registrados</p>
      </div>

      <div className="page-body">
        {success && <div className="alert alert-success">✓ {success}</div>}
        {error   && <div className="alert alert-error">⚠ {error}</div>}

        <div className="card">
          <div className="card-header">
            <span className="card-title">Listado de clientes</span>
            <div className="flex gap-8">
              <input placeholder="Buscar…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
              <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Nuevo</button>
            </div>
          </div>
          <div className="table-wrap">
            {loading ? <div className="loading"><div className="spinner" /></div> : (
              <table>
                <thead><tr><th>#</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>NIT</th><th>Acciones</th></tr></thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id_cliente}>
                      <td className="text-muted monospace">{c.id_cliente}</td>
                      <td><strong>{c.nombre} {c.apellido}</strong></td>
                      <td className="text-muted">{c.email || '—'}</td>
                      <td className="text-muted">{c.telefono}</td>
                      <td className="monospace text-muted">{c.nit || '—'}</td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(c)}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(c.id_cliente, `${c.nombre} ${c.apellido}`)}>🗑</button>
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
              <h2>{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">⚠ {error}</div>}
                <div className="form-grid">
                  <div className="form-group"><label>Nombre *</label><input value={form.nombre} onChange={f('nombre')} required /></div>
                  <div className="form-group"><label>Apellido *</label><input value={form.apellido} onChange={f('apellido')} required /></div>
                  <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={f('email')} /></div>
                  <div className="form-group"><label>Teléfono *</label><input value={form.telefono} onChange={f('telefono')} required /></div>
                  <div className="form-group"><label>NIT</label><input value={form.nit} onChange={f('nit')} /></div>
                  <div className="form-group full"><label>Dirección</label><textarea value={form.direccion} onChange={f('direccion')} /></div>
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
