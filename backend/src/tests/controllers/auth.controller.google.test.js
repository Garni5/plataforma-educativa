const { googleCallback } = require("../../controllers/auth.controller");
const passport = require("passport");

jest.mock("passport");

describe("Google Callback", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("redirecciona correctamente cuando la autenticación es exitosa", async () => {
    const mockUser = { id_persona: 1, correo: "test@mail.com", token: "abc123" };

    passport.authenticate = jest.fn((strategy, callback) => {
      return () => callback(null, mockUser);
    });

    await googleCallback(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${mockUser.token}`
    );
  });

  it("redirecciona al login con error cuando falla la autenticación", async () => {
    passport.authenticate = jest.fn((strategy, callback) => {
      return () => callback(new Error("Error autenticando Google"), null);
    });

    await googleCallback(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/login?error=google`
    );
  });
});
