import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfesorEditorPage from './ProfesorEditorPage'

describe('ProfesorEditorPage', () => {
  beforeEach(() => {
    render(<ProfesorEditorPage />)
  })

  it('renderiza el header y el tópico inicial', () => {
    // Header principal
    expect(
      screen.getByText(/Editor de Contenido del Curso/i)
    ).toBeInTheDocument()

    // Evitamos conflicto entre botón y <h2>
    expect(
      screen.getByRole('button', { name: /Introducción a React/i })
    ).toBeInTheDocument()

    expect(screen.getByText(/2\s+recursos/i)).toBeInTheDocument()
  })

  it('permite agregar un nuevo tópico', async () => {
    const user = userEvent.setup()

    const input = screen.getByPlaceholderText(/Nombre del nuevo tópico/i)
    await user.type(input, 'Hooks Avanzados{enter}')

    // Aseguramos que aparezca como botón de tópico
    expect(
      await screen.findByRole('button', { name: 'Hooks Avanzados' })
    ).toBeInTheDocument()

    expect(screen.getByText('0 recursos')).toBeInTheDocument()
  })

  it('permite agregar un recurso a un tópico', async () => {
    const user = userEvent.setup()

    const addResourceBtn = screen.getByRole('button', {
      name: /Agregar Recurso/i,
    })
    await user.click(addResourceBtn)

    // Mock del prompt ANTES de hacer click en la opción
    vi.spyOn(window, 'prompt').mockReturnValue('Video de prueba')

    // Buscamos el modal por su título
    const modalTitle = await screen.findByText(/Agregar Nuevo Recurso/i)
    const modal = modalTitle.closest('.profesor-modal-content') as HTMLElement

    // Dentro del modal buscamos el "Video" correcto
    const videoBtn = within(modal).getByText(/^Video$/i)
    await user.click(videoBtn)

    expect(await screen.findByText('Video de prueba')).toBeInTheDocument()
  })

  it('permite eliminar un recurso', async () => {
    const user = userEvent.setup()

    // Botones de eliminar (tienen como nombre accesible el emoji 🗑️)
    const trashButtons = screen.getAllByRole('button', { name: '🗑️' })
    const initialResource = screen.getByText(/Conceptos básicos de React/i)

    expect(initialResource).toBeInTheDocument()

    await user.click(trashButtons[0])

    // Esperamos a que desaparezca el recurso del DOM
    await waitFor(() => {
      expect(
        screen.queryByText(/Conceptos básicos de React/i)
      ).not.toBeInTheDocument()
    })
  })

  it('permite alternar la transcripción de un video', async () => {
    const user = userEvent.setup()

    const toggleBtn = screen.getByRole('button', {
      name: /Con transcripción/i,
    })
    expect(toggleBtn).toBeInTheDocument()

    await user.click(toggleBtn)

    expect(
      screen.getByRole('button', { name: /Sin transcripción/i })
    ).toBeInTheDocument()
  })
})
