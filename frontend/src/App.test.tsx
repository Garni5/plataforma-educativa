import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './app/App'

it('muestra loading inicialmente', () => {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByText(/cargando/i)).toBeInTheDocument()
})