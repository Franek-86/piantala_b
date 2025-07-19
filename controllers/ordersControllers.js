// const Order = require("../models/Order");
const db = require("../models");
const Order = db.Order;
exports.addOrder = async (req, res) => {
  const order_number = 1;
  console.log("qui123", req.body);
  const { owner_id: user_id, id: product_id } = req.body;
  const newOrder = await Order.create({
    order_number,
    user_id,
    product_id,
  });
  console.log("newOrder", newOrder);
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
    console.log("updatedOrder", updatedOrder);
    if (updatedOrder[0] === 0) {
      return res
        .status(404)
        .json({ message: `No order with product id ${orderId}` });
    }
    return res.status(200).json({ message: `Updated order successfully` });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
