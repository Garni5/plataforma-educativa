
const express = require("express");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const topicoController = require("../controllers/topico.controller");

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

// ===== RUTAS DE TÓPICOS =====
// Obtener todos los tópicos del profesor autenticado
router.get(
  "/topicos",
  authenticateJWT,
  topicoController.obtenerTopicos
);

// Crear nuevo tópico
router.post(
  "/topicos",
  authenticateJWT,
  topicoController.crearTopico
);

// Actualizar tópico
router.put(
  "/topicos/:id_topico",
  authenticateJWT,
  topicoController.actualizarTopico
);

// Eliminar tópico
router.delete(
  "/topicos/:id_topico",
  authenticateJWT,
  topicoController.eliminarTopico
);

// ===== RUTAS DE RECURSOS =====
// Obtener recursos de un tópico
router.get(
  "/topicos/:id_topico/recursos",
  authenticateJWT,
  topicoController.obtenerRecursos
);

// Agregar recurso a un tópico
router.post(
  "/topicos/:id_topico/recursos",
  authenticateJWT,
  topicoController.agregarRecurso
);

// Eliminar recurso
router.delete(
  "/topicos/:id_topico/recursos/:id_recurso",
  authenticateJWT,
  topicoController.eliminarRecurso
);

// Toggle transcripción de un recurso
router.put(
  "/recursos/:id_recurso/transcripcion",
  authenticateJWT,
  topicoController.toggleTranscripcion
);

module.exports = router;

