const express = require("express");
const router = express.Router();
const plantsController = require("../controllers/plantsControllers");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");
const path = require("path");
const isAuth = require("../middleware/isAuth");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post(
  "/add-plant",
  isAuth,
  upload.single("image"),
  plantsController.addPlant
);
router.post(
  "/upload-plate/:id",
  upload.single("plate"),
  plantsController.addPlate
);
router.get("/", plantsController.getAllPlants);
router.get("/user-plants", plantsController.getUserPlants);
router.get("/owned-plants", plantsController.getOwnedPlants);
router.patch("/:id/status", isAdmin, plantsController.updateStatus);
router.patch("/:id/type", isAdmin, plantsController.updatePlantType);
router.patch("/:id/ownership", plantsController.updateOwner);
router.patch("/clear-plate", isAdmin, plantsController.clearPlate);
router.delete("/:id/delete", isAdmin, plantsController.deletePlant);
router.get("/user/reporter/:id", isAdmin, plantsController.getReporterInfo);
router.get("/user/owner/:id", isAdmin, plantsController.getOwnerInfo);
router.get(
  "/user/owner-public-info/:ownerId",
  plantsController.getOwnerPublicInfo
);
router.patch(
  "/update-plant-pic/:plantId",
  upload.single("plantPic"),
  isAdmin,
  plantsController.updatePlantPic
);
module.exports = router;
