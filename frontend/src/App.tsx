import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import RegisterForm from './pages/RegisterForm'
import './RegisterForms.css'

export default function App() {
  return (
    <>
      <nav className="topbar">
        <span>Plataforma</span>
        <div className="nav">
          <NavLink to="/home" className={({isActive}) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/register" className={({isActive}) => isActive ? 'active' : ''}>
            Registro
          </NavLink>
        </div>
      </nav>

      <main>
        {/* App inicia en / y redirige a /register */}
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<RegisterForm onSuccess={(d)=>console.log('OK', d)} />} />
          {/* opcional: 404 */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </main>
    </>
  )
}
