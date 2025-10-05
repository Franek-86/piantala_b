const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const userController = require("../controllers/usersControllers");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get("/me", userController.userSession);
router.patch("/role", isAdmin, userController.setUserRole);

router.patch("/set-user-pic", upload.single("pic"), userController.setUserPic);
router.patch("/delete-user-pic", userController.deleteUserPic);
router.patch("/status", isAdmin, userController.setUserStatus);
router.get("/user/:id", userController.getUserInfo);
router.delete("/delete-user", userController.deleteUser);
router.get("/users", userController.getAllUsers);
router.post("/send", userController.sendEmail);
module.exports = router;
