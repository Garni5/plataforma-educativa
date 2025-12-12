const express = require("express");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const roleController = require('../controllers/role.controller');
const personaController = require('../controllers/persona.controller');


const topicoController = require("../controllers/topico.controller");
const recursoController = require("../controllers/recurso.controller");

const router = express.Router();

router.get(
  "/admin",
  authenticateJWT,
  authorizeRoles("DOCENTE"),
  (req, res) => {
    res.json({ message: "BIENVENIDO!" });
  }
);

router.get(
  "/editor",
  authenticateJWT,
  authorizeRoles("ESTUDIANTE", "DOCENTE"),
  (req, res) => {
    res.json({ message: "Bienvenido Editor!" });
  }
);

router.post('/user/:id/roles/bulk', roleController.assignRolesBulk);
router.get('/user/:id/rols',roleController.getRols);
router.post('/rols',roleController.store);
router.get('/rols',roleController.index);
router.get('/personas',personaController.index);
// ============ RUTAS PARA TÓPICOS ============
// Obtener todos los tópicos del profesor
router.get("/topicos", authenticateJWT, topicoController.obtenerTopicos);

// Crear un nuevo tópico
router.post("/topicos", authenticateJWT, topicoController.crearTopico);

// Actualizar un tópico
router.put("/topicos/:id", authenticateJWT, topicoController.actualizarTopico);

// Eliminar un tópico
router.delete("/topicos/:id", authenticateJWT, topicoController.eliminarTopico);

// ============ RUTAS PARA RECURSOS ============
// Crear un recurso en un tópico
router.post("/topicos/:id_topico/recursos", authenticateJWT, recursoController.crearRecurso);

// Obtener recursos de un tópico
router.get("/topicos/:id_topico/recursos", authenticateJWT, recursoController.obtenerRecursos);

// Actualizar un recurso
router.put("/topicos/:id_topico/recursos/:id_recurso", authenticateJWT, recursoController.actualizarRecurso);

// Eliminar un recurso
router.delete("/topicos/:id_topico/recursos/:id_recurso", authenticateJWT, recursoController.eliminarRecurso);

// Toggle transcripción de un recurso
router.put("/recursos/:id_recurso/transcripcion", authenticateJWT, recursoController.toggleTranscripcion);


module.exports = router;