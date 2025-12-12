import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IniciarConGoogle from './inicioSesionGoogle';
import '@testing-library/jest-dom';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para Router
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('IniciarConGoogle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debería renderizar el botón de Google', () => {
    render(<IniciarConGoogle />, { wrapper: Wrapper });
    expect(screen.getByText(/Iniciar sesión con Google/i)).toBeInTheDocument();
  });

  it('debería mostrar "Cargando..." cuando se está cargando', async () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    render(<IniciarConGoogle />, { wrapper: Wrapper });
    const googleButton = screen.getByRole('button', { name: /Iniciar sesión con Google/i });
    
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText(/Cargando\.\.\./i)).toBeInTheDocument();
    });
  });
});
