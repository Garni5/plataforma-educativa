import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Home from './pages/Home'
import RegisterForm from './fetures/auth/components/RegisterForm'
import LoginForm from './fetures/auth/components/LoginForm'
import AdminPage from './pages/AdminPage'
import ProfesorEditorPage from './feature/topico/components/ProfesorEditorPage'


export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Detectar la ruta actual
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isEditorRoute = location.pathname.startsWith('/profesor-editor')

  const handleLogout = () => {
    // Limpia token o sesión si lo usas
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    navigate('/login', { replace: true })
  }

  return (
    <>
      <nav className="topbar">
        <span>Plataforma</span>

        <div className="nav">
          {isAdminRoute ? (
            <>
              <span>Soy admin</span>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : isEditorRoute ? (
            <>
              <span>Area Profesor editor</span>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/home"
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

      <main>
        <Routes>
          {/* Raíz redirige al Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/home" element={<Home />} />
          <Route
            path="/register"
            element={<RegisterForm onSuccess={(d) => console.log('OK', d)} />}
          />
          <Route
            path="/login"
            element={<LoginForm onSuccess={(d) => console.log('Login OK', d)} />}
          />

          {/*  Rutas según el rol */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profesor-editor" element={<ProfesorEditorPage />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}
