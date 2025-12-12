jest.mock('../../prismaClient', () => ({
  recurso: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  topico: {
    findUnique: jest.fn(),
  },
}));

const recursoController = require('../../controllers/recurso.controller');
const prisma = require('../../prismaClient');

describe('Recurso Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearRecurso', () => {
    it('debe crear un nuevo recurso', async () => {
      const nuevoRecurso = {
        id_recurso: 1,
        titulo: 'Video Python',
        tipo: 'video',
        url_archivo: 'https://example.com/video.mp4',
        id_topico: 1,
      };

      prisma.topico.findUnique.mockResolvedValue({
        id_topico: 1,
        id_persona: 1,
      });

      prisma.recurso.create.mockResolvedValue(nuevoRecurso);

      const req = {
        user: { id_persona: 1 },
        params: { id_topico: 1 },
        body: {
          titulo: 'Video Python',
          tipo: 'video',
          url_archivo: 'https://example.com/video.mp4',
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await recursoController.crearRecurso(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: nuevoRecurso,
        })
      );
    });

    it('debe rechazar si el tópico no existe', async () => {
      prisma.topico.findUnique.mockResolvedValue(null);

      const req = {
        user: { id_persona: 1 },
        params: { id_topico: 999 },
        body: { titulo: 'Video', tipo: 'video', url_archivo: 'url' },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await recursoController.crearRecurso(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerRecursos', () => {
    it('debe obtener los recursos de un tópico', async () => {
      const mockRecursos = [
        {
          id_recurso: 1,
          titulo: 'Video 1',
          tipo: 'video',
          id_topico: 1,
        },
      ];

      prisma.recurso.findMany.mockResolvedValue(mockRecursos);

      const req = { user: { id_persona: 1 }, params: { id_topico: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await recursoController.obtenerRecursos(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockRecursos,
        })
      );
    });
  });

  describe('eliminarRecurso', () => {
    it('debe eliminar un recurso existente', async () => {
      prisma.recurso.findUnique.mockResolvedValue({
        id_recurso: 1,
        id_topico: 1,
      });

      prisma.topico.findUnique.mockResolvedValue({
        id_topico: 1,
        id_persona: 1,
      });

      prisma.recurso.delete.mockResolvedValue({
        id_recurso: 1,
        id_topico: 1,
      });

      const req = {
        user: { id_persona: 1 },
        params: { id_topico: 1, id_recurso: 1 },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await recursoController.eliminarRecurso(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
