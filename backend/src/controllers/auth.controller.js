
const passport = require("passport");
const authService = require("../services/auth.service");
require("dotenv").config();
//registro sin google
async function register(req, res) {
  try {    
    const persona = await authService.registerPersona(req.body);  
    if(!persona){
      throw { status: 400, message: "Error al registrar el usuario" };
    }  
    res.status(201).json({
      status: 'success',    
      message: "Usuario registrado correctamente"
    });
  } catch (err) {
    res.status(err.status || 409).json({
      status: 'error',
      message: err.message || "Error en el registro"
    });
  }
}

const logout = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Cierra la sesión de Passport
    req.logout(err => {
      if (err) return next(err);

      // Destruye la sesión de Express
      req.session.destroy(err => {
        if (err) return next(err);

        // Limpia la cookie de sesión en el navegador
        res.clearCookie("connect.sid", { path: "/" });

        // Responde al frontend
        return res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
      });
    });
  } else {
    // No había sesión
    return res.status(200).json({ success: true, message: "No había sesión activa" });
  }
};

module.exports = { logout };

//login sin google
async function login(req, res) {
  try {
    const { login, password } = req.body; 
    const result = await authService.loginPersona(login, password);
    res.status(200).json({
      status: 'success',
      token: result.token,
      message: "Usuario autenticado correctamente"
    });
  } catch (err) {
  const statusCode = Number(err.status) || 401;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || "Error en el login"
  });
}
}

// Google
const googleLogin = passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account"
});

const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user) 
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google`);
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${user.token}`);
  })(req, res, next);
};

// Microsoft
const microsoftLogin = passport.authenticate("azure_ad_oauth2");
const microsoftCallback = (req, res) => {
  const token = generateJWT(req.user);
  console.log(token);
  res.json({ jwt: token, user: req.user });
};

module.exports = {
  googleLogin,
  googleCallback,
  microsoftLogin,
  microsoftCallback,
  register,
  login,
  logout
};
