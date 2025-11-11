<<<<<<< HEAD
=======
// src/services/auth.service.js
>>>>>>> saul
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const personaRepo = require("../repositories/persona.repository");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// REGISTRO (lo dejamos casi igual, solo quitamos el campo ci porque no existe)
async function registerPersona(data) {
<<<<<<< HEAD
  console.log("sldkjfasd");
  const existing = await prisma.persona.findFirst({
    where: { correo: data.correo },
  });
  console.log(existing);
  if (existing) throw { status: 409, message: "El usuario con este  correo ya existe" };

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const persona = await personaRepo.createPersona({ ...data, password: hashedPassword });
=======
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

>>>>>>> saul
  return persona;
}

// LOGIN (aquí es donde hacemos la magia del privilegio)
async function loginPersona(login, password) {
<<<<<<< HEAD
  // Buscar usuario y traer roles
  const persona = await prisma.persona.findFirst({
    where: { correo: login },
    include: { roles: true }, // Solo include roles directamente
=======
  // Buscar persona por correo (login)
  const persona = await prisma.persona.findFirst({
    where: { correo: login },
    include: {
      roles: {
        include: { privilegio: true },
      },
    },
>>>>>>> saul
  });

  if (!persona) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  // Verificar contraseña
  const valid = await bcrypt.compare(password, persona.password);
  if (!valid) {
    throw { status: 401, message: "Contraseña incorrecta" };
  }

<<<<<<< HEAD
  // Mapear roles para el JWT
  const roles = persona.roles.map(r => ({
    id_rol: r.id_rol,
    nombre_privilegio: r.nombre_privilegio, // ya no usamos privilegio?.nombre_privilegio
  }));

  // Generar token
  const token = jwt.sign(
    { id_persona: persona.id_persona, correo: persona.correo, roles },
=======
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
>>>>>>> saul
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

// 🔹 Nuevo: para login social (Google o Microsoft)
async function loginSocial(correo, nombres,apellidos) {
  let persona = await prisma.persona.findFirst({ where: { correo } });
  console.log("🚀 ~ file: auth.service.js ~ line 41 ~ loginSocial ~ persona", persona)
  console.log(persona);
  console.log(correo);
  console.log(nombres);
  console.log(apellidos);

  if (!persona) {
    console.log('entra cuando no hay persona');
   try {
  persona = await prisma.persona.create({
    data: { correo, nombres, apellidos, telefono: null, password: null },
  });
} catch (err) {
  console.error("❌ Error creando persona:", err);
  throw err;
}
  }
  console.log(persona);
  const token = jwt.sign(
    { id_persona: persona.id_persona, correo: persona.correo },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { persona, token };
}

module.exports = { registerPersona, loginPersona, loginSocial };
