const express = require("express");
const router = express.Router();

const versionController = require("../controllers/versionControllers");

router.get("/version-number", versionController.version);

module.exports = router;
