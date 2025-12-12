// LoginForm.test.tsx
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

const user = userEvent.setup()

// helper: acepta string o RegExp
const fill = async (label: string | RegExp, value: string) => {
  const input = await screen.findByLabelText(label, { selector: 'input' })
  await user.type(input, value)
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

describe('LoginForm (TDD) - login con correo y password', () => {
  it('renderiza campos y el botón Login está deshabilitado al inicio', () => {
    render(<LoginForm />)

    // Campos principales
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    // Botón de login deshabilitado
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()

    // Link o texto para ir a registro
    expect(screen.getByText(/register/i)).toBeInTheDocument()
  })

  it('muestra errores de validación cuando faltan datos o son inválidos', async () => {
    render(<LoginForm />)

    // forzar submit del formulario (aunque el botón esté deshabilitado)
    const form = screen.getByTestId('form-login')
    fireEvent.submit(form)

    expect(
      await screen.findByText(/correo es requerido/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/password es requerido/i),
    ).toBeInTheDocument()

    // email inválido
    await fill(/email/i, 'correo-sin-dominio')
    fireEvent.submit(screen.getByTestId('form-login'))
    expect(
      await screen.findByText(/formato.*inv[aá]lido/i),
    ).toBeInTheDocument()

    // password muy corto
    await fill(/password/i, '123')
    fireEvent.submit(screen.getByTestId('form-login'))

    const errorElement = await screen.findByText(
      /password debe tener al menos 6 caracteres/i,
    )
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveAttribute('role', 'alert')
  })

  it('habilita Login cuando el formulario es válido y llama a la API con el payload correcto', async () => {
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    await fill(/email/i, 'ana@mail.com')
    await fill(/password/i, 'secreto')

    const btn = screen.getByRole('button', { name: /login/i })
    expect(btn).toBeEnabled()

    // respuesta fake del backend
    const fakeResponse = {
      success: true,
      data: { persona: { id_persona: 1, roles: [] }, token: 'abc123' },
      message: 'Usuario autenticado correctamente',
    }

    // ⬇️ Ahora el componente usa res.json()
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => fakeResponse,
    } as Response)

    await user.click(btn)

    // verifica llamada a /auth/login
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/login$/),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            // ⬇️ el backend ahora espera "correo"
            correo: 'ana@mail.com',
            password: 'secreto',
          }),
        }),
      )
    })

    // verifica que se llame el callback de éxito
    expect(onSuccess).toHaveBeenCalledWith(fakeResponse)
  })

  it('muestra error del servidor cuando la API responde 401/400 y re-habilita Login', async () => {
    render(<LoginForm />)

    await fill(/email/i, 'ana@mail.com')
    await fill(/password/i, 'secreto')

    // ⚠ El componente ahora usa res.json(), no text()
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        message: 'Credenciales inválidas',
        success: false,
      }),
    } as unknown as Response)

    const btn = screen.getByRole('button', { name: /login/i })

    await user.click(btn)

    // Esperar a que se muestre el error del servidor
    await waitFor(
      () => {
        expect(
          screen.getByText(/credenciales inv[aá]lidas/i),
        ).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    // Y que el botón vuelva a habilitarse
    await waitFor(
      () => {
        expect(btn).not.toBeDisabled()
      },
      { timeout: 3000 },
    )
  })
})
