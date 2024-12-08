const express = require("express");
const router = express.Router();
const plantsController = require("../controllers/plantsControllers");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads"); // __dirname will point to the current directory of the file
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`; // Generate a unique name
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.post("/add-plant", upload.single("image"), plantsController.addPlant);
router.get("/", plantsController.getAllPlants);
router.get("/user-plants", plantsController.getUserPlants);
router.get("/owned-plants", plantsController.getOwnedPlants);
router.patch("/:id/status", isAdmin, plantsController.updateStatus);
router.patch("/:id/ownership", plantsController.updateOwner);
router.delete("/:id/delete", isAdmin, plantsController.deletePlant);
module.exports = router;
