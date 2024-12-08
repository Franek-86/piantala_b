const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authController = require("../controllers/authControllers");

router.get("/verify/:token", authController.verificationEmail);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
module.exports = router;
