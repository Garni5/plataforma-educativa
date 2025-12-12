const { register, login } = require("../../controllers/auth.controller");
const authService = require("../../services/auth.service");

jest.mock("../../services/auth.service"); // mock del servicio

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
   
  });

  describe("register", () => {
    it("debería registrar un usuario correctamente", async () => {
      const mockPersona = { id_persona: 1, correo: "test@mail.com" };
      req.body = { correo: "test@mail.com", password: "123456" };
      authService.registerPersona.mockResolvedValue(mockPersona);

      await register(req, res);

      expect(authService.registerPersona).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: "Usuario registrado correctamente",
      });
    });
it("debería manejar errores correctamente", async () => {
  const error = { status: 409, message: "Usuario ya existe" }; // ✔ CORRECTO

  req.body = { correo: "test@mail.com", password: "123456" };
  authService.registerPersona.mockRejectedValue(error);

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith({
    status: 'error',
    message: "Usuario ya existe",
  });
});

it("debería manejar error de login", async () => {
  const error = { status: 401, message: "Contraseña incorrecta" }; // ✔ número, no string
  req.body = { login: "test@mail.com", password: "wrong" };
  authService.loginPersona.mockRejectedValue(error);

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(401); // coincide con el status numérico
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      status: 'error',
      success: false,
      message: "Contraseña incorrecta",
    })
  );
});



  
  });
});
