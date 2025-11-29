import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfesorEditorPage from './ProfesorEditorPage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

describe('ProfesorEditorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //  TESTS DE RENDERIZADO 

  it('debe renderizar el componente correctamente', () => {
    render(<ProfesorEditorPage />);
    expect(screen.getByText('Editor de Contenido del Curso')).toBeInTheDocument();
    expect(screen.getByText('Gestiona tópicos y recursos para tus estudiantes')).toBeInTheDocument();
  });

  it('debe mostrar el tópico inicial', () => {
    render(<ProfesorEditorPage />);
    const h2 = screen.getByRole('heading', { level: 2, name: 'Introducción a React' });
    expect(h2).toBeInTheDocument();
  });

  it('debe mostrar los recursos iniciales', () => {
    render(<ProfesorEditorPage />);
    expect(screen.getByText('Conceptos básicos de React')).toBeInTheDocument();
    expect(screen.getByText('Guía de instalación')).toBeInTheDocument();
  });

  //  TESTS DE TÓPICOS 

  it('debe agregar un nuevo tópico', async () => {
    render(<ProfesorEditorPage />);
    const input = screen.getByPlaceholderText('Nombre del nuevo tópico...');
    const button = screen.getByRole('button', { name: /Agregar Tópico/i });

    await userEvent.type(input, 'Python Avanzado');
    fireEvent.click(button);

    await waitFor(() => {
      const h2 = screen.getByRole('heading', { level: 2, name: 'Python Avanzado' });
      expect(h2).toBeInTheDocument();
    });
  });

  it('no debe agregar un tópico vacío', async () => {
    render(<ProfesorEditorPage />);
    const button = screen.getByRole('button', { name: /Agregar Tópico/i });
    fireEvent.click(button);

    const topics = screen.getAllByRole('button', { name: /Introducción|Python/ });
    expect(topics.length).toBe(1);
  });

  it('debe cambiar de tópico al hacer click', async () => {
    render(<ProfesorEditorPage />);
    
    const input = screen.getByPlaceholderText('Nombre del nuevo tópico...');
    const addTopicBtn = screen.getByRole('button', { name: /Agregar Tópico/i });

    await userEvent.type(input, 'Django');
    fireEvent.click(addTopicBtn);

    const djangoButton = screen.getByRole('button', { name: 'Django' });
    fireEvent.click(djangoButton);

    expect(djangoButton).toHaveClass('active');
  });

  //  TESTS DE RECURSOS 

  it('debe mostrar el modal al hacer click en "Agregar Recurso"', async () => {
    render(<ProfesorEditorPage />);
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    await waitFor(() => {
      expect(screen.getByText('Agregar Nuevo Recurso')).toBeInTheDocument();
    });
  });

  it('debe mostrar las opciones de tipo de recurso', async () => {
    render(<ProfesorEditorPage />);
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    await waitFor(() => {
      const resourceOptions = document.querySelectorAll('.profesor-resource-option');
      expect(resourceOptions.length).toBe(4);
    });
  });

  it('debe mostrar el formulario al seleccionar un tipo de recurso', async () => {
    render(<ProfesorEditorPage />);
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    const resourceOptions = document.querySelectorAll('.profesor-resource-option');
    fireEvent.click(resourceOptions[0]);

    await waitFor(() => {
      expect(screen.getByLabelText(/Título del video/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Selecciona el archivo/i)).toBeInTheDocument();
    });
  });

  it('debe volver a las opciones de tipo al hacer click en "Volver"', async () => {
    render(<ProfesorEditorPage />);
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    const resourceOptions = document.querySelectorAll('.profesor-resource-option');
    fireEvent.click(resourceOptions[0]);

    const backBtn = screen.getByRole('button', { name: /Volver/i });
    fireEvent.click(backBtn);

    await waitFor(() => {
      const newOptions = document.querySelectorAll('.profesor-resource-option');
      expect(newOptions.length).toBe(4);
    });
  });

  //  TESTS DE ARCHIVO 

  it('debe mostrar el nombre del archivo seleccionado', async () => {
    render(<ProfesorEditorPage />);
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    const resourceOptions = document.querySelectorAll('.profesor-resource-option');
    fireEvent.click(resourceOptions[0]);

    const fileInput = screen.getByLabelText(/Selecciona el archivo/i) as HTMLInputElement;
    const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText(/test-video.mp4/)).toBeInTheDocument();
    });
  });

  it('debe validar que el título sea obligatorio', async () => {
    render(<ProfesorEditorPage />);
    
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    const resourceOptions = document.querySelectorAll('.profesor-resource-option');
    fireEvent.click(resourceOptions[0]);

    const file = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    const fileInput = screen.getByLabelText(/Selecciona el archivo/i);
    await userEvent.upload(fileInput, file);

    // El botón debe estar deshabilitado si no hay título
    const submitBtn = screen.getByRole('button', { name: /✓ Agregar Recurso/i });
    expect(submitBtn).toHaveAttribute('disabled');
  });

  it('debe validar que el archivo sea obligatorio', async () => {
    render(<ProfesorEditorPage />);
    
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    const resourceOptions = document.querySelectorAll('.profesor-resource-option');
    fireEvent.click(resourceOptions[0]);

    const titleInput = screen.getByLabelText(/Título del video/i);
    await userEvent.type(titleInput, 'Mi Video');

    // El botón debe estar deshabilitado si no hay archivo
    const submitBtn = screen.getByRole('button', { name: /✓ Agregar Recurso/i });
    expect(submitBtn).toHaveAttribute('disabled');
  });

  //  TESTS DE ELIMINACIÓN 

  it('debe eliminar un recurso', async () => {
    render(<ProfesorEditorPage />);
    expect(screen.getByText('Conceptos básicos de React')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: '🗑️' });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Conceptos básicos de React')).not.toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje vacío cuando no hay recursos', async () => {
    render(<ProfesorEditorPage />);
    
    // Verificar que hay recursos inicialmente
    expect(screen.getByText('Conceptos básicos de React')).toBeInTheDocument();
    expect(screen.getByText('Guía de instalación')).toBeInTheDocument();

    // Eliminar todos los recursos
    let deleteButtons = screen.getAllByRole('button', { name: '🗑️' });
    while (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      deleteButtons = screen.queryAllByRole('button', { name: '🗑️' });
    }

    // Verificar que no hay recursos
    await waitFor(() => {
      expect(screen.queryByText('Conceptos básicos de React')).not.toBeInTheDocument();
      expect(screen.queryByText('Guía de instalación')).not.toBeInTheDocument();
    });
  });

  //  TESTS DE TRANSCRIPCIÓN 

  it('debe mostrar el botón de transcripción solo para videos', () => {
    render(<ProfesorEditorPage />);
    const transcriptionButtons = screen.getAllByRole('button', { name: /transcripción/i });
    expect(transcriptionButtons.length).toBe(1);
  });

  it('debe toggle la transcripción de un video', async () => {
    render(<ProfesorEditorPage />);
    const transcriptionBtn = screen.getByRole('button', { name: /Con transcripción/i });
    expect(transcriptionBtn).toHaveClass('active');

    fireEvent.click(transcriptionBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sin transcripción/i })).toBeInTheDocument();
    });
  });

  //  TESTS DE CONTADOR 

  it('debe mostrar el contador correcto de recursos', () => {
    render(<ProfesorEditorPage />);
    expect(screen.getByText(/2 recursos/)).toBeInTheDocument();
  });

  it('debe actualizar el contador al agregar un recurso', async () => {
    render(<ProfesorEditorPage />);
    
    expect(screen.getByText(/2 recursos/)).toBeInTheDocument();

    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    const resourceOptions = document.querySelectorAll('.profesor-resource-option');
    fireEvent.click(resourceOptions[3]); // Audio

    const titleInput = screen.getByLabelText(/Título del audio/i);
    await userEvent.type(titleInput, 'Podcast');

    const file = new File(['audio content'], 'podcast.mp3', { type: 'audio/mpeg' });
    const fileInput = screen.getByLabelText(/Selecciona el archivo/i);
    await userEvent.upload(fileInput, file);

    const submitBtn = screen.getByRole('button', { name: /✓ Agregar Recurso/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/3 recursos/)).toBeInTheDocument();
    });
  });

  //  TESTS DE MODAL 

  it('debe cerrar el modal al hacer click en X', async () => {
    render(<ProfesorEditorPage />);
    
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    await waitFor(() => {
      expect(screen.getByText('Agregar Nuevo Recurso')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Agregar Nuevo Recurso')).not.toBeInTheDocument();
    });
  });

  it('debe cerrar el modal al hacer click en el overlay', async () => {
    render(<ProfesorEditorPage />);
    
    const addResourceBtn = screen.getAllByRole('button', { name: /Agregar Recurso/i })[0];
    fireEvent.click(addResourceBtn);

    await waitFor(() => {
      const overlay = document.querySelector('.profesor-modal-overlay');
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay!);
    });

    await waitFor(() => {
      expect(screen.queryByText('Agregar Nuevo Recurso')).not.toBeInTheDocument();
    });
  });

  //  TESTS DE TIPOS DE RECURSOS 

  it('debe mostrar el icono correcto para cada tipo de recurso', () => {
    render(<ProfesorEditorPage />);
    expect(screen.getByText('🎥')).toBeInTheDocument();
    expect(screen.getByText('📄')).toBeInTheDocument();
  });

  it('debe mostrar el tipo correcto en cada tarjeta de recurso', () => {
    render(<ProfesorEditorPage />);
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Documento HTML')).toBeInTheDocument();
  });
});