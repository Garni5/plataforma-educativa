import { useState } from 'react'
import '../LoginForm.css'

interface LoginFormProps {
  onSuccess?: (data: LoginResponse) => void
}

interface PersonaResponse {
  id_persona: number
  nombres: string
  apellidos: string
  correo: string
}

interface BackendLoginData {
  token: string
  persona: PersonaResponse
}

interface LoginResponse {
  success: boolean
  data: BackendLoginData
  message: string
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!email) newErrors.email = 'Correo es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Formato de correo inválido'

    if (!password) newErrors.password = 'Password es requerido'
    else if (password.length < 6) newErrors.password = 'Password debe tener al menos 6 caracteres'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: email, password }),
      })

      const raw = await res.text()
      console.log('Respuesta backend:', raw)

      let data: LoginResponse
      try {
        data = JSON.parse(raw)
      } catch {
        throw new Error('El backend no retorna JSON válido.')
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Credenciales inválidas')
      }

      // Guardar token
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userId', String(data.data.persona.id_persona))
      localStorage.setItem('userName', data.data.persona.nombres)
      localStorage.setItem('userEmail', data.data.persona.correo)

      // callback opcional
      onSuccess?.(data)

      // Redirigir a Home o Dashboard general
      window.location.href = '/'
    } catch (err: any) {
      setErrors({ server: err.message || 'Error desconocido' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-layout">
      <div className="login-left">
        <div className="login-brand">Plataforma Educativa Programación Python</div>

        <form className="login-form" onSubmit={handleSubmit} data-testid="form-login">
          <h2 className="login-title">Inicie sesión</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          {errors.server && <div className="server-error">{errors.server}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Cargando...' : 'Login'}
          </button>

          <a href="/register" className="register-link">Register</a>
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
