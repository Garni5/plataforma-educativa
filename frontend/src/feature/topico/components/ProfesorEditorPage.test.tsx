import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'
import ProfesorEditorPage from './ProfesorEditorPage'

// Mock del fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

describe('ProfesorEditorPage', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
    vi.clearAllMocks()
    
    // Mock de localStorage
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('userId', '1')
    localStorage.setItem('userName', 'Test User')
    localStorage.setItem('userEmail', 'test@example.com')
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('muestra formulario de login cuando no hay token', () => {
    localStorage.clear()
    render(<ProfesorEditorPage />)
    
    expect(screen.getByText('🎓 Editor de Contenido')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument()
  })

  test('carga y muestra tópicos cuando está autenticado', async () => {
    const mockTopicos = {
      success: true,
      data: [
        {
          id_topico: 1,
          titulo: 'Variables',
          descripcion: 'Tema sobre variables',
          recursos: []
        }
      ]
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockTopicos
    })

    render(<ProfesorEditorPage />)

    // Esperar a que aparezca el header que confirma que está autenticado
    await waitFor(() => {
      expect(screen.getByText(/Editor de Contenido del Curso/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('permite agregar un nuevo tópico', async () => {
    const mockTopicos = {
      success: true,
      data: []
    }

    const mockNuevoTopico = {
      success: true,
      data: {
        id_topico: 1,
        titulo: 'Python Avanzado',
        descripcion: '',
        recursos: []
      }
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTopicos
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockNuevoTopico
      })

    render(<ProfesorEditorPage />)

    const input = await waitFor(() => 
      screen.getByPlaceholderText('Nombre del nuevo tópico...')
    )

    fireEvent.change(input, { target: { value: 'Python Avanzado' } })
    fireEvent.click(screen.getByText(/Agregar Tópico/))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/topicos'),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })

  test('maneja error de autenticación (401)', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 401,
      ok: false,
      json: async () => ({})
    })

    render(<ProfesorEditorPage />)

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  test('muestra error cuando falla al cargar tópicos', async () => {
    mockFetch.mockRejectedValueOnce(
      new Error('Error de red')
    )

    render(<ProfesorEditorPage />)

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar tópicos/)).toBeInTheDocument()
    })
  })

  test('permite hacer logout', async () => {
    const mockTopicos = {
      success: true,
      data: []
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockTopicos
    })

    render(<ProfesorEditorPage />)

    await waitFor(() => {
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Cerrar Sesión'))

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('userId')).toBeNull()
  })
})