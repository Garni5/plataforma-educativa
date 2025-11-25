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
  })
  if (existing) {
    throw new Error('El usuario con este correo ya existe')
  }

  // 2. Crear la persona
  const persona = await prisma.persona.create({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono,
      password: data.password,
    },
  })

  // 3. Buscar privilegio "usuario_normal"
  const rolNombre = 'usuario_normal'
  let rol = await prisma.privilegio_usuario.findFirst({
    where: { nombre_privilegio: rolNombre },
  })

  // 4. Si no existe, crearlo
  if (!rol) {
    rol = await prisma.privilegio_usuario.create({
      data: { nombre_privilegio: rolNombre },
    })
  }

  // 5. Conectar la persona con ese privilegio
  //    Esto crea automáticamente el registro en la tabla join
  await prisma.persona.update({
    where: { id_persona: persona.id_persona },
    data: {
      roles: {
        connect: { id_rol: rol.id_rol },
      },
    },
  })

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
