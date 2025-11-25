const prisma = require('../prismaClient'); // tu instancia de prisma

async function asignarRolesService(personaId, roles) {
    // Verificar si la persona existe
    const persona = await prisma.persona.findUnique({
        where: { id_persona: personaId }
    });
    console.log(persona);
    if (!persona) {
        throw new Error('La persona no existe');
    }

    // Validar que los roles existan
    const rolesExistentes = await prisma.privilegio_usuario.findMany({
        where: {
            id_rol: { in: roles }
        }
    });
    console.log("esta entrando")
console.log(rolesExistentes);
    if (rolesExistentes.length !== roles.length) {
        throw new Error('Uno o más roles no existen');
    }
   console.log(rolesExistentes);
    // Asignar roles usando "set"
    const result = await prisma.persona.update({
        where: { id_persona: personaId },
        data: {
            roles: {
                set: roles.map(id_rol => ({ id_rol }))
            }
        },
        include: { roles: true }
    });

    return result;
}

module.exports = {
    asignarRolesService
};
