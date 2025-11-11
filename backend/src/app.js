const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
require("./services/authPassport.service"); 
const protectedRoutes = require("./routes/protected.routes");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev")); 
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false, 
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);

app.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});
module.exports = app;
