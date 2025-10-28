const passport = require("passport");
const authService = require("../services/auth.service");

//registro sin google
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

//login sin google
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

// Google
const googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });
const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Error autenticando Google" });

 
    res.json({ jwt:user.token, user });
  })(req, res, next);
};

// Microsoft
const microsoftLogin = passport.authenticate("azure_ad_oauth2");
const microsoftCallback = (req, res) => {
  const token = generateJWT(req.user);
  res.json({ jwt: token, user: req.user });
};

module.exports = {
  googleLogin,
  googleCallback,
  microsoftLogin,
  microsoftCallback,
  register,
  login
};
