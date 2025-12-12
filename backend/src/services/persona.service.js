const prisma = require("../prismaClient");

async function getPersonas( id_rol,search,page,limit){
    try {
        const where = {};
        console.log(search,id_rol);
        if(search){
        where.OR = [
            {nombres: { contains: search, mode: "insensitive" } },
            {apellidos: { contains: search, mode: "insensitive" } },
            {correo: { contains: search, mode: "insensitive" } },
        ];
        }

        if(id_rol){
            where.roles = { some: { id_rol: Number(id_rol) } }; // { some: { id_rol } };
        }  
        const skip = (Number(page) - 1) * Number(limit);    
       const [total,personas] = await Promise.all([
        prisma.persona.count({where}),
        prisma.persona.findMany({where,
            skip: skip,
            take:Number(limit),
            include:{
              roles:true
        
          },          
            orderBy:{nombres:'asc'}
         }),
            
       ]); 

       const data = personas.map((persona) => {
        return {
          id_persona: persona.id_persona,
          nombres: persona.nombres,
          apellidos: persona.apellidos,
          correo: persona.correo,
          telefono: persona.telefono,
          roles: persona.roles.map((rol) => {
          return{
            id:rol.id_rol,
            nombre:rol.nombre_privilegio
          }    
        }),
        };
      });
      
      const meta = {
        page: Number(page),
        limit: Number(limit),
        total: total,
        lastPage: Math.ceil(total / Number(limit)),
      };
        return {
            status_code:200,
            content:{
                status:"success",
                message:"Personas obtenidas correctamente",
                data:data,
                meta:meta,
               
            }
        }

    } catch (error) {
        console.log(error);
        return {
            status_code:500,
            content:{
                status:"error",
                message:"Error al obtener las personas"
            }
        }
    }


}

module.exports = { getPersonas };