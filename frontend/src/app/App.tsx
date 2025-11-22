import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import RegisterForm from '../pages/RegisterForm'
import GoogleCallback from '../pages/GoogleCallback'
import Sesion from '../pages/Sesion'
import Navbar from '../layouts/Navbar'
export default function App() {
  return (
    <>
      <Navbar/>
      <main>
        {/* App inicia en / y redirige a /register */}
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<RegisterForm onSuccess={(d)=>console.log('OK', d)} />} />
             <Route path="/auth/google/callback" element={<GoogleCallback />} />
             <Route path="/logout" element={<Sesion />} />
          {/* opcional: 404 */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </main>
    </>
  )
}
