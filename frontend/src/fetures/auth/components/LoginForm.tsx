import { useState } from 'react'
import './LoginForm.css'

interface LoginFormProps {
  onSuccess?: (data: LoginResponse) => void
}

<<<<<<< HEAD:frontend/src/pages/LoginForm.tsx
interface Rol {
  id_rol: number
  nombre_privilegio: string
}

interface PersonaResponse {
  id_persona: number
  nombres: string
  apellidos: string
  correo: string
  roles: Rol[]          // <-- ahora usamos roles, no privilegio string
}
=======
>>>>>>> jhonny:frontend/src/fetures/auth/components/LoginForm.tsx



// Respuesta completa del backend
interface LoginResponse {
  status: string;
  token:string 
  message: string
  role: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    server?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const fieldsAreFilled = email && password

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!email) newErrors.email = 'Correo es requerido'
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Formato de correo inválido'

    if (!password) newErrors.password = 'Password es requerido'
    else if (password.length < 6)
      newErrors.password = 'Password debe tener al menos 6 caracteres'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

<<<<<<< HEAD:frontend/src/pages/LoginForm.tsx
    setLoading(true)
=======
  setLoading(true)
  try {
    const res = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: email, password }),
    })
>>>>>>> jhonny:frontend/src/fetures/auth/components/LoginForm.tsx

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 👇 el backend espera "correo", no "login"
        body: JSON.stringify({ correo: email, password }),
      })

<<<<<<< HEAD:frontend/src/pages/LoginForm.tsx
      // Si el backend rompió y no devuelve JSON, esto tirará error
      const data: LoginResponse = await res.json()
=======
    if (!res.ok || !data) {
      throw new Error(data.message || 'Error de autenticación')
    }
>>>>>>> jhonny:frontend/src/fetures/auth/components/LoginForm.tsx

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error de autenticación')
      }

<<<<<<< HEAD:frontend/src/pages/LoginForm.tsx
      onSuccess?.(data)

      const { persona } = data.data
      const roles = persona.roles || []

      // Definimos el destino según los privilegios
      let destino = '/'

      if (roles.some(r => r.nombre_privilegio === 'DOCENTE')) {
        destino = '/admin'
      } else if (roles.some(r => r.nombre_privilegio === 'ESTUDIANTE')) {
        destino = '/profesor-editor'
      }

      window.location.href = destino
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ server: err.message })
      } else {
        setErrors({ server: 'Error desconocido' })
      }
    } finally {
      setLoading(false)
=======
    

    if (data.role === 'administrador') {
      window.location.href = '/admin'
    } else if (data.role === 'editor') {
      window.location.href = '/profesor-editor'
    } else {
      window.location.href = '/'
>>>>>>> jhonny:frontend/src/fetures/auth/components/LoginForm.tsx
    }
  }

  return (
    <div className="login-layout">
      <div className="login-left">
        <div className="login-brand">
          Plataforma Educativa Programacion Python
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          data-testid="form-login"
        >
          <h2 className="login-title">Inicie sesión</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              aria-label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              aria-label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <small className="error" role="alert">
                {errors.password}
              </small>
            )}
          </div>

          {errors.server && (
            <div className="server-error" role="alert">
              {errors.server}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !fieldsAreFilled}
            className="btn-login"
          >
            {loading ? 'Cargando...' : 'Login'}
          </button>

          <a href="/register" className="register-link">
            Register
          </a>
        </form>
      </div>

      <div className="login-right">
        <div className="login-hero-overlay">
          <h2>Plataforma</h2>
          <h2>Educativa</h2>
          <h2>Programación</h2>
          <h2>Python</h2>
        </div>
      </div>
    </div>
  )
}
