
const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    const persona = await authService.registerPersona(req.body);
    res.status(201).json({
      success: true,
      data: persona,
      message: "Usuario registrado correctamente"
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Error en el registro"
    });
  }
}

async function login(req, res) {
  try {
    const { login, password } = req.body; 
    const result = await authService.loginPersona(login, password);
    res.status(200).json({
      success: true,
      data: result,
      message: "Usuario autenticado correctamente"
    });
  } catch (err) {
    res.status(err.status || 401).json({
      success: false,
      message: err.message || "Error en el login"
    });
  }
}

module.exports = { register, login };
