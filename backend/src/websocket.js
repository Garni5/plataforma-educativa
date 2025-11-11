// src/websocket.js
const { WebSocketServer } = require('ws');

function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🟢 Cliente WebSocket conectado');

    ws.send('Conectado al servidor WebSocket ✅');

    ws.on('message', (message) => {
      console.log('📨 Mensaje recibido:', message.toString());

      // Enviar el mensaje a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(`Echo: ${message}`);
        }
      });
    });

    ws.on('close', () => console.log('🔴 Cliente desconectado'));
  });

  console.log('🌐 Servidor WebSocket inicializado');
}

module.exports = { initWebSocket };
