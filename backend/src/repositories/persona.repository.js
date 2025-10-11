
const prisma = require("../prismaClient");


async function findByCorreo(correo) {
  return await prisma.persona.findUnique({
    where: { correo },
    include: { roles: { include: { privilegio: true } } },
  });
}
async function findByCi(ci) {
  return await prisma.persona.findUnique({
    where: { ci },
    include: {
      roles: {
        include: { privilegio: true }
      }
    }
  });
}

async function createPersona(data) {

  const existing = await prisma.persona.findFirst({
    where: { OR: [{ ci: data.ci }, { correo: data.correo }] },
  });
  if (existing) throw new Error("El usuario con este CI o correo ya existe");

  


  const persona = await prisma.persona.create({
    data: {
      ci: data.ci,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono,
      password: data.password,
      roles: {
        create: [
          {
            privilegio: {
              create: {
                nombre_privilegio: data.nombre_privilegio || "usuario_normal",
              },
            },
          },
        ],
      },
    },
    include: {
      roles: {
        include: { privilegio: true },
      },
    },
  });

  return persona;
}

module.exports = { findByCorreo, createPersona, findByCi };
