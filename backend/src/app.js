const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
require("./services/authPassport.service"); 
const protectedRoutes = require("./routes/protected.routes");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);



app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});
module.exports = app;
