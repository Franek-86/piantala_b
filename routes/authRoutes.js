const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const authController = require("../controllers/authControllers");

router.get("/verify/:token", authController.verificationEmail);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/users", authController.getAllUsers);
router.get("/user/:id", authController.getUserInfo);
router.get("/login/cities", authController.fetchCities);
router.post("/login/generate-fiscal-code", authController.generateFiscalCode);
router.post("/login/validate-fiscal-code", authController.validateFiscalCode);
router.patch("/role", authController.setUserRole);
router.patch("/status", authController.setUserStatus);
module.exports = router;
