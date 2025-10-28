const { googleCallback } = require("../../controllers/auth.controller");
const authService = require("../../services/auth.service");
const passport = require("passport");

jest.mock("../../services/auth.service");
jest.mock("passport");

describe("Google Callback", () => {
  let req, res, next;

  beforeEach(() => {
    req = {}; 
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("debería responder con usuario y token cuando la autenticación es exitosa", async () => {
    // Mock del usuario que devuelve passport
    const mockUser = { id_persona: 1, correo: "test@mail.com", token: "abc123" };

    // Mockeamos passport.authenticate para simular éxito
    passport.authenticate = jest.fn((strategy, callback) => {
      return (req, res, next) => {
        callback(null, mockUser); // sin error, con usuario
      };
    });

    await googleCallback(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      jwt: mockUser.token,
      user: mockUser,
    });
  });

  it("debería responder con error 401 cuando falla la autenticación", async () => {
    passport.authenticate = jest.fn((strategy, callback) => {
      return (req, res, next) => {
        callback(new Error("Error autenticando Google"), null);
      };
    });

    await googleCallback(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error autenticando Google",
    });
  });
});
