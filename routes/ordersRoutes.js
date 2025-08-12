const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersControllers");
const isAuth = require("../middleware/isAuth");
router.post("/add-order", ordersController.addOrder);
router.get("/all-orders", ordersController.getOrders);
router.patch("/update-order", isAuth, ordersController.updateOrder);
module.exports = router;
