import { 
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import Home from './pages/Home'

// Nuevas rutas reales de tu proyecto actual
import RegisterForm from './fetures/auth/components/RegisterForm'
import LoginForm from './fetures/auth/components/LoginForm'
import AdminPage from './pages/AdminPage'
import ProfesorEditorPage from './feature/topico/components/ProfesorEditorPage'

import type { JSX } from 'react'

// =======================================
//  ProtectedRoute (solo valida token)
// =======================================
interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/login" replace />

  return children
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const isLoggedIn = !!localStorage.getItem('token')

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isEditorRoute = location.pathname.startsWith('/profesor-editor')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')

    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="topbar">
        <span>Plataforma</span>

        <div className="nav">
          {isLoggedIn && (isAdminRoute || isEditorRoute) ? (
            <>
              <span>Sesión activa</span>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>

              <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                Registro
              </NavLink>

              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* CONTENIDO CENTRAL */}
      <main>
        <Routes>
          {/* Redirección raíz a login como tu app anterior */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/home" element={<Home />} />

          {/* Rutas públicas */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* =============================== */}
          {/*  RUTAS PROTEGIDAS SIN ROLES    */}
          {/* =============================== */}

          <Route
            path="/profesor-editor"
            element={
              <ProtectedRoute>
                <ProfesorEditorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}
