
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.get("/api/hola", (req, res) => {
  res.json({mensaje:"¡Hola, mundo desde Express con arquitectura por capas!"});
});

module.exports = app;

