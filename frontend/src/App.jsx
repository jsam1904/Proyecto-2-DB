import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import NuevaVenta from './pages/NuevaVenta'
import Clientes from './pages/Clientes'
import Empleados from './pages/Empleados'
import Reportes from './pages/Reportes'
import Inventario from './pages/Inventario'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="productos"  element={<Productos />} />
        <Route path="ventas"     element={<Ventas />} />
        <Route path="ventas/new" element={<NuevaVenta />} />
        <Route path="clientes"   element={<Clientes />} />
        <Route path="empleados"  element={<Empleados />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="reportes"   element={<Reportes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
