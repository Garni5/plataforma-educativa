const prisma = require('../prismaClient'); // tu instancia de prisma
const mailController = require('./mail.service')


async function getRoles(){
    const roles = await prisma.privilegio_usuario.findMany();
    return {
        status_code:200,
        content:{
            status:"success",
            data:roles,
            message:"Roles obtenidos correctamente"
        }
    }
    
}
async function createRole(nombre_rol){
     await prisma.privilegio_usuario.create({
        data: {
            nombre_privilegio: nombre_rol
        }
    });
    return {
        status_code:200,
        content:{
            status:"success",
            message:"Rol creado correctamente"
        }
    }
}
async function asignarRolesService(personaId, roles) {
    // Verificar si la persona existe
    const persona = await prisma.persona.findUnique({
        where: { id_persona: personaId }
    });
    
    if (!persona) {
        return {
        status_code:404,
        content:{
            status:"error",
            message:"La persona no existe"
        }
    }
    }    
    const rolesExistentes = await prisma.privilegio_usuario.findMany({
        where: {
            id_rol: { in: roles }
        }
    });    
    if (rolesExistentes.length !== roles.length) {
         return {
        status_code:404,
        content:{
            status:"error",
            message:"Uno o mas roles no existen"
        }
      }
    }
    
    const result= await prisma.persona.update({
        where: { id_persona: personaId },
        data: {
            roles: {
                set: roles.map(id_rol => ({ id_rol }))
            }
        },
        include: { roles: true }
    });
    if(!result){
       return {
        status_code:404,
        content:{
            status:"error",
            message:"error al asignar roles"
        } 
    }   
    }
    const rolesNombres = result.roles.map(r => r.nombre_privilegio);
    console.log(rolesNombres);
    const resSend = await mailController.sendMail(result,rolesNombres);
    console.log(resSend);
    return {
        status_code:201,
        content:{
            status:"success",
            message:"roles asignados correctamente"
        } 
    }   
}
async function getRols(id){
    const persona = await prisma.persona.findUnique({
        where : {id_persona:id },
        include:{roles:true}
    })
    if(!persona){
      return {
        status_code:404,
        content:{
            status:"error",
            message:"persona no encontrada"
        }
      }
    }

     return {
        status_code:200,
        content:{
            status:"success",
            data:persona.roles,
            message:"roles obtenidos correctamente"
        }
      }
}

module.exports = {
    asignarRolesService,
    getRols,
    createRole,
    getRoles
};
