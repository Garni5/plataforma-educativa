const app = require('./src/app');
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
