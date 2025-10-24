import {
  describe, it, expect, beforeEach, afterEach, vi, type Mock
} from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterForm from '../RegisterForm'

// helper: acepta string o RegExp
const fill = async (label: string | RegExp, value: string) => {
  const input = await screen.findByLabelText(label, { selector: 'input' })
  fireEvent.change(input, { target: { value } })
  return input
}

// mock global fetch con Vitest
let fetchMock: Mock
beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('RegisterForm (TDD)', () => {
  it('renderiza campos y el botón enviar está deshabilitado al inicio', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/ci/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nombres/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellidos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tel[eé]fono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar/i })).toBeDisabled()
  })

  it('muestra errores de validación cuando faltan datos o son inválidos', async () => {
    render(<RegisterForm />)

    // en lugar de hacer click en el botón deshabilitado
    const form = screen.getByTestId('form-registro')
    fireEvent.submit(form)

    // ahora se disparará handleSubmit() y se mostrarán los errores
    expect(await screen.findByText(/ci es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/nombres es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/apellidos es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/correo es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/password es requerido/i)).toBeInTheDocument()

    // email inválido
    await fill(/correo/i, 'correo-sin-dominio')
    fireEvent.submit(screen.getByTestId('form-registro'))

    expect(await screen.findByText(/formato.*inv[aá]lido/i)).toBeInTheDocument()


    // password corto
    await fill(/password/i, '123')
    fireEvent.blur(screen.getByLabelText(/password/i))
    expect(await screen.findByText(/password debe tener al menos 6 caracteres/i)).toBeInTheDocument()
    })


  it('habilita enviar cuando el formulario es válido y llama a la API con el payload correcto', async () => {
    render(<RegisterForm onSuccess={() => {}} />)

    await fill(/ci/i, '123456')
    await fill(/nombres/i, 'Ana')
    await fill(/apellidos/i, 'Pérez')
    await fill(/correo/i, 'ana@mail.com')
    await fill(/tel[eé]fono/i, '77445566')
    await fill(/password/i, 'secreto')

    const btn = screen.getByRole('button', { name: /registrar/i })
    expect(btn).toBeEnabled()

    // respuesta OK
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
          body: JSON.stringify({
            ci: '123456',
            nombres: 'Ana',
            apellidos: 'Pérez',
            correo: 'ana@mail.com',
            telefono: '77445566',
            password: 'secreto'
          })
        })
      )
    })
  })

  it('muestra error del servidor cuando la API responde 409/400 y re-habilita enviar', async () => {
    render(<RegisterForm />)

    await fill(/ci/i, '123')
    await fill(/nombres/i, 'Ana')
    await fill(/apellidos/i, 'Pérez')
    await fill(/correo/i, 'ana@mail.com')
    await fill(/password/i, 'secreto')

    // respuesta de error 409
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

