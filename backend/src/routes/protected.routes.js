const express = require("express");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const roleController = require('../controllers/role.controller');
const personaController = require('../controllers/persona.controller');

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

module.exports = router;