// src/repositories/persona.repository.js
const prisma = require('../prismaClient')

/**
 * Busca una persona por correo (incluye roles y privilegio)
 */
async function findByCorreo(correo) {
  return prisma.persona.findUnique({
    where: { correo },
   include: { roles: true },
  });
}


async function createPersona(data) {


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

  return persona
}

module.exports = {
  findByCorreo,
  createPersona,
  // findByCi eliminado; si algún archivo lo usa, hay que quitar esa llamada
}


module.exports = { findByCorreo, createPersona };
