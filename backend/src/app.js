const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./services/auth.service"); // inicializa estrategias Passport

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/auth", authRoutes);

// Ruta de prueba protegida
const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.sendStatus(401);
  }
};

app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "Acceso concedido", user: req.user });
});

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});
module.exports = app;
