jest.mock('../../prismaClient', () => ({
  topico: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
}));

const topicoController = require('../../controllers/topico.controller');
const prisma = require('../../prismaClient');

describe('Topico Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerTopicos', () => {
    it('debe retornar los tópicos del usuario autenticado', async () => {
      const mockTopicos = [
        {
          id_topico: 1,
          titulo: 'Variables',
          descripcion: 'Tema sobre variables',
          id_persona: 1,
          recursos: [],
        },
      ];

      prisma.topico.findMany.mockResolvedValue(mockTopicos);

      const req = { user: { id_persona: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await topicoController.obtenerTopicos(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockTopicos,
        })
      );
    });
  });

  describe('crearTopico', () => {
    it('debe crear un nuevo tópico', async () => {
      const nuevoTopico = {
        id_topico: 1,
        titulo: 'Decoradores',
        descripcion: 'Tema sobre decoradores',
        id_persona: 1,
      };

      prisma.topico.create.mockResolvedValue(nuevoTopico);

      const req = {
        user: { id_persona: 1 },
        body: { titulo: 'Decoradores', descripcion: 'Tema sobre decoradores' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await topicoController.crearTopico(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: nuevoTopico,
        })
      );
    });
  });

  describe('eliminarTopico', () => {
    it('debe eliminar un tópico existente', async () => {
      prisma.topico.findUnique.mockResolvedValue({
        id_topico: 1,
        id_persona: 1,
      });

      prisma.topico.delete.mockResolvedValue({
        id_topico: 1,
        titulo: 'Decoradores',
      });

      const req = { user: { id_persona: 1 }, params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await topicoController.eliminarTopico(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
