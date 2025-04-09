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
router.get("/register/regions", authController.fetchRegions);
router.get("/register/districts", authController.fetchDistricts);
router.get("/register/cities", authController.fetchCities);
router.post("/login/generate-fiscal-code", authController.generateFiscalCode);
router.post("/login/validate-fiscal-code", authController.validateFiscalCode);
router.patch("/role", isAdmin, authController.setUserRole);
router.patch("/status", isAdmin, authController.setUserStatus);
router.get("/me", authController.userSession);
module.exports = router;
