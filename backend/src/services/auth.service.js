// src/services/auth.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const personaRepo = require("../repositories/persona.repository");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// REGISTRO (lo dejamos casi igual, solo quitamos el campo ci porque no existe)
async function registerPersona(data) {
  const existing = await prisma.persona.findFirst({
    where: { correo: data.correo }, // 👈 tu tabla persona no tiene "ci"
  });

  if (existing) {
    throw { status: 409, message: "El usuario con este correo ya existe" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const persona = await personaRepo.createPersona({
    ...data,
    password: hashedPassword,
  });

  return persona;
}

// LOGIN (aquí es donde hacemos la magia del privilegio)
async function loginPersona(login, password) {
  // Buscar persona por correo (login)
  const persona = await prisma.persona.findFirst({
    where: { correo: login },
    include: {
      roles: {
        include: { privilegio: true },
      },
    },
  });

  if (!persona) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  const valid = await bcrypt.compare(password, persona.password);
  if (!valid) {
    throw { status: 401, message: "Contraseña incorrecta" };
  }

  // 👇 Tomamos el primer rol y su privilegio
  const privilegio =
    persona.roles[0]?.privilegio?.nombre_privilegio || "usuario_normal";

  // Generamos el token con el privilegio
  const token = jwt.sign(
    {
      id_persona: persona.id_persona,
      correo: persona.correo,
      privilegio,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Formateamos lo que devolveremos al controller
  const personaResponse = {
    id_persona: persona.id_persona,
    nombres: persona.nombres,
    apellidos: persona.apellidos,
    correo: persona.correo,
    privilegio, //  clave para el frontend
  };

  // El controller envía esto como "data"
  return { persona: personaResponse, token };
}

module.exports = { registerPersona, loginPersona };
