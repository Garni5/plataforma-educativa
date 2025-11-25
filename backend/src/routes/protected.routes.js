const express = require("express");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const mailController = require("../controllers/mail.controller"); 
const { asignarRolesController } = require('../controllers/admin.constroller');

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
router.post("/send-mail", mailController.sendMail);
router.post('/asignar', asignarRolesController);

module.exports = router;