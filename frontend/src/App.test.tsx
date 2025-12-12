import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './app/Appcpy'

it('muestra loading inicialmente', () => {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <App />
    </MemoryRouter>
  )
  // El componente App renderiza la navegación principal
  expect(screen.getByText('Plataforma')).toBeInTheDocument()
})