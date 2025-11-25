const { asignarRolesService } = require('../services/admin.service');

async function asignarRolesController(req, res) {
    try {
        const { personaId, roles } = req.body;

        if (!personaId || !Array.isArray(roles)) {
            return res.status(400).json({
                status: 'error',
                message: 'personaId y roles (array) son requeridos'
            });
        }
        console.log("esta entrando");
        const result = await asignarRolesService(personaId, roles);

        return res.status(200).json({
            status: 'success',
            message: 'Roles asignados correctamente',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports = {
    asignarRolesController
};
