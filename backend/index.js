
const app = require("./src/app");
require("dotenv").config();

app.get("/hola", (req, res) => {
  res.send("hola mundo");
});

const PORT = process.env.PORT || 8080; //3000 
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


