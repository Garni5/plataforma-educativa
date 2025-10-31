
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const personaRepo = require("../repositories/persona.repository");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

async function registerPersona(data) {

  const existing = await prisma.persona.findFirst({
    where: { OR: [{ ci: data.ci }, { correo: data.correo }] },
  });
  if (existing) throw { status: 409, message: "El usuario con este CI o correo ya existe" };


  const hashedPassword = await bcrypt.hash(data.password, 10);


  const persona = await personaRepo.createPersona({ ...data, password: hashedPassword });
  return persona;
}

async function loginPersona(login, password) {
  const persona = await prisma.persona.findFirst({
    where: { OR: [{ correo: login }, { ci: login }] },
    include: {
      roles: { include: { privilegio: true } },
    },
  });

  if (!persona) throw { status: 404, message: "Usuario no encontrado" };

  const valid = await bcrypt.compare(password, persona.password);
  if (!valid) throw { status: 401, message: "Contraseña incorrecta" };

  const roles = persona.roles.map((r) => ({
    id_rol: r.id_rol,
    nombre_privilegio: r.privilegio?.nombre_privilegio || null,
  }));

  const token = jwt.sign(
    {
      id_persona: persona.id_persona,
      correo: persona.correo,
      roles,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { persona, token };
}

module.exports = { registerPersona, loginPersona };
