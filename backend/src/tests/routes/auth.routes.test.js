// tests/routes/auth.routes.test.js


// 🔹 Mock de middlewares antes de importar app
jest.mock("../../middleware/auth.middleware", () => ({
  authenticateJWT: (req, res, next) => next()
}));

jest.mock("../../middleware/role.middleware", () => ({
  authorizeRoles: () => (req, res, next) => next()
}));

const request = require("supertest");
const app = require("../../app"); // importar después de los mocks
const authService = require("../../services/auth.service");

jest.mock("../../services/auth.service"); // mock del servicio

describe("Auth Routes", () => {
 describe("POST /auth/register", () => {
  it("debería registrar un usuario y devolver status 201", async () => {
    const mockPersona = { id_persona: 1, correo: "test@mail.com" };
    authService.registerPersona.mockResolvedValue(mockPersona);

    const res = await request(app)
      .post("/auth/register")
      .send({ correo: "test@mail.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      status: 'success',        
      message: "Usuario registrado correctamente",
    });
  });

  it("debería devolver error si ya existe usuario", async () => {
    authService.registerPersona.mockRejectedValue({ status: 409, message: "El usuario con este correo ya existe" });

    const res = await request(app)
      .post("/auth/register")
      .send({ correo: "test@mail.com", password: "123456" });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      status: 'error',
      message: "El usuario con este correo ya existe",
    });
  });
});


describe("POST /auth/login", () => {
  it("debería autenticar al usuario correctamente", async () => {
    const mockResult = { 
    persona: { id_persona: 1, privilegio: ["administrador"] }, 
    token: "abc123" 
  };
    authService.loginPersona.mockResolvedValue(mockResult);

    const res = await request(app)
      .post("/auth/login")
      .send({ login: "test@mail.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: 'success',
        success: true,
        token: mockResult.token,
        message: "Usuario autenticado correctamente",
        role: mockResult.persona.privilegio[0]
      })
    );
  });

  it("debería devolver error al login incorrecto", async () => {
    authService.loginPersona.mockRejectedValue({ status: 401, message: "Contraseña incorrecta" });

    const res = await request(app)
      .post("/auth/login")
      .send({ login: "test@mail.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: 'error',
        success: false,
        message: "Contraseña incorrecta",
      })
    );
  });
});

});
