import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import HomePage from './pages/Home'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import AdminPage from './pages/AdminPage'
import ProfesorEditorPage from './pages/ProfesorEditorPage'
import './RegisterForms.css'
import type { JSX } from 'react'

// =======================================
//  ProtectedRoute (solo valida token)
// =======================================
interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')

  // Si NO hay token → enviar al login
  if (!token) return <Navigate to="/login" replace />

  return children
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Detectar login
  const isLoggedIn = !!localStorage.getItem('token')

  // Detectar rutas específicas
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
      {/* =============================== */}
      {/* BARRA SUPERIOR                 */}
      {/* =============================== */}
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
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Registro
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* =============================== */}
      {/* CONTENIDO CENTRAL               */}
      {/* =============================== */}
      <main>
        <Routes>
          {/* Raíz muestra el Home */}
          <Route path="/" element={<HomePage />} />

          {/* Públicas */}
          <Route
            path="/register"
            element={<RegisterForm onSuccess={(d) => console.log('Registro OK', d)} />}
          />

          <Route
            path="/login"
            element={<LoginForm onSuccess={(d) => console.log('Login OK', d)} />}
          />

          {/* =============================== */}
          {/*  RUTAS PROTEGIDAS SIN ROLES    */}
          {/* =============================== */}

          {/* Profesor Editor */}
          <Route
            path="/ProfesorEditorPage"
            element={
              <ProtectedRoute>
                <ProfesorEditorPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

