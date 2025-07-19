const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersControllers");

router.post("/add-order", ordersController.addOrder);
router.get("/all-orders", ordersController.getOrders);
router.patch("/update-order", ordersController.updateOrder);
module.exports = router;
