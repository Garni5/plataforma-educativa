
const prisma = require("../prismaClient");


async function findByCorreo(correo) {
  return await prisma.persona.findUnique({
    where: { correo },
   include: { roles: true },
  });
}


async function createPersona(data) {

  const existing = await prisma.persona.findFirst({
     where: { correo: data.correo },
  });
  if (existing) throw new Error("El usuario con este correo ya existe");

 
  // Si el rol ya existe, conectarlo, si no, crearlo
const rolNombre = data.nombre_privilegio || "ESTUDIANTE";

let rol = await prisma.privilegio_usuario.findFirst({
  where: { nombre_privilegio: rolNombre },
});

if (!rol) {
  rol = await prisma.privilegio_usuario.create({
    data: { nombre_privilegio: rolNombre },
  });
}

  const persona = await prisma.persona.create({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono,
      password: data.password,
      roles: {
        connect: { id_rol: rol.id_rol },
      },
    },
    include: { roles: true },
  });

  return persona;
}


module.exports = { findByCorreo, createPersona };
