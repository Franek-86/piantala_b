// const Order = require("../models/Order");
const db = require("../models");
const crypto = require("node:crypto");
const Order = db.Order;
exports.addOrder = async (req, res) => {
  let first = "ORD";

  let second = new Date().toISOString().replace(/-/g, "").slice(0, 11);
  let third = crypto.randomBytes(2).toString("hex");

  const order_number = `${first}-${second}-${third}`;
  const { owner_id: user_id, id: product_id } = req.body;
  const newOrder = await Order.create({
    order_number,
    user_id,
    product_id,
  });
  res.status(201).json({
    message: "Order added successfully!",
    order: newOrder,
  });

  try {
  } catch (err) {
    res.status(500).send("Error adding order.");
  }
};
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.updateOrder = async (req, res) => {
  const { status: newStatus, id: orderId } = req.body;
  try {
    const updatedOrder = await Order.update(
      {
        status: newStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    if (updatedOrder[0] === 0) {
      return res
        .status(404)
        .json({ message: `No order with product id ${orderId}` });
    }
    return res
      .status(200)
      .json({ message: `Ordine modificato in "${newStatus}"` });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
