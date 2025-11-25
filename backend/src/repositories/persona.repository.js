// src/repositories/persona.repository.js
const prisma = require('../prismaClient')

async function findByCorreo(correo) {
  return prisma.persona.findUnique({
    where: { correo },
    include: { roles: true },
  })
}

async function createPersona(data) {
  // 1. Verificar si ya existe persona con ese correo
  const existing = await prisma.persona.findFirst({
     where: { correo: data.correo },
  });
  if (existing) throw new Error("El usuario con este correo ya existe");

  const persona = await prisma.persona.create({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono ?? null,
      password: data.password ?? null,      
    },
     include: { roles: false },
  });

  // 6. Devolver persona con sus roles ya conectados
  const personaConRoles = await prisma.persona.findUnique({
    where: { id_persona: persona.id_persona },
    include: { roles: true },
  })

  return personaConRoles
}

module.exports = {
  findByCorreo,
  createPersona,
}
