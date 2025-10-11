
const express = require("express");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

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

module.exports = router;
