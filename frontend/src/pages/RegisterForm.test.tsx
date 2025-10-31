import {
  describe, it, expect, beforeEach, afterEach, vi, type Mock
} from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterForm from './RegisterForm'

// helper: acepta string o RegExp
const fill = async (label: string | RegExp, value: string) => {
  const input = await screen.findByLabelText(label, { selector: 'input' })
  fireEvent.change(input, { target: { value } })
  return input
}

let fetchMock: Mock
beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('RegisterForm (TDD) - sin CI ni Teléfono y con Confirmar contraseña (solo frontend)', () => {
  it('renderiza campos y el botón enviar está deshabilitado al inicio', () => {
    render(<RegisterForm />)

    expect(screen.getByLabelText(/nombres/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellidos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    // el nuevo campo solo para validación en cliente
    expect(
      screen.getByLabelText(/confirm(ar)? (password|contraseñ[ao])/i)
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /registrar/i })).toBeDisabled()
  })

  it('muestra errores de validación cuando faltan datos o son inválidos', async () => {
    render(<RegisterForm />)

    // forzamos submit del formulario (aunque el botón esté deshabilitado)
    const form = screen.getByTestId('form-registro')
    fireEvent.submit(form)

    expect(await screen.findByText(/nombres es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/apellidos es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/correo es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/password es requerido/i)).toBeInTheDocument()
    // error por confirmación vacía (si tu componente lo muestra)
    expect(
      screen.getByText(/confirma tu (password|contraseña)/i)
    ).toBeInTheDocument()

    // email inválido
    await fill(/correo/i, 'correo-sin-dominio')
    fireEvent.submit(screen.getByTestId('form-registro'))
    expect(await screen.findByText(/formato.*inv[aá]lido/i)).toBeInTheDocument()

    // password corto
    await fill(/password/i, '123')
    fireEvent.blur(screen.getByLabelText(/password/i))
    expect(
      await screen.findByText(/password debe tener al menos 6 caracteres/i)
    ).toBeInTheDocument()

    // confirmación no coincide
    await fill(/password/i, 'secreto')
    await fill(/confirm(ar)? (password|contraseñ[ao])/i, 'otro')
    fireEvent.blur(screen.getByLabelText(/confirm(ar)? (password|contraseñ[ao])/i))
    expect(
      await screen.findByText(/las contraseñas no coinciden/i)
    ).toBeInTheDocument()
  })

  it('habilita enviar cuando el formulario es válido y llama a la API con el payload correcto', async () => {
    render(<RegisterForm onSuccess={() => {}} />)

    await fill(/nombres/i, 'Ana')
    await fill(/apellidos/i, 'Pérez')
    await fill(/correo/i, 'ana@mail.com')
    await fill(/password/i, 'secreto')
    await fill(/confirm(ar)? (password|contraseñ[ao])/i, 'secreto')

    const btn = screen.getByRole('button', { name: /registrar/i })
    expect(btn).toBeEnabled()

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id_persona: 1 })
    } as Response)

    fireEvent.click(btn)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/auth\/register$/),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          // ✅ sin ci, sin telefono y sin confirmar_password
          body: JSON.stringify({
            nombres: 'Ana',
            apellidos: 'Pérez',
            correo: 'ana@mail.com',
            password: 'secreto'
          })
        })
      )
    })
  })

  it('muestra error del servidor cuando la API responde 409/400 y re-habilita enviar', async () => {
    render(<RegisterForm />)

    await fill(/nombres/i, 'Ana')
    await fill(/apellidos/i, 'Pérez')
    await fill(/correo/i, 'ana@mail.com')
    await fill(/password/i, 'secreto')
    await fill(/confirm(ar)? (password|contraseñ[ao])/i, 'secreto')

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ message: 'El correo ya está registrado' })
    } as Response)

    const btn = screen.getByRole('button', { name: /registrar/i })
    fireEvent.click(btn)

    expect(await screen.findByText(/el correo ya está registrado/i)).toBeInTheDocument()
    expect(btn).toBeEnabled()
  })
})
