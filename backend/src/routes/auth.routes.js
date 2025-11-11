const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Google
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

// Microsoft
router.get("/microsoft", authController.microsoftLogin);
router.get("/microsoft/callback", authController.microsoftCallback);

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
