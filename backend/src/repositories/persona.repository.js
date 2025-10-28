// src/repositories/persona.repository.js
const prisma = require('../prismaClient')

/**
 * Busca una persona por correo (incluye roles y privilegio)
 */
async function findByCorreo(correo) {
  return prisma.persona.findUnique({
    where: { correo },
    include: { roles: { include: { privilegio: true } } },
  })
}

/**
 * Crea una persona
 * Espera: { nombres, apellidos, correo, password, nombre_privilegio? }
 * NO acepta ci, telefono ni confirmar_password (confirmación se valida en el frontend)
 */
async function createPersona(data) {
  const { nombres, apellidos, correo, password, nombre_privilegio } = data

  // Verifica duplicado por correo
  const existing = await prisma.persona.findUnique({ where: { correo } })
  if (existing) {
    // puedes lanzar Error o un objeto con status para que el controller devuelva 409
    throw new Error('El correo ya está registrado')
  }

  const persona = await prisma.persona.create({
    data: {
      nombres,
      apellidos,
      correo,
      password, // <- debería llegar HASH desde el controller
      roles: {
        create: [
          {
            privilegio: {
              create: {
                nombre_privilegio: nombre_privilegio || 'usuario_normal',
              },
            },
          },
        ],
      },
    },
    include: {
      roles: { include: { privilegio: true } },
    },
  })

  return persona
}

module.exports = {
  findByCorreo,
  createPersona,
  // findByCi eliminado; si algún archivo lo usa, hay que quitar esa llamada
}

