import { render, screen, fireEvent } from '@testing-library/react'
import ProfesorEditorPage from './ProfesorEditorPage'


describe('ProfesorEditorPage', () => {
  test('renderiza correctamente', () => {
    render(<ProfesorEditorPage />)
    // Verificamos si el título se muestra en la página
    expect(screen.getByText('Curso Activo : Python')).toBeInTheDocument()
  })

  test('abre el modal de agregar tópico', () => {
    render(<ProfesorEditorPage />)
    
    // Hacemos clic en el botón de agregar (+)
    fireEvent.click(screen.getByText('+'))
    
    // Verificamos si el modal está visible
    expect(screen.getByText('Añadir Tópico')).toBeInTheDocument()
  })

  test('modifica el nombre de un tópico', () => {
    render(<ProfesorEditorPage />)
    
    // Hacemos clic en el botón de editar en el primer tópico
    fireEvent.click(screen.getAllByRole('button')[0])  // Seleccionamos el primer botón de editar
    
    // Abrimos el modal y cambiamos el nombre
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo Tópico' } })
    fireEvent.click(screen.getByText('Aceptar'))
    
    // Verificamos si el nuevo nombre del tópico aparece
    expect(screen.getByText('Nuevo Tópico')).toBeInTheDocument()
  })

  test('elimina un tópico', () => {
    render(<ProfesorEditorPage />)
    
    // Hacemos clic en el botón de eliminar en el primer tópico
    fireEvent.click(screen.getAllByRole('button')[1])  // Seleccionamos el primer botón de eliminar
    
    // Verificamos que el tópico fue eliminado
    expect(screen.queryByText('Sintaxis básica')).not.toBeInTheDocument()
  })
})
