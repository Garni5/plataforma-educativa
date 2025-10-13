import { useState, useMemo } from 'react'

// 1️⃣ Validador de correo (regex)
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 2️⃣ Tipo de datos del formulario
type Persona = {
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono?: string
  password: string
}

// 3️⃣ Función auxiliar de validación por campo
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

// 4️⃣ Componente principal
export default function RegisterForm({ onSuccess }: { onSuccess?: (d: any) => void }) {
  const [form, setForm] = useState<Persona>({
    ci: '', nombres: '', apellidos: '', correo: '', telefono: '', password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // 🧩 Manejadores
const onChange = (k: keyof Persona) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setForm(prev => ({ ...prev, [k]: value }))
  if (submitted) {
    setErrors(prev => ({ ...prev, [k]: validateField(k, value ?? '') }))
  }
}

const onBlur = (k: keyof Persona) => () => {
  const value = form[k] ?? ''           // <- coalesce a string
  setErrors(prev => ({ ...prev, [k]: validateField(k, value) }))
}

const validate = (f: Persona) => {
  const e: Record<string, string> = {}
  ;(Object.keys(f) as Array<keyof Persona>).forEach((k) => {   // <- paréntesis correctos y tipado
    const value = f[k] ?? ''                                   // <- coalesce a string
    const msg = validateField(k, value)
    if (msg) e[k] = msg
  })
  return e
}
  const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form])

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
      onSuccess?.(data)
    } catch {
      setServerError('Error de red')
    } finally {
      setLoading(false)
    }
  }

  // 🧾 Renderizado del formulario
  return (
    <form onSubmit={handleSubmit} noValidate data-testid="form-registro">
      <div>
        <label>CI</label>
        <input
          aria-label="CI"
          value={form.ci}
          onChange={onChange('ci')}
          onBlur={onBlur('ci')}
        />
        {submitted && errors.ci && <small>{errors.ci}</small>}
      </div>

      <div>
        <label>Nombres</label>
        <input
          aria-label="Nombres"
          value={form.nombres}
          onChange={onChange('nombres')}
          onBlur={onBlur('nombres')}
        />
        {submitted && errors.nombres && <small>{errors.nombres}</small>}
      </div>

      <div>
        <label>Apellidos</label>
        <input
          aria-label="Apellidos"
          value={form.apellidos}
          onChange={onChange('apellidos')}
          onBlur={onBlur('apellidos')}
        />
        {submitted && errors.apellidos && <small>{errors.apellidos}</small>}
      </div>

      <div>
        <label>Correo</label>
        <input
          aria-label="Correo"
          type="email"
          value={form.correo}
          onChange={onChange('correo')}
          onBlur={onBlur('correo')}
        />
        {submitted && errors.correo && <small>{errors.correo}</small>}
      </div>

      <div>
        <label>Teléfono</label>
        <input
          aria-label="Teléfono"
          value={form.telefono}
          onChange={onChange('telefono')}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          aria-label="Password"
          type="password"
          value={form.password}
          onChange={onChange('password')}
          onBlur={onBlur('password')}
        />
        {submitted && errors.password && <small>{errors.password}</small>}
      </div>

      {serverError && <div role="alert">{serverError}</div>}

      <button type="submit" disabled={!isValid || loading}>
        {loading ? 'Enviando...' : 'Registrar'}
      </button>
    </form>
  )
}
