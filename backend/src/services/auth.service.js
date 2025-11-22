const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const personaRepo = require("../repositories/persona.repository");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

async function registerPersona(data) {
  console.log("sldkjfasd");
  const existing = await prisma.persona.findFirst({
    where: { correo: data.correo },
  });
  console.log(existing);
  if (existing) throw { status: 409, message: "El usuario con este  correo ya existe" };

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const persona = await personaRepo.createPersona({ ...data, password: hashedPassword });
  return persona;
}

async function loginPersona(login, password) {

  const persona = await prisma.persona.findFirst({
    where: { correo: login },
    include: { roles: true }, 
  });
  if (!persona) throw { status: 404, message: "Usuario no encontrado" };
  const valid = await bcrypt.compare(password, persona.password);
  if (!valid) throw { status: 401, message: "Contraseña incorrecta" };
  const roles = persona.roles.map(r => ({
    id_rol: r.id_rol,
    nombre_privilegio: r.nombre_privilegio, 
  }));


  const token = jwt.sign(
    { id_persona: persona.id_persona, correo: persona.correo,telefono:persona.telefono, roles: roles },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { persona, token };
}

async function loginSocial(correo, nombres,apellidos) {
  let persona = await prisma.persona.findFirst({ where: { correo } });
 

  if (!persona) {   
   try {
    persona = await prisma.persona.create({
    data: { correo, nombres, apellidos, telefono: null, password: null },
  });
} catch (err) {
  console.error("❌ Error creando persona:", err);
  throw err;
}
  }

  const token = jwt.sign(
    { id_persona: persona.id_persona, correo: persona.correo,telefono:persona.telefono, roles: persona.roles },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  console.log(token);

  return { persona, token };
}

module.exports = { registerPersona, loginPersona, loginSocial };
