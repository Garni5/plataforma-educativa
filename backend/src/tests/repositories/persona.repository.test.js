const personaRepo = require("../../repositories/persona.repository");

jest.mock("../../prismaClient", () => {
  const mockPersona = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  };

  const mockPrivilegio = {
    findFirst: jest.fn(),
    create: jest.fn(),
  };

  return {
    persona: mockPersona,
    privilegio_usuario: mockPrivilegio,
  };
});

// Ahora importamos los mocks para usarlos en los tests
const { persona: mockPersona, privilegio_usuario: mockPrivilegio } = require("../../prismaClient");

describe("Persona Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByCorreo", () => {
    it("retorna persona existente", async () => {
      const persona = { id_persona: 1, correo: "test@mail.com", roles: [] };
      mockPersona.findUnique.mockResolvedValue(persona);

      const result = await personaRepo.findByCorreo("test@mail.com");
      expect(result).toEqual(persona);
      expect(mockPersona.findUnique).toHaveBeenCalledWith({
        where: { correo: "test@mail.com" },
        include: { roles: true },
      });
    });

    it("retorna null si no existe", async () => {
      mockPersona.findUnique.mockResolvedValue(null);

      const result = await personaRepo.findByCorreo("noexiste@mail.com");
      expect(result).toBeNull();
    });
  });

  describe("createPersona", () => {
    it("crea persona y rol si no existen", async () => {
      const data = {
        nombres: "Juan",
        apellidos: "Perez",
        correo: "juan@mail.com",
        telefono: "123456789",
        password: "123456",
        nombre_privilegio: "ESTUDIANTE",
      };

      mockPersona.findFirst.mockResolvedValue(null);
      mockPrivilegio.findFirst.mockResolvedValue(null);
      mockPrivilegio.create.mockResolvedValue({ id_rol: 1, nombre_privilegio: "ESTUDIANTE" });
      mockPersona.create.mockResolvedValue({
        ...data,
        id_persona: 1,
        roles: [{ id_rol: 1, nombre_privilegio: "ESTUDIANTE" }],
      });

      const result = await personaRepo.createPersona(data);

      expect(result).toHaveProperty("correo", "juan@mail.com");
      expect(result.roles).toHaveLength(1);
    });

    it("lanza error si la persona ya existe", async () => {
      mockPersona.findFirst.mockResolvedValue({ id_persona: 1 });

      await expect(personaRepo.createPersona({ correo: "juan@mail.com" }))
        .rejects.toThrow("El usuario con este correo ya existe");
    });
  });
});
