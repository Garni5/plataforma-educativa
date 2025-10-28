import { useState, useMemo } from 'react'
import '../RegisterForms.css'; 

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Definir tipo para la respuesta de onSuccess
interface ResponseData {
  message: string;
}

type Persona = {
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono?: string
  password: string
}

function validateField(key: keyof Persona, value: string) {
  switch (key) {
    case 'ci':        return value ? '' : 'CI es requerido'
    case 'nombres':   return value ? '' : 'Nombres es requerido'
    case 'apellidos': return value ? '' : 'Apellidos es requerido'
    case 'correo':
      if (!value) return 'Correo es requerido'
      if (!emailRx.test(value)) return 'Formato de correo inválido'
      return ''
    case 'password':
      if (!value) return 'Password es requerido'
      if (value.length < 6) return 'Password debe tener al menos 6 caracteres'
      return ''
    default: return ''
  }
}

export default function RegisterForm({ onSuccess }: { onSuccess?: (d: ResponseData) => void }) {
  const [form, setForm] = useState<Persona>({
    ci: '', nombres: '', apellidos: '', correo: '', telefono: '', password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Handlers
  const onChange = (k: keyof Persona) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm(prev => ({ ...prev, [k]: value }))
    if (submitted) {
      setErrors(prev => ({ ...prev, [k]: validateField(k, value ?? '') }))
    }
  }

  const onBlur = (k: keyof Persona) => () => {
    const value = form[k] ?? ''
    setErrors(prev => ({ ...prev, [k]: validateField(k, value) }))
  }

  const validate = (f: Persona) => {
    const e: Record<string, string> = {}
    ;(Object.keys(f) as Array<keyof Persona>).forEach((k) => {
      const value = f[k] ?? ''
      const msg = validateField(k, value)
      if (msg) e[k] = msg
    })
    return e
  }

  const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form])

  // (Opcional) progreso simple con campos requeridos
  
  const progressPct = useMemo(() => {
  const requiredKeys: (keyof Persona)[] = ['ci', 'nombres', 'apellidos', 'correo', 'password'];
  const filled = requiredKeys.filter(k => (form[k] ?? '').trim().length > 0).length
  return Math.round((filled / requiredKeys.length) * 100)
  }, [form]);  // `requiredKeys` ahora está dentro de useMemo


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const eMap = validate(form)
    setErrors(eMap)
    if (Object.keys(eMap).length) return

    try {
      setLoading(true)
      setServerError(null)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data?.message || 'Error al registrar')
        return
      }
      onSuccess?.(data)  // Ahora el tipo de `data` se ajusta a ResponseData
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
          <label>CI</label>
          <input
            aria-label="CI"
            value={form.ci}
            onChange={onChange('ci')}
            onBlur={onBlur('ci')}
            className="input-underline"
            placeholder="Ingresa tu CI"
          />
          {submitted && errors.ci && <small className="error">{errors.ci}</small>}
        </div>

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
          <label>Teléfono</label>
          <input
            aria-label="Teléfono"
            value={form.telefono}
            onChange={onChange('telefono')}
            className="input-underline"
            placeholder="Opcional"
          />
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

        {serverError && <div role="alert" className="error">{serverError}</div>}

        <button type="submit" disabled={!isValid || loading} className="btn-primary">
          {loading ? 'Enviando...' : 'Registrar'}
        </button>
      </form>
    </div>
  )
}
