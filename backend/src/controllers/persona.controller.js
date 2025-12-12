const personaService = require("../services/persona.service");
async function index (req, res) {
    console.log(req.query);
   const { id_rol = null, search = null, page = 1, limit = 10 } = req.query;    
    const result = await personaService.getPersonas( id_rol,search,page,limit);
    return res.status(result.status_code).json(result.content);
}

module.exports = { index };