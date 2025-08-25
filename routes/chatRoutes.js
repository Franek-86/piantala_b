const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatControllers");

router.post("/new-message", chatController.message);
router.get("/all-messages", chatController.messages);

module.exports = router;
