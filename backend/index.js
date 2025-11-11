// index.js
require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { initWebSocket } = require("./src/websocket");

app.get("/hola", (req, res) => {
  res.send("hola mundo");
});

const PORT = process.env.PORT || 3000;

// Creamos servidor HTTP base
const server = http.createServer(app);

// Inicializamos WebSocket sobre el mismo servidor
initWebSocket(server);

// Iniciamos el servidor (HTTP + WebSocket)
server.listen(PORT, () => {
  console.log(`🚀 Servidor Express + WebSocket en http://localhost:${PORT}`);
});
