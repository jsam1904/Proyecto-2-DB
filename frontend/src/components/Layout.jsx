import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { section: 'Principal' },
  { to: '/dashboard',  icon: '▦', label: 'Dashboard' },
  { section: 'Operaciones' },
  { to: '/ventas',     icon: '🛒', label: 'Ventas' },
  { to: '/productos',  icon: '📦', label: 'Productos' },
  { to: '/clientes',   icon: '👥', label: 'Clientes' },
  { to: '/inventario', icon: '🏷️', label: 'Inventario' },
  { section: 'Administración' },
  { to: '/empleados',  icon: '👤', label: 'Empleados' },
  { to: '/reportes',   icon: '📊', label: 'Reportes' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>TiendaDB</h1>
          <span>Sistema de Inventario</span>
        </div>

        <nav className="sidebar-nav">
          {nav.map((item, i) =>
            item.section ? (
              <div key={i} className="nav-section-label">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{user?.nombre?.[0] ?? '?'}</div>
            <div className="user-info">
              <div className="user-name">{user?.nombre}</div>
              <div className="user-role">{user?.rol}</div>
            </div>
            <button className="btn-logout" title="Cerrar sesión" onClick={handleLogout}>⏻</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
