// ProfesorEditorPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfesorEditorPage from './ProfesorEditorPage';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

// -----------------------------
// Mocks globales
// -----------------------------
const fakeCreateObjectURL = vi.fn(() => 'blob:fake-url');
Object.defineProperty(global.URL, 'createObjectURL', {
  configurable: true,
  writable: true,
  value: fakeCreateObjectURL,
});

const localStorageMock = {
  getItem: (key: string) => {
    if (key === 'token') return 'fake-token';
    if (key === 'userId') return '1';
    if (key === 'userName') return 'Profesor Prueba';
    if (key === 'userEmail') return 'prof@test.com';
    return null;
  },
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
} as unknown as Storage;

vi.stubGlobal('localStorage', localStorageMock);

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock as unknown);

// -----------------------------
// Mock por defecto de fetch
// -----------------------------
beforeEach(() => {
  fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method?.toUpperCase() || 'GET';

    if (url.includes('/topicos') && method === 'GET') {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: [
            {
              id_topico: 1,
              titulo: 'Sintaxis básica',
              descripcion: '',
              id_persona: 1,
              recursos: [
                {
                  id_recurso: 10,
                  titulo: 'Video Introductorio',
                  descripcion: 'Video introductorio',
                  tipo: 'video',
                  fileUrl: 'blob:fake-url',
                  tieneTranscripcion: false,
                },
              ],
            },
          ],
        }),
      } as Response;
    }

    if (url.includes('/recursos') && method === 'POST') {
      return {
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          data: {
            id_recurso: 99,
            titulo: 'Recurso Nuevo',
            descripcion: 'Video - video.mp4',
            tipo: 'video',
            tieneTranscripcion: false,
          },
        }),
      } as Response;
    }

    if (method === 'DELETE') {
      return { ok: true, status: 200, json: async () => ({ success: true }) } as Response;
    }

    if (url.includes('/transcripcion') && method === 'PUT') {
      return { ok: true, status: 200, json: async () => ({ success: true, data: { tieneTranscripcion: true } }) } as Response;
    }

    return { ok: true, status: 200, json: async () => ({ success: true, data: [] }) } as Response;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// -----------------------------
// Tests
// -----------------------------
describe('ProfesorEditorPage (TS + Vitest)', () => {

  it('muestra el recurso inicial cargado desde /topicos', async () => {
    render(<ProfesorEditorPage />);
    const recurso = await screen.findByText('Video Introductorio');
    expect(recurso).toBeInTheDocument();
  });

  it('elimina un recurso de video usando el botón dentro de la card', async () => {
    render(<ProfesorEditorPage />);
    const title = await screen.findByText('Video Introductorio');

    const card = title.closest('.profesor-resource-card');
    expect(card).not.toBeNull();

    const eliminarBtn = within(card as HTMLElement).getByTitle('Eliminar');
    fireEvent.click(eliminarBtn);

    await waitFor(() => {
      expect(screen.queryByText('Video Introductorio')).toBeNull();
    });
  });

  it('puede agregar un recurso (flujo: abrir modal, seleccionar tipo, subir archivo, confirmar)', async () => {
    render(<ProfesorEditorPage />);

    const topicTitle = await screen.findByRole('heading', { level: 2, name: 'Sintaxis básica' });
    expect(topicTitle).toBeInTheDocument();

    // Abrir modal para agregar recurso
    const agregarBtn = screen.getByText(/Agregar Recurso/i);
    fireEvent.click(agregarBtn);

    const modal = await screen.findByText('Agregar Nuevo Recurso');
    expect(modal).toBeInTheDocument();

    // Seleccionar tipo Video dentro del modal
    const modalContent = modal.closest('.profesor-modal-content') as HTMLElement;
    const tipoVideo = within(modalContent).getByText('Video');
    fireEvent.click(tipoVideo);

    // Completar título del recurso
    const inputTitle = within(modalContent).getByLabelText(/Título del video/i) as HTMLInputElement;
    fireEvent.change(inputTitle, { target: { value: 'Recurso Nuevo' } });
    expect(inputTitle.value).toBe('Recurso Nuevo');

    // Subir archivo
    const file = new File(['dummy content'], 'video.mp4', { type: 'video/mp4' });
    const fileInput = within(modalContent).getByLabelText('Selecciona el archivo') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    // Confirmar agregar
    const btnAgregar = within(modalContent).getByText('Agregar Recurso');
    fireEvent.click(btnAgregar);

    const nuevo = await screen.findByText('Recurso Nuevo');
    expect(nuevo).toBeInTheDocument();
  });

  it('activa la transcripción de un video al hacer clic', async () => {
    render(<ProfesorEditorPage />);
    await screen.findByText('Video Introductorio');

    const btn = screen.getByText('Sin transcripción');
    fireEvent.click(btn);

    const activo = await screen.findByText('Con transcripción');
    expect(activo).toBeInTheDocument();
  });

});
