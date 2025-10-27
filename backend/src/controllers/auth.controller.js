const passport = require("passport");
const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Google
const googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });
const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: "Error autenticando Google" });

    const token = generateJWT(user);
    res.json({ jwt: token, user });
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
  microsoftCallback
};
