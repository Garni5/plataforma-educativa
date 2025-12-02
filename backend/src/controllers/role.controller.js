const roleService = require('../services/role.service');

async function store (req, res) {
    const {nombre_rol} = req.body;
    if(!nombre_rol){
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro nombre_privilegio es requerido'
        });
    }
    const result = await roleService.createRole(nombre_rol);
    return res.status(result.status_code).json(result.content);
}
async function index (req, res) {
    const result = await roleService.getRoles();
    return res.status(result.status_code).json(result.content);
}
async function assignRolesBulk(req, res) {
    try {
        const {  rols } = req.body;
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'El parámetro id es requerido'
            });
        }

        if (!Array.isArray(rols) || rols.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'El campo rols debe ser un array con al menos un rol'
            });
        }       
        const personaId = Number(id)
        const result = await roleService.asignarRolesService(personaId, rols);       
        return res.status(result.status_code).json(result.content);

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
async function getRols(req, res){
   const {id} = req.params;
     if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'El parámetro id es requerido'
            });

        }
    const personaId = Number(id)
    const result = await roleService.getRols(personaId);
    
    return res.status(result.status_code).json(result.content);

}
module.exports = {
    assignRolesBulk,
    getRols,
    store,
     index,
     
};
