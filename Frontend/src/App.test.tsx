import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import App from './App'

it('muestra loading inicialmente', () => {
  render(<App />)
  expect(screen.getByText(/cargando/i)).toBeInTheDocument()
})