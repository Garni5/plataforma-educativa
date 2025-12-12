import { useState } from 'react'
import './LoginForm.css'

interface LoginFormProps {
  onSuccess?: (data: LoginResponse) => void
}

// Respuesta completa del backend
interface LoginResponse {
  status?: string
  token?: string
  message?: string
  role: string[]
  success?: boolean    // <- la agrego para que puedas usar data.success
  user?: {
    id_persona: number
    nombres: string
    apellidos: string
    correo: string
    privilegio?: string[]
  }
}

const API_URL = import.meta.env.VITE_API_BASE_URL 
console.log(API_URL);

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
      const payload = {
          login:email,
          password:password
      };
      // 🔹 ÚNICO fetch que se usa
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // el backend espera "correo"
        body: JSON.stringify(payload),
      })
      console.log("la respuesta",res);
      const data: LoginResponse = await res.json()

      // misma lógica: si no está ok o success es falso -> error
      if (!res.ok || !data || data.success === false) {
        throw new Error(data?.message || 'Error de autenticación')
      }

      // Guardar token y datos de usuario en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
    localStorage.setItem('userRole', JSON.stringify(data.role));
      localStorage.setItem('userEmail', email)
      
      // Guardar datos del usuario si están disponibles (desde backend)
      if (data.user) {
        localStorage.setItem('userId', data.user.id_persona.toString())
        localStorage.setItem('userName', data.user.nombres)
        localStorage.setItem('userLastName', data.user.apellidos)
      } else {
        // Fallback si no vienen en data.user
        localStorage.setItem('userName', email)
      }

      // callback opcional que ya tenías en props
      onSuccess?.(data)
      if(!data.role){
         const message = "Rol no asignado";
          setErrors((prev) => ({
        ...prev,
        server: message,
      }))
      return;
      }
     const esAdmin = data.role.some((rol: string) => rol === 'administrador');
const editor = data.role.some((rol: string) => rol === 'docente');
      // redirecciones según rol
      if (esAdmin) {
        window.location.href = '/admin'
      } else if (editor) {
        window.location.href = '/profesor-editor'
      } else {
        window.location.href = '/home'
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error de autenticación'

      setErrors((prev) => ({
        ...prev,
        server: message,
      }))
    } finally {
      setLoading(false)
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
              className="text-black"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="form-group ">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              aria-label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black"
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
