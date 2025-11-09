import { useState } from 'react'
import '../LoginForm.css'

interface LoginFormProps {
  onSuccess?: (data: LoginResponse) => void
}

// Define una interfaz para la respuesta que esperas del backend
interface LoginResponse {
  token: string
  persona: { id_persona: number }
  message: string
}

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

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error de autenticación')

      onSuccess?.(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ server: err.message })
      } else {
        setErrors({ server: 'Error desconocido' })
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="login-layout">
      <div className="login-left">
        <div className="login-brand">Plataforma Educativa Programacion Python</div>

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
            // El botón está deshabilitado si:
            // 1. Está cargando (loading)
            // 2. O si los campos requeridos NO están llenos (!fieldsAreFilled)
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
