import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import ProfesorEditorPage from './ProfesorEditorPage'

describe('ProfesorEditorPage', () => {
  test('renderiza correctamente', () => {
    render(<ProfesorEditorPage />)
    expect(screen.getByText('Curso Activo : Python')).toBeInTheDocument()
  })

  test('abre el modal de agregar tópico', () => {
    render(<ProfesorEditorPage />)

    fireEvent.click(screen.getByText('+'))

    expect(screen.getByText('Añadir Tópico')).toBeInTheDocument()
  })

  test('modifica el nombre de un tópico', () => {
    render(<ProfesorEditorPage />)

    // botón de editar del primer tópico
    fireEvent.click(screen.getAllByRole('button')[0])

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Nuevo Tópico' },
    })
    fireEvent.click(screen.getByText('Aceptar'))

    expect(screen.getByText('Nuevo Tópico')).toBeInTheDocument()
  })

  test('elimina un tópico', async () => {
    render(<ProfesorEditorPage />)

    // 1️ Encontrar la tarjeta que contiene el tópico "Sintaxis básica"
    const topicElement = screen.getByText('Sintaxis básica')
    const topicCard = topicElement.closest('.topic-card') as HTMLElement

    // 2️ Dentro de esa tarjeta, encontrar el ícono de eliminar por su alt
    const eliminarIcon = within(topicCard).getByAltText('Eliminar')

    // 3️ Hacer clic en el botón que contiene ese ícono
    fireEvent.click(eliminarIcon.closest('button') as HTMLButtonElement)

    // 4️ Confirmar en el modal (clic en "Aceptar")
    fireEvent.click(screen.getByText('Aceptar'))

    // 5️ Esperar a que desaparezca del DOM
    await waitFor(() => {
      expect(screen.queryByText('Sintaxis básica')).not.toBeInTheDocument()
    })
  })
})
