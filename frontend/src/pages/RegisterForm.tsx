import { useState, useMemo } from 'react'
import '../RegisterForms.css'

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Respuesta de la API (ajústalo si tu backend devuelve otra cosa)
interface ResponseData {
  message?: string
  id_persona?: number
}

// Payload real que se envía al backend (sin confirmarPassword)
type Persona = {
  nombres: string
  apellidos: string
  correo: string
  password: string
}

// Estado del formulario en UI (incluye confirmarPassword solo para validar en cliente)
type FormState = Persona & {
  confirmarPassword: string
}

function validateField(key: keyof FormState, value: string, form: FormState) {
  switch (key) {
    case 'nombres':
      return value ? '' : 'Nombres es requerido'
    case 'apellidos':
      return value ? '' : 'Apellidos es requerido'
    case 'correo':
      if (!value) return 'Correo es requerido'
      if (!emailRx.test(value)) return 'Formato de correo inválido'
      return ''
    case 'password':
      if (!value) return 'Password es requerido'
      if (value.length < 6) return 'Password debe tener al menos 6 caracteres'
      return ''
    case 'confirmarPassword':
      if (!value) return 'Confirma tu contraseña'
      if (value !== form.password) return 'Las contraseñas no coinciden'
      return ''
    default:
      return ''
  }
}

export default function RegisterForm({ onSuccess }: { onSuccess?: (d: ResponseData) => void }) {
  const [form, setForm] = useState<FormState>({
    nombres: '',
    apellidos: '',
    correo: '',
    password: '',
    confirmarPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Handlers
  const onChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm(prev => {
      const next = { ...prev, [k]: value }
      if (submitted) {
        setErrors(prevErr => ({ ...prevErr, [k]: validateField(k, value ?? '', next) }))
        // si cambia password, revalida confirmación
        if (k === 'password' && submitted) {
          setErrors(prevErr => ({
            ...prevErr,
            confirmarPassword: validateField('confirmarPassword', next.confirmarPassword, next),
          }))
        }
      }
      return next
    })
  }

  const onBlur = (k: keyof FormState) => () => {
    const value = form[k] ?? ''
    setErrors(prev => ({ ...prev, [k]: validateField(k, value, form) }))
  }

  const validate = (f: FormState) => {
    const e: Record<string, string> = {}
    ;(Object.keys(f) as Array<keyof FormState>).forEach(k => {
      const value = f[k] ?? ''
      const msg = validateField(k, value, f)
      if (msg) e[k] = msg
    })
    return e
  }

  const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form])

  // Progreso simple (solo campos requeridos reales)
  const progressPct = useMemo(() => {
    const requiredKeys: (keyof FormState)[] = ['nombres', 'apellidos', 'correo', 'password', 'confirmarPassword']
    const filled = requiredKeys.filter(k => (form[k] ?? '').trim().length > 0).length
    return Math.round((filled / requiredKeys.length) * 100)
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const eMap = validate(form)
    setErrors(eMap)
    if (Object.keys(eMap).length) return
     console.log(form);
    try {
      setLoading(true)
      setServerError(null)
      // solo enviamos lo necesario al backend
      const payload: Persona = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        password: form.password,
      }

      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as ResponseData
      if (!res.ok) {
        setServerError(data?.message || 'Error al registrar')
        return
      }
      onSuccess?.(data)
    } catch {
      setServerError('Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <h1 className="register-title">Registro</h1>

      {/* Barra de progreso (opcional) */}
      <div className="progress" aria-hidden="true">
        <div className="bar" style={{ width: `${progressPct}%` }} />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        data-testid="form-registro"
        className="register-form"
      >
        <div className="field">
          <label>Nombres</label>
          <input
            aria-label="Nombres"
            value={form.nombres}
            onChange={onChange('nombres')}
            onBlur={onBlur('nombres')}
            className="input-underline"
            placeholder="Tus nombres"
          />
          {submitted && errors.nombres && <small className="error">{errors.nombres}</small>}
        </div>

        <div className="field">
          <label>Apellidos</label>
          <input
            aria-label="Apellidos"
            value={form.apellidos}
            onChange={onChange('apellidos')}
            onBlur={onBlur('apellidos')}
            className="input-underline"
            placeholder="Tus apellidos"
          />
          {submitted && errors.apellidos && <small className="error">{errors.apellidos}</small>}
        </div>

        <div className="field">
          <label>Correo</label>
          <input
            aria-label="Correo"
            type="email"
            value={form.correo}
            onChange={onChange('correo')}
            onBlur={onBlur('correo')}
            className="input-underline"
            placeholder="tucorreo@dominio.com"
          />
          {submitted && errors.correo && <small className="error">{errors.correo}</small>}
        </div>

        <div className="field">
          <label>Password</label>
          <input
            aria-label="Password"
            type="password"
            value={form.password}
            onChange={onChange('password')}
            onBlur={onBlur('password')}
            className="input-underline input-with-eye"
            placeholder="Mínimo 6 caracteres"
          />
          {submitted && errors.password && <small className="error">{errors.password}</small>}
        </div>

        <div className="field">
          <label>Confirmar contraseña</label>
          <input
            aria-label="Confirmar contraseña"
            type="password"
            value={form.confirmarPassword}
            onChange={onChange('confirmarPassword')}
            onBlur={onBlur('confirmarPassword')}
            className="input-underline"
            placeholder="Repítela igual"
          />
          {submitted && errors.confirmarPassword && (
            <small className="error">{errors.confirmarPassword}</small>
          )}
        </div>

        {serverError && <div role="alert" className="error">{serverError}</div>}

        <button type="submit" disabled={!isValid || loading} className="btn-primary">
          {loading ? 'Enviando...' : 'Registrar'}
        </button>
      </form>
    </div>
  )
}
